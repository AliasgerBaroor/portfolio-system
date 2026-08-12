import { Frame } from "@workspace/ui/components/frame";
import { Typography } from "@workspace/ui/components/typography";

interface IndustryTagChipProps {
    name: string;
}

export function IndustryTagChip({
    name,
}: IndustryTagChipProps) {
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