import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";

interface FieldCardProps
    extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
}

export function FieldCard({
    label,
    children,
    className,
    ...props
}: FieldCardProps) {
    return (
        <div
            className={cn(
                "rounded-xs border border-border bg-muted/20 p-4 space-y-3",
                className
            )}
        >
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {label}
            </p>

            {children}
        </div>
    );
}