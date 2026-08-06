"use client";

import NavigationItem from "./navigation-item";
import type { NavigationProps } from "./floating-navigation.types";
import { useNavigationStore } from "@/contexts/navigation-context";

export default function Navigation({
    items,
}: NavigationProps) {
    const { activeTab, setActiveTab } = useNavigationStore();

    return (
        <>
            <nav className="floating-navigation-menu">
                {items.category.map((item) => (
                    <NavigationItem
                        key={item.id}
                        item={item}
                        active={item.id === activeTab}
                        onClick={() => setActiveTab(item.id)}
                    />
                ))}
            </nav>

            <nav className="floating-navigation-menu">
                {items.actions.map((item) => (
                    <NavigationItem
                        key={item.id}
                        item={item}
                        active={item.id === activeTab}
                        onClick={() => setActiveTab(item.id)}
                    />
                ))}
            </nav>
        </>
    );
}