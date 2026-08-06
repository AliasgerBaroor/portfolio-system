import { Copy } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { FieldCard } from "@workspace/ui/components/field-card";
import { Typography } from "@workspace/ui/components/typography";

export default function ShareLink() {
    return (
        <FieldCard label="Share Link">
            <div className="flex items-center gap-2">
                <div className="flex-1 rounded-xs border border-input bg-muted/30 px-3 py-2">
                    <Typography
                        variant="body-sm"
                        className="truncate font-mono"
                    >
                        https://myportfolio.com
                    </Typography>
                </div>

               <Button variant="outline" size="sm"> <Copy /> Copy </Button>
            </div>

            <Typography
                variant="caption"
                className="text-muted-foreground"
            >
                Anyone with this link can access your portfolio.
            </Typography>
        </FieldCard>
    );
}