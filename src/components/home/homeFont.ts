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
});
