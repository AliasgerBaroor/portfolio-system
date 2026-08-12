export const headerColors = {
  blue: {
    foreground: "var(--color-white)",
    background: "var(--brand-color-1)",
    border: "var(--brand-color-1)",
  },

  orange: {
    foreground: "var(--color-white)",
    background: "var(--brand-color-2)",
    border: "var(--brand-color-2)",
  },

  pink: {
    foreground: "var(--color-white)",
    background: "var(--brand-color-3)",
    border: "var(--brand-color-3)",
  },
} as const;

export type HeaderColor = keyof typeof headerColors;