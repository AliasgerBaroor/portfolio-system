import { Card } from "@workspace/ui/components/card"
import ShareLink from "./share-link"
import PublishButton from "./publish-button"
import PublishStatus from "./publish-status"

function SitePublish() {
    return (
        <Card className="p-6 space-y-5">

            <div className="flex justify-between">

                <PublishStatus />

                <PublishButton />

            </div>

            <ShareLink />

        </Card>
    )
}

export default SitePublish