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
    modified: string;

    /**
     * The hash algorithm of the file to store.
     */
    algorithm: string;

    /**
     * The hash of the file to store.
     */
    hash: string;

    /**
     * The IPFS hash of the file.
     */
    ipfs: string;
}
