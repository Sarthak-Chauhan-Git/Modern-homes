import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1C1C1E",
        accent: "#B8962E",
        "accent-light": "#E5CFA0",
        surface: "#FAFAF8",
        "surface-2": "#F2EFE9",
        "text-muted": "#6B6860",
        border: "#E8E4DC",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
