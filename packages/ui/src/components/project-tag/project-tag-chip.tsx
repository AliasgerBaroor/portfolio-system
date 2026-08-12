import { Frame } from "@workspace/ui/components/frame";
import { Typography } from "@workspace/ui/components/typography";

interface ProjectTagChipProps {
    name: string;
}

export function ProjectTagChip({
    name,
}: ProjectTagChipProps) {
    return (
        <Frame
            strength="low"
            radius="pill"
            className="px-3 py-1"
        >
            <Typography
                variant="body-xs"
                className="font-semibold"
            >
                {name}
            </Typography>
        </Frame>
    );
}