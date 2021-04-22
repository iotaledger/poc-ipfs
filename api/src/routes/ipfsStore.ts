import crypto from "crypto";
import ipfsClient from "ipfs-http-client";
import { SHA3 } from "sha3";
import { IIPFSStoreRequest } from "../models/api/IIPFSStoreRequest";
import { IIPFSStoreResponse } from "../models/api/IIPFSStoreResponse";
import { IConfiguration } from "../models/configuration/IConfiguration";
import { IPayload } from "../models/tangle/IPayload";
import { MessageCacheService } from '../services/messageCacheService';
import { ValidationHelper } from "../utils/validationHelper";
import { IotaC2Helper } from "../utils/iotaC2Helper";
import { ClientBuilder } from "@iota/client";

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
        ValidationHelper.string(request.algorithm, "algorithm");
        ValidationHelper.string(request.hash, "hash");
        ValidationHelper.string(request.data, "data");

        const BYTES_PER_MEGABYTE = 1048576;
        const maxSize = config.maxBytes ?? BYTES_PER_MEGABYTE / 2;

        const buffer = Buffer.from(request.data, "base64");

        if (buffer.length >= maxSize) {
            const size = maxSize >= BYTES_PER_MEGABYTE
                ? `${(maxSize / BYTES_PER_MEGABYTE).toFixed(1)} Mb`
                : `${(maxSize / 1024)} Kb`;
            throw new Error(
                `The file is too large for this demonstration, it should be less than ${size}.`
            );
        }

        if (buffer.length === 0) {
            throw new Error(`The file must be greater than 0 bytes in length.`);
        }

        let hex;

        if (request.algorithm === "sha256") {
            const hashAlgo = crypto.createHash(request.algorithm);
            hashAlgo.update(buffer);
            hex = hashAlgo.digest("hex");
        } else if (request.algorithm === "sha3") {
            const hashAlgo = new SHA3(256);
            hashAlgo.update(buffer);
            hex = hashAlgo.digest("hex");
        }

        if (hex !== request.hash) {
            throw new Error(
                `The hash for the file is incorrect '${request.hash}' was sent but it has been calculated as '${hex}'`);
        }

        const parts = /(https?):\/\/(.*):(\d*)(.*)/.exec(config.ipfs.provider);

        if (parts.length !== 5) {
            throw new Error(`The IPFS Provider is not formatted correctly, it should be in the format https://ipfs.mydomain.com:443/api/v0/`);
        }

        const ipfsConfig = {
            protocol: parts[1],
            host: parts[2],
            port: parts[3],
            "api-path": parts[4],
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

        const ipfsHash = addResponse.path;
        console.log(`Adding file ${request.name} complete in ${Date.now() - addStart}ms`);

        const tanglePayload: IPayload = {
            name: request.name,
            description: request.description,
            size: request.size,
            modified: request.modified,
            algorithm: request.algorithm,
            hash: request.hash,
            ipfs: ipfsHash
        };

        let message;

        const json = JSON.stringify(tanglePayload);

        // Chrysalis client instance
        const client = new ClientBuilder().node(config.node.provider).build();

        const index = IotaC2Helper.generateHash();

        await client
            .message()
            .index(index)
            .data(new TextEncoder().encode(json))
            .submit()
            .then(msg => message = msg)

        const messageCacheService = new MessageCacheService(
            config.dynamoDbConnection,
            config.node.provider);

        await messageCacheService.set({ messageId: message.messageId, message: message.message });

        return {
            success: true,
            message: "OK",
            transactionHash: message.messageId,
            ipfs: tanglePayload.ipfs
        };
    } catch (err) {
        return {
            success: false,
            message: err.toString()
        };
    }
}