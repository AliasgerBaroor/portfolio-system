"use client";

import { Frame } from "@workspace/ui/components/frame";
import { ProgressIcon } from "@workspace/ui/icons/progress";
import { Typography } from "@workspace/ui/components/typography";
import { useGalleryRevealStore } from "@/stores/gallery-reveal-store";

interface FloatingItemCountProps {
    total: number;
}

export function FloatingItemCount({
    total,
}: FloatingItemCountProps) {
    const revealedCount = useGalleryRevealStore(
        (state) => state.revealed.size
    );

    const progress =
        total > 0 ? revealedCount / total : 0;

    return (
        <Frame
            strength="medium"
            radius="pill"
            className="
                fixed
                left-8
                bottom-8
                z-50
                flex
                items-center
                gap-3
                px-4
                py-3
            "
        >
            <ProgressIcon
                progress={progress}
                className="shrink-0"
            />

            <Typography
                variant="heading-sm"
                className="leading-none"
            >
                {revealedCount} / {total}
            </Typography>
        </Frame>
    );
}