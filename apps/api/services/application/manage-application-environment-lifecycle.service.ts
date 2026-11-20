import { prisma } from "../../lib/prisma";
import { requireApplicationPermission } from "../authorization/application-permission.service";

export class ApplicationEnvironmentLifecycleError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 403 | 404 | 409,
    ) {
        super(message);
        this.name = "ApplicationEnvironmentLifecycleError";
    }
}

interface EnvironmentLifecycleParams {
    userId: string;
    workspaceId: string;
    applicationId: string;
    environmentId: string;
}

async function getEnvironmentForLifecycle(params: EnvironmentLifecycleParams) {
    const { userId, workspaceId, applicationId, environmentId } = params;

    await requireApplicationPermission(
        userId,
        applicationId,
        "applications.update",
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
        },
        select: {
            id: true,
            applicationId: true,
            type: true,
            status: true,
            deletedAt: true,
        },
    });

    if (!environment) {
        throw new ApplicationEnvironmentLifecycleError(
            "Environment not found.",
            404,
        );
    }

    return environment;
}

export async function archiveApplicationEnvironment(
    params: EnvironmentLifecycleParams,
) {
    const environment = await getEnvironmentForLifecycle(params);

    if (environment.deletedAt !== null || environment.status === "ARCHIVED") {
        throw new ApplicationEnvironmentLifecycleError(
            "Environment is already archived.",
            409,
        );
    }

    if (environment.type === "PRODUCTION") {
        throw new ApplicationEnvironmentLifecycleError(
            "Production environment cannot be archived.",
            409,
        );
    }

    const result = await prisma.applicationEnvironment.updateMany({
        where: {
            id: environment.id,
            applicationId: environment.applicationId,
            deletedAt: null,
            status: { in: ["ACTIVE", "DISABLED"] },
        },
        data: {
            status: "ARCHIVED",
            deletedAt: new Date(),
        },
    });

    if (result.count !== 1) {
        throw new ApplicationEnvironmentLifecycleError(
            "Environment could not be archived because its state changed. Please retry.",
            409,
        );
    }

    return prisma.applicationEnvironment.findUniqueOrThrow({
        where: { id: environment.id },
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
            deletedAt: true,
        },
    });
}

export async function restoreApplicationEnvironment(
    params: EnvironmentLifecycleParams,
) {
    const environment = await getEnvironmentForLifecycle(params);

    if (environment.deletedAt === null || environment.status !== "ARCHIVED") {
        throw new ApplicationEnvironmentLifecycleError(
            "Environment is not archived.",
            409,
        );
    }

    const result = await prisma.applicationEnvironment.updateMany({
        where: {
            id: environment.id,
            applicationId: environment.applicationId,
            status: "ARCHIVED",
            deletedAt: { not: null },
        },
        data: {
            status: "ACTIVE",
            deletedAt: null,
        },
    });

    if (result.count !== 1) {
        throw new ApplicationEnvironmentLifecycleError(
            "Environment could not be restored because its state changed. Please retry.",
            409,
        );
    }

    return prisma.applicationEnvironment.findUniqueOrThrow({
        where: { id: environment.id },
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
            deletedAt: true,
        },
    });
}