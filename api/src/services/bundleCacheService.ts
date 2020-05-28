import { composeAPI } from "@iota/core";
import { IAWSDynamoDbConfiguration } from "../models/configuration/IAWSDynamoDbConfiguration";
import { IBundle } from "../models/db/IBundle";
import { AmazonDynamoDbService } from "./amazonDynamoDbService";

/**
 * Service to handle the bundle cache.
 */
export class BundleCacheService extends AmazonDynamoDbService<IBundle> {
    /**
     * The name of the database table.
     */
    public static readonly TABLE_NAME: string = "bundleCache";

    /**
     * Configuration to connection to tangle.
     */
    private readonly _provider: string;

    /**
     * Is there connectivity to the tangle.
     */
    private readonly _hasTangleConnectivity: boolean;

    /**
     * Create a new instance of BundleCacheService.
     * @param config The configuration to use.
     * @param provider The tangle node.
     * @param hasTangleConnectivity Is there tangle connectivity.
     */
    constructor(config: IAWSDynamoDbConfiguration, provider: string, hasTangleConnectivity: boolean) {
        super(config, BundleCacheService.TABLE_NAME, "id");
        this._provider = provider;
        this._hasTangleConnectivity = hasTangleConnectivity;
    }

    /**
     * Get the bundle with the given hash.
     * @param id The hash id of the bundle.
     * @returns The bundle if it can be found.
     */
    public async get(id: string): Promise<IBundle> {
        if (this._hasTangleConnectivity) {
            try {
                const iota = composeAPI({
                    provider: this._provider
                });

                const findTransactionsResponse = await iota.findTransactions({ bundles: [id] });
                if (findTransactionsResponse && findTransactionsResponse.length > 0) {
                    return {
                        id,
                        transactionHashes: findTransactionsResponse
                    };
                }
            } catch (err) {
            }
        }

        return super.get(id);
    }
}
