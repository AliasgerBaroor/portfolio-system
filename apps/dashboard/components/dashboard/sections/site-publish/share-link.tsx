"use client";

import { Copy } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { FieldCard } from "@workspace/ui/components/field-card";
import { Typography } from "@workspace/ui/components/typography/typography";

import { usePortfolio } from "@/contexts/portfolio-context";

import {
    useClientAccessKeys,
} from "@/contexts/client-access-key-context";

interface ShareLinkProps {
    slug: string;
}

export default function ShareLink({
    slug,
}: ShareLinkProps) {
    const {
        portfolio,
    } = usePortfolio();

    const {
        selectedCredentialId,
    } =
        useClientAccessKeys();

    const visibility =
        portfolio?.visibility;

    /*
     * IMPORTANT:
     *
     * This is the PORTFOLIO application's URL.
     *
     * Do NOT use window.location.origin here,
     * because this component runs inside Dashboard.
     */
    const portfolioUrl =
        process.env.NEXT_PUBLIC_PORTFOLIO_URL;

    /*
     * PUBLIC
     *
     * http://localhost:3001/aliasger-portfolio
     *
     * PASSWORD
     *
     * http://localhost:3001/aliasger-portfolio/access/FMXBS0R1-3H9
     */
    const shareUrl =
        portfolioUrl
            ? visibility === "PASSWORD" &&
                selectedCredentialId
                ? `${portfolioUrl}/${slug}/access/${selectedCredentialId}`
                : `${portfolioUrl}/${slug}`
            : "";

    const isPasswordProtected =
        visibility === "PASSWORD";

    async function copyShareUrl() {
        if (!shareUrl || (isPasswordProtected && !selectedCredentialId)) {
            return;
        }

        await navigator.clipboard.writeText(
            shareUrl
        );
    }

    return (
        <FieldCard label="Share Link">

            <div className="flex items-center gap-2">

                <div className="flex-1 rounded-xs border border-input bg-muted/30 px-3 py-2">

                    <Typography
                        variant="body-sm"
                        className="truncate font-mono"
                    >
                        {shareUrl.slice(0, 65) + "..." ||
                            "Portfolio URL is not configured."}
                    </Typography>

                </div>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={!shareUrl || (isPasswordProtected && !selectedCredentialId)}
                    onClick={
                        copyShareUrl
                    }
                >
                    <Copy />
                    Copy
                </Button>

            </div>

            <Typography
                variant="caption"
                className="text-secondary-foreground"
            >
                {isPasswordProtected
                    ? selectedCredentialId
                        ? "This link is for the selected client."
                        : "Select a client password to create a client access link."
                    : "Anyone with this link can access your portfolio."}
            </Typography>

        </FieldCard>
    );
}