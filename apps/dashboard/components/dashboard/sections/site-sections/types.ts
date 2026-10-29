export type SectionType =
    | "HERO"
    | "PROJECTS"
    | "ABOUT"
    | "EXPERIENCE"
    | "CONTACT"
    | "CUSTOM";

export type ContentBlockType =
    | "TEXT"
    | "RICH_TEXT"
    | "BULLET_LIST"
    | "QUOTE"
    | "IMAGE"
    | "VIDEO";

export type ContentBlock = {
    id: string;
    sectionId: string;
    type: ContentBlockType;
    title: string | null;
    content: unknown;
    sortOrder: number;
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
};

export type Section = {
    id: string;
    portfolioId: string;
    type: SectionType;
    title: string;
    slug: string;
    sortOrder: number;
    isVisible: boolean;
    isLandingVisible: boolean;
    blocks: ContentBlock[];
    createdAt: string;
    updatedAt: string;
};

export type GetSectionsResponse = {
    success: boolean;
    sections: Section[];
};

export type CreateSectionRequest = {
    type: SectionType;
    title: string;
    slug: string;
};

export type CreateSectionResponse = {
    success: boolean;
    section: Section;
};

export type GetSectionBlocksResponse = {
    success: boolean;
    blocks: ContentBlock[];
};