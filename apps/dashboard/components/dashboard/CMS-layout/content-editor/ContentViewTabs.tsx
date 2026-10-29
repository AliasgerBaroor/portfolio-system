import { FileText, Blocks } from "lucide-react";

type EditorMode = "rich-text" | "blocks";

interface ContentViewTabsProps {
  value: EditorMode;
  onChange: (value: EditorMode) => void;
}

const tabs = [
  {
    value: "rich-text",
    label: "Rich Text",
    icon: FileText,
  },
  {
    value: "blocks",
    label: "Block View",
    icon: Blocks,
  },
] as const;

export function ContentViewTabs({
  value,
  onChange,
}: ContentViewTabsProps) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-xl border-2 border-[#29251d] bg-white p-1 shadow-[0_3px_0_#29251d]"
      role="tablist"
      aria-label="Content editor view"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={[
              "inline-flex items-center gap-2 rounded-lg px-4 py-2",
              "text-sm font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-amber-500",
              isActive
                ? "bg-amber-400 text-[#29251d] shadow-[0_2px_0_#29251d]"
                : "bg-transparent text-[#514b40] hover:bg-[#f5f0e5]",
            ].join(" ")}
          >
            <Icon size={16} strokeWidth={2} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}