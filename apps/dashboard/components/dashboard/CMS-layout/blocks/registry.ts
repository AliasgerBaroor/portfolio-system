import {
    CMS_BLOCK_TYPES,
    type CmsBlockType,
} from "./constants";

export interface CmsBlockDefinition {
    type: CmsBlockType;
    label: string;
    description: string;
}

export const CMS_BLOCK_REGISTRY: Record<
    CmsBlockType,
    CmsBlockDefinition
> = {
    [CMS_BLOCK_TYPES.TEXT]: {
        type: CMS_BLOCK_TYPES.TEXT,
        label: "Text",
        description: "Simple text content.",
    },

    [CMS_BLOCK_TYPES.RICH_TEXT]: {
        type: CMS_BLOCK_TYPES.RICH_TEXT,
        label: "Rich Text",
        description: "Formatted text content.",
    },

    [CMS_BLOCK_TYPES.IMAGE]: {
        type: CMS_BLOCK_TYPES.IMAGE,
        label: "Image",
        description: "Image content.",
    },

    [CMS_BLOCK_TYPES.VIDEO]: {
        type: CMS_BLOCK_TYPES.VIDEO,
        label: "Video",
        description: "Video content.",
    },

    [CMS_BLOCK_TYPES.BULLET_LIST]: {
        type: CMS_BLOCK_TYPES.BULLET_LIST,
        label: "Bullet List",
        description: "A list of items.",
    },

    [CMS_BLOCK_TYPES.QUOTE]: {
        type: CMS_BLOCK_TYPES.QUOTE,
        label: "Quote",
        description: "A quoted piece of content.",
    },
};