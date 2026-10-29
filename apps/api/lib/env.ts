import "dotenv/config";
import type { SignOptions } from "jsonwebtoken";

function required(name: string) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
}

export const env = {
    DATABASE_URL: required("DATABASE_URL"),
    
    FRONTEND_URL: required("FRONTEND_URL"),

    JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
    JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),

    ACCESS_TOKEN_EXPIRES_IN:
        (process.env.ACCESS_TOKEN_EXPIRES_IN ??
            "15m") as SignOptions["expiresIn"],

    REFRESH_TOKEN_EXPIRES_IN:
        (process.env.REFRESH_TOKEN_EXPIRES_IN ??
            "30d") as SignOptions["expiresIn"],

    REFRESH_TOKEN_EXPIRES_RAW:
        process.env.REFRESH_TOKEN_EXPIRES_IN ?? "30d",
};