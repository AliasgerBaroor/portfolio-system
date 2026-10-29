"use client";

import { useEffect, useState } from "react";

import { cn } from "@workspace/ui/lib/utils";
import { Typography } from "@workspace/ui/components/typography/typography";
import { ChevronIcon, PlusIcon } from "@/icons";

import { collectionsService } from "@/services/cms/collections.service";
import type { CmsCollection } from "./collections/types";
import { CmsCreateDialog } from "@/components/dialog/CmsCreateDialog";
import { Button } from "@workspace/ui/components/button";
import { generateSlug } from "@workspace/ui/lib/generate-slug";

interface CollectionsPanelProps {
  className?: string;
  activeCollectionId: string | null;
  onCollectionChange: (collectionId: string) => void;
  refreshKey: number;
}

export default function CollectionsPanel({
  className,
  activeCollectionId,
  onCollectionChange,
  refreshKey
}: CollectionsPanelProps) {
  const [collections, setCollections] =
    useState<CmsCollection[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [newCollectionName, setNewCollectionName] =
    useState("");

  const [newCollectionSlug, setNewCollectionSlug] =
    useState("");

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  useEffect(() => {
    async function loadCollections() {
      try {
        const response =
          await collectionsService.getCollections();

        setCollections(response.collections);

        if (!activeCollectionId) {
          const firstCollection =
            response.collections[0];

          if (firstCollection) {
            onCollectionChange(firstCollection.id);
          }
        }
      } catch (error) {
        console.error(
          "Failed to load collections:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadCollections();
  }, [
    refreshKey,
    activeCollectionId,
    onCollectionChange,
  ]);

  async function handleCreateCollection() {
    const name = newCollectionName.trim();
    const slug = newCollectionSlug.trim();

    if (!name || !slug || creating) return;

    try {
      setCreating(true);

      const response =
        await collectionsService.createCollection({
          name,
          slug,
        });

      setCollections((current) => [
        ...current,
        response.collection,
      ]);

      onCollectionChange(response.collection.id);

      setNewCollectionName("");
      setNewCollectionSlug("");
      setIsSlugManuallyEdited(false);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create collection:", error);
    } finally {
      setCreating(false);
    }
  }

  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col border-r border-border bg-white",
        className
      )}
    >
      {/* Header */}

      {/* Header */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border px-3">
        <Typography
          variant="body-sm"
          className="font-semibold uppercase tracking-wide text-[#221E15]"
        >
          CMS Collections
        </Typography>

        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Add collection"
        >
          <PlusIcon />
        </button>
      </div>

      <CmsCreateDialog
        open={showCreateForm}
        onOpenChange={(open) => {
          setShowCreateForm(open);

          if (!open) {
            setNewCollectionName("");
            setNewCollectionSlug("");
            setIsSlugManuallyEdited(false);
          }
        }}
        title="Create collection"
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleCreateCollection();
          }}
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="collection-name"
              className="text-sm font-medium"
            >
              Collection name
            </label>

            <input
              id="collection-name"
              value={newCollectionName}
              onChange={(event) => {
                const title = event.target.value;
                setNewCollectionName(title);

                if (!isSlugManuallyEdited) {
                  setNewCollectionSlug(generateSlug(title));
                }
              }}
              placeholder="Collection name"
              required
              className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="collection-slug"
              className="text-sm font-medium"
            >
              Collection slug
            </label>

            <input
              id="collection-slug"
              value={newCollectionSlug}
              onChange={(event) =>{
                setNewCollectionSlug(event.target.value)
                setIsSlugManuallyEdited(true);
              }}
              placeholder="collection-slug"
              required
              className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end">
            <Button
              variant="default"
              type="submit"
              size="compact"
              frameStrength="low"
              disabled={
                creating ||
                !newCollectionName.trim() ||
                !newCollectionSlug.trim()
              }
            >
              {creating ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </CmsCreateDialog>


      {/* Collection list */}
      <div className="min-h-0 flex-1 overflow-y-auto py-1">
        {loading && (
          <div className="px-3 py-2">
            <Typography
              variant="body-sm"
              className="text-muted-foreground"
            >
              Loading collections...
            </Typography>
          </div>
        )}

        {!loading && collections.length === 0 && (
          <div className="px-3 py-2">
            <Typography
              variant="body-sm"
              className="text-muted-foreground"
            >
              No collections yet.
            </Typography>
          </div>
        )}

        {!loading &&
          collections.map((collection) => {
            const active =
              collection.id === activeCollectionId;

            return (
              <button
                key={collection.id}
                type="button"
                onClick={() =>
                  onCollectionChange(collection.id)
                }
                className={cn(
                  "group flex w-full items-center gap-2 px-3 py-1.5 text-left transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Typography
                  variant="body-md"
                  className="shrink-0 truncate font-semibold"
                >
                  {collection.name}
                </Typography>

                <Typography
                  variant="body-md"
                  className={cn(
                    "min-w-0 flex-1",
                    active
                      ? "text-primary-foreground"
                      : "text-['#434134']"
                  )}
                >
                  {collection._count.items} items
                </Typography>

                <ChevronIcon
                  className={cn(
                    "h-4 w-4 shrink-0 -rotate-90",
                    active
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            );
          })}
      </div>
    </aside>
  );
}