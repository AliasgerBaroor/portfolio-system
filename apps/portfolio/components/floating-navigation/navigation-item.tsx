"use client"; 
import { icons } from "@workspace/ui/icons/registry";
import type { NavigationItemProps } from "./floating-navigation.types";
import { Typography } from "@workspace/ui/components/typography";
import { Button } from "@workspace/ui/components/button";

export default function NavigationItem({
    item,
    active,
    onClick,
}: NavigationItemProps) {
    const Icon = item.icon ? icons[item.icon] : null;

    const color = active ? {
        text: "text-foreground",
        bg: "bg-primary"
    } : {
        text: "text-accent-foreground",
        bg: "bg-white"
    };

    return (
        <Button
            variant={active ? "active" : "navigation"}
            onClick={onClick}
        >
            {Icon && (
                <Icon
                    width={item.size}
                    height={item.size}
                />
            )}

            {item.label && (
                <Typography variant="body-xl">
                    {item.label}
                </Typography>
            )}
        </Button>
    );
}