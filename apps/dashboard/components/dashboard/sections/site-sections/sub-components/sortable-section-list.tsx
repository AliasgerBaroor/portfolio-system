import { Section } from "../types";
import SectionCard from "./section-card";

interface Props {
    sections: Section[];
}

export default function SortableSectionList({
    sections,
}: Props) {
    return (
        <div className="space-y-4">
            {sections.map((section) => (
                <SectionCard
                    key={section.id}
                    section={section}
                />
            ))}
        </div>
    );
}