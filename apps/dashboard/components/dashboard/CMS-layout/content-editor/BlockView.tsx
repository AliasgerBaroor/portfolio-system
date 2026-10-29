"use client";

import { useEffect, useState } from "react";

import { Typography } from "@workspace/ui/components/typography/typography";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@/components/ui/Input";
import { PlusIcon, TrashIcon } from "@/icons";
import { EyeClosedIcon } from "@/icons/eye-closed";
import { EyeIcon } from "@/icons/eye";
import { ArrowIcon } from "@/icons/arrow";

import { blocksService } from "../../../../services/cms/blocks.service";
import type { CmsBlock } from "../blocks/types";
import {
  CMS_BLOCK_TYPES,
  type CmsBlockType,
} from "../blocks/constants";
import { CMS_BLOCK_REGISTRY } from "../blocks/registry";
import { CmsSection } from "../sections/types";
import { SectionList } from "../sections/section-list";
import { generateSlug } from "@workspace/ui/lib/generate-slug";

type BlockDraft = {
  title: string;
  text: string;
  html: string;
  url: string;
  alt: string;
  items: string[];
  author: string;
};

interface BlockViewProps {
  itemId: string;
  activeSectionId: string | null;
  isSystemSection: boolean;
  sections: CmsSection[];
  sectionsLoading: boolean;
  onSectionChange: (sectionId: string | null) => void;
  onEditSection: (sectionId: string) => void;

  showSectionForm: boolean;
  setShowSectionForm: (show: boolean) => void;
  creatingSection: boolean;
  newSectionTitle: string;
  setNewSectionTitle: (value: string) => void;
  newSectionSlug: string;
  setNewSectionSlug: (value: string) => void;
  newSectionType: string;
  setNewSectionType: (value: string) => void;
  isSectionSlugManuallyEdited: boolean;
  setIsSectionSlugManuallyEdited: (value: boolean) => void;
  handleCreateSection: () => Promise<void>;
}

function getDefaultBlockContent(type: CmsBlockType) {
  switch (type) {
    case CMS_BLOCK_TYPES.TEXT:
      return { text: "" };
    case CMS_BLOCK_TYPES.RICH_TEXT:
      return { html: "" };
    case CMS_BLOCK_TYPES.IMAGE:
      return { url: "", alt: "" };
    case CMS_BLOCK_TYPES.VIDEO:
      return { url: "" };
    case CMS_BLOCK_TYPES.BULLET_LIST:
      return { items: [""] };
    case CMS_BLOCK_TYPES.QUOTE:
      return { text: "", author: "" };
  }
}

function getBlockDraft(block: CmsBlock): BlockDraft {
  const content = block.content;
  const data =
    content &&
    typeof content === "object" &&
    !Array.isArray(content)
      ? (content as Record<string, unknown>)
      : {};

  return {
    title: block.title ?? "",
    text: typeof data.text === "string" ? data.text : "",
    html: typeof data.html === "string" ? data.html : "",
    url: typeof data.url === "string" ? data.url : "",
    alt: typeof data.alt === "string" ? data.alt : "",
    items: Array.isArray(data.items)
      ? data.items.filter(
          (value): value is string => typeof value === "string",
        )
      : [""],
    author: typeof data.author === "string" ? data.author : "",
  };
}

function getBlockContent(type: string, draft: BlockDraft) {
  switch (type) {
    case CMS_BLOCK_TYPES.TEXT:
      return { text: draft.text };
    case CMS_BLOCK_TYPES.RICH_TEXT:
      return { html: draft.html };
    case CMS_BLOCK_TYPES.IMAGE:
      return { url: draft.url, alt: draft.alt };
    case CMS_BLOCK_TYPES.VIDEO:
      return { url: draft.url };
    case CMS_BLOCK_TYPES.BULLET_LIST:
      return { items: draft.items.filter((item) => item.trim()) };
    case CMS_BLOCK_TYPES.QUOTE:
      return { text: draft.text, author: draft.author };
    default:
      return {};
  }
}

export function BlockView({
  itemId,
  activeSectionId,
  isSystemSection,
  sections,
  sectionsLoading,
  onSectionChange,
  onEditSection,
  showSectionForm,
  setShowSectionForm,
  creatingSection,
  newSectionTitle,
  setNewSectionTitle,
  newSectionSlug,
  setNewSectionSlug,
  newSectionType,
  setNewSectionType,
  isSectionSlugManuallyEdited,
  setIsSectionSlugManuallyEdited,
  handleCreateSection,
}: BlockViewProps) {
  const [blocks, setBlocks] = useState<CmsBlock[]>([]);
  const [blocksLoading, setBlocksLoading] = useState(false);
  const [blockPickerOpen, setBlockPickerOpen] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [blockDraft, setBlockDraft] = useState<BlockDraft>({
    title: "",
    text: "",
    html: "",
    url: "",
    alt: "",
    items: [""],
    author: "",
  });
  const [blockSaving, setBlockSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadBlocks() {
      if (!activeSectionId) {
        setBlocks([]);
        setEditingBlockId(null);
        return;
      }

      setBlocksLoading(true);
      setBlocks([]);
      setEditingBlockId(null);

      try {
        const response = await blocksService.getBlocks(activeSectionId);
        if (!cancelled) setBlocks(response.blocks);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load blocks:", error);
        setBlocks([]);
      } finally {
        if (!cancelled) setBlocksLoading(false);
      }
    }

    void loadBlocks();

    return () => {
      cancelled = true;
    };
  }, [activeSectionId]);

  function updateDraft<K extends keyof BlockDraft>(
    key: K,
    value: BlockDraft[K],
  ) {
    setBlockDraft((current) => ({ ...current, [key]: value }));
  }

  async function handleCreateBlock(type: CmsBlockType) {
    if (!activeSectionId || blockSaving) return;

    try {
      setBlockSaving(true);
      const definition = CMS_BLOCK_REGISTRY[type];

      const response = await blocksService.createBlock(activeSectionId, {
        type,
        title: definition.label,
        content: getDefaultBlockContent(type),
      });

      setBlocks((current) => [...current, response.block]);
      setEditingBlockId(response.block.id);
      setBlockDraft(getBlockDraft(response.block));
      setBlockPickerOpen(false);
    } catch (error) {
      console.error("Failed to create block:", error);
    } finally {
      setBlockSaving(false);
    }
  }

  async function handleSaveBlock(blockId: string) {
    if (!activeSectionId || blockSaving) return;

    const block = blocks.find((entry) => entry.id === blockId);
    if (!block) return;

    try {
      setBlockSaving(true);
      const response = await blocksService.updateBlock(
        activeSectionId,
        blockId,
        {
          title: blockDraft.title,
          content: getBlockContent(block.type, blockDraft),
        },
      );

      setBlocks((current) =>
        current.map((entry) =>
          entry.id === blockId ? response.block : entry,
        ),
      );
      setEditingBlockId(null);
    } catch (error) {
      console.error("Failed to save block:", error);
    } finally {
      setBlockSaving(false);
    }
  }

  async function handleDeleteBlock(blockId: string) {
    if (!activeSectionId || blockSaving) return;
    if (!window.confirm("Delete this block?")) return;

    try {
      setBlockSaving(true);
      await blocksService.deleteBlock(activeSectionId, blockId);
      setBlocks((current) =>
        current.filter((block) => block.id !== blockId),
      );
      if (editingBlockId === blockId) setEditingBlockId(null);
    } catch (error) {
      console.error("Failed to delete block:", error);
    } finally {
      setBlockSaving(false);
    }
  }

  async function handleToggleBlockVisibility(block: CmsBlock) {
    if (!activeSectionId || blockSaving) return;

    try {
      setBlockSaving(true);
      const response = await blocksService.updateBlock(
        activeSectionId,
        block.id,
        { isVisible: !block.isVisible },
      );

      setBlocks((current) =>
        current.map((entry) =>
          entry.id === block.id ? response.block : entry,
        ),
      );
    } catch (error) {
      console.error("Failed to toggle block visibility:", error);
    } finally {
      setBlockSaving(false);
    }
  }

  async function handleMoveBlock(
    blockId: string,
    direction: "up" | "down",
  ) {
    if (!activeSectionId || blockSaving) return;

    const index = blocks.findIndex((block) => block.id === blockId);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= blocks.length) return;

    const reordered = [...blocks];
    const [moved] = reordered.splice(index, 1);
    if (!moved) return;
    reordered.splice(target, 0, moved);

    const previous = blocks;
    setBlocks(reordered);

    try {
      setBlockSaving(true);
      await Promise.all(
        reordered.map((block, sortOrder) =>
          blocksService.updateBlock(activeSectionId, block.id, {
            sortOrder,
          }),
        ),
      );
    } catch (error) {
      console.error("Failed to reorder blocks:", error);

      try {
        const response = await blocksService.getBlocks(activeSectionId);
        setBlocks(response.blocks);
      } catch {
        setBlocks(previous);
      }
    } finally {
      setBlockSaving(false);
    }
  }

  function renderBlockEditor(block: CmsBlock) {
    switch (block.type) {
      case CMS_BLOCK_TYPES.TEXT:
        return (
          <textarea
            value={blockDraft.text}
            onChange={(event) => updateDraft("text", event.target.value)}
            placeholder="Text content"
            rows={5}
            className="w-full rounded border border-border p-2 text-sm"
          />
        );

      case CMS_BLOCK_TYPES.RICH_TEXT:
        return (
          <textarea
            value={blockDraft.html}
            onChange={(event) => updateDraft("html", event.target.value)}
            placeholder="Rich text HTML"
            rows={8}
            className="w-full rounded border border-border p-2 text-sm"
          />
        );

      case CMS_BLOCK_TYPES.IMAGE:
        return (
          <div className="space-y-3">
            <Input
              label="Image URL"
              value={blockDraft.url}
              onChange={(event) => updateDraft("url", event.target.value)}
            />
            <Input
              label="Alt text"
              value={blockDraft.alt}
              onChange={(event) => updateDraft("alt", event.target.value)}
            />
          </div>
        );

      case CMS_BLOCK_TYPES.VIDEO:
        return (
          <Input
            label="Video URL"
            value={blockDraft.url}
            onChange={(event) => updateDraft("url", event.target.value)}
          />
        );

      case CMS_BLOCK_TYPES.BULLET_LIST:
        return (
          <div className="space-y-2">
            {blockDraft.items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={item}
                  onChange={(event) => {
                    const next = [...blockDraft.items];
                    next[index] = event.target.value;
                    updateDraft("items", next);
                  }}
                  placeholder={`Item ${index + 1}`}
                  className="min-w-0 flex-1 rounded border border-border p-2 text-sm"
                />
                <Button
                  variant="secondary"
                  size="compact"
                  disabled={blockDraft.items.length === 1 || blockSaving}
                  onClick={() =>
                    updateDraft(
                      "items",
                      blockDraft.items.filter((_, i) => i !== index),
                    )
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              size="compact"
              disabled={blockSaving}
              onClick={() =>
                updateDraft("items", [...blockDraft.items, ""])
              }
            >
              + Add item
            </Button>
          </div>
        );

      case CMS_BLOCK_TYPES.QUOTE:
        return (
          <div className="space-y-3">
            <textarea
              value={blockDraft.text}
              onChange={(event) => updateDraft("text", event.target.value)}
              placeholder="Quote"
              rows={4}
              className="w-full rounded border border-border p-2 text-sm"
            />
            <Input
              label="Author"
              value={blockDraft.author}
              onChange={(event) => updateDraft("author", event.target.value)}
            />
          </div>
        );

      default:
        return (
          <Typography variant="body-sm">
            Unsupported block type.
          </Typography>
        );
    }
  }
  

  if (!itemId) return null;
  return (
    <section className="space-y-5">
      {/* Sections */}
      <div className="space-y-3">
        {sectionsLoading && (
          <Typography variant="body-sm">
            Loading sections...
          </Typography>
        )}

        {!sectionsLoading &&
          itemId &&
          !sections.some((section) => !section.isSystem) && (
            <Typography
              variant="body-sm"
              className="text-muted-foreground"
            >
              No sections yet. Use + to create your first section.
            </Typography>
          )}

        {!sectionsLoading && itemId && (
          <SectionList
            sections={sections}
            activeSectionId={activeSectionId}
            onSectionChange={onSectionChange}
            onEditSection={onEditSection}
          />
        )}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <Typography variant="heading-sm">Blocks</Typography>
        <Button
          variant="secondary"
          size="compact"
          disabled={blockSaving}
          onClick={() => setBlockPickerOpen((value) => !value)}
        >
          <PlusIcon />
          Block
        </Button>
      </div>

      {itemId && showSectionForm && (
        <div className="space-y-3 rounded border border-border p-3">
          <Input
            label="Section name"
            required
            value={newSectionTitle}
            onChange={(event) => {
              const title = event.target.value;

              setNewSectionTitle(title);

              if (!isSectionSlugManuallyEdited) {
                setNewSectionSlug(generateSlug(title));
              }
            }}
            placeholder="e.g. Identity"
          />

          <Input
            label="Section slug"
            required
            value={newSectionSlug}
            onChange={(event) => {
              setNewSectionSlug(event.target.value);
              setIsSectionSlugManuallyEdited(true);
            }}
            placeholder="e.g. identity"
          />

          <Input
            label="Section type"
            value={newSectionType}
            onChange={(event) => setNewSectionType(event.target.value)}
            placeholder="Optional"
          />

          <div className="flex gap-2">
            <Button
              size="compact"
              disabled={
                creatingSection ||
                !newSectionTitle.trim() ||
                !newSectionSlug.trim()
              }
              onClick={handleCreateSection}
            >
              {creatingSection ? "Creating..." : "Create"}
            </Button>

            <Button
              variant="secondary"
              size="compact"
              disabled={creatingSection}
              onClick={() => {
                setShowSectionForm(false);
                setNewSectionTitle("");
                setNewSectionSlug("");
                setNewSectionType("");
                setIsSectionSlugManuallyEdited(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {blockPickerOpen && (
        <div className="mb-4 rounded border border-border p-1">
          {(
            Object.values(CMS_BLOCK_REGISTRY) as Array<{
              type: CmsBlockType;
              label: string;
              description: string;
            }>
          ).map((definition) => (
            <button
              key={definition.type}
              type="button"
              disabled={blockSaving}
              onClick={() => handleCreateBlock(definition.type)}
              className="flex w-full flex-col items-start rounded p-2 text-left hover:bg-muted disabled:opacity-50"
            >
              <Typography variant="body-sm" className="font-medium">
                {definition.label}
              </Typography>
              <Typography
                variant="body-sm"
                className="text-muted-foreground"
              >
                {definition.description}
              </Typography>
            </button>
          ))}
        </div>
      )}

      {blocksLoading && (
        <Typography variant="body-sm">Loading blocks...</Typography>
      )}

      {!blocksLoading && blocks.length === 0 && (
        <Typography variant="body-sm" className="text-muted-foreground">
          No blocks yet. Add a block to start adding content.
        </Typography>
      )}

      <div className="space-y-3">
        {blocks.map((block, index) => {
          const editing = editingBlockId === block.id;
          const content =
            block.content &&
            typeof block.content === "object" &&
            !Array.isArray(block.content)
              ? (block.content as Record<string, unknown>)
              : {};

          return (
            <div
              key={block.id}
              className="space-y-3 rounded border border-border p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Typography variant="body-md" className="font-semibold">
                    {block.title || block.type}
                  </Typography>
                  <Typography
                    variant="body-sm"
                    className="text-muted-foreground"
                  >
                    {block.type}
                  </Typography>
                </div>

                {!editing && (
                  <Button
                    variant="secondary"
                    size="compact"
                    onClick={() => {
                      setEditingBlockId(block.id);
                      setBlockDraft(getBlockDraft(block));
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>

              {editing ? (
                <div className="space-y-3">
                  <Input
                    label="Block title"
                    value={blockDraft.title}
                    onChange={(event) =>
                      updateDraft("title", event.target.value)
                    }
                  />

                  {renderBlockEditor(block)}

                  <div className="flex gap-2">
                    <Button
                      size="compact"
                      disabled={blockSaving}
                      onClick={() => handleSaveBlock(block.id)}
                    >
                      {blockSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="secondary"
                      size="compact"
                      disabled={blockSaving}
                      onClick={() => setEditingBlockId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {block.type === CMS_BLOCK_TYPES.TEXT &&
                    typeof content.text === "string" && (
                      <Typography variant="body-sm">
                        {content.text || "No text content."}
                      </Typography>
                    )}

                  {block.type === CMS_BLOCK_TYPES.RICH_TEXT &&
                    typeof content.html === "string" && (
                      <Typography variant="body-sm">
                        {content.html || "No rich text content."}
                      </Typography>
                    )}

                  {block.type === CMS_BLOCK_TYPES.IMAGE &&
                    typeof content.url === "string" && (
                      <Typography variant="body-sm" className="break-all">
                        Image URL: {content.url || "Not set"}
                      </Typography>
                    )}

                  {block.type === CMS_BLOCK_TYPES.VIDEO &&
                    typeof content.url === "string" && (
                      <Typography variant="body-sm" className="break-all">
                        Video URL: {content.url || "Not set"}
                      </Typography>
                    )}

                  {block.type === CMS_BLOCK_TYPES.BULLET_LIST &&
                    Array.isArray(content.items) && (
                      <ul className="list-disc pl-5">
                        {content.items.map((entry, i) =>
                          typeof entry === "string" ? (
                            <li key={i}>
                              <Typography variant="body-sm">
                                {entry}
                              </Typography>
                            </li>
                          ) : null,
                        )}
                      </ul>
                    )}

                  {block.type === CMS_BLOCK_TYPES.QUOTE &&
                    typeof content.text === "string" && (
                      <blockquote className="border-l-2 border-border pl-3">
                        <Typography variant="body-sm">
                          {content.text || "No quote content."}
                        </Typography>
                        {typeof content.author === "string" && (
                          <Typography
                            variant="body-sm"
                            className="text-muted-foreground"
                          >
                            {content.author}
                          </Typography>
                        )}
                      </blockquote>
                    )}

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      radius="sm"
                      frameStrength={null}
                      square
                      className="!size-8 [&_svg]:!size-4"
                      disabled={blockSaving || index === 0}
                      onClick={() => handleMoveBlock(block.id, "up")}
                    >
                      <ArrowIcon className="rotate-90" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      radius="sm"
                      frameStrength={null}
                      square
                      className="!size-8 [&_svg]:!size-4"
                      disabled={blockSaving || index === blocks.length - 1}
                      onClick={() => handleMoveBlock(block.id, "down")}
                    >
                      <ArrowIcon className="-rotate-90" />
                    </Button>
                    <Button
                      variant="outline"
                      size="compact"
                      disabled={blockSaving}
                      onClick={() => handleToggleBlockVisibility(block)}
                    >
                      {block.isVisible ? <EyeClosedIcon /> : <EyeIcon />}
                      {block.isVisible ? "Hide" : "Show"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="compact"
                      frameStrength="low"
                      disabled={blockSaving}
                      onClick={() => handleDeleteBlock(block.id)}
                    >
                      <TrashIcon color="white" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
