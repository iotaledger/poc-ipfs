import * as crypto from "crypto";

/**
 * Helper function for 32-byte (256-bit) seed generation.
 */
export class Base32Helper {

    /**
     * Generate a random hash in Base32-encoding.
     * @returns The hash.
     */
    public static generateHash(): string {

        const hash = crypto.createHash('sha256').update(crypto.randomBytes(256)).digest('hex');

        return hash;
    }
}