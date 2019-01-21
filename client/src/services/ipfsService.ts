/**
 * Class to handle IPFS services.
 */
export class IpfsService {
    /**
     * The gateway for performing communications.
     */
    private readonly _gateway: string;

    /**
     * Create a new instance of IpfsService.
     * @param gateway The gateway for the api.
     */
    constructor(gateway: string) {
        this._gateway = gateway;
    }

    /**
     * Open a hash in the explorer.
     * @param fileHash The file hash.
     */
    public exploreFile(fileHash?: string): void {
        if (fileHash) {
            window.open(this._gateway.replace(":hash", fileHash), "_blank");
        }
    }
}
