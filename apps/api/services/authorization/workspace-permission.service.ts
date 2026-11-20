
import {
    MembershipStatus,
    WorkspaceStatus,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";

export class WorkspacePermissionError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 403 | 404,
    ) {
        super(message);
        this.name = "WorkspacePermissionError";
    }
}

function hasPermission(
    permissions: unknown,
    requiredPermission: string,
): boolean {
    if (!Array.isArray(permissions)) {
        return false;
    }

    return permissions.some(
        (permission) =>
            typeof permission === "string" &&
            permission === requiredPermission,
    );
}

export async function requireWorkspacePermission(
    userId: string,
    workspaceId: string,
    requiredPermission: string,
) {
    const workspace = await prisma.workspace.findFirst({
        where: {
            id: workspaceId,
            status: WorkspaceStatus.ACTIVE,
            deletedAt: null,
        },
        select: {
            id: true,
            name: true,
            slug: true,
            ownerId: true,
            members: {
                where: {
                    userId,
                    status: MembershipStatus.ACTIVE,
                },
                select: {
                    role: {
                        select: {
                            permissions: true,
                        },
                    },
                },
                take: 1,
            },
        },
    });

    if (!workspace) {
        throw new WorkspacePermissionError(
            "Workspace not found.",
            404,
        );
    }

    const membership = workspace.members[0];

    if (!membership) {
        throw new WorkspacePermissionError(
            "You do not have access to this workspace.",
            404,
        );
    }

    if (
        !hasPermission(
            membership.role.permissions,
            requiredPermission,
        )
    ) {
        throw new WorkspacePermissionError(
            "You do not have permission to perform this action.",
            403,
        );
    }

    return workspace;
}