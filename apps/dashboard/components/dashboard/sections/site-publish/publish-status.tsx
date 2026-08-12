import { Typography } from "@workspace/ui/components/typography"

function PublishStatus() {
    return (
        <div>
            <Typography variant="heading-sm">
                Publish
            </Typography>

            <Typography
                variant="body-sm"
                className="text-secondary-foreground"
            >
                Your site isn't live yet.
            </Typography>
        </div>
    )
}

export default PublishStatus