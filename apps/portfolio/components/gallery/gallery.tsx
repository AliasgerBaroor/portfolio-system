"use client";
import "./gallery.css";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MasonryProps } from "masonic";

import GalleryItem from "./gallery-item";
import type { GalleryItem as Item } from "./gallery.types";
import { GalleryPreviewDialog } from "./gallery-preview-dialog";

const Masonry = dynamic<MasonryProps<Item>>(
    () => import("masonic").then((m) => m.Masonry),
    {
        ssr: false,
    }
);

export default function Gallery({
    items,
}: {
    items: Item[];
}) {
    const [selectedItem, setSelectedItem] =
        useState<Item | null>(null);

    return (
        <div className="gallery">
            <Masonry
                items={items}
                columnWidth={320}
                columnGutter={16}
                render={({ data }) => (
                    <GalleryItem
                        data={data}
                        onClick={() => setSelectedItem(data)}
                    />
                )}
            />

            <GalleryPreviewDialog
                open={!!selectedItem}
                item={selectedItem}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedItem(null);
                    }
                }}
            />
        </div>
    );
}