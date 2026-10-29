import { Frame } from "@workspace/ui/components/frame";
import { Typography } from "@workspace/ui/components/typography/typography";


interface IndustryTagChipProps {
    name: string;
    onClick?: () => void;
}

export function IndustryTagChip({
    name,
    onClick,
}: IndustryTagChipProps) {
    return (
            <Frame
            strength="low"
            radius="pill"
            className="px-3 py-1 cursor-pointer hover:bg-primary/10 transition-colors duration-200"
            onClick={onClick}
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