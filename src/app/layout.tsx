import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter } from "./fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "YardageMath – Free Construction & Yard Calculators",
    template: "%s | YardageMath",
  },
  description:
    "Free calculators for concrete, blocks, gravel, topsoil, mulch, gutters and lawn care. Get cubic yards, tons, bags and costs fast, with the math shown.",
  applicationName: SITE.name,
  authors: [{ name: SITE.founder }],
  creator: SITE.founder,
  publisher: SITE.name,
  robots: { index: true, follow: true },
  // Favicons are supplied by the app/icon.svg and app/apple-icon.tsx file conventions.
};

export const viewport: Viewport = {
  themeColor: "#236b4b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={inter.variable}>
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <a
          href="#main"
          style={{
            position: "absolute",
            left: -9999,
            top: 0,
          }}
          className="skip-link"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
