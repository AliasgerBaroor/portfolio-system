
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { requireWorkspacePermission } from "../authorization/workspace-permission.service";
import { ALLOWED_PERMISSIONS } from "../../constants/permission-registry";

interface UpdateWorkspaceRoleInput {
    name?: string;
    permissions?: string[];
}

export class WorkspaceRoleUpdateError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 400 | 403 | 404 | 409,
    ) {
        super(message);
        this.name = "WorkspaceRoleUpdateError";
    }
}

const BUILT_IN_ROLE_KEYS = new Set(["owner", "admin", "member"]);

function createRoleKey(name: string): string {
    return name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function updateWorkspaceRole(
    userId: string,
    workspaceId: string,
    roleId: string,
    input: UpdateWorkspaceRoleInput,
) {
    const workspace = await requireWorkspacePermission(
        userId,
        workspaceId,
        "workspace.roles.update",
    );

    if (input.name === undefined && input.permissions === undefined) {
        throw new WorkspaceRoleUpdateError(
            "At least one field (name or permissions) must be provided.",
            400,
        );
    }

    const existingRole = await prisma.workspaceRole.findFirst({
        where: {
            id: roleId,
            workspaceId,
        },
        select: {
            id: true,
            key: true,
        },
    });

    if (!existingRole) {
        throw new WorkspaceRoleUpdateError(
            "Workspace role not found.",
            404,
        );
    }

    if (BUILT_IN_ROLE_KEYS.has(existingRole.key)) {
        throw new WorkspaceRoleUpdateError(
            "Built-in workspace roles cannot be modified.",
            403,
        );
    }

    const membership = workspace.members[0];

    const actorPermissions = Array.isArray(membership?.role.permissions)
        ? membership.role.permissions.filter(
            (permission): permission is string =>
                typeof permission === "string",
        )
        : [];

    const data: {
        name?: string;
        key?: string;
        permissions?: string[];
    } = {};

    if (input.name !== undefined) {
        const name = input.name.trim();

        if (name.length < 2 || name.length > 50) {
            throw new WorkspaceRoleUpdateError(
                "Role name must be between 2 and 50 characters.",
                400,
            );
        }

        const key = createRoleKey(name);

        if (!key) {
            throw new WorkspaceRoleUpdateError(
                "A valid role key could not be generated.",
                400,
            );
        }

        data.name = name;
        data.key = key;
    }

    if (input.permissions !== undefined) {
        const permissions = [...new Set(input.permissions)];

        if (permissions.length === 0) {
            throw new WorkspaceRoleUpdateError(
                "At least one permission is required.",
                400,
            );
        }

        const invalidPermissions = permissions.filter(
            (permission) => !ALLOWED_PERMISSIONS.has(permission),
        );

        if (invalidPermissions.length > 0) {
            throw new WorkspaceRoleUpdateError(
                `Invalid permissions: ${invalidPermissions.join(", ")}`,
                400,
            );
        }

        const unauthorizedPermissions = permissions.filter(
            (permission) => !actorPermissions.includes(permission),
        );

        if (unauthorizedPermissions.length > 0) {
            throw new WorkspaceRoleUpdateError(
                "You cannot assign permissions that you do not possess.",
                403,
            );
        }

        data.permissions = permissions;
    }

    try {
        return await prisma.workspaceRole.update({
            where: {
                id: existingRole.id,
            },
            data,
            select: {
                id: true,
                name: true,
                key: true,
                permissions: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            throw new WorkspaceRoleUpdateError(
                "A role with this name already exists in the workspace.",
                409,
            );
        }

        throw error;
    }
}
