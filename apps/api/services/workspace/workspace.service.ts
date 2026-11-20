
import { Prisma } from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { WORKSPACE_PERMISSIONS } from "../../constants/workspace-permissions";
import { CONTENT_PERMISSIONS } from "../../constants/content-permissions";

function createSlug(value: string): string {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function getUniqueWorkspaceSlug(
    tx: Prisma.TransactionClient,
    name: string,
): Promise<string> {
    const baseSlug = createSlug(name) || "workspace";

    let slug = baseSlug;
    let counter = 1;

    while (
        await tx.workspace.findUnique({
            where: { slug },
            select: { id: true },
        })
    ) {
        counter++;
        slug = `${baseSlug}-${counter}`;
    }

    return slug;
}

const allPermissions = [
    ...Object.values(WORKSPACE_PERMISSIONS),
    ...Object.values(CONTENT_PERMISSIONS),
];

const adminPermissions = [
    WORKSPACE_PERMISSIONS.READ,
    WORKSPACE_PERMISSIONS.UPDATE,

    WORKSPACE_PERMISSIONS.MEMBERS_READ,
    WORKSPACE_PERMISSIONS.MEMBERS_INVITE,
    WORKSPACE_PERMISSIONS.MEMBERS_UPDATE,
    WORKSPACE_PERMISSIONS.MEMBERS_REMOVE,

    WORKSPACE_PERMISSIONS.ROLES_READ,
    WORKSPACE_PERMISSIONS.ROLES_CREATE,
    WORKSPACE_PERMISSIONS.ROLES_UPDATE,
    WORKSPACE_PERMISSIONS.ROLES_DELETE,

    WORKSPACE_PERMISSIONS.APPLICATIONS_CREATE,
    WORKSPACE_PERMISSIONS.APPLICATIONS_READ,
    WORKSPACE_PERMISSIONS.APPLICATIONS_UPDATE,
    WORKSPACE_PERMISSIONS.APPLICATIONS_DELETE,

    ...allPermissions.filter((permission) =>
        permission.startsWith("content."),
    ),
];

const memberPermissions = [
    WORKSPACE_PERMISSIONS.READ,
    WORKSPACE_PERMISSIONS.MEMBERS_READ,
    WORKSPACE_PERMISSIONS.ROLES_READ,
    WORKSPACE_PERMISSIONS.APPLICATIONS_READ,

    CONTENT_PERMISSIONS.MODEL_READ,
    CONTENT_PERMISSIONS.FIELD_READ,
    CONTENT_PERMISSIONS.ENTRY_READ,
];

export async function createWorkspace(
    userId: string,
    input: {
        name: string;
        description?: string;
    },
) {
    return prisma.$transaction(async (tx) => {
        const slug = await getUniqueWorkspaceSlug(tx, input.name);

        const workspace = await tx.workspace.create({
            data: {
                name: input.name,
                slug,
                description: input.description ?? null,
                ownerId: userId,
                createdById: userId,
            },
        });

        const roles = [
            {
                name: "Owner",
                key: "owner",
                description: "Full access to the workspace.",
                permissions: allPermissions,
            },
            {
                name: "Admin",
                key: "admin",
                description: "Manages workspace settings, members, roles and applications.",
                permissions: adminPermissions,
            },
            {
                name: "Member",
                key: "member",
                description: "Can view the workspace, applications and content.",
                permissions: memberPermissions,
            },
        ];

        await tx.workspaceRole.createMany({
            data: roles.map((role) => ({
                workspaceId: workspace.id,
                name: role.name,
                key: role.key,
                description: role.description,
                permissions: role.permissions,
                isSystem: true,
            })),
        });

        const ownerRole = await tx.workspaceRole.findUniqueOrThrow({
            where: {
                workspaceId_key: {
                    workspaceId: workspace.id,
                    key: "owner",
                },
            },
        });

        await tx.workspaceMember.create({
            data: {
                workspaceId: workspace.id,
                userId,
                roleId: ownerRole.id,
                status: "ACTIVE",
            },
        });

        const createdRoles = await tx.workspaceRole.findMany({
            where: {
                workspaceId: workspace.id,
            },
        });

        return {
            ...workspace,
            roles: createdRoles,
        };
    });
}