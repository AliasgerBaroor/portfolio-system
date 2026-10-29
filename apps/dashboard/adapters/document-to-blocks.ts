// import type { JSONContent } from "@tiptap/core";

/**
 * Represents a rich-text block payload supported by the
 * existing CMS blocks API.
 */
export interface RichTextBlockContent {
  html: string;
}

/**
 * Converts a Tiptap document into the content payload
 * used by an existing RICH_TEXT CMS block.
 *
 * HTML serialization is intentionally supplied by the caller,
 * using the configured Tiptap editor instance.
 */
export function documentToBlocks(
  html: string,
): RichTextBlockContent[] {
  const normalizedHtml = html.trim();

  if (!normalizedHtml) {
    return [];
  }

  return [
    {
      html: normalizedHtml,
    },
  ];
}