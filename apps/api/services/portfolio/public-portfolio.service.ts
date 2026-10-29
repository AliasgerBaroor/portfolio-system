import { prisma } from "../../lib/prisma";

export async function getPublicPortfolio(
    slug: string
) {
    const portfolio =
        await prisma.portfolio.findFirst({
            where: {
                slug,
                deletedAt: null,
                isPublished: true,
            },
        });

    if (!portfolio) {
        throw new Error(
            "Portfolio not found."
        );
    }

    const sections =
        await prisma.portfolioSection.findMany({
            where: {
                portfolioId: portfolio.id,
                isVisible: true,

                ...(portfolio.visibility === "PASSWORD"
                    ? {
                        isLandingVisible: true,
                    }
                    : {}),
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

    const categories =
        await prisma.portfolioCategory.findMany({
            where: {
                portfolioId: portfolio.id,
            },

            orderBy: {
                sortOrder: "asc",
            },

            include: {
                clients: {
                    include: {
                        client: {
                            select: {
                                id: true,
                                name: true,
                                company: true,
                            },
                        },
                    },
                },
            },
        });

    /*
     * PASSWORD PORTFOLIO
     *
     * Return the latest active access key so
     * /[slug] knows which key to use for login.
     */
    if (
        portfolio.visibility === "PASSWORD"
    ) {
        const defaultAccess =
            await prisma.portfolioClientAccess.findFirst({
                where: {
                    portfolioId: portfolio.id,

                    accessKey: {
                        isActive: true,

                        deletedAt: null,

                        expiresAt: {
                            gt: new Date(),
                        },
                    },
                },

                orderBy: {
                    accessKey: {
                        createdAt: "desc",
                    },
                },
            });

        return {
            ...portfolio,

            defaultAccessKeyId:
                defaultAccess?.accessKeyId ?? null,

            sections,

            categories,

            projects: [],
        };
    }

    /*
     * PUBLIC PORTFOLIO
     */
    const projects =
        await prisma.project.findMany({
            where: {
                portfolioId: portfolio.id,

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

                portfolioCategories: {
                    include: {
                        category: true,
                    },
                },
            },
        });

    return {
        ...portfolio,

        sections,

        categories,

        projects,
    };
}