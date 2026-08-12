"use client";

import React from "react";
import Image from "next/image";

import type { GalleryItem } from "./gallery.types";
import { Frame } from "@workspace/ui/components/frame";
import { useGalleryRevealStore } from "@/stores/gallery-reveal-store";

interface Props {
    data: GalleryItem;
    onClick: () => void;
}

function GalleryItem({
    data,
    onClick,
}: Props) {
    const revealed = useGalleryRevealStore(
        (state) => state.revealed.has(data.id)
    );

    const reveal = useGalleryRevealStore(
        (state) => state.reveal
    );

    return (
        <Frame strength="low" radius="md">
            <div
                className="gallery-item cursor-pointer"
                style={{
                    aspectRatio: `${data.media.width} / ${data.media.height}`,
                }}
                onMouseEnter={() => reveal(data.id)}
                onClick={onClick}
            >
                {data.media.type === "image" ? (
                    <Image
                        src={data.media.src}
                        alt={data.media.alt ?? ""}
                        width={data.media.width}
                        height={data.media.height}
                        loading="eager"
                        decoding="async"
                        sizes="(max-width: 768px) 100vw, 320px"
                        className="gallery-media"
                        data-revealed={revealed}
                    />
                ) : (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="none"
                        poster={data.media.poster}
                        className="gallery-media"
                        data-revealed={revealed}
                    >
                        <source src={data.media.src} />
                    </video>
                )}
            </div>
        </Frame>
    );
}

export default React.memo(GalleryItem);