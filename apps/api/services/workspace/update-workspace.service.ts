
import {
    MembershipStatus,
    WorkspaceStatus,
} from "@prisma/client";

import { prisma } from "../../lib/prisma";
import { WORKSPACE_PERMISSIONS } from "../../constants/workspace-permissions";
import { requireWorkspacePermission } from "../authorization/workspace-permission.service";

interface UpdateWorkspaceInput {
    name?: string;
    description?: string | null;
}

function generateSlug(value: string): string {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function getUniqueWorkspaceSlug(
    name: string,
    workspaceId: string,
): Promise<string> {
    const baseSlug = generateSlug(name);

    if (!baseSlug) {
        throw new Error("Workspace name cannot generate a valid slug.");
    }

    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existingWorkspace = await prisma.workspace.findFirst({
            where: {
                slug,
                id: { not: workspaceId },
                deletedAt: null,
            },
            select: { id: true },
        });

        if (!existingWorkspace) {
            return slug;
        }

        counter++;
        slug = `${baseSlug}-${counter}`;
    }
}

export async function updateWorkspace(
    userId: string,
    workspaceId: string,
    input: UpdateWorkspaceInput,
) {
    await requireWorkspacePermission(
        userId,
        workspaceId,
        WORKSPACE_PERMISSIONS.UPDATE,
    );

    const existingWorkspace = await prisma.workspace.findFirst({
        where: {
            id: workspaceId,
            status: WorkspaceStatus.ACTIVE,
            deletedAt: null,
            members: {
                some: {
                    userId,
                    status: MembershipStatus.ACTIVE,
                },
            },
        },
        select: {
            id: true,
            name: true,
        },
    });

    if (!existingWorkspace) {
        return null;
    }

    const data: {
        name?: string;
        slug?: string;
        description?: string | null;
    } = {};

    if (input.name !== undefined) {
        data.name = input.name;

        if (input.name !== existingWorkspace.name) {
            data.slug = await getUniqueWorkspaceSlug(
                input.name,
                workspaceId,
            );
        }
    }

    if (input.description !== undefined) {
        data.description = input.description;
    }

    return prisma.workspace.update({
        where: { id: workspaceId },
        data,
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
            _count: {
                select: {
                    members: true,
                    applications: true,
                },
            },
        },
    });
}