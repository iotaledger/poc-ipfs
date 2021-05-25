import { MessageWrapper } from "@iota/client/lib/types";
import { Converter } from "@iota/iota.js";
import * as crypto from "crypto";
import { IPayload } from "../models/tangle/IPayload";

/**
 * Chrysalis client helper functions
 */
export class IotaC2Helper {

    /**
     * Generate a random hash in Base32-encoding.
     * @returns The hash.
     */
    public static generateHash(): string {
        return crypto.createHash("sha256").update(crypto.randomBytes(256)).digest("hex");
    }

    /**
     * Convert message object to payload
     * @param message The message object to convert.
     * @returns The payload.
     */
    public static async messageToPayload(message: MessageWrapper): Promise<IPayload> {
        // Need the any casts in this function because the iota.rs binding definitions are incorrect.
        if (message.message.payload.type as any !== 2) {
            throw new Error(`Invalid messageId: ${message.messageId}. Message has no Indexation Payload containing data.`);
        }

        const payload: IPayload = JSON.parse(Converter.hexToUtf8((message.message.payload as any).data));

        if (payload) {
            return payload;
        } else {
            throw new Error(`Error converting Message: ${
                message.messageId} Indexation Payload data to a valid payload`);
        }
    }
}
