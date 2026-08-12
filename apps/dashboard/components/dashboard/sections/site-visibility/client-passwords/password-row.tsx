"use client";

import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography";

import {
    Copy,
    Eye,
    EyeOff,
    Trash2,
} from "lucide-react";

import { useState } from "react";

import type { ClientAccessKey } from "@/types/client-access-key";

interface Props {
    password: ClientAccessKey;
}

export default function PasswordRow({
    password,
}: Props) {
    const [passVisible, setPassVisible] =
        useState(false);

    const expired =
        !password.isActive ||
        (
            password.expiresAt !== null &&
            new Date(password.expiresAt) <=
            new Date()
        );

    const canUsePassword =
        !expired &&
        password.password !== null;

    async function handleCopy() {
        if (!password.password || !canUsePassword) {
            return;
        }

        await navigator.clipboard.writeText(
            password.password
        );
    }
    return (
        <div className="flex items-center justify-between gap-4 rounded-xs border border-border bg-muted/30 px-4 py-3">

            {/* LEFT */}

            <div className="min-w-0">

                <Typography variant="heading-sm">
                    {password.name}
                </Typography>

                <Typography
                    variant="caption"
                    className="text-muted-foreground"
                >
                    Expires{" "}
                    {password.expiresAt
                        ? new Date(
                            password.expiresAt
                        ).toLocaleString()
                        : "Never"}
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
                        {canUsePassword
                            ? (
                                passVisible
                                    ? password.password
                                    : "••••••••"
                            )
                            : "••••••••"}
                    </Typography>

                </div>

                {/* Eye */}

                <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={!canUsePassword}
                    onClick={() =>
                        setPassVisible(
                            (prev) => !prev
                        )
                    }
                    title={
                        canUsePassword
                            ? "Show password"
                            : "Password expired"
                    }
                >
                    {passVisible ? (
                        <EyeOff className="size-4" />
                    ) : (
                        <Eye className="size-4" />
                    )}
                </Button>

                {/* Copy */}

                <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={!canUsePassword}
                    onClick={handleCopy}
                    title={
                        canUsePassword
                            ? "Copy password"
                            : "Password expired"
                    }
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