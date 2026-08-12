"use client";

import { useEffect, useState } from "react";
import { Frame } from "@workspace/ui/components/frame";
import { ClockIcon } from "@workspace/ui/icons/clock";
import { Typography } from "@workspace/ui/components/typography";

export function FloatingClock() {
    const [time, setTime] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formattedTime = time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    return (
        <Frame
            strength="medium"
            radius="pill"
            className="
                fixed
                right-8
                bottom-11
                z-50
                flex
                items-center
                gap-3
                px-4
                py-3
            "
        >
            <ClockIcon className="shrink-0" />

            <Typography
                variant="heading-sm"
                className="leading-none"
            >
                {formattedTime}
            </Typography>
        </Frame>
    );
}