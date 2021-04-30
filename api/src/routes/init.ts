import { IConfiguration } from "../models/configuration/IConfiguration";
import { MessageCacheService } from "../services/messageCacheService";
import { StateService } from './../services/stateService';

/**
 * Initialise the database.
 * @param config The configuration.
 * @returns The response.
 */
export async function init(config: IConfiguration): Promise<string[]> {
    let log = "Initializing\n";

    try {
        log += await new StateService(config.dynamoDbConnection).createTable();
        log += await new MessageCacheService(config.dynamoDbConnection, config.node.provider).createTable();

    } catch (err) {
        log += `Failed\n${err.toString()}\n`;
    }

    if (log.indexOf("Failed") < 0) {
        log += "Initialization Succeeded";
    } else {
        log += "Initialization Failed";
    }

    return log.split("\n");
}
