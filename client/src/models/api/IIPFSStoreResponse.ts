import { IResponse } from "./IResponse";

export interface IIPFSStoreResponse extends IResponse {
    /**
     * The hash for the transactions.
     */
    transactionHash?: string;

    /**
     * The hash for the ipfs item.
     */
    ipfsHash?: string;
}
