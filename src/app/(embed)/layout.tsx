import type { Metadata, Viewport } from "next";
import "../globals.css";
import { SITE } from "@/lib/constants";

/**
 * Bare root layout for embeddable calculators (/embed/*). No site header, footer,
 * nav, analytics, consent banner, JSON-LD or web font. System font stack only, so
 * the frame stays light and sets no cookies and makes no third-party requests.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  robots: { index: false, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body style={{ margin: 0, background: "#fff", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" }}>
        <main style={{ padding: "0.75rem" }}>{children}</main>
      </body>
    </html>
  );
}
