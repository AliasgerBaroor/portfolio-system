import { randomBytes } from "crypto";

export function generateClientCredentialId() {
    return randomBytes(9).toString("base64url");
}