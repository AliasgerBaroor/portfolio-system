import * as React from "react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import { Typography } from "@workspace/ui/components/typography/typography";
import { LinkArrowIcon } from "@/icons/link-arrow";

export interface FileCardProps {
    image: React.ReactNode;
    name: string;
    meta: string;
    onClick?: () => void;
    className?: string;
}

export function FileCard({
    image,
    name,
    meta,
    onClick,
    className,
}: FileCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative",
                "flex h-16 w-[262px] items-center",
                "rounded-[4px]",
                "border border-[#E9E8E8]",
                "bg-white",
                onClick && "cursor-pointer",
                className
            )}
        >
            {/* Image area */}
            <div
                className={cn(
                    "flex h-16 w-16 shrink-0",
                    "flex-col items-center justify-center",
                    "gap-2",
                    "border-r border-[#E9E8E8]"
                )}
            >
                {image}
            </div>

            {/* Text + icon area */}
            <div
                className={cn(
                    "flex min-w-0 flex-1 self-stretch",
                    "items-center",
                    "gap-1",
                    "px-4"
                )}
            >
                {/* Texts */}
                <div
                    className={cn(
                        "flex min-w-0 flex-1",
                        "flex-col items-start",
                        "gap-1"
                    )}
                >
                    <Typography
                        variant="field-label"
                        className="truncate text-[#221E15]"
                    >
                        {name}
                    </Typography>

                    <Typography
                        variant="inline-text"
                        className="truncate text-[#221E15]"
                    >
                        {meta}
                    </Typography>
                </div>

                {/* Arrow */}
                <LinkArrowIcon className="absolute right-2 top-2 h-4 w-4 shrink-0" 
                aria-hidden="true"

                />
            </div>
        </div>
    );
}