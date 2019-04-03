
export interface RetrieveFileState {
    /**
     * Is the data valid.
     */
    isValid: boolean;

    /**
     * Is the form busy.
     */
    isBusy: boolean;

    /**
     * Has the request errored.
     */
    isErrored: boolean;

    /**
     * Status message to display.
     */
    status: string;

    /**
     * The hash of the transaction to validate.
     */
    transactionHash: string;

    /**
     * The name of the file.
     */
    fileName?: string;

    /**
     * The description of the file.
     */
    fileDescription?: string;

    /**
     * The length of the file.
     */
    fileSize?: number;

    /**
     * The modified date of the file.
     */
    fileModified?: Date;

    /**
     * The hash algorithm of the file.
     */
    fileAlgorithm?: string;

    /**
     * The hash of the file.
     */
    fileHash?: string;

    /**
     * The ipfs hash of the file.
     */
    ipfsFileHash?: string;

    /**
     * File buffer.
     */
    fileBuffer?: Buffer;

    /**
     * The ipfs hash for the file.
     */
    ipfsHash?: string;
}
