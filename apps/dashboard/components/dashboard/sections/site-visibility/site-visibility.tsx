"use client";
import { Globe, Lock } from "lucide-react";
import { Typography } from "@workspace/ui/components/typography/typography";
import { Card } from "@workspace/ui/components/card";
import { OptionCard } from "@workspace/ui/components/option-card";
import { usePortfolio } from "@/contexts/portfolio-context";
import { Frame } from "@workspace/ui/components/frame";

export default function SiteVisibility() {
    const {
        portfolio,
        updatePortfolio,
    } = usePortfolio();

    async function handleVisibilityChange(
        visibility: "PUBLIC" | "PASSWORD"
    ) {
        if (
            portfolio?.visibility ===
            visibility
        ) {
            return;
        }

        await updatePortfolio({
            visibility,
        });
    }
    
    return (
        <Card className="p-6 space-y-3">
            <div className="space-y-1">
                <Typography variant="heading-xs">
                    Visibility
                </Typography>
                <Typography
                    variant="body-sm"
                    className="text-secondary-foreground"
                >
                    Choose who can open your portfolio once it's live.
                </Typography>
            </div>


            <div className="grid grid-cols-2 gap-4">
                    <Frame strength="low" radius="sm">
                <OptionCard
                    className=" cursor-pointer"
                    selected={
                        portfolio?.visibility ===
                        "PUBLIC"
                    }
                    onClick={() =>
                        handleVisibilityChange(
                            "PUBLIC"
                        )
                    }
                >
                    <OptionCard.Header>
                        <Globe className="size-4" />

                        <Typography variant="heading-2xs">
                            Public
                        </Typography>
                    </OptionCard.Header>

                    <OptionCard.Description className="text-2xs">
                        Anyone with the link can view it.
                    </OptionCard.Description>
                </OptionCard>
                </Frame>
                <Frame strength="low" radius="sm">
                <OptionCard
                    className=" cursor-pointer"
                    selected={
                        portfolio?.visibility ===
                        "PASSWORD"
                    }
                    onClick={() =>
                        handleVisibilityChange(
                            "PASSWORD"
                        )
                    }
                >
                    <OptionCard.Header>
                        <Lock className="size-4" />

                        <Typography variant="heading-2xs">
                            Password Protected
                        </Typography>
                    </OptionCard.Header>

                    <OptionCard.Description className="text-2xs">
                        Visitors must enter a client password.
                    </OptionCard.Description>
                </OptionCard>
                </Frame>

            </div>
        </Card>
    )
}