import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";
import { Frame, type FrameRadius } from "./frame";

type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link"
  | "active"
  | "navigation";

type FrameStrength = "low" | "medium" | "high";

const frameVariants: Record<
  ButtonVariant,
  FrameStrength | null
> = {
  default: "medium",
  active: "medium",
  secondary: "low",
  outline: "low",
  ghost: null,
  destructive: null,
  link: null,
  navigation: null,
};

const buttonVariants = cva(
  [
    "group/button",
    "inline-flex shrink-0",
    "items-center justify-center",
    "whitespace-nowrap",
    "select-none",
    "cursor-pointer",
    "font-heading",
    "font-medium",
    "outline-none",
    "transition-all",

    // Icon
    "[&_svg]:shrink-0",

    // Interaction
    "active:translate-y-[2px]",
    "focus-visible:ring-3",
    "focus-visible:ring-ring/50",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary / default Figma button
        default: [
          "rounded-[100px]",
          "border-2",
          "border-[#221E15]",
          "bg-[#FFB801]",
          "text-[#221E15]",
          "shadow-[0_4px_0_0_#221E15]",
        ].join(" "),

        // White low-strength button
        secondary: [
          "rounded-[100px]",
          "border",
          "border-[#221E15]",
          "bg-white",
          "text-[#221E15]",
          "shadow-[0_2px_0_0_#221E15]",

          "disabled:bg-muted",
          "disabled:text-muted-foreground",
        ].join(" "),

        // White outlined button
        outline: [
          "rounded-[100px]",
          "border",
          "border-[#221E15]",
          "bg-white",
          "text-[#221E15]",
          "shadow-[0_2px_0_0_#221E15]",
          "data-[square=true]:!rounded-sm",
        ].join(" "),

        ghost: [
          "rounded-[100px]",
          "border-transparent",
          "bg-transparent",
          "shadow-none",
          "text-foreground",
          "hover:bg-muted",
        ].join(" "),

        destructive: [
          "rounded-[100px]",
          "border-2",
          "border-[#221E15]",
          "bg-destructive",
          "text-white",
          "shadow-[0_4px_0_0_#221E15]",
        ].join(" "),

        link: [
          "rounded-none",
          "border-transparent",
          "bg-transparent",
          "shadow-none",
          "text-primary",
          "underline-offset-4",
          "hover:underline",
        ].join(" "),

        active: [
          "rounded-pill",
          "border-2",
          "border-[#221E15]",
          "bg-primary",
          "text-primary-foreground",
          "shadow-[0_4px_0_0_var(--ink)]",
        ].join(" "),

        navigation: [
          "rounded-pill",
          "border-0",
          "bg-transparent",
          "text-foreground",
          "shadow-none",
        ].join(" "),
      },

      size: {
        xs: [
          "h-8",
          "gap-1.5",
          "px-2",
          "text-sm",
          "leading-5",
          "[&_svg]:size-4",
        ].join(" "),

        sm: [
          "h-10",
          "gap-1.5",
          "px-3",
          "text-base",
          "leading-6",
          "[&_svg]:size-4",
        ].join(" "),

        // Exact Figma button:
        //
        // padding: 6px 12px
        // gap: 8px
        // Delight 12px / 500 / 16px / 0.24px
        compact: [
          "h-auto",
          "gap-2",
          "px-3",
          "py-1.5",
          "text-[12px]",
          "leading-4",
          "tracking-[0.24px]",
          "[&_svg]:size-4",
        ].join(" "),

        default: [
          "h-12",
          "gap-2",
          "py-2",
          "pl-3.5",
          "pr-5",
          "text-[20px]",
          "leading-7",
          "tracking-[0.4px]",
          "[&_svg]:size-6",
        ].join(" "),

        lg: [
          "h-14",
          "gap-2",
          "py-2.5",
          "pl-4",
          "pr-4",
          "text-xl",
          "leading-7",
          "[&_svg]:size-6",
        ].join(" "),

        icon: [
          "size-12",
          "p-0",
          "[&_svg]:size-6",
        ].join(" "),

        "icon-sm": [
          "size-10",
          "p-0",
          "[&_svg]:size-5",
        ].join(" "),

        "icon-lg": [
          "size-14",
          "p-0",
          "[&_svg]:size-7",
        ].join(" "),
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends ButtonPrimitive.Props,
  VariantProps<typeof buttonVariants> {
  horizontalPadding?: number;
  verticalPadding?: number;
  radius?: FrameRadius;
  frameClassName?: string;
  frameStrength?: FrameStrength | null;
  square?: boolean;
}

function Button({
  className,
  variant = "default",
  size = "default",
  horizontalPadding,
  verticalPadding,
  radius = "pill",
  frameClassName,
  frameStrength,
  square = false,
  children,
  style,
  ...props
}: ButtonProps) {
  const resolvedVariant = variant ?? "default";


  const resolvedFrameStrength =
    frameStrength !== undefined
      ? frameStrength
      : frameVariants[resolvedVariant];

  const hasFrame = resolvedFrameStrength != null;

  
  const button = (
    <ButtonPrimitive
      data-slot="button"
      data-square={square ? "true" : undefined}
      className={cn(
        buttonVariants({
          variant: resolvedVariant,
          size,
        }),
        hasFrame && [
          "border-0",
          "shadow-none",
        ],
        className
      )}
      style={{
        ...(horizontalPadding !== undefined
          ? {
            paddingLeft: `${horizontalPadding}px`,
            paddingRight: `${horizontalPadding}px`,
          }
          : {}),
        ...(verticalPadding !== undefined
          ? {
            paddingTop: `${verticalPadding}px`,
            paddingBottom: `${verticalPadding}px`,
          }
          : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </ButtonPrimitive>
  );

  if (resolvedFrameStrength) {
    return (
      <Frame
        strength={resolvedFrameStrength}
        radius={radius}
        visual={false}
        className={cn("w-fit", frameClassName)}
      >
        {button}
      </Frame>
    );
  }

  return button;
}

export { Button, buttonVariants };