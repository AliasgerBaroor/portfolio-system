export type Client = {
    id: string;

    ownerId: string;

    name: string;

    company: string | null;

    email: string | null;

    isActive: boolean;

    createdAt: string;

    updatedAt: string;

    deletedAt: string | null;
};

export type CreateClientRequest = {
    name: string;

    company?: string;

    email?: string;
};

export type CreateClientResponse = {
    success: boolean;

    client: Client;
};

export type GetClientsResponse = {
    success: boolean;

    clients: Client[];
};