import { ClientAccessKey } from "@prisma/client";

export function toClientAccessKeyResponse(
    accessKey: ClientAccessKey
) {
    return {
        id: accessKey.id,
        name: accessKey.name,
        expiresAt: accessKey.expiresAt,
        deviceLimit: accessKey.deviceLimit,
        usedCount: accessKey.usedCount,
        isActive: accessKey.isActive,
        createdAt: accessKey.createdAt,
        lastUsedAt: accessKey.lastUsedAt,
    };
}

type ClientAccessKeyWithPassword =
    ClientAccessKey & {
        password: string | null;
    };

export function toClientAccessKeyWithPasswordResponse(
    accessKey: ClientAccessKeyWithPassword
) {
    const expired =
        accessKey.expiresAt !== null &&
        accessKey.expiresAt <= new Date();

    return {
        id: accessKey.id,

        name: accessKey.name,

        password:
            expired || !accessKey.isActive
                ? null
                : accessKey.password,

        expiresAt: accessKey.expiresAt,

        deviceLimit: accessKey.deviceLimit,

        usedCount: accessKey.usedCount,

        isActive:
            !expired &&
            accessKey.isActive,

        createdAt: accessKey.createdAt,

        lastUsedAt: accessKey.lastUsedAt,
    };
}