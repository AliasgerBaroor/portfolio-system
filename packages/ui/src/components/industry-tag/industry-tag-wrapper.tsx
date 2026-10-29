import { Typography } from "../typography/typography";
import { IndustryTagChip } from "./industry-tag-chip";
import { IndustryTag } from "./industry-tag-types";


interface IndustryTagListProps {
    title?: string,
    tags: IndustryTag[];
    onTagClick?: (tag: IndustryTag) => void;
}

export function IndustryTagList({
    title,
    tags,
    onTagClick,
}: IndustryTagListProps) {
    return (
        <div className="flex flex-col gap-2">
            <Typography
                variant="body-md"
                className="text-secondary-foreground font-semibold uppercase"
            >
                {title}
            </Typography>

            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <IndustryTagChip
                        key={tag.label}
                        name={tag.name}
                        onClick={() =>
                            onTagClick?.(tag)
                        }
                    />
                ))}
            </div>
        </div>
    );
}
