import { prisma } from "../../../lib/prisma";

export interface CreateCmsSectionInput {
    title: string;
    slug: string;
    type?: string;
    sortOrder?: number;
    isVisible?: boolean;
}

export interface UpdateCmsSectionInput {
    title?: string;
    slug?: string;
    type?: string | null;
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

export async function getCmsSections(
    userId: string,
    itemId: string,
) {
    const portfolio =
        await getUserPortfolio(userId);

    const item =
        await prisma.cmsItem.findFirst({
            where: {
                id: itemId,
                collection: {
                    portfolioId: portfolio.id,
                },
                deletedAt: null,
            },
        });

    if (!item) {
        throw new Error("CMS item not found.");
    }

    return prisma.cmsSection.findMany({
        where: {
            itemId: item.id,
        },
        orderBy: {
            sortOrder: "asc",
        },
    });
}

export async function getCmsSection(
    userId: string,
    itemId: string,
    sectionId: string,
) {
    const portfolio =
        await getUserPortfolio(userId);

    return prisma.cmsSection.findFirst({
        where: {
            id: sectionId,
            itemId,
            item: {
                collection: {
                    portfolioId: portfolio.id,
                },
                deletedAt: null,
            },
        },
    });
}

export async function createCmsSection(
    userId: string,
    itemId: string,
    input: CreateCmsSectionInput,
) {
    const portfolio =
        await getUserPortfolio(userId);

    const item =
        await prisma.cmsItem.findFirst({
            where: {
                id: itemId,
                collection: {
                    portfolioId: portfolio.id,
                },
                deletedAt: null,
            },
        });

    if (!item) {
        throw new Error("CMS item not found.");
    }

    const existingSection =
        await prisma.cmsSection.findUnique({
            where: {
                itemId_slug: {
                    itemId: item.id,
                    slug: input.slug,
                },
            },
        });

    if (existingSection) {
        throw new Error(
            "A section with this slug already exists.",
        );
    }

    const lastSection =
        await prisma.cmsSection.findFirst({
            where: {
                itemId: item.id,
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
        (lastSection
            ? lastSection.sortOrder + 1
            : 0);

    return prisma.cmsSection.create({
        data: {
            itemId: item.id,
            title: input.title,
            slug: input.slug,
            type: input.type,
            sortOrder,
            isVisible:
                input.isVisible ?? true,
        },
    });
}

export async function updateCmsSection(
    userId: string,
    itemId: string,
    sectionId: string,
    input: UpdateCmsSectionInput,
) {
    const portfolio =
        await getUserPortfolio(userId);

    const section =
        await prisma.cmsSection.findFirst({
            where: {
                id: sectionId,
                itemId,
                item: {
                    collection: {
                        portfolioId: portfolio.id,
                    },
                    deletedAt: null,
                },
            },
        });

    if (!section) {
        return null;
    }

    if (
        input.slug &&
        input.slug !== section.slug
    ) {
        const existingSection =
            await prisma.cmsSection.findUnique({
                where: {
                    itemId_slug: {
                        itemId: section.itemId,
                        slug: input.slug,
                    },
                },
            });

        if (existingSection) {
            throw new Error(
                "A section with this slug already exists.",
            );
        }
    }

    return prisma.cmsSection.update({
        where: {
            id: section.id,
        },
        data: input,
    });
}

export async function deleteCmsSection(
    userId: string,
    itemId: string,
    sectionId: string,
) {
    const portfolio =
        await getUserPortfolio(userId);

    const section =
        await prisma.cmsSection.findFirst({
            where: {
                id: sectionId,
                itemId,
                item: {
                    collection: {
                        portfolioId: portfolio.id,
                    },
                    deletedAt: null,
                },
            },
        });

    if (!section) {
        return null;
    }

    if (section.isSystem) {
        throw new Error(
            "The system section cannot be deleted independently."
        );
    }

    return prisma.cmsSection.delete({
        where: {
            id: section.id,
        },
    });
}