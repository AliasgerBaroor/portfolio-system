"use client";

import Image from "next/image";

import {
    Dialog,
    DialogOverlay,
    DialogPortal,
    DialogPrimitive,
} from "@workspace/ui/components/dialog";

import type { GalleryItem } from "./gallery.types";
import { PlaceHolderLogoIcon } from "@workspace/ui/icons/placeholder";
import { Button } from "@workspace/ui/components/button";
import { CrossIcon } from "../../../../packages/ui/src/icons/cross";
import { Typography } from "@workspace/ui/components/typography";
import { useState } from "react";
import DialogPopup from "./dialog-primitive-popup";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: GalleryItem | null;
}

export function GalleryPreviewDialog({
    open,
    onOpenChange,
    item,
}: Props) {
    if (!item) return null;
    const [showDetails, setShowDetails] = useState(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>

                <DialogOverlay className="gallery-dialog-overlay" />
                <DialogPopup>
                    <div className="flex flex-col items-center gap-10">

                        {/* ================================= */}
                        {/* Preview Card */}
                        {/* ================================= */}

                        <div
                            className="
                                w-[815px]
                                h-[545px]
                                rounded-[28px]
                                bg-white
                                p-[10px]
                                shadow-2xl
                            "
                        >
                            <div
                                className="
                                    grid
                                    h-full
                                    grid-cols-[392px_392px]
                                    grid-rows-[258px_258px]
                                    gap-[10px]
                                "
                            >

                                {/* Left */}

                                <div className="row-span-2 overflow-hidden rounded-[18px]">

                                    <Image
                                        src="/details/placeholder.png"
                                        width={393}
                                        height={526}
                                        alt=""
                                        className="block w-full h-auto rounded-[18px]"
                                        unoptimized

                                    />

                                </div>

                                {/* Right Top */}

                                <div className="overflow-hidden rounded-[18px]">

                                    <Image
                                        src="/details/logo.png"
                                        width={393}
                                        height={258}
                                        alt=""
                                        className="block w-full h-auto rounded-[18px]"
                                        unoptimized
                                    />

                                </div>

                                {/* Right Bottom */}

                                <div className="overflow-hidden rounded-[18px]">

                                    <Image
                                        src="/details/showcase.png"
                                        width={393}
                                        height={258}
                                        alt=""
                                        className="block w-full h-auto rounded-[18px]"
                                        unoptimized
                                    />

                                </div>

                            </div>
                        </div>

                        {/* ================================= */}
                        {/* Bottom */}
                        {/* ================================= */}


                    </div>
                </DialogPopup>

                <div
                    className="
    fixed
    left-1/2
    bottom-8
    z-[60]
    -translate-x-1/2
    flex
    items-center
    gap-6
  "
                >

                    {/* Info Card */}
                    <div className="                                border-4
                                border-white/40
                                    rounded-[26px]
                                
                                "
                    >

                        <div
                            className="
                                    flex
                                    items-center
                                    gap-3

                                    rounded-[22px]
                                    bg-white

                                    px-3
                                    py-2    

                                    shadow-xl

                                    max-w-[510px]

                                "
                        >

                            <PlaceHolderLogoIcon className="p-2 bg-[#FFF7EB] rounded-[8px]" />

                            <div className="flex-1">
                                <Typography variant="body-lg" className="text-muted-foreground">
                                    A trust-first travel website and mobile
                                    app designed for a couples-first brand.
                                </Typography>

                                <Button
                                    variant="link"
                                    className="
                                            underline
                                            underline-offset-4
                                            text-forground
                                            font-semibold
                                        "
                                >
                                    More Info
                                </Button>

                            </div>

                        </div>
                    </div>

                    {/* Close */}
                    <Button
                        size="icon-xl"
                        onClick={() => onOpenChange(false)}
                        className="
                                bg-white
                                border-4
                                border-white/40
                                hover:bg-white
    "
                    >
                        <CrossIcon className="size-7" />
                    </Button>

                </div>

            </DialogPortal>
        </Dialog>
    );
}