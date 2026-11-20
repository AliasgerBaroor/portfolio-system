
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { requireWorkspacePermission } from "../authorization/workspace-permission.service";
import type { CreateApplicationInput } from "../../validators/application/create-application.validator";

function createSlug(value: string): string {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function getUniqueApplicationSlug(
    tx: Prisma.TransactionClient,
    workspaceId: string,
    name: string,
): Promise<string> {
    const baseSlug = createSlug(name) || "application";
    let slug = baseSlug;
    let counter = 1;

    while (
        await tx.application.findUnique({
            where: {
                workspaceId_slug: {
                    workspaceId,
                    slug,
                },
            },
            select: { id: true },
        })
    ) {
        counter++;
        slug = `${baseSlug}-${counter}`;
    }

    return slug;
}

export async function createApplication(
    userId: string,
    workspaceId: string,
    input: CreateApplicationInput,
) {
    await requireWorkspacePermission(
        userId,
        workspaceId,
        "applications.create",
    );

    return prisma.$transaction(async (tx) => {
        const slug = await getUniqueApplicationSlug(
            tx,
            workspaceId,
            input.name,
        );

        const application = await tx.application.create({
            data: {
                workspaceId,
                name: input.name,
                slug,
                description: input.description ?? null,
                type: input.type,
                integrationMode: input.integrationMode,
                createdById: userId,

                environments: {
                    create: [
                        {
                            name: "Development",
                            slug: "development",
                            type: "DEVELOPMENT",
                        },
                        {
                            name: "Staging",
                            slug: "staging",
                            type: "STAGING",
                        },
                        {
                            name: "Production",
                            slug: "production",
                            type: "PRODUCTION",
                        },
                    ],
                },
            },
            include: {
                environments: true,
            },
        });

        return application;
    });
}
