import type { CmsBlock } from "@/components/dashboard/CMS-layout/blocks/types";
import { CMS_BLOCK_TYPES } from "@/components/dashboard/CMS-layout/blocks/constants";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getContent(block: CmsBlock): Record<string, unknown> {
  const content = block.content;

  if (
    !content ||
    typeof content !== "object" ||
    Array.isArray(content)
  ) {
    return {};
  }

  return content as Record<string, unknown>;
}

function renderBlock(block: CmsBlock): string {
  const data = getContent(block);

  switch (block.type) {
    case CMS_BLOCK_TYPES.TEXT: {
      const text = typeof data.text === "string" ? data.text : "";
      return text ? `<p>${escapeHtml(text)}</p>` : "";
    }

    case CMS_BLOCK_TYPES.RICH_TEXT: {
    // Preserve existing rich-text markup for Tiptap to parse.
    return typeof data.html === "string" ? data.html : "";
}

    case CMS_BLOCK_TYPES.IMAGE: {
    const url = typeof data.url === "string" ? data.url : "";
    const alt = typeof data.alt === "string" ? data.alt : "";

    if (!url) return "";

    return `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" />`;
}

    case CMS_BLOCK_TYPES.VIDEO: {
    const url = typeof data.url === "string" ? data.url : "";

    if (!url) return "";

    return `<p><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>`;
}

    case CMS_BLOCK_TYPES.BULLET_LIST: {
    const items = Array.isArray(data.items)
        ? data.items.filter(
            (item): item is string =>
                typeof item === "string" && item.trim().length > 0,
        )
        : [];

    if (items.length === 0) return "";

    return `<ul>${items
        .map((item) => `<li><p>${escapeHtml(item)}</p></li>`)
        .join("")}</ul>`;
}

    case CMS_BLOCK_TYPES.QUOTE: {
    const text = typeof data.text === "string" ? data.text : "";
    const author = typeof data.author === "string" ? data.author : "";

    if (!text) return "";

    const authorHtml = author
        ? `<p>— ${escapeHtml(author)}</p>`
        : "";

    return `<blockquote><p>${escapeHtml(text)}</p>${authorHtml}</blockquote>`;
}

    default:
return "";
  }
}

/**
 * Creates an HTML representation of blocks in their current order.
 *
 * This is a display conversion, not a lossless round-trip format.
 * Do not use it to replace persisted blocks yet.
 */
export function blocksToDocument(blocks: CmsBlock[]): string {
  return blocks
    .map(renderBlock)
    .filter(Boolean)
    .join("\n");
}