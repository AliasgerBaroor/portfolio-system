"use client"; 
import { icons } from "@workspace/ui/icons/registry";
import type { ActionButtonProps } from "./floating-navigation.types";

export default function ActionButton({
    item,
}: ActionButtonProps) {
    const Icon = icons[item.icon];

    return (
        <button
            className="floating-navigation-action"
            onClick={item.onClick}
        >
            <Icon width={20} height={20} />
        </button>
    );
}