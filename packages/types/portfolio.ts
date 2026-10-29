export type Portfolio = {
    id: string;

    ownerId: string;

    title: string;

    slug: string;

    visibility:
    | "PUBLIC"
    | "PRIVATE"
    | "PASSWORD"
    | "UNLISTED";

    isPublished: boolean;

    isArchived: boolean;

    createdAt: string;

    updatedAt: string;

    deletedAt: string | null;

    theme: string | null;

    customDomain: string | null;

    favicon: string | null;

    seoTitle: string | null;

    seoDescription: string | null;
};

export type GetPortfolioResponse = {
    success: boolean;

    portfolio: Portfolio;
};

export type CreatePortfolioRequest = {
    title: string;

    slug: string;
};

export type CreatePortfolioResponse = {
    success: boolean;

    portfolio: Portfolio;
};

export type UpdatePortfolioRequest = {
    title?: string;
    visibility?:
    | "PUBLIC"
    | "PRIVATE"
    | "PASSWORD"
    | "UNLISTED";
};

export type UpdatePortfolioResponse = {
    success: boolean;
    portfolio: Portfolio;
};