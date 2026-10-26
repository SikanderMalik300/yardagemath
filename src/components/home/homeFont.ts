import { Figtree } from "next/font/google";

/**
 * Homepage-only typeface. Applied to the `.home` wrapper only, so the shared
 * header and footer keep Inter. Weights 400/500/600, swap to avoid blocking.
 */
export const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-figtree",
  // Homepage-only font: don't force-preload it, or every page in the (site) group
  // preloads a second woff2 it never uses. It still loads on the homepage via
  // @font-face with display: swap. Keeps non-home pages to one preloaded font (Inter).
  preload: false,
});
