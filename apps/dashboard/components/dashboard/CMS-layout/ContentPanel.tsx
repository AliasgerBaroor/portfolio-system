
"use client";

import { useEffect, useState } from "react";

import { cn } from "@workspace/ui/lib/utils";
import { Typography } from "@workspace/ui/components/typography/typography";
import { Input } from "@/components/ui/Input";
import { Button } from "@workspace/ui/components/button";

import { sectionsService } from "../../../services/cms/sections.service";
import { itemsService } from "../../../services/cms/items.service";
import ShareLink from "./sections/share-link";

import type { CmsSection } from "./sections/types";

import { IconText } from "@/components/ui/icon-text";
import { LinkIcon, TrashIcon } from "@/icons";
import type { CmsItem } from "./items/types";
import EmptyItems from "./items/empty-items";
import { ContentViewTabs } from "./content-editor/ContentViewTabs";
import { BlockView } from "./content-editor/BlockView";
import RichTextView from "./content-editor/RichTextView";
import { usePortfolio } from "@/contexts/portfolio-context";

type EditorMode = "rich-text" | "blocks";

interface ContentPanelProps {
  className?: string;
  itemId: string | null;
  item: CmsItem | null;
  activeSectionId: string | null;
  sectionCreateRequestKey: number;
  onSectionChange: (sectionId: string | null) => void;
  onItemDeleted: (itemId: string) => void;
  onItemUpdated: (item: CmsItem) => void;
  onAddSection: () => void;
  canAddSection: boolean;
}
export default function ContentPanel({
  className,
  itemId,
  item,
  activeSectionId,
  sectionCreateRequestKey,
  onSectionChange,
  onItemDeleted,
  onItemUpdated,
  onAddSection,
  canAddSection,
}: ContentPanelProps) {
    const {
        portfolio
    } = usePortfolio();

  const [editorMode, setEditorMode] =
    useState<EditorMode>("blocks");

  const [sections, setSections] = useState<CmsSection[]>([]);

  const [sectionsLoading, setSectionsLoading] = useState(false);

  const [showSectionForm, setShowSectionForm] = useState(false);
  const [creatingSection, setCreatingSection] = useState(false);
  const [, setSavingSection] = useState(false);

  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionSlug, setNewSectionSlug] = useState("");
  const [newSectionType, setNewSectionType] = useState("");

  const [deletingItem, setDeletingItem] = useState(false);

  const [itemTitleDraft, setItemTitleDraft] = useState("");
  const [itemSlugDraft, setItemSlugDraft] = useState("");
  const [savingItem, setSavingItem] = useState(false);
  const [itemSaveError, setItemSaveError] = useState<string | null>(null);

  const [isSectionSlugManuallyEdited, setIsSectionSlugManuallyEdited] =
    useState(false);

  const activeSection =
    sections.find((section) => section.id === activeSectionId) ?? null;

  useEffect(() => {
    if (sectionCreateRequestKey === 0 || !itemId) return;

    setShowSectionForm(true);
  }, [sectionCreateRequestKey, itemId]);
  
  // Load sections whenever the selected item changes.
  useEffect(() => {
    let cancelled = false;

    async function loadSections() {
      if (!itemId) {
        setSections([]);
        onSectionChange(null);
        return;
      }

      setSectionsLoading(true);
      setSections([]);

      try {
        const response = await sectionsService.getSections(itemId);

        if (cancelled) return;


        setSections(response.sections);

        const firstSection =
          response.sections.find((section) => !section.isSystem) ??
          response.sections[0];

        onSectionChange(firstSection?.id ?? null);
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load sections:", error);
        setSections([]);
        onSectionChange(null);
      } finally {
        if (!cancelled) setSectionsLoading(false);
      }
    }

    void loadSections();

    return () => {
      cancelled = true;
    };
  }, [itemId, onSectionChange]);

  useEffect(() => {
    setItemTitleDraft(item?.title ?? "");
    setItemSlugDraft(item?.slug ?? "");
    setItemSaveError(null);
  }, [item?.id, item?.title, item?.slug]);

  async function handleDeleteItem() {
    if (!itemId || !item || deletingItem) return;

    const confirmed = window.confirm(
      `Delete item "${item.title}" and all its sections and blocks?`
    );

    if (!confirmed) return;

    try {
      setDeletingItem(true);

      await itemsService.deleteItem(item.collectionId, itemId);

      onItemDeleted(itemId);
    } catch (error) {
      console.error("Failed to delete CMS item:", error);
    } finally {
      setDeletingItem(false);
    }
  }

  async function handleSaveItem() {
    if (!item || !itemId || savingItem) return;

    const title = itemTitleDraft.trim();
    const slug = itemSlugDraft.trim();

    if (!title || !slug) {
      setItemSaveError("Item title and slug are required.");
      return;
    }

    if (title === item.title && slug === item.slug) {
      setItemSaveError(null);
      return;
    }

    try {
      setSavingItem(true);
      setItemSaveError(null);

      const response = await itemsService.updateItem(
        item.collectionId,
        itemId,
        { title, slug },
      );

      onItemUpdated(response.item);
    } catch (error) {
      console.error("Failed to update CMS item:", error);

      setItemSaveError(
        error instanceof Error
          ? error.message
          : "Failed to save item settings.",
      );
    } finally {
      setSavingItem(false);
    }
  }

  async function handleCreateSection() {
    if (!itemId) return;

    const title = newSectionTitle.trim();
    const slug = newSectionSlug.trim();
    const type = newSectionType.trim();

    if (!title || !slug) return;

    try {
      setCreatingSection(true);

      const response = await sectionsService.createSection(itemId, {
        title,
        slug,
        type: type || undefined,
      });

      setSections((current) => [...current, response.section]);
      setShowSectionForm(false);
      setNewSectionTitle("");
      setNewSectionSlug("");
      setNewSectionType("");
      setIsSectionSlugManuallyEdited(false);

      onSectionChange(response.section.id);
    } catch (error) {
      console.error("Failed to create section:", error);
    } finally {
      setCreatingSection(false);
    }
  }

  return (
    <main
      className={cn(
        "flex h-full min-h-0 min-w-0 flex-1 flex-col border-l border-[#221E15] bg-white",
        className,
      )}
    >
      <div className=" flex flex-col gap-4 min-h-0 flex-1 overflow-y-auto p-3">
        {!itemId && <EmptyItems />}

        {itemId && item && (
            <div
                    className={cn(
                        "flex w-full flex-col",
                        "items-start",
                        "gap-4",
                        "self-stretch",
                        "rounded-[12px]",
                        "border-2 border-[#221E15]",
                        "bg-white",
                        "p-4",
                        "shadow-[0_4px_0_0_#221E15]",
                        className
                    )}
                >
          {/* <DetailField
            label="ID"
            value={"697b300923e73c838369b84c"}
          /> */}


          <Input
            label="Item title"
            required
            value={itemTitleDraft}
            onChange={(event) => setItemTitleDraft(event.target.value)}
            placeholder="Enter item title"
          />

          <Input
            label="Item slug"
            required
            value={itemSlugDraft}
            onChange={(event) => setItemSlugDraft(event.target.value)}
            placeholder="item-slug"
          />

          <IconText icon={<LinkIcon />} isUrl>
            {itemSlugDraft || "Enter an item slug"}
          </IconText>

          {itemSaveError && (
            <Typography variant="body-sm" className="text-red-600">
              {itemSaveError}
            </Typography>
          )}

          <div className="flex gap-2">
            <Button
              size="compact"
                frameStrength={"low"}
              disabled={
                !item ||
                savingItem ||
                !itemTitleDraft.trim() ||
                !itemSlugDraft.trim()
              }
              onClick={handleSaveItem}
            >
              {savingItem ? "Saving..." : "Save changes"}
            </Button>

            <Button
              variant="destructive"
              size="compact"
                frameStrength={"low"}
              disabled={!item || deletingItem || savingItem}
              onClick={handleDeleteItem}
            >
              <TrashIcon color="white" />
              {deletingItem ? "Deleting..." : "Delete"}
            </Button>
          </div>

                </div>
        )}

        {itemId && (
          <>
            <ContentViewTabs
              value={editorMode}
              onChange={setEditorMode}
            />

            {editorMode === "rich-text" ? (
              <RichTextView
                itemId={itemId}
                sections={sections}
              />
            ) : (
                <BlockView
                  itemId={itemId}
                  activeSectionId={activeSectionId}
                  isSystemSection={Boolean(activeSection?.isSystem)}
                  sections={sections}
                  sectionsLoading={sectionsLoading}
                  onSectionChange={onSectionChange}
                  onEditSection={(sectionId) => {
                    onSectionChange(sectionId);
                  }}
                  showSectionForm={showSectionForm}
                  setShowSectionForm={setShowSectionForm}
                  creatingSection={creatingSection}
                  newSectionTitle={newSectionTitle}
                  setNewSectionTitle={setNewSectionTitle}
                  newSectionSlug={newSectionSlug}
                  setNewSectionSlug={setNewSectionSlug}
                  newSectionType={newSectionType}
                  setNewSectionType={setNewSectionType}
                  isSectionSlugManuallyEdited={isSectionSlugManuallyEdited}
                  setIsSectionSlugManuallyEdited={setIsSectionSlugManuallyEdited}
                  handleCreateSection={handleCreateSection}
                />
            )}
          </>
        )}
        {/* disabled={!canAddSection}
        onClick={onAddSection} */}

        {portfolio?.slug && (
          <ShareLink slug={portfolio.slug} />
        )}
      </div>
    </main>
  );
}
