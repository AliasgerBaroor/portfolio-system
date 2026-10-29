"use client";

import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogPopup,
} from "@workspace/ui/components/dialog";

import { Frame } from "@workspace/ui/components/frame";
import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography/typography";
import { MinimizeIcon } from "@workspace/ui/icons/minimize";
import { getStoragePublicUrl } from "@/lib/supabase/storage";

import type { Dispatch, SetStateAction } from "react";
    import { GalleryItem } from "./gallery.types";
import { ProjectTagList } from "../tag-list/project-tag-list";
import { ProjectRecognitionStrip } from "../project/ProjectRecognitionStrip";
import { MatchKeys } from "../match-keys/match-keys";

interface GalleryMoreInfoDialogProps {
    open: boolean;
    logoLoaded: boolean;
    logoError: boolean;
    setLogoLoaded: Dispatch<SetStateAction<boolean>>;
    setLogoError: Dispatch<SetStateAction<boolean>>;
    onOpenChange: (open: boolean) => void;
    item: GalleryItem | null;
    onMinimize: () => void;
}

export function GalleryMoreInfoDialog({
    open,
    onOpenChange,
    logoLoaded,
    logoError,
    setLogoLoaded,
    setLogoError,
    item,
    onMinimize,
}: GalleryMoreInfoDialogProps) {
    const project = item?.project;
    const metrics = project?.metrics;
    const projectTags = project?.tags ?? [];
    
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogPortal>
                <DialogOverlay className="flex md:hidden" />
                <DialogPopup
                    className="
    gallery-more-info-popup
    fixed inset-0 z-[1200]
    flex flex-col items-center justify-end
    overflow-y-auto p-4 pb-8
    outline-none pointer-events-none
"
                >
                    <div className="pointer-events-auto flex w-full max-w-[400px] flex-col items-center gap-3">
                        {/* PROJECT INFORMATION */}
                        <Frame
                            radius="md"
                            className="w-full overflow-hidden p-0"
                        >
                            <MatchKeys
                                value={item?.projectId ?? ""}
                                matchKeys={["mishmash"]}
                            >
                                <ProjectRecognitionStrip />
                            </MatchKeys>

                            {/* Padded project content */}
                            <div className="flex w-full flex-col gap-4 p-4">
                                <div className="flex items-center gap-3 self-stretch bg-white">
                                    {/* PROJECT LOGO */}

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                                        {project?.logo ? (
                                            <img
                                                key={project.logo}
                                                src={getStoragePublicUrl(project.logo)}
                                                alt={`${project.name ?? "Project"} logo`}
                                                className="h-full w-full object-contain"
                                                onLoad={() => {
                                                    setLogoLoaded(true);
                                                    setLogoError(false);
                                                }}
                                                onError={(event) => {
                                                    setLogoError(true);
                                                    setLogoLoaded(true);

                                                    const image = event.currentTarget;
                                                    const fallbackUrl = getStoragePublicUrl(
                                                        "placeholder/default-brand.svg"
                                                    );

                                                    if (!image.src.endsWith("default-brand.svg")) {
                                                        image.src = fallbackUrl;
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={getStoragePublicUrl("placeholder/default-brand.svg")}
                                                alt="Default project logo"
                                                className="h-full w-full object-contain"
                                            />
                                        )}
                                    </div>

                                    {/* PROJECT NAME + DESCRIPTION */}
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <Typography
                                            variant="heading-xs"
                                            className="
                                            font-delight
                                            text-[16px]
                                            font-semibold
                                            leading-[24px]
                                            tracking-normal
                                            text-[#221E15]
                                        "
                                        >
                                            {project?.name}
                                        </Typography>

                                        <Typography
                                            variant="body-md"
                                            className="
                                            font-sans
                                            text-[14px]
                                            font-normal
                                            leading-[20px]
                                            text-[#434134]
                                        "
                                        >
                                            {project?.industry}
                                        </Typography>
                                    </div>
                                </div>

                                <ProjectTagList tags={projectTags} />

                                <div className="h-px w-full bg-[#E9E8E8]" />

                                {/* METRICS */}
                                <div className="grid grid-cols-3 gap-3">
                                    {metrics?.map((metric) => (
                                        <div
                                            key={metric.label}
                                            className="flex min-w-0 flex-col items-center"
                                        >
                                            <Typography
                                                variant="body-lg"
                                                className="h-6 w-full text-center font-semibold font-heading text-[#221E15]"
                                            >
                                                {metric.value}
                                            </Typography>

                                            <Typography
                                                variant="body-sm"
                                                className="w-full break-words text-center text-[#434134]"
                                            >
                                                {metric.label}
                                            </Typography>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-px w-full bg-[#E9E8E8]" />

                                <Typography
                                    variant="body-sm"
                                    className="text-[#221E15]"
                                >
                                    {project?.description}
                                </Typography>
                            </div>
                        </Frame>
                        
                        {/* MINIMIZE / CLOSE */}
                        <Button
                            type="button"
                            size="icon"
                            radius="md"
                            onClick={onMinimize}
                                aria-label="Close project details"
                                className="
                                    shrink-0
                                    bg-white
                                    hover:bg-white
                                    rounded-md
                                "
                        >
                            <MinimizeIcon className="size-7" />
                        </Button>
                    </div>
                </DialogPopup>
            </DialogPortal>
        </Dialog>
    );
}