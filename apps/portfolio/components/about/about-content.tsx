"use client";

import { useState } from "react";

import {
    AboutBgIcon,
    CircleIcon,
    PlateIcon,
    SmileIcon,
    StarIcon,
} from "@/icons";

import { industryTags } from "@/data/about-industry-tags";

import { Frame } from "@workspace/ui/components/frame";
import { IndustryTag, IndustryTagList } from "@workspace/ui/components/industry-tag";
import { Typography } from "@workspace/ui/components/typography/typography";
import { Button } from "@workspace/ui/components/button";

interface AboutContentProps {
    onCategorySelect?: (category: IndustryTag) => void;
}

export function AboutContent({
    onCategorySelect,
}: AboutContentProps) {

    const [expanded, setExpanded] = useState(false);

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
                <div className="flex flex-col gap-5 px-4 pt-4 pb-4">

                    {/* ABOUT */}
                    <section className="flex flex-col gap-2">
                        <Typography
                            variant="body-md"
                            className="
                                font-semibold
                                uppercase
                                text-secondary-foreground
                            "
                        >
                            About Us
                        </Typography>

                        <Typography variant="body-md">
                            I started at Hexcode Design as a fresher
                            with no clients, no playbook, and no idea
                            what I was walking into.
                        </Typography>

                        <Typography variant="body-md">
                            Four years later, I'm a Creative Director,
                            Lead Product Designer and founding team
                            member — leading design across web, mobile,
                            and SaaS platforms, mentoring junior
                            designers, and sitting in rooms with
                            founders and C-suite executives to shape
                            product strategy.
                        </Typography>

                        {expanded && (
                            <Typography variant="body-md">
                                That gap didn't happen by accident.
                                It happened because I kept taking on
                                things I wasn't fully ready for —
                                and figuring them out anyway.
                            </Typography>
                        )}
                    </section>

                    {/* WHAT I DO */}
                    <section className="flex flex-col gap-2">
                        <Typography
                            variant="body-md"
                            className="
                                font-semibold
                                uppercase
                                text-secondary-foreground
                            "
                        >
                            What I do:
                        </Typography>

                        <Typography variant="body-md">
                            I design end-to-end digital experiences —
                            from early-stage research and wireframing
                            to interaction design, design systems,
                            and final handoff. I've worked across
                            fintech, healthcare, cloud infrastructure,
                            SaaS, and e-commerce, for clients ranging
                            from seed-stage startups to Fortune 500
                            companies.
                        </Typography>

                        {!expanded && (
                            <Button
                                size="xs"
                                type="button"
                                variant="link"
                                onClick={() => setExpanded(true)}
                                className="
                                    self-start
                                    p-0
                                    font-semibold
                                    text-foreground
                                    underline
                                    underline-offset-4
                                "
                            >
                                Read More
                            </Button>
                        )}
                    </section>

                    {/* EVERYTHING BELOW READ MORE */}
                    {expanded && (
                        <>
                            <section className="flex flex-col gap-2">
                                <Typography
                                    variant="body-md"
                                    className="
                                        font-semibold
                                        uppercase
                                        text-secondary-foreground
                                    "
                                >
                                    Some outcomes from that work:
                                </Typography>

                                <Typography variant="body-md">
                                    — Products that raised $300M+ in funding
                                    <br />
                                    — Platforms serving Fortune 500 clients
                                    <br />
                                    — 70% conversion growth on mobile
                                    <br />
                                    — $3M+ in new business won through design pitches
                                    <br />
                                    — Design systems built for 12+ enterprise clients
                                </Typography>
                            </section>

                            <section className="flex flex-col gap-2">
                                <Typography
                                    variant="body-md"
                                    className="
                                        font-semibold
                                        uppercase
                                        text-secondary-foreground
                                    "
                                >
                                    What I believe:
                                </Typography>

                                <Typography variant="body-md">
                                    Good design isn't decoration. It's the
                                    difference between a product that users
                                    understand immediately and one they
                                    abandon in 30 seconds. I care about the
                                    logic behind every decision — spacing,
                                    hierarchy, interaction, flow — not just
                                    how it looks.
                                </Typography>
                            </section>

                            <section className="flex flex-col gap-2">
                                <Typography
                                    variant="body-md"
                                    className="
                                        font-semibold
                                        uppercase
                                        text-secondary-foreground
                                    "
                                >
                                    Tools
                                </Typography>

                                <Typography variant="body-md">
                                    Figma, ProtoPie, Framer, After Effects,
                                    Webflow, Adobe Creative Suite
                                </Typography>
                            </section>

                            <Typography variant="body-md">
                                Currently part of the founding team at
                                Hexcode Design, Indore.
                            </Typography>
                        </>
                    )}

                    {/* DIVIDER */}
                    <div className="h-px w-full bg-foreground" />

                   {/* INDUSTRIES */}
                <IndustryTagList
                        title="Industries"
                    tags={industryTags}
                    onTagClick={(category) => {
                        onCategorySelect?.(category);
                    }}
                />

                </div>
            </div>
        </div>
    );
}