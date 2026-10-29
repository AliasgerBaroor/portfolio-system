import { cn } from "@workspace/ui/lib/utils";
import { PosterText } from "@workspace/ui/components/typography/poster-text";
import { Typography } from "@workspace/ui/components/typography/typography";

interface MottoCardProps {
    lines: string[];
    title?: string;
    className?: string;
}

export function MottoCard({
    lines,
    title = "MY MOTTO",
    className,
}: MottoCardProps) {
    return (
        <div
            className={cn(
                `
                w-full
                overflow-hidden
                rounded-[8px]
                border-2
                border-[#221E15]
                bg-white
                `,
                className
            )}
        >
            {/* Browser header */}
            <div
                className="
                    flex
                    h-[70px]
                    items-center
                    justify-center
                    relative
                    bg-[#FFF8EF]
                    border-b-2
                    border-[#221E15]
                "
            >
                {/* Traffic lights */}
                <div className="absolute left-4 flex items-center gap-2">
                    <span
                        className="
                            size-4
                            rounded-full
                            border-2
                            border-[#221E15]
                            bg-[#FF5739]
                        "
                    />

                    <span
                        className="
                            size-4
                            rounded-full
                            border-2
                            border-[#221E15]
                            bg-[#FFB801]
                        "
                    />

                    <span
                        className="
                            size-4
                            rounded-full
                            border-2
                            border-[#221E15]
                            bg-[#22B83E]
                        "
                    />
                </div>

                <Typography
                variant="body-md"
                    className="
                        font-[600]
                        leading-none
                        tracking-[-0.02em]
                        text-[#434134]
                    "
                >
                    {title}
                </Typography>
            </div>

            {/* Poster */}
            <div
                className="
                    flex
                    items-center
                    justify-center
                    bg-[#4678BA]
                    px-8
                    py-8
                "
            >
                <PosterText
                    lines={lines}
                    className="max-w-full"
                />
            </div>
        </div>
    );
}