import { cn } from "@workspace/ui/lib/utils";

type PosterTextStyle = {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;

    shadow?: string;
    shadowX?: number;
    shadowY?: number;

    fontFamily?: string;
    fontSize?: number | string;
    fontWeight?: number;
    lineHeight?: number | string;
    letterSpacing?: number | string;
};

interface PosterTextProps {
    text?: string;
    lines?: string[];
    className?: string;
    styleConfig?: PosterTextStyle;
}

export function PosterText({
    text,
    lines,
    className,
    styleConfig = {},
}: PosterTextProps) {
    const {
        fill = "#FFB801",
        stroke = "#221E15",
        strokeWidth = 1,

        shadow = "#221E15",
        shadowX = -4,
        shadowY = 4,

        fontFamily = "var(--font-heading)",
        fontSize = 56,
        fontWeight = 800,
        lineHeight = 50,
        letterSpacing = -1.12,
    } = styleConfig;

    const content = lines ?? (text ? [text] : []);

    return (
        <div
            className={cn(
                "max-w-full text-center",
                className
            )}
            style={{
                color: fill,
                fontFamily,
                fontSize:
                    typeof fontSize === "number"
                        ? `${fontSize}px`
                        : fontSize,
                fontWeight,
                lineHeight:
                    typeof lineHeight === "number"
                        ? `${lineHeight}px`
                        : lineHeight,
                letterSpacing:
                    typeof letterSpacing === "number"
                        ? `${letterSpacing}px`
                        : letterSpacing,

                WebkitTextStroke: `${strokeWidth}px ${stroke}`,

                textShadow: `${shadowX}px ${shadowY}px 0 ${shadow}`,
            }}
        >
            {content.map((line, index) => (
                <div key={`${line}-${index}`}>
                    {line}
                </div>
            ))}
        </div>
    );
}