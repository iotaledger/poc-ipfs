import { IIPFSConfiguration } from "./IIPFSConfiguration";

/**
 * Definition of configuration file.
 */
export interface IConfiguration {
    /**
     * The provider to use for IOTA communication.
     */
    provider: string;

    /**
     * The IPFS configuration.
     */
    ipfs: IIPFSConfiguration;

    /**
     * The seed to generate address for the transactions.
     */
    seed: string;
}
