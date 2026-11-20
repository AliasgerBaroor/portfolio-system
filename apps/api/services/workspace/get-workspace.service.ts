import {
    MembershipStatus,
    WorkspaceStatus,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { WORKSPACE_PERMISSIONS } from "../../constants/workspace-permissions";
import { requireWorkspacePermission } from "../authorization/workspace-permission.service";

export async function getWorkspace(
    userId: string,
    workspaceId: string,
) {
    // Verify workspace access and permission first.
    await requireWorkspacePermission(
        userId,
        workspaceId,
        WORKSPACE_PERMISSIONS.READ,
    );

    // Retrieve workspace details.
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
            description: true,
            status: true,
            ownerId: true,
            createdById: true,
            createdAt: true,
            updatedAt: true,

            members: {
                where: {
                    userId,
                    status: MembershipStatus.ACTIVE,
                },
                select: {
                    role: {
                        select: {
                            id: true,
                            name: true,
                            key: true,
                            permissions: true,
                        },
                    },
                },
                take: 1,
            },

            _count: {
                select: {
                    members: true,
                    applications: true,
                },
            },
        },
    });

    if (!workspace) {
        return null;
    }

    return {
        ...workspace,
        membership: workspace.members[0] ?? null,
        members: undefined,
    };
}