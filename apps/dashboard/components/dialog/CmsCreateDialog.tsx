
"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

import {
    Dialog,
    DialogOverlay,
    DialogPopup,
    DialogPortal,
    DialogTitle,
} from "@workspace/ui/components/dialog";

interface CmsCreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: ReactNode;
}

export function CmsCreateDialog({
    open,
    onOpenChange,
    title,
    children,
}: CmsCreateDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="z-[1000] bg-black/30 backdrop-blur-sm" />

                <DialogPopup
                    className="
                        fixed left-1/2 top-1/2 z-[1001]
                        w-[calc(100%-32px)] max-w-md
                        -translate-x-1/2 -translate-y-1/2
                        rounded-lg border-2 border-[#221E15]
                        bg-white p-5
                        shadow-[0_4px_0_0_#221E15]
                        outline-none
                    "
                >
                    <div className="mb-5 flex items-center justify-between pr-8">
                        <DialogTitle className="text-base font-semibold text-[#221E15]">
                            {title}
                        </DialogTitle>
                    </div>

                    <button
                        type="button"
                        aria-label="Close dialog"
                        onClick={() => onOpenChange(false)}
                        className="
                            absolute right-3 top-3
                            flex size-7 items-center justify-center
                            rounded-sm text-[#221E15]
                            transition-colors hover:bg-muted
                        "
                    >
                        <X className="size-4" />
                    </button>

                    {children}
                </DialogPopup>
            </DialogPortal>
        </Dialog>
    );
}
