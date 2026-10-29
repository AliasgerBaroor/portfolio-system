"use client";

import "./floating-navigation.css";
import { useState } from "react";
import { CrossIcon } from "@workspace/ui/icons/cross";
import type { FloatingNavigationProps } from "./floating-navigation.types";
import { Button } from "@workspace/ui/components/button";

export default function FloatingNavigation({
    children,
}: FloatingNavigationProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="floating-navigation-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Navigation */}
            <div
                className={`floating-navigation ${isOpen ? "is-open" : ""
                    }`}
            >
                {children}

                {/* Mobile close button */}
                <Button
                    size="lg"
                    radius="md"
                    className="bg-white"
                    frameClassName="floating-navigation-close md:hidden"
                    onClick={() => setIsOpen(false)}
                >
                    <CrossIcon />
                </Button>
            </div>

            {/* Mobile Menu button */}
            {!isOpen && (
                <div className="floating-navigation-trigger">
                    <Button
                        variant="default"
                        onClick={() => setIsOpen(true)}
                    >
                        Menu
                    </Button>
                </div>
            )}
        </>
    );
}