import { ApplicationStatus } from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { requireWorkspacePermission } from "../authorization/workspace-permission.service";
import type { UpdateApplicationInput } from "../../validators/application/update-application.validator";

export class ApplicationNotFoundError extends Error {
    constructor() {
        super("Application not found.");
        this.name = "ApplicationNotFoundError";
    }
}

export async function updateApplication(
    userId: string,
    workspaceId: string,
    applicationId: string,
    input: UpdateApplicationInput,
) {
    await requireWorkspacePermission(
        userId,
        workspaceId,
        "applications.update",
    );

    const existingApplication = await prisma.application.findFirst({
        where: {
            id: applicationId,
            workspaceId,
            status: ApplicationStatus.ACTIVE,
            deletedAt: null,
        },
        select: {
            id: true,
        },
    });

    if (!existingApplication) {
        throw new ApplicationNotFoundError();
    }

    return prisma.application.update({
        where: {
            id: existingApplication.id,
        },
        data: {
            ...(input.name !== undefined && {
                name: input.name,
            }),
            ...(input.description !== undefined && {
                description: input.description,
            }),
            ...(input.type !== undefined && {
                type: input.type,
            }),
            ...(input.integrationMode !== undefined && {
                integrationMode: input.integrationMode,
            }),
        },
    });
}