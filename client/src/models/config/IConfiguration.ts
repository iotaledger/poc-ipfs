import { ITangleExplorerConfiguration } from "./ITangleExplorerConfiguration";

export interface IConfiguration {
    /**
     * The api endpoint for the IOTA IPFS.
     */
    apiEndpoint: string;

    /**
     * The IPFS gateway to use for viewing files.
     */
    ipfsGateway: string;

    /**
     * The tangle explorer configuration.
     */
    tangleExplorer: ITangleExplorerConfiguration;
}
