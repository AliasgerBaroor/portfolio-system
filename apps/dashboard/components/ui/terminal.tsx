import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";
import { ResizeIcon } from "@/icons/resize";

export interface TerminalProps {
    output: string;
    className?: string;
    onResize?: () => void;
}

export function Terminal({
    output,
    className,
    onResize,
}: TerminalProps) {
    const terminalRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const terminal = terminalRef.current;

        if (!terminal) return;

        terminal.scrollTop = terminal.scrollHeight;
    }, [output]);

    return (
        <div
            ref={terminalRef}
            className={cn(
                "relative",
                "flex h-[320px] w-full",
                "items-start self-stretch",
                "overflow-auto",
                "rounded-[4px]",
                "border border-[#E9E8E8]",
                "bg-[#221E15]",
                "px-3 pt-3 pb-1.5",
                className
            )}
        >
            <pre
                className={cn(
                    "m-0 min-w-0 whitespace-pre-wrap break-words",
                    "font-mono",
                    "text-[10px]",
                    "font-medium",
                    "leading-[12px]",
                    "tracking-[0.2px]",
                    "text-white"
                )}
            >
                {output}
            </pre>

            <button
                type="button"
                onClick={onResize}
                aria-label="Resize terminal"
                className={cn(
                    "absolute right-3 top-3",
                    "flex items-center justify-center",
                    "rounded-full",
                    "border border-white/10",
                    "bg-white/10",
                    "p-2",
                    "text-white",
                    "transition-colors",
                    "hover:bg-white/15",
                    "focus:outline-none",
                    "focus-visible:ring-2",
                    "focus-visible:ring-white/30"
                )}
            >
                <ResizeIcon
                    aria-hidden="true" />
            </button>
        </div>
    );
}