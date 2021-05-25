import { Client, ClientBuilder } from "@iota/client";
import { MessageWrapper } from "@iota/client/lib/types";
import { IAWSDynamoDbConfiguration } from "../models/configuration/IAWSDynamoDbConfiguration";
import { AmazonDynamoDbService } from "./amazonDynamoDbService";

/**
 * Service to handle the message cache.
 */
export class MessageCacheService extends AmazonDynamoDbService<MessageWrapper> {
    /**
     * The name of the database table.
     */
    public static readonly TABLE_NAME: string = "messageCache";

    /**
     * Configuration to connection to tangle.
     */
    private readonly _provider: string;

    /**
     * Client-instance
     */
    private readonly _client: Client;

    /**
     * Create a new instance of MessageCacheService.
     * @param config The configuration to use.
     * @param provider The tangle node.
     */
    constructor(config: IAWSDynamoDbConfiguration, provider: string) {
        super(config, MessageCacheService.TABLE_NAME, "messageId");
        this._provider = provider;
        try {
            this._client = new ClientBuilder()
                .node(this._provider)
                .build();
        } catch (err) {
        }
    }

    /**
     * Get the message with the given id.
     * @param messageId The message id.
     * @returns The message if it can be found.
     */
    public async get(messageId: string): Promise<MessageWrapper> {
        if (await this.isNodeHealthy()) {
            try {
                return this._client.getMessage().data(messageId);
            } catch (err) {
            }
        }

        return super.get(messageId);
    }

    /**
     * Helper function to check if the node is healthy
     * @returns a boolean-value to check if the node is healthy or not
     */
    public async isNodeHealthy(): Promise<boolean> {
        return this._client && this._client.getInfo()
            .then(info => { return info.nodeinfo.isHealthy; })
            .catch(err => { return false; });
    }
}
