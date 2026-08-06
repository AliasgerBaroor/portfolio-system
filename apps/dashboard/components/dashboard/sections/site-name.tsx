import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Typography } from "@workspace/ui/components/typography";

function SiteName() {
    return (
<Card className="rounded-xl p-6 space-y-3">
  <div className="space-y-1">
    <Typography variant="heading-xs">
      Site Name
    </Typography>

    <Typography
      variant="body-sm"
      className="text-muted-foreground"
    >
      Shown as the title of your portfolio.
    </Typography>
  </div>

  <Input
    value="My Portfolio"
    placeholder="Enter your site name"
  />
</Card>
    )
}

export default SiteName