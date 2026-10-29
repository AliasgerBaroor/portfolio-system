"use client";

import {
    AboutBgIcon,
    CircleIcon,
    PlateIcon,
    SmileIcon,
    StarIcon,
} from "@/icons";


import { Frame } from "@workspace/ui/components/frame";
import { Typography } from "@workspace/ui/components/typography/typography";
import { Button } from "@workspace/ui/components/button";
import { connectItems } from "@/data/connect";
import { ConnectCard } from "../connect/connect-card";
import { MottoCard } from "../connect/MottoCard";

export function ContactContent() {

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">

            {/* ========================= */}
            {/* FIXED PROFILE HEADER */}
            {/* ========================= */}

            <div
                className="
                    relative
                    w-full
                    shrink-0
                    aspect-[328/166]
                    overflow-hidden
                "
            >
                <AboutBgIcon
                    className="
                        absolute
                        inset-0
                        h-full
                        w-full
                    "
                />

                <SmileIcon
                    className="
                        absolute
                        right-5
                        top-3
                        z-10
                    "
                />

                <StarIcon
                    className="
                        absolute
                        right-5
                        bottom-3
                        z-10
                    "
                />

                <CircleIcon
                    className="
                        absolute
                        left-4
                        top-2
                        z-10
                    "
                />

                <PlateIcon
                    className="
                        absolute
                        left-2
                        bottom-3
                        z-10
                    "
                />

                <Frame
                    strength="medium"
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        z-10
                        flex
                        -translate-x-1/2
                        -translate-y-1/2
                        flex-col
                        items-center
                        whitespace-nowrap
                        bg-primary
                        p-3
                        px-4
                    "
                >
                    <Typography variant="heading-md">
                        Burhanuddin Baroor
                    </Typography>

                    <Typography variant="body-lg">
                        Creative Director & Lead Designer
                    </Typography>
                </Frame>
            </div>

            {/* ========================= */}
            {/* SCROLLABLE CONTENT */}
            {/* ========================= */}

            <div
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    overscroll-contain
                    hide-scrollbar
                "
            >
                <div className="flex flex-col gap-4 px-4 pt-4 pb-4">
                    <div>
                        <div className="flex flex-col gap-1">
                    <Typography variant="body-md" className="font-[600] uppercase">Available for work</Typography>
                    <Typography variant="body-xl" className="font-[700]">Have a project in mind? lets get to work</Typography>
                    </div>

                        <Button
                            type="button"
                            size="lg"
                            frameStrength={null}
                            className="mt-6 w-[200px] min-w-[180px] px-8"
                        >
                            Start a project
                        </Button>

                    </div>

                    <div className="border-y border-[#221E15] p-4 flex flex-col gap-3">
                    {/* Connect Via */}
                    <Typography variant="body-md" className="font-[600] text-[#434134] uppercase">Connect via</Typography>

                        <div className="grid grid-cols-2 gap-4">
                            {connectItems.map((item) => (
                                <ConnectCard
                                    key={item.title}
                                    {...item}
                                />
                            ))}
                        </div>
                    </div>
                    <MottoCard
                        lines={[
                            "Good",
                            "Design is",
                            "Honest",
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}