
export interface UploadFileState {
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
     * The name of the file.
     */
    fileName: string;

    /**
     * The description of the file.
     */
    fileDescription: string;

    /**
     * The length of the file.
     */
    fileSize?: number;

    /**
     * The modified date of the file.
     */
    fileModified?: Date;

    /**
     * The hash of the file.
     */
    fileAlgorithm: string;

    /**
     * The hash of the file.
     */
    fileHash?: string;

    /**
     * File buffer.
     */
    fileBuffer?: Buffer;

    /**
     * The transaction hash for the file.
     */
    transactionHash?: string;

    /**
     * The ipfs hash for the file.
     */
    ipfsHash?: string;
}
