import jwt from "jsonwebtoken";
import { env } from "./env";

export interface AccessTokenPayload {
    userId: string;
    role: string;
}

export interface RefreshTokenPayload {
    sessionId: string;
    userId: string;
}

export function signAccessToken(
    payload: AccessTokenPayload
) {
    return jwt.sign(
        payload,
        env.JWT_ACCESS_SECRET,
        {
            expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
        }
    );
}

export function signRefreshToken(
    payload: RefreshTokenPayload
) {
    return jwt.sign(
        payload,
        env.JWT_REFRESH_SECRET,
        {
            expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
        }
    );
}

export function verifyAccessToken(token: string) {
    return jwt.verify(
        token,
        env.JWT_ACCESS_SECRET
    ) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(
        token,
        env.JWT_REFRESH_SECRET
    ) as RefreshTokenPayload;
}