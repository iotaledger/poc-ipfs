import { IAWSDynamoDbConfiguration } from "../models/configuration/IAWSDynamoDbConfiguration";
import { IState } from "../models/db/IState";
import { AmazonDynamoDbService } from "./amazonDynamoDbService";

/**
 * Service to handle the state.
 */
export class StateService extends AmazonDynamoDbService<IState> {
    /**
     * The name of the database table.
     */
    public static readonly TABLE_NAME: string = "state";

    constructor(config: IAWSDynamoDbConfiguration) {
        super(config, StateService.TABLE_NAME, "id");
    }
}