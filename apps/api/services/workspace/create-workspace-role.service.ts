
import { prisma } from "../../lib/prisma";
import { requireWorkspacePermission } from "../authorization/workspace-permission.service";
import { ALLOWED_PERMISSIONS } from "../../constants/permission-registry";

interface CreateWorkspaceRoleInput {
    name: string;
    permissions: string[];
}

export class WorkspaceRoleCreationError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 400 | 403 | 404 | 409,
    ) {
        super(message);
        this.name = "WorkspaceRoleCreationError";
    }
}

function createRoleKey(name: string): string {
    return name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function createWorkspaceRole(
    userId: string,
    workspaceId: string,
    input: CreateWorkspaceRoleInput,
) {
    const workspace = await requireWorkspacePermission(
        userId,
        workspaceId,
        "workspace.roles.create",
    );

    const name = input.name.trim();
    const key = createRoleKey(name);
    const permissions = [...new Set(input.permissions)];

    if (name.length < 2 || name.length > 50) {
        throw new WorkspaceRoleCreationError(
            "Role name must be between 2 and 50 characters.",
            400,
        );
    }

    if (!key) {
        throw new WorkspaceRoleCreationError(
            "A valid role key could not be generated.",
            400,
        );
    }

    if (permissions.length === 0) {
        throw new WorkspaceRoleCreationError(
            "At least one permission is required.",
            400,
        );
    }

    const invalidPermissions = permissions.filter(
        (permission) => !ALLOWED_PERMISSIONS.has(permission),
    );

    if (invalidPermissions.length > 0) {
        throw new WorkspaceRoleCreationError(
            `Invalid permissions: ${invalidPermissions.join(", ")}`,
            400,
        );
    }

    const membership = workspace.members[0];

    const actorPermissions = Array.isArray(membership?.role.permissions)
        ? membership.role.permissions.filter(
            (permission): permission is string =>
                typeof permission === "string",
        )
        : [];

    const unauthorizedPermissions = permissions.filter(
        (permission) => !actorPermissions.includes(permission),
    );

    if (unauthorizedPermissions.length > 0) {
        throw new WorkspaceRoleCreationError(
            "You cannot assign permissions that you do not possess.",
            403,
        );
    }

    const existingRole = await prisma.workspaceRole.findUnique({
        where: {
            workspaceId_key: {
                workspaceId,
                key,
            },
        },
        select: {
            id: true,
        },
    });

    if (existingRole) {
        throw new WorkspaceRoleCreationError(
            "A role with this name already exists in the workspace.",
            409,
        );
    }

    return prisma.workspaceRole.create({
        data: {
            workspaceId,
            name,
            key,
            permissions,
        },
        select: {
            id: true,
            name: true,
            key: true,
            permissions: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}
