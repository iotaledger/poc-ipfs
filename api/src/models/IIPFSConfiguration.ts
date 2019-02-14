/**
 * Configuration for the IPFS Node.
 */
export interface IIPFSConfiguration {
    /**
     * The protocol for the ipfs node.
     */
    protocol: string;
    /**
     * The host for the ipfs node.
     */
    host: string;
    /**
     * The port for the ipfs node.
     */
    port: string;
    /**
     * The api path for the ipfs node.
     */
    apiPath: string;
    /**
     * The token for the ipfs node.
     */
    token: string;
}
