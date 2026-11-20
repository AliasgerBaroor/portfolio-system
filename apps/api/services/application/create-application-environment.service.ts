import { prisma } from "../../lib/prisma";
import { requireApplicationPermission } from "../authorization/application-permission.service";

export class ApplicationEnvironmentCreationError extends Error {
    constructor(
        message: string,
        public readonly status: 403 | 404 | 409,
    ) {
        super(message);
        this.name = "ApplicationEnvironmentCreationError";
    }
}

function createSlug(value: string): string {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function getUniqueEnvironmentSlug(
    applicationId: string,
    name: string,
): Promise<string> {
    const baseSlug = createSlug(name);

    if (!baseSlug) {
        throw new ApplicationEnvironmentCreationError(
            "Environment name must produce a valid slug.",
            409,
        );
    }

    let slug = baseSlug;
    let suffix = 2;

    while (
        await prisma.applicationEnvironment.findUnique({
            where: {
                applicationId_slug: {
                    applicationId,
                    slug,
                },
            },
            select: { id: true },
        })
    ) {
        slug = `${baseSlug}-${suffix}`;
        suffix++;
    }

    return slug;
}

interface CreateApplicationEnvironmentParams {
    userId: string;
    workspaceId: string;
    applicationId: string;
    name: string;
    type: "CUSTOM";
    description?: string | null;
}

export async function createApplicationEnvironment(
    params: CreateApplicationEnvironmentParams,
) {
    const {
        userId,
        workspaceId,
        applicationId,
        name,
        type,
        description,
    } = params;

    await requireApplicationPermission(
        userId,
        applicationId,
        "applications.update",
    );

    const application = await prisma.application.findFirst({
        where: {
            id: applicationId,
            workspaceId,
            status: "ACTIVE",
            deletedAt: null,
        },
        select: { id: true },
    });

    if (!application) {
        throw new ApplicationEnvironmentCreationError(
            "Application not found.",
            404,
        );
    }

    if (type !== "CUSTOM") {
        throw new ApplicationEnvironmentCreationError(
            "Only custom environments can be created manually.",
            409,
        );
    }

    const slug = await getUniqueEnvironmentSlug(applicationId, name);

    return prisma.applicationEnvironment.create({
        data: {
            applicationId,
            name,
            slug,
            type: "CUSTOM",
            description: description ?? null,
        },
        select: {
            id: true,
            applicationId: true,
            name: true,
            slug: true,
            type: true,
            description: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}