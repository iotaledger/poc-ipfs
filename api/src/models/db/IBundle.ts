export interface IBundle {
    /**
     * Id of the bundle
     */
    id: string;
    /**
     * The transaction hashes contained in the bundle.
     */
    transactionHashes: ReadonlyArray<string>;
}
