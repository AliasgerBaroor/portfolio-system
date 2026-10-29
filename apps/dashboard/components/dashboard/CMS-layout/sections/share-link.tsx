"use client";

import { Copy, ExternalLink } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { FieldCard } from "@workspace/ui/components/field-card";
import { Typography } from "@workspace/ui/components/typography/typography";

import { usePortfolio } from "@/contexts/portfolio-context";
import { useClientAccessKeys } from "@/contexts/client-access-key-context";

interface ShareLinkProps {
    slug: string;
}

export default function ShareLink({ slug }: ShareLinkProps) {
    const { portfolio } = usePortfolio();
    const { selectedCredentialId } = useClientAccessKeys();

    const visibility = portfolio?.visibility;
    const baseUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL?.trim()
        .replace(/\/+$/, "");

    const isPasswordProtected = visibility === "PASSWORD";

    const shareUrl =
        baseUrl && slug
            ? isPasswordProtected
                ? selectedCredentialId
                    ? `${ baseUrl } /${slug}/access / ${ selectedCredentialId } `
                    : ""
                : `${ baseUrl }/${slug}`
            : "";

const message = !baseUrl
    ? "Portfolio URL is not configured."
    : !slug
        ? "Portfolio slug is not available."
        : isPasswordProtected && !selectedCredentialId
            ? "Select a client password to create a client access link."
            : isPasswordProtected
                ? "This link is for the selected client."
                : "Anyone with this link can access your portfolio.";

async function copyShareUrl() {
    if (!shareUrl) return;

    try {
        await navigator.clipboard.writeText(shareUrl);
    } catch (error) {
        console.error("Failed to copy portfolio URL:", error);
    }
}

return (
    <FieldCard label="Share Link">
        <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1 rounded-xs border border-input bg-muted/30 px-3 py-2">
                <Typography
                    variant="body-sm"
                    className="truncate font-mono"
                >
                    {shareUrl || "Portfolio URL is not configured."}
                </Typography>
            </div>

            <Button
                variant="outline"
                size="sm"
                disabled={!shareUrl}
                onClick={copyShareUrl}
            >
                <Copy />
                Copy
            </Button>

            {shareUrl && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(
                        shareUrl,
                        "_blank",
                        "noopener,noreferrer"
                    )}
                >
                    <ExternalLink />
                    Open
                </Button>
            )}
        </div>

        <Typography
            variant="caption"
            className="text-secondary-foreground"
        >
            {message}
        </Typography>
    </FieldCard>
);
}