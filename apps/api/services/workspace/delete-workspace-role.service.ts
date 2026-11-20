
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { requireWorkspacePermission } from "../authorization/workspace-permission.service";

export class WorkspaceRoleDeletionError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 403 | 404 | 409,
    ) {
        super(message);
        this.name = "WorkspaceRoleDeletionError";
    }
}

const BUILT_IN_ROLE_KEYS = new Set(["owner", "admin", "member"]);

export async function deleteWorkspaceRole(
    userId: string,
    workspaceId: string,
    roleId: string,
) {
    await requireWorkspacePermission(
        userId,
        workspaceId,
        "workspace.roles.delete",
    );

    const existingRole = await prisma.workspaceRole.findFirst({
        where: {
            id: roleId,
            workspaceId,
        },
        select: {
            id: true,
            name: true,
            key: true,
            _count: {
                select: {
                    members: true,
                    invitations: true,
                },
            },
        },
    });

    if (!existingRole) {
        throw new WorkspaceRoleDeletionError(
            "Workspace role not found.",
            404,
        );
    }

    if (BUILT_IN_ROLE_KEYS.has(existingRole.key)) {
        throw new WorkspaceRoleDeletionError(
            "Built-in workspace roles cannot be deleted.",
            403,
        );
    }

    if (
        existingRole._count.members > 0 ||
        existingRole._count.invitations > 0
    ) {
        throw new WorkspaceRoleDeletionError(
            "This role cannot be deleted because it is assigned to members or referenced by invitations.",
            409,
        );
    }

    try {
        await prisma.workspaceRole.delete({
            where: {
                id: existingRole.id,
            },
        });

        return {
            roleId: existingRole.id,
            name: existingRole.name,
            key: existingRole.key,
            status: "DELETED" as const,
        };
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            (error.code === "P2003" || error.code === "P2025")
        ) {
            throw new WorkspaceRoleDeletionError(
                "The role could not be deleted because it is still referenced or no longer exists.",
                409,
            );
        }

        throw error;
    }
}
