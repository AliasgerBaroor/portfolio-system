"use client";
import { Globe, Lock } from "lucide-react";
import { Typography } from "@workspace/ui/components/typography";
import { useState } from "react";
import { Card } from "@workspace/ui/components/card";
import { OptionCard } from "@workspace/ui/components/option-card";

type Props = {
    value: "PUBLIC" | "PASSWORD";
    onChange: (value: "PUBLIC" | "PASSWORD") => void;
};

export default function SiteVisibility({
    value,
    onChange,
}: Props) {

    return (
        <Card className="rounded-xl p-6 space-y-3">
            <div className="space-y-1">
                <Typography variant="heading-xs">
                    Visibility
                </Typography>
                <Typography
                    variant="body-sm"
                    className="text-muted-foreground"
                >
                    Choose who can open your portfolio once it's live.
                </Typography>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <OptionCard
    selected={value === "PUBLIC"}
    onClick={() => onChange("PUBLIC")}
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

             <OptionCard
    selected={value === "PASSWORD"}
    onClick={() => onChange("PASSWORD")}
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

            </div>
        </Card>
    )
}