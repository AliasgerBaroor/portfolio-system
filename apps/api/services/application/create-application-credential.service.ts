
import { prisma } from "../../lib/prisma";
import {
    generateApplicationCredential,
} from "../../lib/application-credential";
import {
    requireApplicationPermission,
} from "../authorization/application-permission.service";

export class ApplicationCredentialCreationError extends Error {
    constructor(
        message: string,
        public readonly status: 403 | 404 | 409,
    ) {
        super(message);
        this.name = "ApplicationCredentialCreationError";
    }
}

interface CreateApplicationCredentialParams {
    userId: string;
    workspaceId: string;
    applicationId: string;
    environmentId: string;
    name: string;
    description?: string | null;
    scopes: string[];
    expiresAt?: string | null;
}

export async function createApplicationCredential(
    params: CreateApplicationCredentialParams,
) {
    const {
        userId,
        workspaceId,
        applicationId,
        environmentId,
        name,
        description,
        scopes,
        expiresAt,
    } = params;

    await requireApplicationPermission(
        userId,
        applicationId,
        "applications.update",
    );

    const application = await prisma.application.findFirst({
        where: {
            id: applicationId,
            workspaceId,
            status: "ACTIVE",
            deletedAt: null,
        },
        select: {
            id: true,
        },
    });

    if (!application) {
        throw new ApplicationCredentialCreationError(
            "Application not found.",
            404,
        );
    }

    const environment = await prisma.applicationEnvironment.findFirst({
        where: {
            id: environmentId,
            applicationId,
            status: "ACTIVE",
            deletedAt: null,
        },
        select: {
            id: true,
        },
    });

    if (!environment) {
        throw new ApplicationCredentialCreationError(
            "Active application environment not found.",
            404,
        );
    }

    const parsedExpiry = expiresAt ? new Date(expiresAt) : null;

    if (parsedExpiry && parsedExpiry.getTime() <= Date.now()) {
        throw new ApplicationCredentialCreationError(
            "Credential expiry must be in the future.",
            409,
        );
    }

    const { secret, keyPrefix, secretHash } =
        generateApplicationCredential();

    const credential = await prisma.applicationCredential.create({
        data: {
            environmentId,
            name,
            description: description ?? null,
            keyPrefix,
            secretHash,
            scopes,
            createdById: userId,
            expiresAt: parsedExpiry,
        },
        select: {
            id: true,
            environmentId: true,
            name: true,
            description: true,
            keyPrefix: true,
            scopes: true,
            expiresAt: true,
            createdAt: true,
        },
    });

    return {
        credential,
        secret,
    };
}
