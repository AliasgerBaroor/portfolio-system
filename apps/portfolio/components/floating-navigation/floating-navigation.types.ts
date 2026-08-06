import { IconName } from "@workspace/ui/icons/registry";
import { ReactNode } from "react";

export type NavigationItem = {
    id: string;
    label: string;
    icon?: IconName;
    size?: number;
};

export type NavigationGroup = {
    category: NavigationItem[];
    actions: NavigationItem[];
};

export type ActionItem = {
    id: string;
    icon: IconName;
    onClick?: () => void;
};

export type FloatingNavigationProps = {
    children: ReactNode;
};

export type NavigationProps = {
    items: NavigationGroup;
};

export type NavigationItemProps = {
    item: NavigationItem;
    active?: boolean;
    onClick?: () => void;
};

export type ActionsProps = {
    items: ActionItem[];
};

export type ActionButtonProps = {
    item: ActionItem;
};