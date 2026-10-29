"use client";

import { Button } from "@workspace/ui/components/button";
import { Loader } from "@workspace/ui/components/loader";
import { Typography } from "@workspace/ui/components/typography/typography";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import type { Client } from "@/types/client";

interface Props {
    client: Client;

    onRemove: (
        clientId: string
    ) => Promise<void>;
}

export default function ClientRow({
    client,
    onRemove,
}: Props) {
    const [removing, setRemoving] =
        useState(false);

    async function handleRemove() {
        if (removing) {
            return;
        }

        try {
            setRemoving(true);

            await onRemove(client.id);
        } finally {
            setRemoving(false);
        }
    }

    return (
        <div className="flex items-center justify-between gap-4 rounded-xs border border-border bg-muted/30 px-4 py-3">

            {/* LEFT */}

            <div className="min-w-0">

                <Typography variant="heading-sm">
                    {client.name}
                </Typography>

                <Typography
                    variant="caption"
                    className="text-muted-foreground"
                >
                    {client.company ||
                        client.email ||
                        "No company or email provided"}
                </Typography>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-2">

                {/* Email / Company */}

                {client.email && (
                    <Typography
                        variant="caption"
                        className="hidden text-muted-foreground sm:block"
                    >
                        {client.email}
                    </Typography>
                )}

                {/* Status */}

                <div className="rounded-md bg-muted px-3 py-1">
                    <Typography
                        variant="body-sm"
                        className="text-muted-foreground"
                    >
                        {client.isActive
                            ? "Active"
                            : "Inactive"}
                    </Typography>
                </div>

                {/* Delete */}

                <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={removing}
                    onClick={handleRemove}
                    title={
                        client.isActive
                            ? "Remove client"
                            : "Delete client"
                    }
                >
                    {removing ? (
                        <Loader className="size-4 animate-spin" />
                    ) : (
                        <Trash2 className="size-4" />
                    )}
                </Button>

            </div>

        </div>
    );
}