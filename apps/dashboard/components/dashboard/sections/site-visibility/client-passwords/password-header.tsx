import { Typography } from "@workspace/ui/components/typography";

export default function PasswordHeader() {
    return (
        <div className="space-y-1">
            <Typography variant="heading-xs">
                Client Passwords
            </Typography>

            <Typography
                variant="body-sm"
                className="text-muted-foreground"
            >
                Each password is tied to one client and expires after 24 hours.
            </Typography>
        </div>
    );
}