export type ClientAccessLoginRequest = {
    password: string;
    fingerprint: string;
};

export type ClientAccessLoginResponse = {
    success: boolean;
    sessionToken: string;
    expiresAt: string;
};

export type ClientPortfolioResponse = {
    success: boolean;
    portfolio: ClientPortfolio;
};

export type ClientPortfolio = {
    id: string;
    ownerId: string;
    title: string;
    slug: string;
    visibility: string;
    isPublished: boolean;
    isArchived: boolean;
    createdAt: string;
    deletedAt: string | null;
    updatedAt: string;

    theme: string | null;
    customDomain: string | null;
    favicon: string | null;
    seoTitle: string | null;
    seoDescription: string | null;

    sections: ClientPortfolioSection[];

    projects: ClientPortfolioProject[];
};

export type ClientPortfolioSection = {
    id: string;
    portfolioId: string;
    type: string;
    title: string;
    slug: string;
    sortOrder: number;
    isVisible: boolean;
    settings: unknown;
    createdAt: string;
    updatedAt: string;
};

export type ClientPortfolioProject = {
    id: string;
    portfolioId: string;
    title: string;
    slug: string;
    summary: string | null;
    content: string | null;
    coverImage: string | null;

    visibility: string;

    sortOrder: number;

    createdAt: string;
    updatedAt: string;

    deletedAt: string | null;

    isPublished: boolean;
    isArchived: boolean;

    details: unknown | null;

    galleryImages: unknown[];
};