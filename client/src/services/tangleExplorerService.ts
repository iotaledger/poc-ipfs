import { ITangleExplorerConfiguration } from "../models/config/ITangleExplorerConfiguration";

/**
 * Helper functions for use with tangle explorer.
 */
export class TangleExplorerService {
    /**
     * The explorer config.
     */
    private readonly _config: ITangleExplorerConfiguration;

    /**
     * Create a new instance of TangleExplorerService.
     * @param config The config for the api.
     */
    constructor(config: ITangleExplorerConfiguration) {
        this._config = config;
    }

    /**
     * Open a message in the explorer.
     * @param messageId The id of the message.
     */
    public message(messageId?: string): void {
        if (messageId) {
            window.open(this._config.messages.replace(":messageId", messageId), "_blank");
        }
    }
}
