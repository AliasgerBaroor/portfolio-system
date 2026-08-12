import * as React from "react";
import { cn } from "@workspace/ui/lib/utils";

interface OptionCardProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    selected?: boolean;
}

function Root({
  selected = false,
  className,
  children,
  ...props
}: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "w-full border p-4 text-left transition-all duration-150",
        "focus-visible:outline-none",
        "hover:border-border/60",

        selected
          ? "border-border bg-primary/5"
          : "border-border",

        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Header({
    children,
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex items-center gap-2",
                className
            )}
        >
            {children}
        </div>
    );
}

function Description({
    children,
    className,
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn(
                "mt-2 text-sm text-muted-foreground",
                className
            )}
        >
            {children}
        </p>
    );
}

export const OptionCard = Object.assign(Root, {
    Header,
    Description,
});