import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent",
        "px-2.5 py-2 text-base md:text-sm",
        "outline-none transition-all duration-150",
        "placeholder:text-muted-foreground",

        // Focus
        "focus-visible:outline-none",
        "focus-visible:border-primary",
        "focus-visible:ring-1",
        "focus-visible:ring-primary/20",

        // Disabled
        "disabled:cursor-not-allowed",
        "disabled:bg-input/50",
        "disabled:opacity-50",

        // Invalid
        "aria-invalid:border-destructive",
        "aria-invalid:ring-1",
        "aria-invalid:ring-destructive/20",

        className
      )}
      {...props}
    />
  )
}

export { Textarea }
