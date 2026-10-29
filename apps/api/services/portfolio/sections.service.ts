import { prisma } from "../../lib/prisma";

export async function getPortfolioSections(
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
        throw new Error("Portfolio not found.");
    }

    return prisma.portfolioSection.findMany({
        where: {
            portfolioId: portfolio.id,
        },
        include: {
            blocks: {
                where: {
                    isVisible: true,
                },
                orderBy: {
                    sortOrder: "asc",
                },
            },
        },
        orderBy: {
            sortOrder: "asc",
        },
    });
}

export async function createPortfolioSection(
    userId: string,
    data: {
        type: "HERO" | "PROJECTS" | "ABOUT" | "EXPERIENCE" | "CONTACT" | "CUSTOM";
        title: string;
        slug: string;
    }
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

    const existingSection =
        await prisma.portfolioSection.findUnique({
            where: {
                portfolioId_slug: {
                    portfolioId: portfolio.id,
                    slug: data.slug,
                },
            },
        });

    if (existingSection) {
        throw new Error(
            "A section with this slug already exists."
        );
    }

    const lastSection =
        await prisma.portfolioSection.findFirst({
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
        lastSection
            ? lastSection.sortOrder + 1
            : 0;

    return prisma.portfolioSection.create({
        data: {
            portfolioId: portfolio.id,
            type: data.type,
            title: data.title,
            slug: data.slug,
            sortOrder,
            isVisible: true,
            isLandingVisible: false,
        },

        include: {
            blocks: true,
        },
    });
}