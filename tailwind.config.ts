import type { Config } from "tailwindcss";

/**
 * Design tokens are defined as CSS custom properties in globals.css (see design.md §2–4).
 * Tailwind maps to those variables so utilities and raw CSS stay in sync.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        "surface-emphasis": "var(--surface-emphasis)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-inverse": "var(--text-inverse)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        brand: "var(--brand)",
        "brand-hover": "var(--brand-hover)",
        "brand-soft": "var(--brand-soft)",
        success: "var(--success)",
        warning: "var(--warning)",
        "warning-soft": "var(--warning-soft)",
        error: "var(--error)",
        "error-soft": "var(--error-soft)",
        "focus-ring": "var(--focus-ring)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
      },
      maxWidth: {
        content: "1180px",
        reading: "760px",
        calculator: "1080px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(23, 32, 27, 0.05)",
        card: "0 4px 14px rgba(23, 32, 27, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
