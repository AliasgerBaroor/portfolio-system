
import { prisma } from "../../../lib/prisma";

export class ContentEntryRetrievalError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 404,
    ) {
        super(message);
        this.name = "ContentEntryRetrievalError";
    }
}

export async function getContentEntry(
    applicationId: string,
    environmentId: string,
    modelId: string,
    entryId: string,
) {
    const application = await prisma.application.findFirst({
        where: {
            id: applicationId,
            status: "ACTIVE",
            deletedAt: null,
        },
        select: { id: true },
    });

    if (!application) {
        throw new ContentEntryRetrievalError(
            "Application not found or inactive.",
            404,
        );
    }

    const environment = await prisma.applicationEnvironment.findFirst({
        where: {
            id: environmentId,
            applicationId,
            status: "ACTIVE",
            deletedAt: null,
        },
        select: { id: true },
    });

    if (!environment) {
        throw new ContentEntryRetrievalError(
            "Environment not found or inactive.",
            404,
        );
    }

    const model = await prisma.contentModel.findFirst({
        where: {
            id: modelId,
            applicationId,
            deletedAt: null,
        },
        select: { id: true },
    });

    if (!model) {
        throw new ContentEntryRetrievalError(
            "Content model not found.",
            404,
        );
    }

    const entry = await prisma.contentEntry.findFirst({
        where: {
            id: entryId,
            modelId,
            environmentId,
            deletedAt: null,
        },
        select: {
            id: true,
            modelId: true,
            environmentId: true,
            externalId: true,
            slug: true,
            status: true,
            visibility: true,
            accessMethod: true,
            publishedAt: true,
            currentDraftVersionId: true,
            publishedVersionId: true,
            createdAt: true,
            updatedAt: true,

            currentDraftVersion: {
                select: {
                    id: true,
                    version: true,
                    schemaVersion: true,
                    snapshot: true,
                    status: true,
                    changeSummary: true,
                    createdAt: true,
                },
            },

            publishedVersion: {
                select: {
                    id: true,
                    version: true,
                    schemaVersion: true,
                    snapshot: true,
                    status: true,
                    changeSummary: true,
                    createdAt: true,
                },
            },

            versions: {
                orderBy: { version: "desc" },
                select: {
                    id: true,
                    version: true,
                    schemaVersion: true,
                    snapshot: true,
                    status: true,
                    changeSummary: true,
                    createdAt: true,
                },
            },
        },
    });

    if (!entry) {
        throw new ContentEntryRetrievalError(
            "Content entry not found.",
            404,
        );
    }

    return entry;
}
