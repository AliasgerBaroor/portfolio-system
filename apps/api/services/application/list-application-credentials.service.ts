
import { prisma } from "../../lib/prisma";
import { requireApplicationPermission } from "../authorization/application-permission.service";

export class ApplicationCredentialListError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 404,
    ) {
        super(message);
        this.name = "ApplicationCredentialListError";
    }
}

interface ListApplicationCredentialsParams {
    userId: string;
    workspaceId: string;
    applicationId: string;
    environmentId: string;
}

export async function listApplicationCredentials(
    params: ListApplicationCredentialsParams,
) {
    const {
        userId,
        workspaceId,
        applicationId,
        environmentId,
    } = params;

    await requireApplicationPermission(
        userId,
        applicationId,
        "applications.read",
    );

    const environment = await prisma.applicationEnvironment.findFirst({
        where: {
            id: environmentId,
            applicationId,
            application: {
                workspaceId,
                status: "ACTIVE",
                deletedAt: null,
            },
            deletedAt: null,
            status: {
                not: "ARCHIVED",
            },
        },
        select: {
            id: true,
        },
    });

    if (!environment) {
        throw new ApplicationCredentialListError(
            "Application environment not found.",
            404,
        );
    }

    return prisma.applicationCredential.findMany({
        where: {
            environmentId,
        },
        select: {
            id: true,
            environmentId: true,
            name: true,
            description: true,
            keyPrefix: true,
            scopes: true,
            expiresAt: true,
            lastUsedAt: true,
            revokedAt: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
