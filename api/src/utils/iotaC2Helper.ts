import * as crypto from "crypto";
import { Converter } from "@iota/iota.js";
import { IPayload } from "../models/tangle/IPayload";
import { MessageWrapper } from "@iota/client/lib/types";

/**
 * Chrysalis client helper functions
 */
export class IotaC2Helper {

    /**
     * Generate a random hash in Base32-encoding.
     * @returns The hash.
     */
    public static generateHash(): string {
        const hash = crypto.createHash('sha256').update(crypto.randomBytes(256)).digest('hex');
        return hash;
    }

    /**
     * Convert message object to payload
     * @param message The message object to convert.
     * @returns The payload.
     */
    public static async messageToPayload(message: MessageWrapper): Promise<IPayload> {
        if (message.message.payload.type !== "Indexation") {
            throw new Error(`Invalid messageId: ${message.messageId}. Message has no Indexation Payload containing data.`);
        }

        const payload: IPayload = JSON.parse(Converter.bytesToUtf8(message.message.payload.data.data));

        if (payload) {
            return payload;
        } else {
            Error(`Error converting Message: ${message.messageId} Indexation Payload data to a valid payload`);
        }
    }
}