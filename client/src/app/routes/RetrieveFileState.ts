import { AlertColor } from "iota-react-components";

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
     * Status to display.
     */
    status: string;

    /**
     * Status color to display.
     */
    statusColor: AlertColor;

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
     * The hash of the file.
     */
    fileSha256?: string;

    /**
     * The ipfs hash of the file.
     */
    ipfsSha256?: string;

    /**
     * File buffer.
     */
    fileBuffer?: Buffer;

    /**
     * The ipfs hash for the file.
     */
    ipfsHash?: string;
}
