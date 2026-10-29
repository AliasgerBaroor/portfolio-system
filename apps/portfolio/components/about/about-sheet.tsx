"use client";

import { useState } from "react";

import {
    PortfolioBottomSheet,
} from "@/components/bottom-sheet/portfolio-bottom-sheet";

import { AboutContent } from "@/components/about/about-content";
import { ClientsContent } from "@/components/clients/clients-content";

import { useAboutDialogStore } from "@/stores/about-dialog-store";
import { IndustryTag } from "@workspace/ui/components/industry-tag";

type View = "about" | "clients";

export default function AboutSheet() {
    const isOpen = useAboutDialogStore(
        (state) => state.isOpen
    );

    const close = useAboutDialogStore(
        (state) => state.close
    );

    const [view, setView] =
        useState<View>("about");

    const [selectedCategory, setSelectedCategory] =
        useState<IndustryTag | null>(null);

    return (
        <PortfolioBottomSheet
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    close();
                    setView("about");
                    setSelectedCategory(null);
                }
            }}
            variant={view === "clients" ? "wide" : "default"}
        >
            {view === "about" && (
                <AboutContent
                    onCategorySelect={(category) => {
                        setSelectedCategory(category);
                        setView("clients");
                    }}
                />
            )}

            {view === "clients" && (
                <ClientsContent
                    selectedCategory={selectedCategory}
                />
            )}
        </PortfolioBottomSheet>
    );
}