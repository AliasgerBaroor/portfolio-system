export interface CmsItem {
    id: string;
    collectionId: string;
    title: string;
    slug: string;
    description: string | null;
    data: unknown;
    isPublished: boolean;
    isVisible: boolean;
    sortOrder: number;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface GetItemsResponse {
    success: boolean;
    items: CmsItem[];
}

export interface CreateItemRequest {
    title: string;
    slug: string;
    description?: string;
    data?: unknown;
    isPublished?: boolean;
    isVisible?: boolean;
    sortOrder?: number;
}

export interface CreateItemResponse {
    success: boolean;
    item: CmsItem;
}


export interface UpdateItemRequest {
    title?: string;
    slug?: string;
    description?: string | null;
    data?: unknown;
    isPublished?: boolean;
    isVisible?: boolean;
    sortOrder?: number;
}

export interface UpdateItemResponse {
    success: boolean;
    item: CmsItem;
}

export interface DeleteItemResponse {
    success: boolean;
    item: CmsItem;
}
