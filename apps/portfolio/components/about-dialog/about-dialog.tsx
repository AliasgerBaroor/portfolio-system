"use client";

import { industryTags } from "@/data/about-industry-tags";
import {
    AboutBgIcon,
    CircleIcon,
    PlateIcon,
    SmileIcon,
    StarIcon,
} from "@/icons";
import { useAboutDialogStore } from "@/stores/about-dialog-store";

import {
    Dialog,
    DialogOverlay,
    DialogPopup,
    DialogPortal,
} from "@workspace/ui/components/dialog";

import { Button } from "@workspace/ui/components/button";
import { Frame } from "@workspace/ui/components/frame";
import { IndustryTagList } from "@workspace/ui/components/industry-tag";
import { Typography } from "@workspace/ui/components/typography";
import { CrossIcon } from "@workspace/ui/icons/cross";
import { MinimizeIcon } from "@workspace/ui/icons/minimize";
import { AffinityLogo } from "@/icons/temporary";
import { clients } from "@/data/clients";
import { useState } from "react";

function AboutDialog() {
    const isOpen = useAboutDialogStore((state) => state.isOpen);
    const close = useAboutDialogStore((state) => state.close);
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    close();
                }
            }}
        >
            <DialogPortal>

                {/* ================================= */}
                {/* Background Overlay */}
                {/* ================================= */}

                <DialogOverlay className="gallery-dialog-overlay" />

                {/* ================================= */}
                {/* About Dialog */}
                {/* ================================= */}
                <DialogPopup
                    className="
        fixed
        left-1/2
        top-[calc(20%)]
        z-[100]
        flex
        -translate-x-1/2
        flex-row
        items-end
        z-[100]
    "
                >
                    <div className="flex flex-col  z-10 items-center gap-6">
                        {/* ================================= */}
                        {/* Minimize Button */}
                        {/* ================================= */}

                        <Button
                            type="button"
                            size="icon"
                            className="
                                shrink-0
                                bg-brand-color-1
                                hover:bg-brand-color-1/85
                            "
                            onClick={() => {
                                close();
                            }}
                        >
                            <CrossIcon color="#fff" />
                        </Button>

                        {/* ================================= */}
                        {/* Details Card */}
                        {/* ================================= */}

                        <Frame
                            strength="high"
                            radius="md"
                            className="
                                w-[380px]
                                bg-white
                            "
                        >
                            <div className="flex flex-col gap-4">

                                <div className="relative w-full aspect-[328/166] overflow-hidden">

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
                                            -translate-x-1/2
                                            -translate-y-1/2

                                            flex
                                            flex-col

                                            bg-primary
                                            whitespace-nowrap

                                            p-3
                                            px-4

                                            items-center
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

                                {/* Tags */}

                                <div className="flex flex-col gap-2 px-4">

                                    <Typography
                                        variant="body-md"
                                        className="
                                            text-secondary-foreground
                                            font-semibold
                                            uppercase
                                        "
                                    >
                                        About Us
                                    </Typography>

                                    {/* Description */}

                                    <div className="flex flex-col gap-2 items-start">

                                        <Typography
                                            variant="body-md"
                                            className="text-foreground"
                                        >
                                            I started at Hexcode Design as a fresher
                                            with no clients, no playbook, and no idea
                                            what I was walking into.
                                        </Typography>

                                        <Typography
                                            variant="body-md"
                                            className="text-foreground"
                                        >
                                            Four years later, I'm a Senior Product
                                            Designer and founding team member —
                                            leading design across web, mobile, and
                                            SaaS platforms, mentoring junior des...
                                        </Typography>

                                        <Button
                                            size="xs"
                                            type="button"
                                            variant="link"
                                            className="
                                                p-0
                                                font-semibold
                                                text-foreground
                                                underline
                                                underline-offset-4
                                            "
                                        >
                                            Read More
                                        </Button>

                                    </div>
                                </div>
                            </div>

                            {/* Divider */}

                            <div className="my-4 h-px bg-foreground" />

                            <div className="px-4 pb-4">
                                <IndustryTagList tags={industryTags} />
                            </div>

                        </Frame>


                    </div>

                    {/* ================================= */}
                    {/* Clients */}
                    {/* ================================= */}

                    <Frame radiusRemove="left"
                        strength="high"
                        radius="md"
                        className={`
                            w-[${!collapsed ? "350" : ""}px]
                            -ml-2.5
                            mb-[1px]

                            max-h-[400px]
                            
                            ${collapsed ? " p-2 pb-3 ps-7 pe-5" : ""}

                           
            `}
                    >
                        {!collapsed ? (
                            <div className="p-4 ps-5">

                                <div className="flex items-center justify-between">
                                    <Typography
                                        variant="body-md"
                                        className="
                            font-semibold
                            uppercase
                            text-secondary-foreground
                        "
                                    >
                                        Our Clients
                                    </Typography>

                                    <Button
                                        type="button"
                                        size="icon-sm"
                                        radius="sm"
                                        className="
                                        shrink-0
                                        bg-white
                                        hover:bg-white
                                    "
                                    onClick={() => setCollapsed(true)}
                                    >
                                        <MinimizeIcon className="size-4" />
                                    </Button>
                                </div>

                                <div className="my-4 h-px bg-foreground" />
                                <div className="grid grid-cols-2 gap-x-8 gap-y-8
                                                            max-h-[300px]
                            overflow-y-auto
                            hide-scrollbar
                            
                            pb-5">
                                    {clients.map((client, id) => (
                                        <div
                                            key={id}
                                            className="flex h-11 items-center"
                                        >
                                            <client.logo className="h-auto max-h-11 w-auto" />
                                        </div>
                                    ))}
                                </div>

                            </div>
                        ) : (
                            <Button
                                type="button"
                                size="icon-sm"
                                radius="sm"
                                className="
                                        shrink-0
                                        bg-white
                                        hover:bg-white
                                    "
                                    onClick={() => setCollapsed(false)}
                            >
                                <MinimizeIcon className="size-4" />
                            </Button>
                        )
                        }

                    </Frame>


                </DialogPopup>

            </DialogPortal>
        </Dialog>
    );
}

export default AboutDialog;