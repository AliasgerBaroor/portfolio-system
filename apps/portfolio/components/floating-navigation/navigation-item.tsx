"use client"; 
import { icons } from "@workspace/ui/icons/registry";
import type { NavigationItemProps } from "./floating-navigation.types";
import { Typography } from "@workspace/ui/components/typography";

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
        <button
            className={`group floating-navigation-item ${color.bg} hover:bg-primary cursor-pointer`} 
            onClick={onClick}
        >
            {Icon && (
                <Icon
                    width={item.size}
                    height={item.size}
                    className={`${color.text} group-hover:text-foreground`}
                />
            )}

{
                item.label && 
            <Typography
                variant="body-xl"
                className={`${color.text} group-hover:text-foreground`}
            >
                {item.label}
            </Typography>
}
        </button>
    );
}