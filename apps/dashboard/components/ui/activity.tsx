import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";
import { Typography } from "@workspace/ui/components/typography/typography";

export interface ActivityItem {
    icon: React.ReactNode;
    value: React.ReactNode;
    description: React.ReactNode;
}

export interface ActivityProps {
    items: ActivityItem[];
    label?: React.ReactNode;
    className?: string;
}

export function Activity({
    items,
    label = "Activity",
    className,
}: ActivityProps) {
    return (
        <div
            className={cn(
                "flex w-full flex-col",
                "items-start",
                "gap-4",
                "self-stretch",
                "rounded-[12px]",
                "border-2 border-[#221E15]",
                "bg-white",
                "p-4",
                "shadow-[0_4px_0_0_#221E15]",
                className
            )}
        >
            {/* Activity label */}
            <Typography
                variant="field-label"
                className="uppercase text-[#221E15]"
            >
                {label}
            </Typography>

            {/* Activity items */}
            <div className="flex w-full flex-col gap-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex items-center",
                            "gap-2",
                            "w-full"
                        )}
                    >
                        {/* Icon */}
                        <span
                            className={cn(
                                "flex shrink-0",
                                "h-5 w-5",
                                "items-center justify-center"
                            )}
                            aria-hidden="true"
                        >
                            {item.icon}
                        </span>

                        {/* Text */}
                        <div className="flex min-w-0 items-center gap-1">
                            <Typography
                                as="span"
                                variant="field-label"
                                className="shrink-0 text-[#221E15]"
                            >
                                {item.value}
                            </Typography>

                            <Typography
                                as="span"
                                variant="body-sm"
                                className="text-[#434134]"
                            >
                                {item.description}
                            </Typography>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}