import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";

const ENCRYPTION_KEY =
    process.env.CLIENT_PASSWORD_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
    throw new Error(
        "CLIENT_PASSWORD_ENCRYPTION_KEY is not configured."
    );
}

const key = Buffer.from(
    ENCRYPTION_KEY,
    "hex"
);

if (key.length !== 32) {
    throw new Error(
        "CLIENT_PASSWORD_ENCRYPTION_KEY must be 32 bytes."
    );
}

export function encryptClientPassword(
    password: string
) {
    const iv =
        crypto.randomBytes(12);

    const cipher =
        crypto.createCipheriv(
            ALGORITHM,
            key,
            iv
        );

    const encrypted =
        Buffer.concat([
            cipher.update(password, "utf8"),
            cipher.final(),
        ]);

    const authTag =
        cipher.getAuthTag();

    return [
        iv.toString("hex"),
        authTag.toString("hex"),
        encrypted.toString("hex"),
    ].join(":");
}

export function decryptClientPassword(
    encryptedPassword: string
) {
    const [
        ivHex,
        authTagHex,
        encryptedHex,
    ] = encryptedPassword.split(":");

    if (
        !ivHex ||
        !authTagHex ||
        !encryptedHex
    ) {
        throw new Error(
            "Invalid encrypted client password."
        );
    }

    const decipher =
        crypto.createDecipheriv(
            ALGORITHM,
            key,
            Buffer.from(ivHex, "hex")
        );

    decipher.setAuthTag(
        Buffer.from(authTagHex, "hex")
    );

    const decrypted =
        Buffer.concat([
            decipher.update(
                Buffer.from(
                    encryptedHex,
                    "hex"
                )
            ),
            decipher.final(),
        ]);

    return decrypted.toString("utf8");
}