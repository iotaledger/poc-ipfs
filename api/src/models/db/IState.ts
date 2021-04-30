export interface IState {
    /**
     * The id for the state.
     */
    id: string;
    /**
     * The seed to use for address generation.
     */
    seed: string;
    /**
     * The last address idnex used.
     */
    addressIndex: number;
}