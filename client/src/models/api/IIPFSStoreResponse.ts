import { IResponse } from "./IResponse";

export interface IIPFSStoreResponse extends IResponse {
    /**
     * The message id.
     */
    messageId?: string;

    /**
     * The hash for the ipfs item.
     */
    ipfs?: string;
}
