import "./header.css";
import { icons, IconName } from "@workspace/ui/icons/registry";
import { HeaderColor, headerColors } from "@workspace/ui/colors/registry";

type HeaderItemType = {
  key: string;
  url: string;
  icon: IconName;
  color: HeaderColor;
};

export default function Header() {
  const items: HeaderItemType[] = [
    {
      key: "resume",
      url: "/resume",
      icon: "file",
      color: "blue",
    },
    {
      key: "preview",
      url: "/preview",
      icon: "logo",
      color: "orange",
    },
    {
      key: "mail",
      url: "/mail",
      icon: "envelope",
      color: "pink",
    },
  ];

  return (
    <header className="flex items-start gap-3 bg-white p-2 rounded-pill">
      {items.map((item) => (
        <HeaderItem key={item.key} item={item} />
      ))}
    </header>
  );
}

function HeaderItem({ item }: { item: HeaderItemType }) {
  const Icon = icons[item.icon];
  const colors = headerColors[item.color];

  return (
    <div
      className="header-item"
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
    </div>
  );
}