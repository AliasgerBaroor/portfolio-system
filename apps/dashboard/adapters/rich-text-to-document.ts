import { generateJSON } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

const richTextExtensions = [
  StarterKit,
  Underline,
  Link.configure({
    openOnClick: false,
  }),
];

/**
 * Converts saved rich-text HTML into a Tiptap document.
 *
 * This function does not modify or persist CMS data.
 */
export function richTextToDocument(html: string) {
  return generateJSON(html, richTextExtensions);
}