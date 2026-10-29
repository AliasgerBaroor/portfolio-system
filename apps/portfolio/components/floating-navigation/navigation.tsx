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
        <div className="floating-navigation-content">
            <Frame
                strength="low"
                className="floating-navigation-category-frame"
            >
                <nav className="floating-navigation-menu floating-navigation-categories">
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

            <Frame
                strength="low"
                className="floating-navigation-action-frame"
            >
                <nav className={"floating-navigation-menu floating-navigation-actions"}>
                    {items.actions.map((item) => (
                        <NavigationItem
                            key={item.id}
                            item={item}
                            active={item.id === action}
                            onClick={() => setAction(item.id)}
                            mobileLabel
                            disabled
                        />
                    ))}
                </nav>
            </Frame>
        </div>
    );
}