import { Inter } from "next/font/google";

/**
 * Self-hosted via next/font — no runtime Google Fonts request (design.md §3, §19).
 * Loaded as the Inter variable font: a single woff2 covering weights 400–700,
 * instead of four static files (audit P1 #7). display: swap, preloaded.
 */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  // Size-adjusted fallback metrics so the swap causes no layout shift (CLS 0).
  adjustFontFallback: true,
});
