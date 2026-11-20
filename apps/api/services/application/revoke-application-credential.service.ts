
import { prisma } from "../../lib/prisma";
import {
    requireApplicationPermission,
} from "../authorization/application-permission.service";

export class ApplicationCredentialRevocationError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 403 | 404 | 409,
    ) {
        super(message);
        this.name = "ApplicationCredentialRevocationError";
    }
}

interface RevokeApplicationCredentialParams {
    userId: string;
    workspaceId: string;
    applicationId: string;
    environmentId: string;
    credentialId: string;
}

export async function revokeApplicationCredential(
    params: RevokeApplicationCredentialParams,
) {
    const {
        userId,
        workspaceId,
        applicationId,
        environmentId,
        credentialId,
    } = params;

    await requireApplicationPermission(
        userId,
        applicationId,
        "applications.update",
    );

    // Verify that the environment belongs to this application
    // and workspace. Revocation remains possible even if the
    // environment is disabled or archived.
    const environment = await prisma.applicationEnvironment.findFirst({
        where: {
            id: environmentId,
            applicationId,
            application: {
                workspaceId,
            },
        },
        select: {
            id: true,
        },
    });

    if (!environment) {
        throw new ApplicationCredentialRevocationError(
            "Application environment not found.",
            404,
        );
    }

    const credential = await prisma.applicationCredential.findFirst({
        where: {
            id: credentialId,
            environmentId,
        },
        select: {
            id: true,
            revokedAt: true,
        },
    });

    if (!credential) {
        throw new ApplicationCredentialRevocationError(
            "Application credential not found.",
            404,
        );
    }

    if (credential.revokedAt) {
        throw new ApplicationCredentialRevocationError(
            "Application credential has already been revoked.",
            409,
        );
    }

    const revokedAt = new Date();

    const result = await prisma.applicationCredential.updateMany({
        where: {
            id: credentialId,
            environmentId,
            revokedAt: null,
        },
        data: {
            revokedAt,
        },
    });

    if (result.count !== 1) {
        throw new ApplicationCredentialRevocationError(
            "Credential could not be revoked because its state changed.",
            409,
        );
    }

    return prisma.applicationCredential.findUniqueOrThrow({
        where: {
            id: credentialId,
        },
        select: {
            id: true,
            environmentId: true,
            name: true,
            keyPrefix: true,
            scopes: true,
            revokedAt: true,
            updatedAt: true,
        },
    });
}
