import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@workspace/ui/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-sm border border-input px-2.5 py-1",
        "text-base md:text-sm font-sans",
        "outline-none transition-all duration-150",
        "placeholder:text-muted-foreground",

        "focus-visible:border-primary",
        "focus-visible:ring-1",
        "focus-visible:ring-primary/20",

        "disabled:pointer-events-none",
        "disabled:cursor-not-allowed",
        "disabled:bg-input/50",
        "disabled:opacity-50",

        "aria-invalid:border-destructive",
        "aria-invalid:ring-1",
        "aria-invalid:ring-destructive/20",

        className
      )}
      {...props}
    />
  )
}

export { Input }
