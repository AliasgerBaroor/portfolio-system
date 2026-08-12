import { ProjectTagChip } from "./project-tag-chip";

interface ProjectTag {
    id: string;
    name: string;
}

interface ProjectTagListProps {
    tags: ProjectTag[];
}

export function ProjectTagList({
    tags,
}: ProjectTagListProps) {
    return (
        <div className= "flex flex-wrap gap-2" >
        {
            tags.map((tag) => (
                <ProjectTagChip
                    key= { tag.id }
                    name = { tag.name }
                />
            ))
        }
        </div>
    );
}
