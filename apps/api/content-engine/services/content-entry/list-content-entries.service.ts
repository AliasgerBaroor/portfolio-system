import {
    ContentEntryStatus,
} from "@prisma/client";

import { prisma } from "../../../lib/prisma";

import type {
    ListContentEntriesInput,
} from "../../validators/content-entry/list-content-entries.validator";

export class ContentEntryListingError extends Error {
    constructor(
        message: string,
        public readonly statusCode: 404 | 400,
    ) {
        super(message);
        this.name = "ContentEntryListingError";
    }
}

export async function listContentEntries(
    applicationId: string,
    environmentId: string,
    modelId: string,
    input: ListContentEntriesInput,
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
        throw new ContentEntryListingError(
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
        throw new ContentEntryListingError(
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
        throw new ContentEntryListingError(
            "Content model not found.",
            404,
        );
    }

    const where = {
        application: undefined,
        modelId,
        environmentId,
        deletedAt: null,
        ...(input.status ? { status: input.status } : {}),
    };

    const skip = (input.page - 1) * input.limit;

    const [entries, total] = await prisma.$transaction([
        prisma.contentEntry.findMany({
            where: {
                modelId: where.modelId,
                environmentId: where.environmentId,
                deletedAt: where.deletedAt,
                ...(input.status ? { status: input.status } : {}),
            },
            orderBy: {
                updatedAt: "desc",
            },
            skip,
            take: input.limit,
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
            },
        }),

        prisma.contentEntry.count({
            where: {
                modelId,
                environmentId,
                deletedAt: null,
                ...(input.status ? { status: input.status } : {}),
            },
        }),
    ]);

    return {
        entries,
        pagination: {
            page: input.page,
            limit: input.limit,
            total,
            totalPages: Math.ceil(total / input.limit),
            hasNextPage: skip + entries.length < total,
            hasPreviousPage: input.page > 1,
        },
    };
}