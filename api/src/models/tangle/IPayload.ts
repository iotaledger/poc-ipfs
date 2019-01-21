export interface IPayload {
    /**
     * The filename of the file to store.
     */
    name: string;

    /**
     * The description of the file to store.
     */
    description: string;

    /**
     * The size of the file to store.
     */
    size: number;

    /**
     * The modified date of the file to store.
     */
    modified: Date;

    /**
     * The sha256 hash of the file to store.
     */
    sha256: string;

    /**
     * The IPFS hash of the file.
     */
    ipfs: string;
}
