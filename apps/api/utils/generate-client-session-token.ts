import crypto from "node:crypto";

export function generateClientSessionToken() {
    return crypto.randomBytes(32).toString("hex");
}