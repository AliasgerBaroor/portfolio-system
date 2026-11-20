
import { ApplicationStatus } from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { requireWorkspacePermission } from "../authorization/workspace-permission.service";

export class ApplicationDeletionNotFoundError extends Error {
    constructor() {
        super("Application not found.");
        this.name = "ApplicationDeletionNotFoundError";
    }
}

export async function deleteApplication(
    userId: string,
    workspaceId: string,
    applicationId: string,
) {
    await requireWorkspacePermission(
        userId,
        workspaceId,
        "applications.delete",
    );

    const deletedAt = new Date();

    const result = await prisma.application.updateMany({
        where: {
            id: applicationId,
            workspaceId,
            status: ApplicationStatus.ACTIVE,
            deletedAt: null,
        },
        data: {
            status: ApplicationStatus.ARCHIVED,
            deletedAt,
        },
    });

    if (result.count === 0) {
        throw new ApplicationDeletionNotFoundError();
    }

    return {
        applicationId,
        status: ApplicationStatus.ARCHIVED,
        deletedAt,
    };
}
