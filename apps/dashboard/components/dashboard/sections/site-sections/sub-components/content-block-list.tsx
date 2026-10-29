import type { ContentBlock } from "../types";
import ContentBlockCard from "./content-block-card";

interface ContentBlockListProps {
    blocks: ContentBlock[];
}

export default function ContentBlockList({
    blocks,
}: ContentBlockListProps) {
    if (blocks.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            {blocks.map((block) => (
                <ContentBlockCard
                    key={block.id}
                    block={block}
                />
            ))}
        </div>
    );
}