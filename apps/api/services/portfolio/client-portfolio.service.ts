import { prisma } from "../../lib/prisma";

export async function getClientPortfolio(
    slug: string,
    accessKeyId: string
) {
    const portfolio =
        await prisma.portfolio.findFirst({
            where: {
                slug,
                deletedAt: null,
                isPublished: true,
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

    if (!portfolio) {
        throw new Error(
            "Portfolio not found."
        );
    }

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

    return portfolio;
}