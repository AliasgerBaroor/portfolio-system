import { FileIcon, LogoIcon } from "./index";
import { EnvelopeIcon } from "./envelope";
import {
    Images,
    LucideIcon,
} from "lucide-react";
import { ComponentType } from "react";
import { GridIcon } from "./grid";
import { WebIcon } from "./website";
import { ProductIcon } from "./product";
import { BrandIcon } from "./brand";
import { AppIcon } from "./app";
import { GalleryIcon } from "./gallery";
import { ContactIcon } from "./contact";

export const icons = {
    // Header
    file: FileIcon,
    envelope: EnvelopeIcon,
    logo: LogoIcon,

    // Navigation
    grid: GridIcon,
    web: WebIcon,
    product: ProductIcon,
    brand: BrandIcon,
    app: AppIcon,
    work: GalleryIcon,
    contact: ContactIcon,

    // Actions
    gallery: Images,
} satisfies Record<string, LucideIcon | ComponentType>;

export type IconName = keyof typeof icons;