import Image from "next/image";
import { Typography } from "@workspace/ui/components/typography/typography";
import { getStoragePublicUrl } from "@/lib/supabase/storage";

export function ProjectRecognitionStrip() {
    return (
        <div className="flex items-center justify-center gap-2 self-stretch bg-[#F3EFE3] px-2 py-1">
            <Typography
                variant="body-sm"
                className="whitespace-nowrap font-delight text-[12px] font-medium leading-4 text-[#221E15]"
            >
                As Seen On
            </Typography>

            <Image
                src={getStoragePublicUrl("media-logos/Shark-tank-india.svg")}
                alt="Shark Tank India"
                width={112}
                height={24}
                className="h-6 w-auto object-contain"
                unoptimized
            />
        </div>
    );
}