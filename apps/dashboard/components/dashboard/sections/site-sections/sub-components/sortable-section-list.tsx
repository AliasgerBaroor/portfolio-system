import type { Section } from "../types";
import SectionCard from "./section-card";
import SectionContentEditor from "./section-content-editor";

interface Props {
    sections: Section[];
    openSectionId: string | null;
    onToggle: (sectionId: string) => void;
}

export default function SortableSectionList({
    sections,
    openSectionId,
    onToggle,
}: Props) {
    return (
        <div className="space-y-4">
            {sections.map((section) => {
                const isOpen = openSectionId === section.id;

                return (
                    <div key={section.id} className="space-y-2">
                        <SectionCard
                            section={section}
                            isOpen={isOpen}
                            onToggle={() => onToggle(section.id)}
                        />

                        {isOpen && (
                            <SectionContentEditor
                                section={section}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}