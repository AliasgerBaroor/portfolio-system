import { UpdatePortfolioDto } from "../../dto/portfolio/update-portfolio.dto";
import { prisma } from "../../lib/prisma";

export async function getPortfolio(
    userId: string
) {
    const portfolio =
        await prisma.portfolio.findFirst({
            where: {
                ownerId: userId,
                deletedAt: null,
            },
        });

    if (!portfolio) {
        throw new Error(
            "Portfolio not found."
        );
    }

    return portfolio;
}

export async function createPortfolio(
    ownerId: string,
    title: string,
    slug: string
) {
    const existingPortfolio =
        await prisma.portfolio.findFirst({
            where: {
                ownerId,
                deletedAt: null,
            },
        });

    if (existingPortfolio) {
        throw new Error(
            "Portfolio already exists."
        );
    }

    const existingSlug =
        await prisma.portfolio.findUnique({
            where: {
                slug,
            },
        });

    if (existingSlug) {
        throw new Error(
            "Slug already taken."
        );
    }

    return prisma.$transaction(async (tx) => {
        const portfolio =
            await tx.portfolio.create({
                data: {
                    ownerId,
                    title,
                    slug,
                },
            });

        await tx.cmsCollection.create({
            data: {
                portfolioId: portfolio.id,
                name: "Basic info",
                slug: "basic-info",
                description:
                    "Basic portfolio information",
                isSystem: true,
                isEnabled: true,
                sortOrder: 0,
            },
        });

        return portfolio;
    });
}

export async function updatePortfolio(
    userId: string,
    data: UpdatePortfolioDto
) {
    const portfolio =
        await prisma.portfolio.findFirst({
            where: {
                ownerId: userId,
                deletedAt: null,
            },
        });

    if (!portfolio) {
        throw new Error(
            "Portfolio not found."
        );
    }

    return prisma.portfolio.update({
        where: {
            id: portfolio.id,
        },
        data: {
            ...data,
        },
    });
}

export async function deletePortfolio(
    userId: string
) {
    const portfolio =
        await prisma.portfolio.findFirst({
            where: {
                ownerId: userId,
                deletedAt: null,
            },
        });

    if (!portfolio) {
        throw new Error(
            "Portfolio not found."
        );
    }

    return prisma.portfolio.delete({
        where: {
            id: portfolio.id,
        },
    });
}

export async function publishPortfolio(
    userId: string
) {
    const portfolio =
        await prisma.portfolio.findFirst({
            where: {
                ownerId: userId,
                deletedAt: null,
            },
        });

    if (!portfolio) {
        throw new Error(
            "Portfolio not found."
        );
    }

    if (portfolio.isArchived) {
        throw new Error(
            "Archived portfolio cannot be published."
        );
    }

    return prisma.portfolio.update({
        where: {
            id: portfolio.id,
        },
        data: {
            isPublished: true,
        },
    });
}