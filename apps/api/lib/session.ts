import { randomBytes } from "crypto";

import { hashToken } from "./hash";
import { expiryDate } from "./date";
import { env } from "./env";
import { type StringValue } from "ms";

export function generateSessionTokens() {
    const refreshToken =
        randomBytes(64).toString("hex");

    const refreshTokenHash =
        hashToken(refreshToken);

    const expiresAt = expiryDate(
        env.REFRESH_TOKEN_EXPIRES_IN as StringValue
    );

    return {
        refreshToken,
        refreshTokenHash,
        expiresAt,
    };
}