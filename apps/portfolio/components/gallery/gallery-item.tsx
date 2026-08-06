"use client";

import React from "react";
import Image from "next/image";
import type { GalleryItem } from "./gallery.types";

interface Props {
    data: GalleryItem;
}

function GalleryItem({ data }: Props) {
    return (
        <div className="gallery-item">
            {data.media.type === "image" ? (
                <Image
                    src={data.media.src}
                    alt={data.media.alt ?? ""}
                    width={data.media.width}
                    height={data.media.height}
                    loading="lazy"
                    decoding="async"
                    sizes="260px"
                    className="gallery-media"
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
                >
                    <source src={data.media.src} />
                </video>
            )}
        </div>
    );
}

export default React.memo(GalleryItem);