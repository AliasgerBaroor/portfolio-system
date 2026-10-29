import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";
import { Typography } from "@workspace/ui/components/typography/typography";

export interface DetailFieldProps {
    label: React.ReactNode;
    value: React.ReactNode;
    className?: string;
    labelClassName?: string;
    valueClassName?: string;
}

export function DetailField({
    label,
    value,
    className,
    labelClassName,
    valueClassName,
}: DetailFieldProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-start gap-1 self-stretch",
                className
            )}
        >
            <Typography
                variant="field-label"
                className={cn(
                    "text-[#221E15]",
                    labelClassName
                )}
            >
                {label}
            </Typography>

            <Typography
                variant="field-value"
                className={cn(
                    "text-[#221E15]",
                    valueClassName
                )}
            >
                {value}
            </Typography>
        </div>
    );
}