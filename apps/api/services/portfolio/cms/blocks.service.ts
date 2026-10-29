import {
    Prisma,
} from "@prisma/client";

import { prisma } from "../../../lib/prisma";

export interface CreateCmsBlockInput {
    type: string;
    title?: string;
    content?: Prisma.InputJsonValue;
    sortOrder?: number;
}

export interface UpdateCmsBlockInput {
    type?: string;
    title?: string | null;
    content?: Prisma.InputJsonValue;
    sortOrder?: number;
    isVisible?: boolean;
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

export async function getCmsBlocks(
    userId: string,
    sectionId: string,
) {
    const portfolio =
        await getUserPortfolio(userId);

    const section =
        await prisma.cmsSection.findFirst({
            where: {
                id: sectionId,
                item: {
                    collection: {
                        portfolioId: portfolio.id,
                    },
                    deletedAt: null,
                },
            },
        });

    if (!section) {
        throw new Error("CMS section not found.");
    }

    return prisma.cmsBlock.findMany({
        where: {
            sectionId: section.id,
        },
        orderBy: {
            sortOrder: "asc",
        },
    });
}

export async function createCmsBlock(
    userId: string,
    sectionId: string,
    input: CreateCmsBlockInput,
) {
    const portfolio =
        await getUserPortfolio(userId);

    const section =
        await prisma.cmsSection.findFirst({
            where: {
                id: sectionId,
                item: {
                    collection: {
                        portfolioId: portfolio.id,
                    },
                    deletedAt: null,
                },
            },
        });

    if (!section) {
        throw new Error("CMS section not found.");
    }

    const lastBlock =
        await prisma.cmsBlock.findFirst({
            where: {
                sectionId: section.id,
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
        (lastBlock
            ? lastBlock.sortOrder + 1
            : 0);

    return prisma.cmsBlock.create({
        data: {
            sectionId: section.id,
            type: input.type,
            title: input.title,
            content: input.content,
            sortOrder,
        },
    });
}

export async function updateCmsBlock(
    userId: string,
    sectionId: string,
    blockId: string,
    input: UpdateCmsBlockInput,
) {
    const portfolio =
        await getUserPortfolio(userId);

    const section =
        await prisma.cmsSection.findFirst({
            where: {
                id: sectionId,
                item: {
                    collection: {
                        portfolioId: portfolio.id,
                    },
                    deletedAt: null,
                },
            },
        });

    if (!section) {
        throw new Error("CMS section not found.");
    }

    const block =
        await prisma.cmsBlock.findFirst({
            where: {
                id: blockId,
                sectionId: section.id,
            },
        });

    if (!block) {
        return null;
    }

    return prisma.cmsBlock.update({
        where: {
            id: block.id,
        },
        data: {
            type: input.type,
            title: input.title,
            content: input.content,
            sortOrder: input.sortOrder,
            isVisible: input.isVisible,
        },
    });
}

export async function deleteCmsBlock(
    userId: string,
    sectionId: string,
    blockId: string,
) {
    const portfolio =
        await getUserPortfolio(userId);

    const section =
        await prisma.cmsSection.findFirst({
            where: {
                id: sectionId,
                item: {
                    collection: {
                        portfolioId: portfolio.id,
                    },
                    deletedAt: null,
                },
            },
        });

    if (!section) {
        throw new Error("CMS section not found.");
    }

    const block =
        await prisma.cmsBlock.findFirst({
            where: {
                id: blockId,
                sectionId: section.id,
            },
        });

    if (!block) {
        return null;
    }

    return prisma.cmsBlock.delete({
        where: {
            id: block.id,
        },
    });
}