import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Typography } from "@workspace/ui/components/typography";

interface EmptyStateProps
    extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}

export function EmptyState({
    title,
    description,
    icon,
    action,
    className,
    ...props
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center",
                className
            )}
            {...props}
        >
            {icon && <div className="mb-4">{icon}</div>}

            <Typography variant="heading-xs">
                {title}
            </Typography>

            {description && (
                <Typography
                    variant="body-sm"
                    className="mt-1 max-w-sm text-muted-foreground"
                >
                    {description}
                </Typography>
            )}

            {action && (
                <div className="mt-6">
                    {action}
                </div>
            )}
        </div>
    );
}