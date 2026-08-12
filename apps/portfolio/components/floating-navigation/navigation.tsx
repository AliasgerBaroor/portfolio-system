"use client";

import NavigationItem from "./navigation-item";
import type { NavigationProps } from "./floating-navigation.types";
import { useNavigationStore } from "@/stores/navigation-context";
import { Frame } from "@workspace/ui/components/frame";

export default function Navigation({
    items,
}: NavigationProps) {
    const {
        category,
        action,
        setCategory,
        setAction,
    } = useNavigationStore();

    return (
        <>
            <Frame strength="low">
                <nav className="floating-navigation-menu">
                    {items.category.map((item) => (
                        <NavigationItem
                            key={item.id}
                            item={item}
                            active={item.id === category}
                            onClick={() => setCategory(item.id)}
                        />
                    ))}
                </nav>
            </Frame>

            <Frame strength="low">
                <nav className="floating-navigation-menu">
                    {items.actions.map((item) => (
                        <NavigationItem
                            key={item.id}
                            item={item}
                            active={item.id === action}
                            onClick={() => setAction(item.id)}
                        />
                    ))}
                </nav>
            </Frame>
        </>
    );
}