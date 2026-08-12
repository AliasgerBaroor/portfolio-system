import { Typography } from "../typography";
import { IndustryTagChip } from "./industry-tag-chip";
import { IndustryTag } from "./industry-tag-types";


interface IndustryTagListProps {
    tags: IndustryTag[];
}

export function IndustryTagList({
    tags,
}: IndustryTagListProps) {
    return (
       <div className="flex flex-col gap-2">
            <Typography variant="body-md" className="text-secondary-foreground font-semibold uppercase">Industries</Typography>
            <div className="flex flex-wrap gap-2" >
                {
                    tags.map((tag) => (
                        <IndustryTagChip
                            key={tag.id}
                            name={tag.name}
                        />
                    ))
                }
            </div>
       </div>
    );
}
