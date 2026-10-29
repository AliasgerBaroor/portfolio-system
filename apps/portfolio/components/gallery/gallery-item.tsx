
"use client";

import "./gallery.css";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import type { GalleryItem } from "./gallery.types";
import { Frame } from "@workspace/ui/components/frame";
import { useGalleryRevealStore } from "@/stores/gallery-reveal-store";

interface Props {
    data: GalleryItem;
    onClick: () => void;
}

function GalleryItemComponent({ data, onClick }: Props) {
    const mediaRef = useRef<HTMLDivElement>(null);
    const [nearViewport, setNearViewport] = useState(false);

    const uniqueItemId = data.id.replace(
        /__(?:horizontal|vertical)_-?\d+|__repeat_\d+/g,
        ""
    );

    const revealed = useGalleryRevealStore(
        (state) => state.revealed.has(uniqueItemId)
    );

    const reveal = useGalleryRevealStore(
        (state) => state.reveal
    );

    useEffect(() => {
        const element = mediaRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) return;

                if (entry.isIntersecting) {
                    setNearViewport(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: "300px",
                threshold: 0,
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <Frame
            strength="low"
            radius="md"
            className="gallery-frame"
        >
            <div
                ref={mediaRef}
                className="gallery-item cursor-pointer"
                style={{
                    aspectRatio: `${data.media.width} / ${data.media.height}`,
                }}
                onMouseEnter={() => reveal(uniqueItemId)}
                onClick={onClick}
            >
                {data.media.type === "image" ? (
                    nearViewport ? (
                        <Image
                            src={data.media.src}
                            alt={data.media.alt ?? ""}
                            width={data.media.width}
                            height={data.media.height}
                            loading="lazy"
                            decoding="async"
                            sizes="320px"
                            className="gallery-media"
                            data-revealed={revealed}
                        />
                    ) : (
                        <div
                            className="gallery-media"
                            aria-hidden="true"
                        />
                    )
                ) : (
                    <video
                        autoPlay={nearViewport}
                        muted
                        loop
                        playsInline
                        preload="none"
                        poster={data.media.poster}
                        className="gallery-media"
                        data-revealed={revealed}
                    >
                        {nearViewport && (
                            <source src={data.media.src} />
                        )}
                    </video>
                )}
            </div>
        </Frame>
    );
}

export default React.memo(GalleryItemComponent);