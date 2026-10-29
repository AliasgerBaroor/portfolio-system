"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@workspace/ui/lib/utils";
import { Typography } from "@workspace/ui/components/typography/typography";
import { ChevronIcon, PlusIcon } from "@/icons";

import { itemsService } from "../../../services/cms/items.service";
import type { CmsItem } from "./items/types";
import { CmsCreateDialog } from "@/components/dialog/CmsCreateDialog";
import { Button } from "@workspace/ui/components/button";


interface ItemPanelProps {
  className?: string;
  collectionId: string | null;
  activeItemId: string | null;
  activeItem: CmsItem | null;
  onItemChange: (item: CmsItem | null) => void;
  onItemCreated: () => void;
  refreshKey: number;
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: { message?: string };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return error instanceof Error
    ? error.message
    : "Something went wrong.";
}

function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ItemPanel({
  className,
  collectionId,
  activeItemId,
  activeItem,
  onItemChange,
  onItemCreated,
  refreshKey,
}: ItemPanelProps) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemSlug, setNewItemSlug] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const activeItemIdRef = useRef(activeItemId);
  const onItemChangeRef = useRef(onItemChange);

  useEffect(() => {
    if (!activeItem) return;

    setItems((current) =>
      current.map((existingItem) =>
        existingItem.id === activeItem.id
          ? activeItem
          : existingItem
      )
    );
  }, [activeItem]);
  
  useEffect(() => {
    activeItemIdRef.current = activeItemId;
  }, [activeItemId]);

  useEffect(() => {
    onItemChangeRef.current = onItemChange;
  }, [onItemChange]);

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      if (!collectionId) {
        setItems([]);
        setShowCreateForm(false);
        onItemChangeRef.current(null);
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      try {
        const response = await itemsService.getItems(collectionId);

        if (cancelled) return;

        setItems(response.items);

        const selectedItem = response.items.find(
          (item) => item.id === activeItemIdRef.current
        );

        onItemChangeRef.current(
          selectedItem ?? response.items[0] ?? null
        );
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load CMS items:", error);
        setItems([]);
        onItemChangeRef.current(null)
        setErrorMessage(getErrorMessage(error));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadItems();

    return () => {
      cancelled = true;
    };
  }, [collectionId, refreshKey]);

  async function handleCreateItem() {
    if (!collectionId) return;

    const title = newItemTitle.trim();
    const slug = newItemSlug.trim();

    if (!title || !slug) {
      setErrorMessage("Item title and slug are required.");
      return;
    }

    setCreating(true);
    setErrorMessage(null);

    try {
      const response = await itemsService.createItem(collectionId, {
        title,
        slug,
      });

      setItems((current) => [...current, response.item]);

      onItemChange(response.item);
      onItemCreated();

      setNewItemTitle("");
      setNewItemSlug("");
      setIsSlugManuallyEdited(false);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create CMS item:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setCreating(false);
    }
  }

  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col bg-white",
        className
      )}
    >
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border px-3">
        <Typography
          variant="body-sm"
          className="font-semibold uppercase tracking-wide text-[#221E15]"
        >
          Items
        </Typography>

        <button
          type="button"
          disabled={!collectionId || creating}
          onClick={() => {
            setShowCreateForm((current) => !current);
            setErrorMessage(null);
          }}
          className="flex h-5 w-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Add item"
        >
          <PlusIcon />
        </button>
      </div>

      {errorMessage && (
        <div className="border-b border-red-200 bg-red-50 px-3 py-2">
          <Typography variant="body-sm" className="text-red-700">
            {errorMessage}
          </Typography>
        </div>
      )}


      <CmsCreateDialog
        open={showCreateForm}
        onOpenChange={(open) => {
          setShowCreateForm(open);

          if (!open) {
            setNewItemTitle("");
            setNewItemSlug("");
            setIsSlugManuallyEdited(false);
            setErrorMessage(null);
          }
        }}
        title="Create item"
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleCreateItem();
          }}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="item-title" className="text-sm font-medium">
              Item title
            </label>
            <input
              id="item-title"
              value={newItemTitle}
              onChange={(event) => {
                const title = event.target.value;

                setNewItemTitle(title);

                if (!isSlugManuallyEdited) {
                  setNewItemSlug(generateSlug(title));
                }
              }}
              placeholder="Item title"
              required
              className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="item-slug" className="text-sm font-medium">
              Item slug
            </label>
            <input
              id="item-slug"
              value={newItemSlug}
              onChange={(event) => {
                setNewItemSlug(event.target.value);
                setIsSlugManuallyEdited(true);
              }}
              placeholder="item-slug"
              required
              className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          {errorMessage && (
            <Typography variant="body-sm" className="text-red-700">
              {errorMessage}
            </Typography>
          )}

          <div className="flex justify-end">
            <Button
              variant="default"
              type="submit"
              size="compact"
              frameStrength="low"
              disabled={
                creating ||
                !newItemTitle.trim() ||
                !newItemSlug.trim() ||
                !collectionId
              }
            >
              {creating ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </CmsCreateDialog>
              

      <div className="min-h-0 flex-1 overflow-y-auto py-1">
        {loading && (
          <div className="px-3 py-2">
            <Typography variant="body-sm" className="text-muted-foreground">
              Loading items...
            </Typography>
          </div>
        )}

        {!loading && !collectionId && (
          <div className="px-3 py-2">
            <Typography variant="body-sm" className="text-muted-foreground">
              Select a collection.
            </Typography>
          </div>
        )}

        {!loading && collectionId && items.length === 0 && (
          <div className="px-3 py-2">
            <Typography variant="body-sm" className="text-muted-foreground">
              No items yet.
            </Typography>
          </div>
        )}

        {!loading &&
          items.map((item) => {
            const active = item.id === activeItemId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onItemChange(item)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "flex w-full items-center gap-2 border-b border-border px-3 py-1.5 text-left text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Typography
                  variant="body-md"
                  className="min-w-0 flex-1 truncate font-semibold"
                >
                  {item.title}
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
