    import * as React from "react";
    import { cn } from "@workspace/ui/lib/utils";

    type TypographyVariant =
        | "display-xl"
        | "display-lg"
        | "heading-xl"
        | "heading-lg"
        | "heading-md"
        | "heading-sm"
        | "heading-xs"
        | "heading-2xs"
        | "body-xl"
        | "body-lg"
        | "body-md"
        | "body-sm"
        | "body-xs"
        | "label"
        | "caption"
        | "overline"
        | "field-value"
        | "field-label"
        | "inline-text"
        | "inline-text-emphasis";

    const defaultElement: Record<
        TypographyVariant,
        React.ElementType
    > = {
        "display-xl": "h1",
        "display-lg": "h1",

        "heading-xl": "h1",
        "heading-lg": "h2",
        "heading-md": "h3",
        "heading-sm": "h4",
        "heading-xs": "h5",
        "heading-2xs": "h6",

        "body-xl": "p",
        "body-lg": "p",
        "body-md": "p",
        "body-sm": "p",
        "body-xs": "p",

        label: "label",
        caption: "span",
        overline: "span",

        "field-value": "span",
        "field-label": "label",
        
        "inline-text": "span",
        "inline-text-emphasis": "span",
    };

    const variants: Record<
        TypographyVariant,
        string
    > = {
        "display-xl":
            "font-heading text-6xl font-bold tracking-tight",

        "display-lg":
            "font-heading text-5xl font-bold tracking-tight",

        "heading-xl":
            "font-heading text-4xl font-bold",

        "heading-lg":
            "font-heading text-3xl font-semibold",

        "heading-md":
            "font-heading text-2xl font-semibold",

        "heading-sm":
            "font-heading text-xl font-semibold",

        "heading-xs":
            "font-heading text-lg font-semibold",

        "heading-2xs":
            "font-heading text-md font-semibold",

        "body-xl":
            "font-sans text-lg",

        "body-lg":
            "font-sans text-base",

        "body-md":
            "font-sans text-sm",

        "body-sm":
            "font-sans text-xs",

        "body-xs":
            "font-sans text-2xs",

        label:
            "font-sans text-sm font-medium",

        caption:
            "font-sans text-xs text-primary-foreground",

        overline:
            "font-sans text-xs uppercase tracking-widest text-muted-foreground",

        "field-value":
            "font-heading text-[10px] font-medium leading-[12px] tracking-[0.2px]",

        "field-label":
            "font-sans text-[12px] font-semibold leading-[16px]",
        
        "inline-text":
            "font-heading text-[10px] font-normal leading-[12px] tracking-[0.2px]",

        "inline-text-emphasis":
            "font-heading text-[10px] font-medium leading-[12px] tracking-[0.2px]",
    };

    type TypographyOwnProps<
        C extends React.ElementType
    > = {
        as?: C;
        variant?: TypographyVariant;
        className?: string;
        children?: React.ReactNode;
    };

    type TypographyProps<
        C extends React.ElementType
    > = TypographyOwnProps<C> &
        Omit<
            React.ComponentPropsWithRef<C>,
            keyof TypographyOwnProps<C>
        >;

    export function Typography<
        C extends React.ElementType = "p"
    >({
        variant = "body-lg",
        as,
        className,
        children,
        ...props
    }: TypographyProps<C>) {
        const Component =
            as ?? defaultElement[variant];

        return (
            <Component
                className={cn(
                    variants[variant],
                    className
                )}
                {...props}
            >
                {children}
            </Component>
        );
    }