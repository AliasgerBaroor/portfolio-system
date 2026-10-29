"use client";

import {
    useEffect,
    useState,
} from "react";

import { createPortal } from "react-dom";

import { Frame } from "@workspace/ui/components/frame";
import { ClockIcon } from "@workspace/ui/icons/clock";
import { Typography } from "@workspace/ui/components/typography/typography";

import { useClientAccess } from "@/contexts/client-access-context";

type FloatingClockProps = {
    embedded?: boolean;
};

export function FloatingClock({
    embedded = false,
}: FloatingClockProps) {
    const {
        sessionExpiresAt,
        handleSessionExpired,
    } = useClientAccess();

    const [remainingMs, setRemainingMs] =
        useState<number | null>(null);

    useEffect(() => {
        if (!sessionExpiresAt) {
            setRemainingMs(null);
            return;
        }

        let hasExpired = false;

        const updateRemaining = () => {
            const expiresAt =
                sessionExpiresAt.getTime();

            const remaining =
                expiresAt - Date.now();

            if (remaining <= 0) {
                setRemainingMs(0);

                if (!hasExpired) {
                    hasExpired = true;
                    void handleSessionExpired();
                }

                return;
            }

            setRemainingMs(remaining);
        };

        updateRemaining();

        const interval = setInterval(
            updateRemaining,
            1000
        );

        return () => {
            clearInterval(interval);
        };
    }, [
        sessionExpiresAt,
        handleSessionExpired,
    ]);

    if (!sessionExpiresAt || remainingMs === null) {
        return null;
    }

    const totalSeconds =
        Math.floor(
            remainingMs / 1000
        );

    const hours =
        Math.floor(
            totalSeconds / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;

    const formattedTime = [
        hours,
        minutes,
        seconds,
    ]
        .map((value) =>
            String(value).padStart(2, "0")
        )
        .join(":");

    const clock = (
        <Frame
            strength="medium"
            radius="pill"
            className="
                flex
                items-center
                gap-3
                px-4
                py-3
            "
        >
            <ClockIcon
                className="
                    h-6
                    w-6
                    shrink-0
                    lg:h-8
                    lg:w-8
                "
            />

            <Typography
                variant="heading-xs"
                className="
                    leading-none
                    lg:text-xl
                "
            >
                {formattedTime}
            </Typography>
        </Frame>
    );

    /*
     * Embedded clock stays where the parent
     * places it.
     */
    if (embedded) {
        return clock;
    }

    /*
     * Floating clock is rendered directly
     * under document.body.
     *
     * Therefore it can NEVER be affected
     * by GalleryCanvas transform/scale.
     */
    return createPortal(
        <div
            className="
                fixed
                right-4
                bottom-7
                z-[1000]
            "
        >
            {clock}
        </div>,
        document.body
    );
}