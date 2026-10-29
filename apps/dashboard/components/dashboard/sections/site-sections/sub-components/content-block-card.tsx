import { Card } from "@workspace/ui/components/card";
import { Typography } from "@workspace/ui/components/typography/typography";

import type { ContentBlock } from "../types";

interface ContentBlockCardProps {
    block: ContentBlock;
}

export default function ContentBlockCard({
    block,
}: ContentBlockCardProps) {
    const content = block.content as {
        heading?: string;
        description?: string;
        items?: string[];
    };

    return (
        <Card className="p-4 space-y-3">
            {content.heading && (
                <Typography variant="heading-xs">
                    {content.heading}
                </Typography>
            )}

            {content.description && (
                <Typography
                    variant="body-sm"
                    className="text-secondary-foreground"
                >
                    {content.description}
                </Typography>
            )}

            {content.items && (
                <div className="space-y-1">
                    {content.items.map((item, index) => (
                        <Typography
                            key={index}
                            variant="body-sm"
                            className="text-secondary-foreground"
                        >
                            — {item}
                        </Typography>
                    ))}
                </div>
            )}
        </Card>
    );
}