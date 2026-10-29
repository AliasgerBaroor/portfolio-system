import { Card } from "@workspace/ui/components/card";
import { Typography } from "@workspace/ui/components/typography/typography";
import { ChevronDown } from "lucide-react";

import type { Section } from "../types";

interface SectionCardProps {
    section: Section;
    isOpen: boolean;
    onToggle: () => void;
}

export default function SectionCard({
    section,
    isOpen,
    onToggle,
}: SectionCardProps) {
    return (
        <Card
            className="overflow-hidden"
        >
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between p-5 text-left"
            >
                <div>
                    <Typography variant="heading-xs">
                        {section.title}
                    </Typography>

                    <Typography
                        variant="body-sm"
                        className="text-secondary-foreground"
                    >
                        {section.type}
                    </Typography>
                </div>

                <div className="flex items-center gap-3">
                    <Typography
                        variant="body-sm"
                        className="text-secondary-foreground"
                    >
                        {section.blocks.length}{" "}
                        {section.blocks.length === 1
                            ? "block"
                            : "blocks"}
                    </Typography>

                    <ChevronDown
                        className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""
                            }`}
                    />
                </div>
            </button>
        </Card>
    );
}