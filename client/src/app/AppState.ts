import { AlertColor } from "iota-react-components";

export interface AppState {
    /**
     * The status to display in the alert.
     */
    status: string;

    /**
     * The color to display the alert.
     */
    statusColor: AlertColor;
}
