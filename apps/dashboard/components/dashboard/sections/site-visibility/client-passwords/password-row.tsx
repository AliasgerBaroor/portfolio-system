"use client";

import { Button } from "@workspace/ui/components/button";
import { Loader } from "@workspace/ui/components/loader";
import { Typography } from "@workspace/ui/components/typography/typography";

import {
    Copy,
    Eye,
    EyeOff,
    Trash2,
} from "lucide-react";

import { useState } from "react";

import type {
    ClientAccessKey,
} from "@/types/client-access-key";

interface Props {
    password: ClientAccessKey;

    selected: boolean;

    onSelect: (
        credentialId: string
    ) => void;

    onRevoke: (
        accessKeyId: string
    ) => Promise<void>;
}

export default function PasswordRow({
    password,
    selected,
    onSelect,
    onRevoke,
}: Props) {
    const [
        passVisible,
        setPassVisible,
    ] =
        useState(false);

    const [
        revoking,
        setRevoking,
    ] =
        useState(false);

    const expired =
        !password.isActive ||
        (
            password.expiresAt !==
            null &&
            new Date(
                password.expiresAt
            ) <= new Date()
        );

    const canUsePassword =
        !expired &&
        password.password !== null;

    async function handleCopy() {
        if (
            !password.password ||
            !canUsePassword
        ) {
            return;
        }

        await navigator.clipboard.writeText(
            password.password
        );
    }

    async function handleRevoke() {
        if (revoking) {
            return;
        }

        try {
            setRevoking(true);

            await onRevoke(
                password.id
            );
        } finally {
            setRevoking(false);
        }
    }

    return (
        <div
            /*
             * Clicking the ROW selects
             * this credential.
             */
            onClick={() => {
                if (!expired) {
                    onSelect(
                        password.id
                    );
                }
            }}
            className={`
                flex
                items-center
                justify-between
                gap-4
                rounded-xs
                border
                px-4
                py-3
                transition
                cursor-pointer
                ${selected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/30"
                }
                ${expired
                    ? "opacity-60 cursor-default"
                    : ""
                }
            `}
        >
            {/* LEFT */}

            <div className="min-w-0">
                <Typography
                    variant="heading-sm"
                >
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

                {/* PASSWORD */}

                <div
                    className="rounded-md bg-muted px-3 py-1"
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >
                    <Typography
                        variant="body-sm"
                        className="font-mono tracking-wider"
                    >
                        {canUsePassword
                            ? passVisible
                                ? password.password
                                : "••••••••"
                            : "••••••••"}
                    </Typography>
                </div>

                {/* EYE */}

                <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={
                        !canUsePassword
                    }
                    onClick={(event) => {
                        event.stopPropagation();

                        setPassVisible(
                            (previous) =>
                                !previous
                        );
                    }}
                >
                    {passVisible ? (
                        <EyeOff className="size-4" />
                    ) : (
                        <Eye className="size-4" />
                    )}
                </Button>

                {/* COPY */}

                <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={
                        !canUsePassword
                    }
                    onClick={(event) => {
                        event.stopPropagation();

                        void handleCopy();
                    }}
                >
                    <Copy className="size-4" />
                </Button>

                {/* DELETE */}

                <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={
                        revoking
                    }
                    onClick={(event) => {
                        event.stopPropagation();

                        void handleRevoke();
                    }}
                >
                    {revoking ? (
                        <Loader className="size-4 animate-spin" />
                    ) : (
                        <Trash2 className="size-4" />
                    )}
                </Button>

            </div>
        </div>
    );
}