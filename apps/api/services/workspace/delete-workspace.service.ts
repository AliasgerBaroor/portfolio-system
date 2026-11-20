
import { WorkspaceStatus } from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { WORKSPACE_PERMISSIONS } from "../../constants/workspace-permissions";
import { requireWorkspacePermission } from "../authorization/workspace-permission.service";

export async function deleteWorkspace(
    userId: string,
    workspaceId: string,
) {
    // Verify that the user has permission to delete this workspace.
    await requireWorkspacePermission(
        userId,
        workspaceId,
        WORKSPACE_PERMISSIONS.DELETE,
    );

    // Soft-delete the workspace.
    const result = await prisma.workspace.updateMany({
        where: {
            id: workspaceId,
            status: WorkspaceStatus.ACTIVE,
            deletedAt: null,
        },
        data: {
            status: WorkspaceStatus.ARCHIVED,
            deletedAt: new Date(),
        },
    });

    if (result.count === 0) {
        return null;
    }

    return {
        id: workspaceId,
        status: WorkspaceStatus.ARCHIVED,
        deleted: true,
    };
}
