"use client"; 
import ActionButton from "./action-button";
import type { ActionsProps } from "./floating-navigation.types";

export default function Actions({
    items,
}: ActionsProps) {
    return (
        <div className="floating-navigation-actions">
            {items.map((item) => (
                <ActionButton
                    key={item.id}
                    item={item}
                />
            ))}
        </div>
    );
}