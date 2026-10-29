
"use client";

import { usePortfolio } from "@/contexts/portfolio-context";
import { ArrowIcon } from "@/icons/arrow";
import { CloudDisconnectIcon } from "@/icons/cloud-disconnect";
import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography/typography";

interface ContentControlPanelProps {
    title?: string | null;
}

export default function ContentControlPanel({
    title,
}: ContentControlPanelProps) {
    const {
        publishPortfolio,
    } = usePortfolio();

    async function handlePublish() {
        try {
            await publishPortfolio();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex h-14 shrink-0 items-center justify-between border-l border-b border-l-border border-b-[#221E15] bg-white px-3">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Back"
                        className="flex h-5 w-5 items-center justify-center"
                        onClick={() => window.history.back()}
                    >
                        <ArrowIcon />
                    </button>

                    <Typography
                        variant="body-sm"
                        className="font-semibold uppercase tracking-wide text-[#221E15]"
                    >
                        {title || "Content"}
                    </Typography>
                </div>
                <div className="flex items-center">
                    <div className="flex gap-1 items-center">
                    <CloudDisconnectIcon />
                    <Typography
                        variant="field-value"
                            className="font-heading text-[#F84F2E]"
                    >
                        Changes in draft
                    </Typography>
                    </div>

                    <div
                        aria-hidden="true"
                        className="ml-3 mr-3 h-6 w-[2px] shrink-0 bg-[#E9E8E8]"
                    />

                    <Button
                        onClick={handlePublish}
                        size="compact"
                        frameStrength="low"
                    >
                        Publish
                    </Button>

                </div>

            </div>
        </div>
    );
}
