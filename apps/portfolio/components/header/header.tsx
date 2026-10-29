"use client"
import "./header.css";
import { icons, IconName } from "@workspace/ui/icons/registry";
import { HeaderColor, headerColors } from "@workspace/ui/colors/registry";
import { Frame } from "@workspace/ui/components/frame";
import { useAboutDialogStore } from "@/stores/about-dialog-store";
import { headerButtons, HeaderItemType } from "@/data/header";
import { HeaderAction } from "./header-types";
import { useContactOpenDialogStore } from "@/stores/contact-dialog-store";

export default function Header() {
  const open = useAboutDialogStore((state) => state.open);
  const openContact = useContactOpenDialogStore((state) => state.open);

  const actions: Record<HeaderAction, () => void> = {
    "open-about": open,
    "open-contact": openContact,
    navigate: () => { },
    none: () => { },
  };

  return (
    <Frame>
    <header className="flex items-start gap-3 bg-white p-2 rounded-pill">
        {headerButtons.map((item) => (
          <HeaderItem key={item.key} item={item} onAction={item.action ? actions[item.action] : undefined} />
      ))}
    </header>
    </Frame>

  );
}

function HeaderItem({
  item,
  onAction,
}: {
  item: HeaderItemType;
  onAction?: () => void;
}) {
  const Icon = icons[item.icon];
  const colors = headerColors[item.color];

  return (
    <button
      className="header-item"
      onClick={onAction}
      style={
        {
          "--header-bg": colors.background,
          "--header-border": colors.border,
          "--header-fg": colors.foreground,
        } as React.CSSProperties
      }
    >
      <div className="header-item-inner">
        <Icon width={28} height={28} />
      </div>
    </button>
  );
}