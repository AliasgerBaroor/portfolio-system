"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

import { ClientCategoryTooltipIcon } from "@/icons";
import { Typography } from "@workspace/ui/components/typography/typography";

export default function ClientCategoryTooltip({
    category,
    anchor,
}: {
    category: string;
    anchor: HTMLElement;
}) {
    const [position, setPosition] = useState<{
        left: number;
        top: number;
    } | null>(null);

    useEffect(() => {
        const updatePosition = () => {
            const rect = anchor.getBoundingClientRect();

            setPosition({
                left: rect.left + rect.width / 2,
                top: rect.bottom + 8,
            });
        };

        updatePosition();

        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [anchor]);

    if (!position) return null;

    return createPortal(
        <div
            className="pointer-events-none fixed z-[9999]"
            style={{
                left: position.left,
                top: position.top,
                transform: "translateX(-50%)",
            }}
        >
            <div className="relative flex h-[42px] min-w-[109px] items-center justify-center px-4">
                <ClientCategoryTooltipIcon className="absolute inset-0 h-full w-full" />

                <Typography
                    variant="body-sm"
                    className="relative z-10 translate-y-[2px] whitespace-nowrap"
                >
                    {category}
                </Typography>
            </div>
        </div>,
        document.body,
    );
}