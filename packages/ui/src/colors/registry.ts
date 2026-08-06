export const headerColors = {
  blue: {
    foreground: "hsl(40 19% 6%)",
    background: "hsl(208 100% 72%)",
    border: "hsl(208 100% 72%)",
  },

  orange: {
    foreground: "hsl(40 19% 6%)",
    background: "hsl(29 100% 57%)",
    border: "hsl(29 100% 57%)",
  },

  pink: {
    foreground: "hsl(40 19% 6%)",
    background: "hsl(326 85% 79%)",
    border: "hsl(326 85% 79%)",
  },
} as const;

export type HeaderColor = keyof typeof headerColors;