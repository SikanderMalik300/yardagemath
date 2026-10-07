import { Inter } from "next/font/google";

/** Self-hosted via next/font — no runtime Google Fonts request (design.md §3, §19). */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  preload: true,
});
