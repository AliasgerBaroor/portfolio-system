"use client";
import "./gallery.css";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { MasonryProps } from "masonic";

import GalleryItem from "./gallery-item";
import type { GalleryItem as Item } from "./gallery.types";

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
                overscanBy={4}
                render={({ data }) => (
                    <GalleryItem data={data} />
                )}
        />
        </div>
    );
}