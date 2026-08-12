import type {
    ComponentPropsWithoutRef,
    CSSProperties,
    ElementType,
    ReactNode,
} from "react";
import { cn } from "@workspace/ui/lib/utils";

export type FrameStrength = "low" | "medium" | "high";
export type FrameRadius = "none" | "sm" | "md" | "lg" | "pill";

export type FrameRadiusRemove =
    | "all"
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "horizontal"
    | "vertical"
    | "top-left"
    | "top-right"
    | "bottom-right"
    | "bottom-left"
    | Array<
        | "top-left"
        | "top-right"
        | "bottom-right"
        | "bottom-left"
    >;
type FrameProps = {
    as?: ElementType;
    children: ReactNode;
    strength?: FrameStrength;
    shift?: number;
    radius?: FrameRadius;
    radiusRemove?: FrameRadiusRemove;
    className?: string;
    style?: CSSProperties;
} & Omit<
    ComponentPropsWithoutRef<ElementType>,
    "children" | "className" | "style"
>;

const radiusValues = {
    none: "0",
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    pill: "var(--radius-pill)",
} as const;

export function Frame({
    as,
    children,
    strength = "medium",
    shift = 0,
    radius = "pill",
    radiusRemove,
    className = "",
    style,
    ...props
}: FrameProps) {
    const Component = as ?? "div";

    const baseRadius = radiusValues[radius];

    const remove = {
        topLeft:
            radiusRemove === "all" ||
            radiusRemove === "top" ||
            radiusRemove === "left" ||
            radiusRemove === "horizontal" ||
            (Array.isArray(radiusRemove) &&
                radiusRemove.includes("top-left")),

        topRight:
            radiusRemove === "all" ||
            radiusRemove === "top" ||
            radiusRemove === "right" ||
            radiusRemove === "horizontal" ||
            (Array.isArray(radiusRemove) &&
                radiusRemove.includes("top-right")),

        bottomRight:
            radiusRemove === "all" ||
            radiusRemove === "bottom" ||
            radiusRemove === "right" ||
            radiusRemove === "vertical" ||
            (Array.isArray(radiusRemove) &&
                radiusRemove.includes("bottom-right")),

        bottomLeft:
            radiusRemove === "all" ||
            radiusRemove === "bottom" ||
            radiusRemove === "left" ||
            radiusRemove === "vertical" ||
            (Array.isArray(radiusRemove) &&
                radiusRemove.includes("bottom-left")),
    };

    const strengthStyles = {
        low: {
            border: "1px solid var(--foreground)",
            boxShadow: `${shift}px 2px 0 0 var(--foreground)`,
        },
        medium: {
            border: "2px solid var(--foreground)",
            boxShadow: `${shift}px 4px 0 0 var(--foreground)`,
        },
        high: {
            border: "3px solid var(--foreground)",
            boxShadow: `${shift}px 6px 0 0 var(--foreground)`,
        },
    } as const;

    return (
        <Component
            {...props}
            className={cn(
                "bg-white overflow-hidden",
                className
            )}
            style={{
                borderTopLeftRadius: remove.topLeft ? 0 : baseRadius,
                borderTopRightRadius: remove.topRight ? 0 : baseRadius,
                borderBottomRightRadius: remove.bottomRight ? 0 : baseRadius,
                borderBottomLeftRadius: remove.bottomLeft ? 0 : baseRadius,

                ...strengthStyles[strength],
                ...style,
            }}
        >
            {children}
        </Component>
    );
}