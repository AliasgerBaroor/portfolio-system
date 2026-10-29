import { prisma } from "../../lib/prisma";

type CreateContentBlockData = {
    type:
    | "TEXT"
    | "RICH_TEXT"
    | "BULLET_LIST"
    | "QUOTE"
    | "IMAGE"
    | "VIDEO";
    title?: string | null;
    content: unknown;
};

export async function createPortfolioContentBlock(
    userId: string,
    sectionId: string,
    data: CreateContentBlockData
) {
    const portfolio = await prisma.portfolio.findFirst({
        where: {
            ownerId: userId,
            deletedAt: null,
        },
        select: {
            id: true,
        },
    });

    if (!portfolio) {
        throw new Error("Portfolio not found.");
    }

    const section = await prisma.portfolioSection.findFirst({
        where: {
            id: sectionId,
            portfolioId: portfolio.id,
        },
        select: {
            id: true,
        },
    });

    if (!section) {
        throw new Error("Section not found.");
    }

    const lastBlock =
        await prisma.portfolioContentBlock.findFirst({
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

    const sortOrder = lastBlock
        ? lastBlock.sortOrder + 1
        : 0;

    return prisma.portfolioContentBlock.create({
        data: {
            sectionId: section.id,
            type: data.type,
            title: data.title ?? null,
            content: data.content as object,
            sortOrder,
            isVisible: true,
        },
    });
}

export async function getPortfolioContentBlocks(
    userId: string,
    sectionId: string
) {
    const portfolio = await prisma.portfolio.findFirst({
        where: {
            ownerId: userId,
            deletedAt: null,
        },
        select: {
            id: true,
        },
    });

    if (!portfolio) {
        throw new Error("Portfolio not found.");
    }

    const section = await prisma.portfolioSection.findFirst({
        where: {
            id: sectionId,
            portfolioId: portfolio.id,
        },
        select: {
            id: true,
        },
    });

    if (!section) {
        throw new Error("Section not found.");
    }

    return prisma.portfolioContentBlock.findMany({
        where: {
            sectionId: section.id,
        },
        orderBy: {
            sortOrder: "asc",
        },
    });
}

export async function updatePortfolioContentBlock(
    userId: string,
    sectionId: string,
    blockId: string,
    data: {
        type?:
        | "TEXT"
        | "RICH_TEXT"
        | "BULLET_LIST"
        | "QUOTE"
        | "IMAGE"
        | "VIDEO";
        title?: string | null;
        content?: unknown;
        isVisible?: boolean;
    }
) {
    const portfolio = await prisma.portfolio.findFirst({
        where: {
            ownerId: userId,
            deletedAt: null,
        },
        select: {
            id: true,
        },
    });

    if (!portfolio) {
        throw new Error("Portfolio not found.");
    }

    const section = await prisma.portfolioSection.findFirst({
        where: {
            id: sectionId,
            portfolioId: portfolio.id,
        },
        select: {
            id: true,
        },
    });

    if (!section) {
        throw new Error("Section not found.");
    }

    const block = await prisma.portfolioContentBlock.findFirst({
        where: {
            id: blockId,
            sectionId: section.id,
        },
        select: {
            id: true,
        },
    });

    if (!block) {
        throw new Error("Content block not found.");
    }

    return prisma.portfolioContentBlock.update({
        where: {
            id: block.id,
        },
        data: {
            ...(data.type !== undefined && {
                type: data.type,
            }),

            ...(data.title !== undefined && {
                title: data.title,
            }),

            ...(data.content !== undefined && {
                content: data.content as object,
            }),

            ...(data.isVisible !== undefined && {
                isVisible: data.isVisible,
            }),
        },
    });
}

export async function deletePortfolioContentBlock(
    userId: string,
    sectionId: string,
    blockId: string
) {
    const portfolio = await prisma.portfolio.findFirst({
        where: {
            ownerId: userId,
            deletedAt: null,
        },
        select: {
            id: true,
        },
    });

    if (!portfolio) {
        throw new Error("Portfolio not found.");
    }

    const section = await prisma.portfolioSection.findFirst({
        where: {
            id: sectionId,
            portfolioId: portfolio.id,
        },
        select: {
            id: true,
        },
    });

    if (!section) {
        throw new Error("Section not found.");
    }

    const block = await prisma.portfolioContentBlock.findFirst({
        where: {
            id: blockId,
            sectionId: section.id,
        },
        select: {
            id: true,
        },
    });

    if (!block) {
        throw new Error("Content block not found.");
    }

    await prisma.portfolioContentBlock.delete({
        where: {
            id: block.id,
        },
    });

    return {
        id: block.id,
    };
}

export async function reorderPortfolioContentBlocks(
    userId: string,
    sectionId: string,
    blockIds: string[]
) {
    const portfolio = await prisma.portfolio.findFirst({
        where: {
            ownerId: userId,
            deletedAt: null,
        },
        select: {
            id: true,
        },
    });

    if (!portfolio) {
        throw new Error("Portfolio not found.");
    }

    const section = await prisma.portfolioSection.findFirst({
        where: {
            id: sectionId,
            portfolioId: portfolio.id,
        },
        select: {
            id: true,
        },
    });

    if (!section) {
        throw new Error("Section not found.");
    }

    const blocks = await prisma.portfolioContentBlock.findMany({
        where: {
            sectionId: section.id,
        },
        select: {
            id: true,
        },
    });

    const existingBlockIds = new Set(
        blocks.map((block) => block.id)
    );

    const uniqueBlockIds = new Set(blockIds);

    if (uniqueBlockIds.size !== blockIds.length) {
        throw new Error("Duplicate block IDs are not allowed.");
    }

    const containsOnlySectionBlocks =
        blockIds.every((id) => existingBlockIds.has(id));

    if (!containsOnlySectionBlocks) {
        throw new Error(
            "One or more blocks do not belong to this section."
        );
    }

    if (blockIds.length !== blocks.length) {
        throw new Error(
            "All section blocks must be included when reordering."
        );
    }

    await prisma.$transaction(
        blockIds.map((blockId, index) =>
            prisma.portfolioContentBlock.update({
                where: {
                    id: blockId,
                },
                data: {
                    sortOrder: index,
                },
            })
        )
    );

    return prisma.portfolioContentBlock.findMany({
        where: {
            sectionId: section.id,
        },
        orderBy: {
            sortOrder: "asc",
        },
    });
}

export async function updatePortfolioContentBlockVisibility(
    userId: string,
    sectionId: string,
    blockId: string,
    isVisible: boolean
) {
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

    const section =
        await prisma.portfolioSection.findFirst({
            where: {
                id: sectionId,
                portfolioId: portfolio.id,
            },
        });

    if (!section) {
        throw new Error("Section not found.");
    }

    const block =
        await prisma.portfolioContentBlock.findFirst({
            where: {
                id: blockId,
                sectionId,
            },
        });

    if (!block) {
        throw new Error("Content block not found.");
    }

    return prisma.portfolioContentBlock.update({
        where: {
            id: blockId,
        },
        data: {
            isVisible,
        },
    });
}