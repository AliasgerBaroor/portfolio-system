import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { Frame, type FrameRadius } from "./frame";

import { cn } from "@workspace/ui/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  containerClassName?: string;
  radius?: FrameRadius;
  inputSize?: "sm" | "md" | "lg";
}

function Input({
  className,
  containerClassName,
  startContent,
  endContent,
  type,
  inputSize = "lg",
  radius = "pill",
  ...props
}: InputProps) {
  
  const inputSizeStyles = {
    sm: "h-9",
    md: "h-10",
    lg: "h-14",
  } as const;

  return (
    <Frame
      strength="low"
      radius={radius}
      className={cn(
        `flex w-full items-center overflow-hidden`,
        inputSizeStyles[inputSize],
        "bg-white",
        containerClassName
      )}
    >
      {startContent && (
        <div className="flex shrink-0 items-center pl-5">
          {startContent}
        </div>
      )}

      <InputPrimitive
        type={type}
        data-slot="input"
        style={{
          caretColor: "var(--foreground)",
        }}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent px-5 py-3",
          "font-sans text-base text-foreground",
          "caret-[var(--foreground)]",
          "outline-none",
          "placeholder:text-foreground",

          // Autofill
          "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_white]",
          "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)]",

          // Disabled
          "disabled:pointer-events-none",
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",

          // Invalid
          "aria-invalid:text-destructive",

          className
        )}
        {...props}
      />

      {endContent && (
        <div className="flex shrink-0 items-center p-1 pb-2">
          {endContent}
        </div>
      )}
    </Frame>
  );
}

export { Input };