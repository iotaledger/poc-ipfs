import { composeAPI } from "@iota/core";
import { asTransactionObject } from "@iota/transaction-converter";
import { IIPFSRetrieveRequest } from "../models/api/IIPFSRetrieveRequest";
import { IIPFSRetrieveResponse } from "../models/api/IIPFSRetrieveResponse";
import { IConfiguration } from "../models/IConfiguration";
import { IPayload } from "../models/tangle/IPayload";
import { TrytesHelper } from "../utils/trytesHelper";
import { ValidationHelper } from "../utils/validationHelper";

/**
 * Ipfs retrieve command.
 * @param config The configuration.
 * @param request the request.
 * @returns The response.
 */
export async function ipfsRetrieve(config: IConfiguration, request: IIPFSRetrieveRequest): Promise<IIPFSRetrieveResponse> {
    try {
        ValidationHelper.string(request.transactionHash, "transactionHash");

        const iota = composeAPI({
            provider: config.provider
        });

        const transactions = await iota.getTrytes([request.transactionHash]);

        if (!transactions || transactions.length === 0) {
            throw new Error(`Unable to locate the specified transaction: '${request.transactionHash}'.`);
        }

        const txObject = asTransactionObject(transactions[0]);

        const payload = TrytesHelper.fromTrytes<IPayload>(txObject.signatureMessageFragment);

        return {
            success: true,
            message: "OK",
            ...payload
        };
    } catch (err) {
        return {
            success: false,
            message: err.toString()
        };
    }
}
