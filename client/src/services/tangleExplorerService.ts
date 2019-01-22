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
     * Open a bundle hash in the explorer.
     * @param bundleHash The bundle hash.
     */
    public bundle(bundleHash?: string): void {
        if (bundleHash) {
            window.open(this._config.bundles.replace(":bundleHash", bundleHash), "_blank");
        }
    }

    /**
     * Open a transaction hash in the explorer.
     * @param transactionHash The transaction hash.
     */
    public transaction(transactionHash?: string): void {
        if (transactionHash) {
            window.open(this._config.transactions.replace(":transactionHash", transactionHash), "_blank");
        }
    }
}
