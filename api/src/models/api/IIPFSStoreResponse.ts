import { IResponse } from "./IResponse";

export interface IIPFSStoreResponse extends IResponse {
    /**
     * The hash for the messages.
     */
    messageId?: string;

    /**
     * The hash for the ipfs item.
     */
    ipfs?: string;
}
