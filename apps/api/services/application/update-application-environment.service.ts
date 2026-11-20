import { prisma } from "../../lib/prisma";
import { requireApplicationPermission } from "../authorization/application-permission.service";
import type { UpdateApplicationEnvironmentInput } from "../../validators/application/update-application-environment.validator";

export class ApplicationEnvironmentUpdateError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 403 | 404 | 409,
    ) {
        super(message);
        this.name = "ApplicationEnvironmentUpdateError";
    }
}

interface UpdateApplicationEnvironmentParams {
    userId: string;
    workspaceId: string;
    applicationId: string;
    environmentId: string;
    data: UpdateApplicationEnvironmentInput;
}

export async function updateApplicationEnvironment(
    params: UpdateApplicationEnvironmentParams,
) {
    const {
        userId,
        workspaceId,
        applicationId,
        environmentId,
        data,
    } = params;

    await requireApplicationPermission(
        userId,
        applicationId,
        "applications.update",
    );

    const environment = await prisma.applicationEnvironment.findFirst({
        where: {
            id: environmentId,
            applicationId,
            deletedAt: null,
            status: { not: "ARCHIVED" },
            application: {
                workspaceId,
                status: "ACTIVE",
                deletedAt: null,
            },
        },
        select: {
            id: true,
            type: true,
        },
    });

    if (!environment) {
        throw new ApplicationEnvironmentUpdateError(
            "Environment not found.",
            404,
        );
    }

    // Production status changes require a separate guarded lifecycle operation.
    if (
        environment.type === "PRODUCTION" &&
        data.status !== undefined &&
        data.status !== "ACTIVE"
    ) {
        throw new ApplicationEnvironmentUpdateError(
            "Production environment status cannot be changed through this endpoint.",
            409,
        );
    }

    return prisma.applicationEnvironment.update({
        where: {
            id: environmentId,
        },
        data: {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.description !== undefined && {
                description: data.description,
            }),
            ...(data.status !== undefined && { status: data.status }),
        },
        select: {
            id: true,
            applicationId: true,
            name: true,
            slug: true,
            type: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}