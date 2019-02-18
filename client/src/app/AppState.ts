import { StatusMessageColor } from "iota-react-components";

export interface AppState {
    /**
     * The status to display in the status message.
     */
    status: string;

    /**
     * The color to display the status message.
     */
    statusColor: StatusMessageColor;

    /**
     * Is the page busy.
     */
    isBusy: boolean;

    /**
     * Is the side menu open.
     */
    isSideMenuOpen: boolean;
}
