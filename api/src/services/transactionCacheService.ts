import { composeAPI } from "@iota/core";
import { IAWSDynamoDbConfiguration } from "../models/configuration/IAWSDynamoDbConfiguration";
import { ITransaction } from "../models/db/ITransaction";
import { AmazonDynamoDbService } from "./amazonDynamoDbService";

/**
 * Service to handle the transaction cache.
 */
export class TransactionCacheService extends AmazonDynamoDbService<ITransaction> {
    /**
     * The name of the database table.
     */
    public static readonly TABLE_NAME: string = "transactionCache";

    /**
     * Configuration to connection to tangle.
     */
    private readonly _provider: string;

    /**
     * Is there connectivity to the tangle.
     */
    private readonly _hasTangleConnectivity: boolean;

    /**
     * Create a new instance of TransactionCacheService.
     * @param config The configuration to use.
     * @param provider The tangle node.
     * @param hasTangleConnectivity Is there tangle connectivity.
     */
    constructor(config: IAWSDynamoDbConfiguration, provider: string, hasTangleConnectivity: boolean) {
        super(config, TransactionCacheService.TABLE_NAME, "id");
        this._provider = provider;
        this._hasTangleConnectivity = hasTangleConnectivity;
    }

    /**
     * Get the transaction with the given hash.
     * @param id The hash id.
     * @returns The transaction if it can be found.
     */
    public async get(id: string): Promise<ITransaction> {
        if (this._hasTangleConnectivity) {
            try {
                const iota = composeAPI({
                    provider: this._provider
                });

                const getTrytesResponse = await iota.getTrytes([id]);
                if (getTrytesResponse && getTrytesResponse.length > 0) {
                    // All 9s means it has been removed with a snapshot
                    if (!/^9*$/.test(getTrytesResponse[0])) {
                        return {
                            id,
                            trytes: getTrytesResponse[0]
                        };
                    }
                }
            } catch (err) {
            }
        }

        return super.get(id);
    }
}
