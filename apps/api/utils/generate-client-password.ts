import crypto from "node:crypto";

export function generateClientPassword() {
    const alphabet =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    function random(length: number) {
        return Array.from(
            crypto.randomBytes(length)
        )
            .map(
                (b) =>
                    alphabet[
                    b % alphabet.length
                    ]
            )
            .join("");
    }

    return `${random(4)}-${random(4)}`;
}