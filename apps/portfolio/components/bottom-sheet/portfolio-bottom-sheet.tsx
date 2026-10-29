"use client";

import type { ReactNode } from "react";

import {
    Dialog,
    DialogOverlay,
    DialogPopup,
    DialogPortal,
} from "@workspace/ui/components/dialog";

import { Button } from "@workspace/ui/components/button";
import { Frame } from "@workspace/ui/components/frame";
import { CrossIcon } from "@workspace/ui/icons/cross";
import { cn } from "@workspace/ui/lib/utils";

interface PortfolioBottomSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
    variant?: "default" | "wide";
    className?: string;
}

export function PortfolioBottomSheet({
    open,
    onOpenChange,
    children,
    variant = "default",
    className,
}: PortfolioBottomSheetProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogPortal>

                <DialogOverlay
                    className="gallery-dialog-overlay"
                />

                <DialogPopup
                    className="
        fixed
        inset-0
        z-[1000]
        flex
        items-start
        justify-center
        px-4
        pt-12
        pointer-events-none
    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            items-center
                            gap-6
                            pointer-events-auto
                        "
                    >

                        {/* CLOSE BUTTON */}
                        <Button
                            type="button"
                            size="icon"
                            className={cn(
                                "shrink-0 bg-brand-color-2 hover:bg-brand-color-2/85",
                                className
                            )}
                            onClick={() =>
                                onOpenChange(false)
                            }
                        >
                            <CrossIcon color="#fff" />
                        </Button>

                        {/* SHEET */}
                        <Frame
                            strength="high"
                            radius="md"
                            className={`
                                flex
                                h-[calc(100dvh-248px)]
                                flex-col
                                overflow-hidden
                                bg-white
                               ${
                                variant === "wide"
                                    ? "w-[calc(100vw-32px)] md:w-[75vw]"
                                    : "w-[calc(100vw-32px)] max-w-[380px]"
}
    `}
                        >
                            {children}
                        </Frame>

                    </div>
                </DialogPopup>

            </DialogPortal>
        </Dialog>
    );
}