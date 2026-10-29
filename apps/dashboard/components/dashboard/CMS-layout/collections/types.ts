export interface CmsCollection {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    isEnabled: boolean;
    sortOrder: number;
    _count: {
        items: number;
    };
}

export interface GetCollectionsResponse {
    success: boolean;
    collections: CmsCollection[];
}

export interface CreateCollectionRequest {
    name: string;
    slug: string;
    description?: string;
    sortOrder?: number;
}

export interface CreateCollectionResponse {
    success: boolean;
    collection: CmsCollection;
}

export interface UpdateCollectionRequest {
    name?: string;
    slug?: string;
    description?: string | null;
    isEnabled?: boolean;
    sortOrder?: number;
}

export interface UpdateCollectionResponse {
    success: boolean;
    collection: CmsCollection;
}

export interface DeleteCollectionResponse {
    success: boolean;
    collection: CmsCollection;
}