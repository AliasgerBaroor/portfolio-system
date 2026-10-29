import type { ComponentType, SVGProps } from "react";

import { Frame } from "@workspace/ui/components/frame";
import { Typography } from "@workspace/ui/components/typography/typography";

type ConnectCardProps = {
    title: string;
    color: string;
    href: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    iconColor?: string;
    iconMultiColor?: boolean;
};

export function ConnectCard({
    title,
    color,
    href,
    icon: Icon,
    iconColor = "#221E15",
    iconMultiColor = false,
}: ConnectCardProps) {
    const isExternal = href.startsWith("https://");

    return (
        <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            aria-label={title === "Mail" ? "Email me" : `Visit my ${title} profile`}
            className="block rounded"
        >
            <Frame
                strength="low"
                radius="xs"
                className="flex items-center gap-2 p-2 transition-opacity hover:opacity-80"
                style={{ backgroundColor: color }}
            >
                <Frame
                    strength="low"
                    radius="xs"
                    className="flex shrink-0 items-center justify-center bg-white p-1.5"
                >
                    <Icon
                        aria-hidden="true"
                        {...(!iconMultiColor && {
                            style: { color: iconColor },
                        })}
                    />
                </Frame>

                <Typography variant="body-md" className="font-[700]">
                    {title}
                </Typography>
            </Frame>
        </a>
    );
}