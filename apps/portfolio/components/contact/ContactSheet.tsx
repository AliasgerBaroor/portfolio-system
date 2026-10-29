"use client";

import { PortfolioBottomSheet } from "@/components/bottom-sheet/portfolio-bottom-sheet";
import { useContactOpenDialogStore } from "@/stores/contact-dialog-store";
import { ContactContent } from "./contact-content";

export default function ContactSheet() {
    const isOpen = useContactOpenDialogStore(
        (state) => state.isOpen
    );

    const close = useContactOpenDialogStore(
        (state) => state.close
    );

    return (
        <PortfolioBottomSheet
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    close();
                }
            }}
            className="bg-brand-color-3 hover:bg-brand-color-3/85"
        >
            <ContactContent />
        </PortfolioBottomSheet>
    );
}