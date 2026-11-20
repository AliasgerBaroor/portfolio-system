import { prisma } from "../../lib/prisma";
import { requireApplicationPermission } from "../authorization/application-permission.service";

export class ApplicationEnvironmentNotFoundError extends Error {
    constructor() {
        super("Application not found.");
        this.name = "ApplicationEnvironmentNotFoundError";
    }
}

export async function listApplicationEnvironments(
    userId: string,
    workspaceId: string,
    applicationId: string,
) {
    await requireApplicationPermission(
        userId,
        applicationId,
        "applications.read",
    );

    // Ensure the application belongs to the requested workspace.
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
        throw new ApplicationEnvironmentNotFoundError();
    }

    return prisma.applicationEnvironment.findMany({
        where: {
            applicationId,
            deletedAt: null,
            status: {
                not: "ARCHIVED",
            },
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
            deletedAt: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}