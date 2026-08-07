"use client";
import "./gallery.css";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MasonryProps } from "masonic";

import GalleryItem from "./gallery-item";
import type { GalleryItem as Item } from "./gallery.types";
import { GalleryPreviewDialog } from "./gallery-preview-dialog";

const LOOP_COUNT = 100;

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

    if (items.length === 0) {
        return null;
    }

    const repeatedItems = useMemo(() => {
        return Array.from(
            { length: items.length * LOOP_COUNT },
            (_, index) => {
                const item =
                    items[index % items.length]!;

                return {
                    ...item,
                    id: `${item.id}-${index}`,
                };
            }
        );
    }, [items]);

    return (
        <div className="gallery">
            <Masonry
                items={repeatedItems}
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
                    if (!open) setSelectedItem(null);
                }}
            />
        </div>
    );
}