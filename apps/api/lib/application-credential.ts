
import { createHash, randomBytes } from "node:crypto";

const APPLICATION_KEY_PREFIX = "lgfx";
const SECRET_BYTES = 32;

export interface GeneratedApplicationCredential {
    secret: string;
    keyPrefix: string;
    secretHash: string;
}

/**
 * Generates a high-entropy application API credential.
 * The plaintext secret must only be returned once.
 */
export function generateApplicationCredential(): GeneratedApplicationCredential {
    const secretPart = randomBytes(SECRET_BYTES).toString("base64url");

    const secret = `${APPLICATION_KEY_PREFIX}_${secretPart}`;

    const keyPrefix = secret.slice(0, 13);

    const secretHash = hashApplicationCredential(secret);

    return {
        secret,
        keyPrefix,
        secretHash,
    };
}

/**
 * Hashes a plaintext application API credential for secure storage.
 */
export function hashApplicationCredential(secret: string): string {
    return createHash("sha256").update(secret).digest("hex");
}
