"use client";

import { useState } from "react";
import Image from "next/image";

import {
    Dialog,
    DialogOverlay,
    DialogPortal,
} from "@workspace/ui/components/dialog";

import { Button } from "@workspace/ui/components/button";
import { Frame } from "@workspace/ui/components/frame";
import { Typography } from "@workspace/ui/components/typography";
import { PlaceHolderLogoIcon } from "@workspace/ui/icons/placeholder";
import { CrossIcon, } from "@workspace/ui/icons/cross";
import { MinimizeIcon, } from "@workspace/ui/icons/minimize";

import type { GalleryItem } from "./gallery.types";
import DialogPopup from "./dialog-primitive-popup";
import { ProjectTagList } from "@workspace/ui/components/project-tag";
import { projectTags } from "@/data/project-tag";
import { ProjectMetrics } from "../metric";
import { metrics } from "@/data/project-metrics";

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
    const [showDetails, setShowDetails] = useState(false);

    if (!item) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>

                {/* ================================= */}
                {/* Background */}
                {/* ================================= */}

                <DialogOverlay className="gallery-dialog-overlay" />

                {/* ================================= */}
                {/* Main Preview */}
                {/* ================================= */}

                <DialogPopup>
                    <Frame
                        strength="high"
                        radius="md"
                    >
                        <div className="flex flex-col items-center">

                            {/* Preview Card */}

                            <div
                                className="
                                    h-[545px]
                                    w-[815px]
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

                                    {/* ============================= */}
                                    {/* Left */}
                                    {/* ============================= */}

                                    <div
                                        className="
                                            row-span-2
                                            overflow-hidden
                                            rounded-[18px]
                                        "
                                    >
                                        <Image
                                            src="/images/details/placeholder.png"
                                            width={393}
                                            height={526}
                                            alt=""
                                            className="
                                                block
                                                h-auto
                                                w-full
                                                rounded-[18px]
                                            "
                                            unoptimized
                                        />
                                    </div>

                                    {/* ============================= */}
                                    {/* Right Top */}
                                    {/* ============================= */}

                                    <div
                                        className="
                                            overflow-hidden
                                            rounded-[18px]
                                        "
                                    >
                                        <Image
                                            src="/images/details/logo.png"
                                            width={393}
                                            height={258}
                                            alt=""
                                            className="
                                                block
                                                h-auto
                                                w-full
                                                rounded-[18px]
                                            "
                                            unoptimized
                                        />
                                    </div>

                                    {/* ============================= */}
                                    {/* Right Bottom */}
                                    {/* ============================= */}

                                    <div
                                        className="
                                            overflow-hidden
                                            rounded-[18px]
                                        "
                                    >
                                        <Image
                                            src="/images/details/showcase.png"
                                            width={393}
                                            height={258}
                                            alt=""
                                            className="
                                                block
                                                h-auto
                                                w-full
                                                rounded-[18px]
                                            "
                                            unoptimized
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </Frame>
                </DialogPopup>

                {/* ================================= */}
                {/* Bottom Controls */}
                {/* ================================= */}

                {!showDetails && (
                    <div
                        className="
                            fixed
                            bottom-8
                            left-1/2
                            z-[60]
                            flex
                            -translate-x-1/2
                            items-center
                            gap-6
                        "
                    >

                        {/* ============================= */}
                        {/* Info Card */}
                        {/* ============================= */}

                        <Frame
                            radius="md"
                            className="w-[510px]"
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    bg-white
                                    px-3
                                    py-2
                                "
                            >

                                {/* Logo */}

                                <PlaceHolderLogoIcon
                                    className="
                                        shrink-0
                                        rounded-[8px]
                                        bg-[#FFF7EB]
                                        p-2
                                    "
                                />

                                {/* Content */}

                                <div className="min-w-0 flex-1">

                                    <Typography
                                        variant="body-lg"
                                        className="text-secondary-foreground"
                                    >
                                        A trust-first travel website and
                                        mobile app designed for a
                                        couples-first brand.
                                    </Typography>

                                    <Button
                                        type="button"
                                        variant="link"
                                        onClick={() =>
                                            setShowDetails(true)
                                        }
                                        className="
                                            p-0
                                            font-semibold
                                            text-foreground
                                            underline
                                            underline-offset-4
                                        "
                                    >
                                        More Info
                                    </Button>

                                </div>
                            </div>
                        </Frame>

                        {/* ============================= */}
                        {/* Close */}
                        {/* ============================= */}

                        <Button
                            type="button"
                            size="icon"
                            radius="md"
                            onClick={() =>
                                onOpenChange(false)
                            }
                            className="
                                shrink-0
                                border-4
                                border-white/40
                                bg-white
                                hover:bg-white
                            "
                        >
                            <CrossIcon className="size-7" />
                        </Button>

                    </div>
                )}

                {/* ================================= */}
                {/* Details Window */}
                {/* ================================= */}

                {showDetails && (
                    <div
                        className="
            fixed
            left-1/2
            top-[calc(55%)]
            z-[100]
            flex
            -translate-x-1/2
            flex-col
            items-center
            gap-6
        "
                    >
                        {/* ================================= */}
                        {/* Details Card */}
                        {/* ================================= */}

                        <Frame
                            strength="high"
                            radius="md"
                            className="
                                    w-[380px]
                                    bg-white
                                "
                        >
                            <div className="p-6 flex flex-col gap-4">

                                {/* Header */}
                                <div className="flex items-center gap-3">
                                <PlaceHolderLogoIcon
                                    className="
                                        shrink-0
                                        rounded-[8px]
                                        bg-[#FFF7EB]
                                        p-2
                                    "
                                />

                                <div className="flex flex-col">

                                <Typography
                                    variant="heading-xs"
                                    className="leading-none"
                                >
                                    30 Sundays
                                </Typography>

                                <Typography
                                    variant="body-md"
                                        className="mt-1 text-secondary-foreground"
                                >
                                    Travel
                                </Typography>

                                </div>

                                </div>
                                {/* Tags */}

                                <ProjectTagList tags={projectTags} />

                                {/* Divider */}

                                <div className="my-4 h-px bg-divider" />

                                {/* ================================= */}
                                {/* Metrics */}
                                {/* ================================= */}

                                <ProjectMetrics metrics={metrics} />

                                {/* Divider */}

                                <div className="my-4 h-px bg-divider" />

                                {/* Description */}

                                <Typography
                                    variant="body-sm"
                                    className="text-foreground"
                                >
                                    Lorem ipsum dolor sit amet consectetur. Quam velit
                                    blandit turpis id nulla quis justo. Sit eu nisi et
                                    viverra ac diam urna.
                                </Typography>

                            </div>
                        </Frame>

                        {/* ================================= */}
                        {/* Minimize Button */}
                        {/* ================================= */}

                        <Button
                            type="button"
                            size="icon"
                            radius="md"
                            onClick={() => setShowDetails(false)}
                            className="
                                shrink-0
                                border-4
                                border-white/40
                                bg-white
                                hover:bg-white
                            "
                        >
                            <MinimizeIcon className="size-7" />
                        </Button>
                    </div>
                )}


            </DialogPortal>
        </Dialog>
    );
}