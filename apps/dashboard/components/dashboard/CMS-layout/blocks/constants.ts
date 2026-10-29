export const CMS_BLOCK_TYPES = {
    TEXT: "TEXT",
    RICH_TEXT: "RICH_TEXT",
    IMAGE: "IMAGE",
    VIDEO: "VIDEO",
    BULLET_LIST: "BULLET_LIST",
    QUOTE: "QUOTE",
} as const;

export type CmsBlockType =
    (typeof CMS_BLOCK_TYPES)[keyof typeof CMS_BLOCK_TYPES];