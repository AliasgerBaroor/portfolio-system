import { CmsBlockType } from "./constants";

export interface CmsBlock {
    id: string;
    sectionId: string;
    type: CmsBlockType;
    title: string | null;
    content: unknown;
    sortOrder: number;
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GetBlocksResponse {
    success: boolean;
    blocks: CmsBlock[];
}

export interface CreateBlockRequest {
    type: CmsBlockType;
    title?: string;
    content?: unknown;
    sortOrder?: number;
}

export interface CreateBlockResponse {
    success: boolean;
    block: CmsBlock;
}

export interface UpdateBlockRequest {
    type?: CmsBlockType;
    title?: string | null;
    content?: unknown;
    sortOrder?: number;
    isVisible?: boolean;
}

export interface UpdateBlockResponse {
    success: boolean;
    block: CmsBlock;
}

export interface DeleteBlockResponse {
    success: boolean;
    block: CmsBlock;
}

export interface TextBlockContent {
    text: string;
}

export interface RichTextBlockContent {
    html: string;
}

export interface ImageBlockContent {
    url: string;
    alt?: string;
}

export interface VideoBlockContent {
    url: string;
}

export interface BulletListBlockContent {
    items: string[];
}

export interface QuoteBlockContent {
    text: string;
    author?: string;
}