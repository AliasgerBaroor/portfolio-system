"use client";

import { cn } from "@workspace/ui/lib/utils";
import { getSectionColor } from "./section-colors";
import type { CmsSection } from "./types";
import { UploadIcon } from "@/icons/upload";

interface SectionListProps {
    sections: CmsSection[];
    activeSectionId: string | null;
    onSectionChange: (sectionId: string) => void;
    onEditSection: (sectionId: string) => void;
}

export function SectionList({
    sections,
    activeSectionId,
    onSectionChange,
    onEditSection,
}: SectionListProps) {
    const visibleSections = sections.filter(
        (section) => !section.isSystem,
    );

    if (visibleSections.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-start gap-3">
            {visibleSections.map((section, index) => {
                const isActive = activeSectionId === section.id;

                return (
                    <div
                        key={section.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isActive}
                        onClick={() => onSectionChange(section.id)}
                        onKeyDown={(event) => {
                            if (
                                event.target === event.currentTarget &&
                                (event.key === "Enter" || event.key === " ")
                            ) {
                                event.preventDefault();
                                onSectionChange(section.id);
                            }
                        }}
                        className={cn(
                            "flex min-w-0 cursor-pointer items-center gap-2",
                            "rounded border border-[#221E15] p-2",
                            "shadow-[0_2px_0_0_#221E15]",
                            "transition-[filter,box-shadow] hover:brightness-95",
                            isActive && "shadow-[0_4px_0_0_#221E15]",
                        )}
                        style={{
                            backgroundColor: getSectionColor(index),
                        }}
                    >
                        <button
                            type="button"
                            aria-label={`Edit ${section.title}`}
                            onClick={(event) => {
                                event.stopPropagation();
                                onEditSection(section.id);
                            }}
                            className="!flex !h-5 !w-5 !min-h-0 !min-w-0 !shrink-0 !items-center !justify-center !rounded-[4px] !border !border-[#221E15] !bg-white !p-0 !shadow-[0_2px_0_0_#221E15]"
                        >
                            <UploadIcon className="!h-3 !w-3" />
                        </button>

                        <span className="min-w-0 flex-1 truncate text-left font-[Switzer] text-sm font-bold leading-5 text-[#221E15]">
                            {section.title}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}