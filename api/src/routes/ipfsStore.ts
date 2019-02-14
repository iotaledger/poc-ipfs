import { composeAPI, generateAddress } from "@iota/core";
import crypto from "crypto";
import ipfsClient from "ipfs-http-client";
import { IIPFSStoreRequest } from "../models/api/IIPFSStoreRequest";
import { IIPFSStoreResponse } from "../models/api/IIPFSStoreResponse";
import { IConfiguration } from "../models/IConfiguration";
import { IPayload } from "../models/tangle/IPayload";
import { IotaHelper } from "../utils/iotaHelper";
import { TrytesHelper } from "../utils/trytesHelper";
import { ValidationHelper } from "../utils/validationHelper";

/**
 * Ipfs store command.
 * @param config The configuration.
 * @param request the request.
 * @returns The response.
 */
export async function ipfsStore(config: IConfiguration, request: IIPFSStoreRequest): Promise<IIPFSStoreResponse> {
    try {
        ValidationHelper.string(request.name, "name");
        ValidationHelper.string(request.description, "description");
        ValidationHelper.number(request.size, "size");
        ValidationHelper.string(request.modified, "modified");
        ValidationHelper.string(request.sha256, "sha256");
        ValidationHelper.string(request.data, "data");

        await IotaHelper.isNodeAvailable(config.provider, true);

        const maxSize = 10240;

        const buffer = Buffer.from(request.data, "base64");

        if (buffer.length >= maxSize) {
            throw new Error(`The file is too large for this demonstration, it should be less than ${maxSize} bytes.`);
        }

        if (buffer.length === 0) {
            throw new Error(`The file must be greater than 0 bytes in length.`);
        }

        const sha256 = crypto.createHash("sha256");
        sha256.update(buffer);
        const hex = sha256.digest("hex");

        if (hex !== request.sha256) {
            throw new Error(`The sha256 for the file is incorrect '${request.sha256}' was sent but it has been calculated as '${hex}'`);
        }

        const ipfsConfig = {
            host: config.ipfs.host,
            port: config.ipfs.port,
            protocol: config.ipfs.protocol,
            "api-path": config.ipfs.apiPath,
            headers: undefined
        };

        if (config.ipfs.token) {
            ipfsConfig.headers = {
                Authorization: `Basic ${config.ipfs.token}`
            };
        }

        const ipfs = ipfsClient(ipfsConfig);

        const addStart = Date.now();
        console.log(`Adding file ${request.name} to IPFS of length ${request.size}`);
        const addResponse = await ipfs.add(buffer);
        console.log(addResponse);
        console.log(`Adding file ${request.name} complete in ${Date.now() - addStart}ms`);

        const iota = composeAPI({
            provider: config.provider
        });

        const nextAddress = generateAddress(config.seed, 0, 2);

        const tanglePayload: IPayload = {
            name: request.name,
            description: request.description,
            size: request.size,
            modified: request.modified,
            sha256: request.sha256,
            ipfs: addResponse[0].hash
        };

        console.log(`Prepare Transfer`);
        const trytes = await iota.prepareTransfers(
            "9".repeat(81),
            [
                {
                    address: nextAddress,
                    value: 0,
                    message: TrytesHelper.toTrytes(tanglePayload)
                }
            ]);

        const sendStart = Date.now();
        console.log(`Sending Trytes`);
        const bundles = await iota.sendTrytes(trytes, config.depth, config.mwm);
        console.log(`Sending Trytes complete in ${Date.now() - sendStart}ms`);

        return {
            success: true,
            message: "OK",
            transactionHash: bundles[0].hash,
            ipfs: tanglePayload.ipfs
        };
    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: err.toString()
        };
    }
}
