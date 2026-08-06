"use client"; 
import "./floating-navigation.css";
import type { FloatingNavigationProps } from "./floating-navigation.types";

export default function FloatingNavigation({
    children,
}: FloatingNavigationProps) {
    return (
        <div className="floating-navigation">
            {children}
        </div>
    );
}