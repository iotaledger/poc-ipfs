import { IIPFSRetrieveRequest } from "../models/api/IIPFSRetrieveRequest";
import { IIPFSRetrieveResponse } from "../models/api/IIPFSRetrieveResponse";
import { IConfiguration } from "../models/configuration/IConfiguration";
import { MessageCacheService } from '../services/messageCacheService';
import { IotaC2Helper } from "../utils/iotaC2Helper";
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
        ValidationHelper.isMessageId(request.transactionHash);

        const messageCacheService = new MessageCacheService(
            config.dynamoDbConnection,
            config.node.provider);
        const message = await messageCacheService.get(request.transactionHash);

        if (!message) {
            throw new Error(`Unable to locate the specified message: '${request.transactionHash}'.`);
        }

        const payload = await IotaC2Helper.messageToPayload(message);

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
