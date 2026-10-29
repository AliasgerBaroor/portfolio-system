import { prisma } from "../../lib/prisma";

export async function getClientPortfolio(
    slug: string,
    accessKeyId: string
) {
    
    // 1. Find the portfolio first.
    // Do NOT load projects/sections yet.
    const portfolio =
        await prisma.portfolio.findFirst({
            where: {
                slug,
                deletedAt: null,
                isPublished: true,
            },
            select: {
                id: true,
            },
        });

    if (!portfolio) {
        throw new Error(
            "Portfolio not found."
        );
    }

    // 2. Verify that this access key
    // is actually authorized for this portfolio.
    const access =
        await prisma.portfolioClientAccess.findUnique({
            where: {
                accessKeyId_portfolioId: {
                    accessKeyId,
                    portfolioId: portfolio.id,
                },
            },
        });

    if (!access) {
        throw new Error(
            "Client is not authorized for this portfolio."
        );
    }

    // 3. Only after authorization succeeds,
    // load the complete portfolio.
    const fullPortfolio =
        await prisma.portfolio.findUnique({
            where: {
                id: portfolio.id,
            },

            include: {
                sections: {
                    where: {
                        isVisible: true,
                    },
                    orderBy: {
                        sortOrder: "asc",
                    },
                },

                projects: {
                    where: {
                        deletedAt: null,
                        isPublished: true,
                        isArchived: false,
                    },

                    orderBy: {
                        sortOrder: "asc",
                    },

                    include: {
                        details: true,

                        galleryImages: {
                            orderBy: {
                                sortOrder: "asc",
                            },
                        },
                    },
                },
            },
        });

    if (!fullPortfolio) {
        throw new Error(
            "Portfolio not found."
        );
    }

    return fullPortfolio;
}