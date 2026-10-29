"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

import { Typography } from "@workspace/ui/components/typography/typography";
import { blocksService } from "@/services/cms/blocks.service";
import { blocksToDocument } from "@/adapters/blocks-to-document";
import { EditorToolbar } from "./EditorToolbar";
import type { CmsSection } from "@/components/dashboard/CMS-layout/sections/types";
import type { CmsBlock } from "@/components/dashboard/CMS-layout/blocks/types";

interface RichTextViewProps {
  itemId: string;
  sections: CmsSection[];
}

interface SectionBlockSnapshot {
  sectionId: string;
  blocks: CmsBlock[];
}

function RichTextView({
  itemId,
  sections,
}: RichTextViewProps) {
  const [originalBlocks, setOriginalBlocks] = useState<
    SectionBlockSnapshot[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: "",
    immediatelyRender: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      setLoading(true);
      setLoadError(null);
      setOriginalBlocks([]);
      
      try {

        const contentSections = sections.filter(
          (section) => !section.isSystem,
        );

        const sectionBlocks = await Promise.all(
          contentSections.map(async (section) => {
            const response = await blocksService.getBlocks(section.id);

            return {
              section,
              blocks: response.blocks,
            };
          }),
        );


        if (cancelled) return;

        const html = sectionBlocks
          .map(({ section, blocks }) => {
            const content = blocksToDocument(blocks);

            return [
              `<h2 data-section-id="${section.id}">${section.title}</h2>`,
              content,
            ].join("");
          })
          .join("");

        setOriginalBlocks(
          sectionBlocks.map(({ section, blocks }) => ({
            sectionId: section.id,
            blocks,
          })),
        );

        editor?.commands.setContent(html);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load all section content:", error);
        setLoadError("Failed to load item content.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (editor) {
      void loadContent();
    }

    return () => {
      cancelled = true;
    };
  }, [itemId, sections, editor]);

  return (
    <div className="flex min-h-[400px] flex-col overflow-hidden rounded-xl border-2 border-[#221E15] bg-white shadow-[0_4px_0_#221E15]">
      <div className="border-b border-[#221E15]/15">
        <EditorToolbar editor={editor} />
      </div>

      <div className="flex-1 p-6">
        <Typography variant="heading-sm">
          Rich Text Editor
        </Typography>

        {loading && (
          <p className="mt-3 text-sm text-gray-500">
            Loading section content...
          </p>
        )}

        {loadError && (
          <p className="mt-3 text-sm text-red-600">
            {loadError}
          </p>
        )}

        {sections.filter((section) => !section.isSystem).length === 0 && (
          <p className="mt-3 text-sm text-gray-500">
            No content sections available for this item.
          </p>
        )}

        <EditorContent
          editor={editor}
          className="mt-4 min-h-[300px] outline-none"
        />
      </div>
    </div>
  );
}

export default RichTextView;