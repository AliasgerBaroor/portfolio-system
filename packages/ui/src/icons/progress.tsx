import type { SVGProps } from "react";

interface ProgressIconProps extends SVGProps<SVGSVGElement> {
    progress?: number;
}

export function ProgressIcon({
    progress = 0,
    ...props
}: ProgressIconProps) {
    const value = Math.max(0, Math.min(1, progress));

    const radius = 11.34;
    const circumference = 2 * Math.PI * radius;

    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            {...props}
        >
            {/* Background */}
            <circle
                cx="16"
                cy="16"
                r={radius}
                fill="none"
                stroke="#221E15"
                strokeOpacity="0.2"
                strokeWidth="5.32"
            />

            {/* Progress */}
            <circle
                cx="16"
                cy="16"
                r={radius}
                fill="none"
                stroke="#FFB801"
                strokeWidth="5.32"
                strokeLinecap="round"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={circumference * (1 - value)}
                transform="rotate(-90 16 16)"
                style={{
                    transition:
                        "stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
            />
        </svg>
    );
}