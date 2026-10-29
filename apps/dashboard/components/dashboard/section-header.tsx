import { Typography } from "@workspace/ui/components/typography/typography";

type SectionHeaderProps = {
    title: string;
    description?: string;
};

export default function SectionHeader({
    title,
    description,
}: SectionHeaderProps) {

    return (
        <div className="space-y-1">
            <Typography variant="heading-xs">
                {title}
            </Typography>

            {description && (
                <Typography
                    variant="body-sm"
                    className="text-secondary-foreground"
                >
                    {description}
                </Typography>
            )}
        </div>
    );
}