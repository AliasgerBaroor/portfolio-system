import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography";

import { Copy, Trash2 } from "lucide-react";

import { ClientPassword } from "./types";

interface Props {
    password: ClientPassword;
}

export default function PasswordRow({
    password,
}: Props) {
    return (
        <div className="grid grid-cols-[1fr_auto] items-center gap-6 rounded-xs border border-border bg-muted/30 px-4 py-3">

            {/* LEFT */}

            <div className="min-w-0">

                <Typography variant="heading-sm">
                    {password.clientName}
                </Typography>

                <Typography
                    variant="caption"
                    className="text-muted-foreground"
                >
                    Expires{" "}
                    {password.expiresAt.toLocaleString()}
                </Typography>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-2">

                {/* Password */}

                <div className="rounded-md bg-muted px-3 py-1">

                    <Typography
                        variant="body-sm"
                        className="font-mono tracking-wider"
                    >
                        {password.password}
                    </Typography>

                </div>

                {/* Copy */}

                <Button
                    variant="ghost"
                    size="icon-sm"
                >
                    <Copy className="size-4" />
                </Button>

                {/* Delete */}

                <Button
                    variant="ghost"
                    size="icon-sm"
                >
                    <Trash2 className="size-4" />
                </Button>

            </div>

        </div>
    );
}