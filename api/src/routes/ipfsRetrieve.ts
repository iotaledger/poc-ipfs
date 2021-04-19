// import { asTransactionObject, Transaction } from "@iota/transaction-converter";
import { IIPFSRetrieveRequest } from "../models/api/IIPFSRetrieveRequest";
import { IIPFSRetrieveResponse } from "../models/api/IIPFSRetrieveResponse";
import { IConfiguration } from "../models/configuration/IConfiguration";
// import { IPayload } from "../models/tangle/IPayload";
// import { BundleCacheService } from "../services/bundleCacheService";
// import { TransactionCacheService } from "../services/transactionCacheService";
import { MessageCacheService } from '../services/messageCacheService';
import { IotaC2Helper } from "../utils/iotaC2Helper";
// import { IotaHelper } from "../utils/iotaHelper";
// import { TrytesHelper } from "../utils/trytesHelper";
import { ValidationHelper } from "../utils/validationHelper";

/**
 * Ipfs retrieve command.
 * @param config The configuration.
 * @param request the request.
 * @returns The response.
 */
export async function ipfsRetrieve(
    config: IConfiguration,
    request: IIPFSRetrieveRequest): Promise<IIPFSRetrieveResponse> {
    try {
        ValidationHelper.string(request.transactionHash, "transactionHash");

        // not needed anymore
        // const hasConnectivity = await IotaHelper.isNodeAvailable(config.node.provider);

        // not needed anymore
        // const transactionCacheService = new TransactionCacheService(
        //     config.dynamoDbConnection,
        //     config.node.provider,
        //     hasConnectivity);
        // const transaction = await transactionCacheService.get(request.transactionHash);

        // not needed anymore
        // if (!transaction) {
        //     throw new Error(`Unable to locate the specified transaction: '${request.transactionHash}'.`);
        // }

        const messageCacheService = new MessageCacheService(
            config.dynamoDbConnection,
            config.node.provider);
        const message = await messageCacheService.get(request.transactionHash);

        if (!message) {
            throw new Error(`Unable to locate the specified message: '${request.transactionHash}'.`);
        }

        const payload = await IotaC2Helper.messageToPayload(message);

        console.log("payload-C2", payload);

        // not needed anymore
        // const txObject = asTransactionObject(transaction.trytes);
        // const txObjects: Transaction[] = [txObject];

        // not needed anymore
        // if (txObject.lastIndex > 0) {
        //     const bundleCacheService = new BundleCacheService(
        //         config.dynamoDbConnection,
        //         config.node.provider,
        //         hasConnectivity);
        //     const bundle = await bundleCacheService.get(txObject.bundle);
        //     if (bundle) {
        //         for (let i = 0; i < bundle.transactionHashes.length; i++) {
        //             if (bundle.transactionHashes[i] !== request.transactionHash) {
        //                 const txAdditional = await transactionCacheService.get(bundle.transactionHashes[i]);
        //                 if (txAdditional) {
        //                     txObjects.push(asTransactionObject(txAdditional.trytes));
        //                 }
        //             }
        //         }
        //     }
        //     txObjects.sort((a, b) => a.currentIndex - b.currentIndex);
        // }

        // not needed anymore
        // const payload = TrytesHelper.fromTrytes<IPayload>(txObjects.map(t => t.signatureMessageFragment).join(""));

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
