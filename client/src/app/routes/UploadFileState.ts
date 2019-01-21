import { AlertColor } from "iota-react-components";

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
     * Status to display.
     */
    status: string;

    /**
     * Status color to display.
     */
    statusColor: AlertColor;

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
    fileSha256?: string;

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
