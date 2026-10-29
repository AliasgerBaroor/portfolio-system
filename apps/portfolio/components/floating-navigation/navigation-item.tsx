"use client";

import { icons } from "@workspace/ui/icons/registry";
import type { NavigationItemProps } from "./floating-navigation.types";
import { Typography } from "@workspace/ui/components/typography/typography";
import { Button } from "@workspace/ui/components/button";

export default function NavigationItem({
    item,
    active,
    onClick,
    mobileLabel = false,
    disabled = false,
}: NavigationItemProps) {
    const Icon = item.icon ? icons[item.icon] : null;

    return (
        <Button
            variant={active ? "active" : "navigation"}
            onClick={onClick}
            className="floating-navigation-item"
            disabled={disabled}
        >
            {Icon && (
                <Icon
                    width={item.size}
                    height={item.size}
                />
            )}

            {item.label && (
                <Typography
                    variant="body-xl"
                    className={
                        mobileLabel
                            ? "floating-navigation-mobile-label"
                            : undefined
                    }
                >
                    {item.label}
                </Typography>
            )}
        </Button>
    );
}