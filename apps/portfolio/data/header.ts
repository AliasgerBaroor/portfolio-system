import { HeaderAction } from "@/components/header/header-types";
import { HeaderColor } from "@workspace/ui/colors/registry";
import { IconName } from "@workspace/ui/icons/registry";

export type HeaderItemType = {
    key: string;
    url?: string;
    icon: IconName;
    color: HeaderColor;
    action?: HeaderAction;
};

export const headerButtons: HeaderItemType[] = [
    {
        key: "resume",
        url: "/resume",
        icon: "file",
        color: "blue",
        action: "navigate",
    },
    {
        key: "about",
        icon: "logo",
        color: "orange",
        action: "open-about",
    },
    {
        key: "contact",
        url: "/contact",
        icon: "envelope",
        color: "pink",
        action: "navigate",
    },
];