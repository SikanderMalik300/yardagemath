import type { MetadataRoute } from "next";
import { calculators, categoryList } from "@/data/calculators";
import { SITE } from "@/lib/constants";

const BASE = SITE.url;

// Static export needs this route pre-rendered.
export const dynamic = "force-static";

function url(path: string): string {
  const p = path.endsWith("/") ? path : `${path}/`;
  return `${BASE}${p === "//" ? "/" : p}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Honest per-page lastmod. Pages touched by the 2026-10-22 sitewide fixes
  // (formula pi -> 3.1416, fraction glyphs, em-dash cleanup) carry that date;
  // untouched boilerplate keeps its earlier date.
  const staticPages: { path: string; lastmod: string }[] = [
    { path: "/", lastmod: "2026-10-22" },
    { path: "/about/", lastmod: "2026-10-22" },
    { path: "/authors/sikander-mushtaq/", lastmod: "2026-10-22" },
    { path: "/sitemap/", lastmod: "2026-10-22" },
    { path: "/editorial-policy/", lastmod: "2026-10-22" },
    { path: "/how-we-calculate/", lastmod: "2026-10-26" },
    { path: "/free-calculators-for-your-website/", lastmod: "2026-10-23" },
    { path: "/contact/", lastmod: "2026-10-22" },
    { path: "/privacy-policy/", lastmod: "2026-10-22" },
    { path: "/terms/", lastmod: "2026-10-22" },
    { path: "/disclaimer/", lastmod: "2026-10-22" },
    { path: "/affiliate-disclosure/", lastmod: "2026-10-22" },
  ];

  return [
    ...staticPages.map((p) => ({
      url: url(p.path),
      lastModified: p.lastmod,
      changeFrequency: "monthly" as const,
      priority: p.path === "/" ? 1 : 0.5,
    })),
    ...categoryList.map((c) => ({
      url: url(`/${c.slug}/`),
      lastModified: "2026-10-22",
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...calculators.map((c) => ({
      url: url(`/${c.slug}/`),
      lastModified: c.lastUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
