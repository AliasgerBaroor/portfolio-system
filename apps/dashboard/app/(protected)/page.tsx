"use client";

import { useState } from "react";

import CollectionsPanel from "@/components/dashboard/CMS-layout/CollectionsPanel";
import ItemPanel from "@/components/dashboard/CMS-layout/ItemPanel";
import ContentPanel from "@/components/dashboard/CMS-layout/ContentPanel";
import { Frame } from "@workspace/ui/components/frame";
import { CmsItem } from "@/components/dashboard/CMS-layout/items/types";
import { PlusIcon } from "@/icons";
import { Typography } from "@workspace/ui/components/typography/typography";
import ContentControlPanel from "@/components/dashboard/CMS-layout/ContentControlPanel";

export default function DashboardPage() {
  const [activeCollectionId, setActiveCollectionId] =
    useState<string | null>(null);

  const [activeItemId, setActiveItemId] =
    useState<string | null>(null);

  const [activeSectionId, setActiveSectionId] =
    useState<string | null>(null);

  const [collectionsRefreshKey, setCollectionsRefreshKey] =
    useState(0);

  const [itemsRefreshKey, setItemsRefreshKey] = useState(0);

  const [activeItem, setActiveItem] = useState<CmsItem | null>(null);

  const [sectionCreateRequestKey, setSectionCreateRequestKey] =
    useState(0);

  function handleItemChange(item: CmsItem | null) {
    setActiveItem(item);
    setActiveItemId(item?.id ?? null);
    setActiveSectionId(null);
  }


  function handleItemDeleted(itemId: string) {
    if (activeItemId === itemId) {
      setActiveItem(null);
      setActiveItemId(null);
      setActiveSectionId(null);
    }

    setItemsRefreshKey((current) => current + 1);
    setCollectionsRefreshKey((current) => current + 1);
  }
  function handleItemCreated() {
    setCollectionsRefreshKey(
      (current) => current + 1,
    );
  }

  function handleItemUpdated(updatedItem: CmsItem) {
    setActiveItem(updatedItem);
    setActiveItemId(updatedItem.id);
  }

  return (
    <Frame
      className="
        grid
        h-full
        min-h-0
        w-full
        grid-cols-[220px_220px_minmax(0,1fr)]
        overflow-hidden
      "
      radius="sm"
    >
      <CollectionsPanel
        activeCollectionId={activeCollectionId}
        onCollectionChange={setActiveCollectionId}
        refreshKey={collectionsRefreshKey}
      />

      <ItemPanel
        collectionId={activeCollectionId}
        activeItemId={activeItemId}
        activeItem={activeItem}
        onItemChange={handleItemChange}
        onItemCreated={handleItemCreated}
        refreshKey={itemsRefreshKey}
      />
      <div className="flex flex-col">
        <ContentControlPanel
          title={activeItem?.title}
        />

        <ContentPanel
          itemId={activeItemId}
          item={activeItem}
          activeSectionId={activeSectionId}
          onSectionChange={setActiveSectionId}
          onItemDeleted={handleItemDeleted}
          onItemUpdated={handleItemUpdated}
          sectionCreateRequestKey={sectionCreateRequestKey}
          canAddSection={Boolean(activeItemId)}
          onAddSection={() =>
            setSectionCreateRequestKey((current) => current + 1)
          }
        />
      </div>
    </Frame>
  );
}