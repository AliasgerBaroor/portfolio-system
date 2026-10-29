import { prisma } from "../../../lib/prisma";

export interface CreateCmsCollectionInput {
    name: string;
    slug: string;
    description?: string;
    sortOrder?: number;
}

export interface UpdateCmsCollectionInput {
    name?: string;
    slug?: string;
    description?: string | null;
    isEnabled?: boolean;
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

export async function getCmsCollections(
    userId: string,
) {
    const portfolio =
        await getUserPortfolio(userId);

return prisma.cmsCollection.findMany({
    where: {
        portfolioId: portfolio.id,
    },
    orderBy: {
        sortOrder: "asc",
    },
    include: {
        _count: {
            select: {
                items: {
                    where: {
                        deletedAt: null,
                    },
                },
            },
        },
    },
});
}

export async function getCmsCollection(
    userId: string,
    collectionId: string,
) {
    const portfolio =
        await getUserPortfolio(userId);

    return prisma.cmsCollection.findFirst({
        where: {
            id: collectionId,
            portfolioId: portfolio.id,
        },
        include: {
            _count: {
                select: {
                    items: true,
                },
            },
        },
    });
}

export async function createCmsCollection(
    userId: string,
    input: CreateCmsCollectionInput,
) {
    const portfolio =
        await getUserPortfolio(userId);

    const existingCollection =
        await prisma.cmsCollection.findUnique({
            where: {
                portfolioId_slug: {
                    portfolioId: portfolio.id,
                    slug: input.slug,
                },
            },
        });

    if (existingCollection) {
        throw new Error(
            "A collection with this slug already exists.",
        );
    }

    const lastCollection =
        await prisma.cmsCollection.findFirst({
            where: {
                portfolioId: portfolio.id,
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
        (lastCollection
            ? lastCollection.sortOrder + 1
            : 0);

    return prisma.cmsCollection.create({
        data: {
            portfolioId: portfolio.id,
            name: input.name,
            slug: input.slug,
            description: input.description,
            sortOrder,
        },
        include: {
            _count: {
                select: {
                    items: true,
                },
            },
        },
    });
}

export async function updateCmsCollection(
    userId: string,
    collectionId: string,
    input: UpdateCmsCollectionInput,
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
        return null;
    }

    if (input.slug && input.slug !== collection.slug) {
        const existingCollection =
            await prisma.cmsCollection.findUnique({
                where: {
                    portfolioId_slug: {
                        portfolioId: portfolio.id,
                        slug: input.slug,
                    },
                },
            });

        if (existingCollection) {
            throw new Error(
                "A collection with this slug already exists.",
            );
        }
    }

    return prisma.cmsCollection.update({
        where: {
            id: collectionId,
        },
        data: input,
        include: {
            _count: {
                select: {
                    items: true,
                },
            },
        },
    });
}

export async function deleteCmsCollection(
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
        return null;
    }

    if (collection.isSystem) {
        throw new Error(
            "System collection cannot be deleted."
        );
    }

    return prisma.cmsCollection.delete({
        where: {
            id: collectionId,
        },
    });
}