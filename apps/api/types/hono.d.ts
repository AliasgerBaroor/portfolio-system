import type { UserRole } from "@prisma/client";

export interface AuthUser {
    id: string;
    email: string;
    username: string;
    displayName: string;
    fullName: string;
    avatar: string | null;
    role: UserRole;
    isActive: boolean;
    deletedAt: Date | null;
}

import type { ClientAccessSession, ClientAccessKey } from "@prisma/client";

declare module "hono" {
    interface ContextVariableMap {
        user: AuthUser;

        clientAccessSession:
        ClientAccessSession & {
            accessKey: ClientAccessKey;
        };
    }
}