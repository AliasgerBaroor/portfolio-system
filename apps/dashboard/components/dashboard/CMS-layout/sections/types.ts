export interface CmsSection {
    id: string;
    itemId: string;
    title: string;
    slug: string;
    type: string | null;
    sortOrder: number;
    isVisible: boolean;
    isSystem: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GetSectionsResponse {
    success: boolean;
    sections: CmsSection[];
}

export interface GetSectionResponse {
    success: boolean;
    section: CmsSection;
}

export interface CreateSectionInput {
    title: string;
    slug: string;
    type?: string;
    sortOrder?: number;
    isVisible?: boolean;
}

export interface UpdateSectionInput {
    title?: string;
    slug?: string;
    type?: string | null;
    sortOrder?: number;
    isVisible?: boolean;
}

export interface CreateSectionResponse {
    success: boolean;
    section: CmsSection;
}

export interface UpdateSectionResponse {
    success: boolean;
    section: CmsSection;
}

export interface DeleteSectionResponse {
    success: boolean;
    section: CmsSection;
}