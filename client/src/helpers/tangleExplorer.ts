
/**
 * Helper functions for use with tangle explorer.
 */
export class TangleExplorer {
    /**
     * Open a bundle hash in the explorer.
     * @param bundleHash The bundle hash.
     */
    public static bundle(bundleHash?: string): void {
        if (bundleHash) {
            window.open(`https://thetangle.org/bundle/${bundleHash}`, "_blank");
        }
    }

    /**
     * Open a transaction hash in the explorer.
     * @param transactionHash The transaction hash.
     */
    public static transaction(transactionHash?: string): void {
        if (transactionHash) {
            window.open(`https://thetangle.org/transaction/${transactionHash}`, "_blank");
        }
    }
}
