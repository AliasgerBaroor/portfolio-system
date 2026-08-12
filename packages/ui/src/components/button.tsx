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

const frameVariants: Record<ButtonVariant, FrameStrength | null> = {
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
    "font-medium",
    "outline-none",
    "transition-all",

    // Figma
    "rounded-pill",
    "bg-primary",
    "text-primary-foreground",
    "shadow-[0_4px_0_0_var(--ink)]",

    // Icon
    "[&_svg]:shrink-0",

    // Interaction
    "active:translate-y-[2px]",
    "focus-visible:ring-3 focus-visible:ring-ring/50",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",

        outline: [
          "bg-white",
          "text-foreground",
        ].join(" "),

        secondary: [
          "bg-white",
          "text-ink",
          "disabled:bg-muted",
          "disabled:text-muted-foreground",
        ].join(" "),

        ghost: [
          "border-transparent",
          "bg-transparent",
          "shadow-none",
          "text-foreground",
          "hover:bg-muted",
        ].join(" "),

        destructive: [
          "bg-destructive",
          "text-white",
        ].join(" "),

        link: [
          "border-transparent",
          "bg-transparent",
          "shadow-none",
          "text-primary",
          "underline-offset-4",
          "hover:underline",
        ].join(" "),

        active: [
          "rounded-pill",
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
          "pr-6",
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
  radius?: FrameRadius;
  frameClassName?: string;
}

function Button({
  className,
  variant = "default",
  size = "default",
  horizontalPadding,
  radius = "pill",
  frameClassName,
  children,
  style,
  ...props
}: ButtonProps) {
  const resolvedVariant = variant ?? "default";

  const button = (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({
          variant: resolvedVariant,
          size,
        }),
        className
      )}
      style={{
        ...(horizontalPadding !== undefined
          ? {
            paddingLeft: `${horizontalPadding}px`,
            paddingRight: `${horizontalPadding}px`,
          }
          : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </ButtonPrimitive>
  );

  const frameStrength = frameVariants[resolvedVariant];

  if (frameStrength) {
    return (
      <Frame
        strength={frameStrength}
        radius={radius}
        className={frameClassName}
      >
        {button}
      </Frame>
    );
  }

  return button;
}

export { Button, buttonVariants };