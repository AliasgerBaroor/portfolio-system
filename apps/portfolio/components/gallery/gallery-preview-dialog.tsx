    "use client";

    import { useEffect, useState } from "react";
    import Image from "next/image";

    import {
        Dialog,
        DialogOverlay,
        DialogPortal,
    } from "@workspace/ui/components/dialog";
import { GalleryMoreInfoDialog } from "./gallery-more-info-dialog";

    import { Button } from "@workspace/ui/components/button";
    import { Frame } from "@workspace/ui/components/frame";
    import { Typography } from "@workspace/ui/components/typography/typography";
    import { PlaceHolderLogoIcon } from "@workspace/ui/icons/placeholder";
    import { CrossIcon, } from "@workspace/ui/icons/cross";

    import type { GalleryItem } from "./gallery.types";
    import DialogPopup from "../dialog-primitive-popup";
    import { FloatingClock } from "../floating-clock/floating-clock";
    import { getStoragePublicUrl } from "@/lib/supabase/storage";

    interface Props {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        item: GalleryItem | null;
        onMoreInfoClick: () => void;
        showInfoCard: boolean;
    }

    export function GalleryPreviewDialog({
        open,
        onOpenChange,
        item,
        onMoreInfoClick,
        showInfoCard
    }: Props) {
        const [imageLoaded, setImageLoaded] = useState(false);
        const [imageError, setImageError] = useState(false);
        const [logoLoaded, setLogoLoaded] = useState(false);
        const [logoError, setLogoError] = useState(false);

        const handlePreviewOpenChange = (nextOpen: boolean) => {
            onOpenChange(nextOpen);
        };

        useEffect(() => {
            setImageLoaded(false);
            setImageError(false);
        }, [item?.media.src]);

        useEffect(() => {
            setLogoLoaded(false);
            setLogoError(false);
        }, [item?.project?.logo]);

        if (!item) return null;

        const width = item.media.width;
        const height = item.media.height;

        return (
            <Dialog
                open={open}
                onOpenChange={handlePreviewOpenChange}
            >
                <DialogPortal>

                    {/* ================================= */}
                    {/* Background */}
                    {/* ================================= */}

                    <DialogOverlay
                        className="gallery-dialog-overlay"
                        onClick={() => handlePreviewOpenChange(false)}
                    />

                    {/* ================================= */}
                    {/* Main Preview */}
                    {/* ================================= */}

                    <DialogPopup
                        className="
                        gallery-preview-popup
        fixed
        inset-0
        z-[1000]
        flex
        flex-col
        items-center
        pointer-events-none
    "
                    >
                        <div
                            className="
            relative
            flex
            h-[100dvh]
            w-full
            flex-col
            items-center
            justify-center
            pt-[60px]
            pb-[120px]
            pointer-events-none
        "
                        >
                            {/* ================================= */}
                            {/* MAIN PREVIEW */}
                            {/* ================================= */}


                            <Frame
                                radius="md"
                                className="
        pointer-events-auto
        relative
        flex
        box-border
        w-fit
        max-w-[calc(100vw-32px)]
        shrink-0
    "
                            >
                                <div
                                    className="
            relative
            box-border
            w-full
            max-w-full
            rounded-[12px]
            bg-white
            p-[6px]
            md:rounded-[18px]
            md:p-[10px]
        "
                                    style={{
                                        width: `min(${width * 1.3}px, calc(100vw - 48px))`,
                                    }}
                                >
                                    <div
                                        className="
                relative
                w-full
                max-w-full
                overflow-hidden
                rounded-[8px]
                bg-white
                md:rounded-[12px]
            "
                                        style={{
                                            aspectRatio: `${width} / ${height}`,
                                            maxHeight: "min(72dvh, 700px)",
                                        }}
                                    >
                                        {!imageLoaded && !imageError && (
                                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
                                                <div
                                                    role="status"
                                                    aria-label="Loading image"
                                                    className="h-8 w-8 animate-spin rounded-full border-4 border-[#221E15]/15 border-t-[#221E15]"
                                                />
                                            </div>
                                        )}

                                        {imageError ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white">
                                                <PlaceHolderLogoIcon />
                                                <Typography variant="body-md">
                                                    Unable to load preview
                                                </Typography>
                                            </div>
                                        ) : (
                                            <Image
                                                key={item.media.src}
                                                src={item.media.src}
                                                alt={item.media.alt ?? "Project preview"}
                                                fill
                                                sizes="(max-width: 767px) calc(100vw - 32px), 100vw"
                                                className={`object-contain transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                                                    }`}
                                                unoptimized
                                                onLoad={() => setImageLoaded(true)}
                                                onError={() => setImageError(true)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </Frame>


                            {/* ================================= */}
                            {/* INFO CARD + CLOSE */}
                            {/* ================================= */}

 
                                    {/* INFO CARD */}
                            {showInfoCard && item && (
                                    <div
                                        className="
    pointer-events-auto
    absolute
    bottom-[92px]
    md:bottom-[60px]
    left-1/2
    flex
    w-[calc(100vw-32px)]
    max-w-[510px]
    -translate-x-1/2
    flex-col
    items-center
    gap-3
    md:w-auto
    md:max-w-none
    md:flex-row
    md:gap-6
"
                                    >
                                        <Frame
                                            radius="md"
                                            className="
                        w-full
                        md:w-[510px]
                    "
                                        >
                                            <div
                                                className="
                            flex
                            gap-3
                            bg-white
                            px-3
                            py-2
                        "
                                            >
                                                {!logoLoaded && !logoError && (
                                                    <div
                                                        role="status"
                                                        aria-label="Loading logo"
                                                        className="absolute inset-0 flex items-center justify-center"
                                                    >
                                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#221E15]/15 border-t-[#221E15]" />
                                                    </div>
                                                )}

                                                {logoError ? (
                                                    <div className="relative flex h-[48px] w-[48px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-[#FFF7EB] p-2">
                                                        <img
                                                            src={getStoragePublicUrl(
                                                                "placeholder/default-brand.svg"
                                                            )}
                                                            alt="Project logo"
                                                            className={`h-full w-full object-contain transition-opacity duration-200 ${logoLoaded ? "opacity-100" : "opacity-0"
                                                                }`}
                                                            onLoad={() => setLogoLoaded(true)}
                                                            onError={() => setLogoError(true)}
                                                        />
                                                    </div>
                                                ) : item.project?.logo ? (
                                                    <img
                                                        src={getStoragePublicUrl(item.project.logo)}
                                                        alt={`${item.project.name} logo`}
                                                        onLoad={() => setLogoLoaded(true)}
                                                        onError={() => setLogoError(true)}
                                                        className="h-[48px] w-[48px] shrink-0"
                                                    />
                                                ) : (
                                                    <img
                                                        src={getStoragePublicUrl(
                                                            "placeholder/default-brand.svg"
                                                        )}
                                                        alt="Project logo"
                                                        className="h-[48px] w-[48px] shrink-0 rounded-[8px] bg-[#FFF7EB] object-contain p-2"
                                                    />
                                                )}
                                                
                                                <div className="min-w-0 flex-1">
                                                    <Typography
                                                        variant="body-lg"
                                                        className="text-secondary-foreground line-clamp-2"
                                                    >
                                                        {item.project?.description ?? ""}
                                                    </Typography>

                                                    <Button
                                                        type="button"
                                                        variant="link"
                                                        size="compact"
                                                onClick={onMoreInfoClick}
                                                        className="
            h-auto
            p-0
            font-heading
            text-[12px]
            font-semibold
            leading-4
            tracking-normal
            text-[#221E15]
            underline
            decoration-solid
            underline-offset-auto
        "
                                                    >
                                                        More Info
                                                    </Button>

                                                </div>
                                            </div>
                                        </Frame>

                                        {/* DESKTOP CLOSE ONLY */}
                                        <Button
                                            type="button"
                                            size="icon"
                                            radius="md"
                                            onClick={() => handlePreviewOpenChange(false)}
                                            className="hidden md:flex shrink-0 rounded-md bg-white hover:bg-white"
                                            frameClassName="hidden md:flex">
                                            <CrossIcon className="size-7" />
                                        </Button>
                                    </div>
                            )}
                                    {/* MOBILE BOTTOM CONTROLS */}
                                    {/* MOBILE CLOSE - BOTTOM LEFT */}
                                    <Button
                                        type="button"
                                        size="icon"
                                        radius="md"
                                        onClick={() => handlePreviewOpenChange(false)}
                                        frameClassName="
            fixed
            left-4
            bottom-7
            z-[200]
            md:hidden
        "
                                        className="
            shrink-0
            border-4
            border-white/40
            bg-white
            hover:bg-white
            rounded-md
        "
                                    >
                                        <CrossIcon className="size-7" />
                                    </Button>

                        </div>
                    </DialogPopup>
                    {/* ================================= */}
                    {/* Details Window */}
                    {/* ================================= */}

                </DialogPortal>
                {/* <FloatingClock /> */}
            </Dialog>
        );
    }