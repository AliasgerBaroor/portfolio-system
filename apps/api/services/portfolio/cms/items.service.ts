import {
    Prisma,
} from "@prisma/client";

import { prisma } from "../../../lib/prisma";

export interface CreateCmsItemInput {
    title: string;
    slug: string;
    description?: string;
    data?: Prisma.InputJsonValue;
    isPublished?: boolean;
    isVisible?: boolean;
    sortOrder?: number;
}

export interface UpdateCmsItemInput {
    title?: string;
    slug?: string;
    description?: string | null;
    data?: Prisma.InputJsonValue;
    isPublished?: boolean;
    isVisible?: boolean;
    sortOrder?: number;
}

async function getUserPortfolio(userId: string) {
    const portfolio =
        await prisma.portfolio.findFirst({
            where: {
                ownerId: userId,
                deletedAt: null,
            },
        });

    if (!portfolio) {
        throw new Error("Portfolio not found.");
    }

    return portfolio;
}

export async function getCmsItems(
    userId: string,
    collectionId: string,
) {
    const portfolio =
        await getUserPortfolio(userId);

    const collection =
        await prisma.cmsCollection.findFirst({
            where: {
                id: collectionId,
                portfolioId: portfolio.id,
            },
        });

    if (!collection) {
        throw new Error("Collection not found.");
    }

    return prisma.cmsItem.findMany({
        where: {
            collectionId: collection.id,
            deletedAt: null,
        },
        orderBy: {
            sortOrder: "asc",
        },
    });
}

export async function getCmsItem(
    userId: string,
    collectionId: string,
    itemId: string,
) {
    const portfolio =
        await getUserPortfolio(userId);

    return prisma.cmsItem.findFirst({
        where: {
            id: itemId,
            collectionId,
            collection: {
                portfolioId: portfolio.id,
            },
            deletedAt: null,
        },
    });
}

export async function createCmsItem(
    userId: string,
    collectionId: string,
    input: CreateCmsItemInput,
) {
    const portfolio = await getUserPortfolio(userId);

    const collection = await prisma.cmsCollection.findFirst({
        where: {
            id: collectionId,
            portfolioId: portfolio.id,
        },
    });

    if (!collection) {
        throw new Error("Collection not found.");
    }

    const existingItem = await prisma.cmsItem.findUnique({
        where: {
            collectionId_slug: {
                collectionId: collection.id,
                slug: input.slug,
            },
        },
    });

    if (existingItem) {
        throw new Error("An item with this slug already exists.");
    }

    const lastItem = await prisma.cmsItem.findFirst({
        where: {
            collectionId: collection.id,
            deletedAt: null,
        },
        orderBy: {
            sortOrder: "desc",
        },
        select: {
            sortOrder: true,
        },
    });

    const sortOrder =
        input.sortOrder ??
        (lastItem ? lastItem.sortOrder + 1 : 0);

    return prisma.$transaction(async (tx) => {
        const item = await tx.cmsItem.create({
            data: {
                collectionId: collection.id,
                title: input.title,
                slug: input.slug,
                description: input.description,
                data: input.data,
                isPublished: input.isPublished ?? false,
                isVisible: input.isVisible ?? true,
                sortOrder,
            },
        });

        await tx.cmsSection.create({
            data: {
                itemId: item.id,
                title: "Item settings",
                slug: "item-settings",
                type: "SYSTEM",
                sortOrder: 0,
                isVisible: true,
                isSystem: true,
            },
        });

        return item;
    });
}

export async function updateCmsItem(
    userId: string,
    collectionId: string,
    itemId: string,
    input: UpdateCmsItemInput,
) {
    const portfolio =
        await getUserPortfolio(userId);

    const item =
        await prisma.cmsItem.findFirst({
            where: {
                id: itemId,
                collectionId,
                collection: {
                    portfolioId: portfolio.id,
                },
                deletedAt: null,
            },
        });

    if (!item) {
        return null;
    }

    if (
        input.slug &&
        input.slug !== item.slug
    ) {
        const existingItem =
            await prisma.cmsItem.findUnique({
                where: {
                    collectionId_slug: {
                        collectionId: item.collectionId,
                        slug: input.slug,
                    },
                },
            });

        if (existingItem) {
            throw new Error(
                "An item with this slug already exists.",
            );
        }
    }

    return prisma.cmsItem.update({
        where: {
            id: item.id,
        },
        data: input,
    });
}

export async function deleteCmsItem(
    userId: string,
    collectionId: string,
    itemId: string,
) {
    const portfolio =
        await getUserPortfolio(userId);

    const item =
        await prisma.cmsItem.findFirst({
            where: {
                id: itemId,
                collectionId,
                collection: {
                    portfolioId: portfolio.id,
                },
                deletedAt: null,
            },
        });

    if (!item) {
        return null;
    }

    return prisma.cmsItem.delete({
        where: {
            id: item.id,
        },
    });
}