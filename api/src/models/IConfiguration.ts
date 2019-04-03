import { IAWSDynamoDbConfiguration } from "./IAWSDynamoDbConfiguration";
import { IIPFSConfiguration } from "./IIPFSConfiguration";
import { INodeConfiguration } from "./INodeConfiguration";

/**
 * Definition of configuration file.
 */
export interface IConfiguration {
    /**
     * The provider to use for IOTA communication.
     */
    node: INodeConfiguration;

    /**
     * The IPFS configuration.
     */
    ipfs: IIPFSConfiguration;

    /**
     * The dynamic db connection.
     */
    dynamoDbConnection: IAWSDynamoDbConfiguration;
}
