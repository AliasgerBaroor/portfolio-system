import { IndustryTagChip } from "@workspace/ui/components/industry-tag";
import { Typography } from "@workspace/ui/components/typography/typography";

interface ProjectTagListProps {
    title?: string;
    tags: string[];
    onTagClick?: (tag: string) => void;
}

export function ProjectTagList({
    title,
    tags,
    onTagClick,
}: ProjectTagListProps) {
    if (tags.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            {title && (
                <Typography
                    variant="body-md"
                    className="text-secondary-foreground font-semibold uppercase"
                >
                    {title}
                </Typography>
            )}

            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <IndustryTagChip
                        key={tag}
                        name={tag}
                        onClick={() => onTagClick?.(tag)}
                    />
                ))}
            </div>
        </div>
    );
}