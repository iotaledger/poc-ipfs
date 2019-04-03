import { IConfiguration } from "../models/IConfiguration";
import { BundleCacheService } from "../services/bundleCacheService";
import { StateService } from "../services/stateService";
import { TransactionCacheService } from "../services/transactionCacheService";

/**
 * Initialise the database.
 * @param config The configuration.
 * @returns The response.
 */
export async function init(config: IConfiguration): Promise<string[]> {
    let log = "Initializing\n";

    try {
        log += await new BundleCacheService(config.dynamoDbConnection, config.node.provider, false).createTable();
        log += await new TransactionCacheService(config.dynamoDbConnection, config.node.provider, false).createTable();
        log += await new StateService(config.dynamoDbConnection).createTable();

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
