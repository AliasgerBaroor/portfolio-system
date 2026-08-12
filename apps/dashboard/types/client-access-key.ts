export type ClientAccessKey = {
    id: string;

    name: string;

    password: string | null;

    expiresAt: string | null;

    deviceLimit: number;

    usedCount: number;

    isActive: boolean;

    createdAt: string;

    lastUsedAt: string | null;
};

export type CreateClientAccessKeyRequest = {
    name: string;
};

export type CreateClientAccessKeyResponse = {
    success: boolean;

    password: string;

    accessKey: ClientAccessKey;
};

export type GetClientAccessKeysResponse = {
    success: boolean;

    accessKeys: ClientAccessKey[];
};