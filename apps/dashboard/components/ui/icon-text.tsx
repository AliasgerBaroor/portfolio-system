import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";
import { Typography } from "@workspace/ui/components/typography/typography";

export interface IconTextProps {
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    iconClassName?: string;
    isUrl?: boolean;
}

export function IconText({
    icon,
    children,
    className,
    iconClassName,
    isUrl = false,
}: IconTextProps) {
    const text =
        typeof children === "string"
            ? children
            : null;

    const urlParts =
        isUrl && text
            ? text.match(/^(.*\/)([^/]*)$/)
            : null;

    return (
        <div
            className={cn(
                "flex w-full items-center",
                "gap-1",
                "self-stretch",
                "rounded-[4px]",
                "bg-[#F3EFE3]",
                "px-1 py-[6px] pl-2",
                className
            )}
        >
            {icon && (
                <span
                    className={cn(
                        "flex shrink-0 items-center justify-center",
                        iconClassName
                    )}
                    aria-hidden="true"
                >
                    {icon}
                </span>
            )}

            {urlParts ? (
                <Typography
                    as="span"
                    variant="inline-text"
                    className="min-w-0"
                >
                    {urlParts[1]}

                    <Typography
                        as="span"
                        variant="inline-text-emphasis"
                    >
                        {urlParts[2]}
                    </Typography>
                </Typography>
            ) : (
                <Typography
                    as="span"
                    variant="inline-text"
                    className="min-w-0"
                >
                    {children}
                </Typography>
            )}
        </div>
    );
}