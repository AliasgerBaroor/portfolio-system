import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Typography } from "@workspace/ui/components/typography";
import { usePortfolio } from "@/contexts/portfolio-context";
import { useEffect, useState } from "react";

function SiteName() {
  const {
    portfolio,
    updatePortfolio,
  } = usePortfolio();

  const [title, setTitle] =
    useState("");

  useEffect(() => {
    if (portfolio) {
      setTitle(portfolio.title);
    }
  }, [portfolio]);

  async function handleBlur() {
    if (!portfolio) {
      return;
    }

    const trimmedTitle =
      title.trim();

    if (
      trimmedTitle === portfolio.title
    ) {
      return;
    }

    await updatePortfolio({
      title: trimmedTitle,
    });
  }

    return (
<Card className="rounded-xl p-6 space-y-3">
  <div className="space-y-1">
    <Typography variant="heading-xs">
      Site Name
    </Typography>

    <Typography
      variant="body-md"
      className="text-secondary-foreground"
    >
      Shown as the title of your portfolio.
    </Typography>
  </div>

        <Input
          inputSize="md"
          value={title}
          placeholder="Enter your site name"
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          radius="sm"
        />
</Card>
    )
}

export default SiteName