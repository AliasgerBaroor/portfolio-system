import {
    ApplicationStatus,
    WorkspaceStatus,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { requireWorkspacePermission } from "../authorization/workspace-permission.service";

export async function listWorkspaceApplications(
    userId: string,
    workspaceId: string,
) {
    await requireWorkspacePermission(
        userId,
        workspaceId,
        "applications.read",
    );

    return prisma.application.findMany({
        where: {
            workspaceId,
            status: ApplicationStatus.ACTIVE,
            deletedAt: null,
        },
        select: {
            id: true,
            workspaceId: true,
            name: true,
            slug: true,
            description: true,
            type: true,
            integrationMode: true,
            status: true,
            createdById: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}