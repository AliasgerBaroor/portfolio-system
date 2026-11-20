import type { UserRole, ClientAccessSession, ClientAccessKey } from "@prisma/client";

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

export type ApplicationCredentialScope =
    | "content.read"
    | "content.write"
    | "assets.read"
    | "assets.write";

export interface AuthenticatedApplicationCredential {
    id: string;
    environmentId: string;
    applicationId: string;
    scopes: ApplicationCredentialScope[];
}

declare module "hono" {
    interface ContextVariableMap {
        user: AuthUser;
        clientAccessSession: ClientAccessSession & {
            accessKey: ClientAccessKey;
        };
        applicationCredential: AuthenticatedApplicationCredential;
    }
}