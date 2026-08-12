export type ClientAccessKeyResponse = {
    id: string;

    name: string;

    password: string | null;

    expiresAt: Date | null;

    deviceLimit: number;

    usedCount: number;

    isActive: boolean;

    createdAt: Date;

    lastUsedAt: Date | null;
};

export type CreateClientAccessKeyResponse = {
    success: boolean;

    password: string;

    accessKey: ClientAccessKeyResponse;
};