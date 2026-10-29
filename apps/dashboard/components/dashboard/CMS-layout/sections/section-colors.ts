export const SECTION_COLORS = [
    "rgba(30, 173, 37, 0.30)",  // Green
    "rgba(40, 72, 183, 0.30)", // Blue
    "rgba(173, 30, 87, 0.30)",  // Pink
    "rgba(161, 30, 173, 0.30)", // Purple
] as const;

export function getSectionColor(index: number): string {
    return SECTION_COLORS[index % SECTION_COLORS.length]
        ?? SECTION_COLORS[0];
}