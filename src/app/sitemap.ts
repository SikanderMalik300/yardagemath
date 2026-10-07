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
  const staticPages = [
    "/",
    "/about/",
    "/contact/",
    "/how-we-calculate/",
    "/sitemap/",
    "/privacy-policy/",
    "/terms/",
    "/disclaimer/",
    "/affiliate-disclosure/",
  ];

  const now = "2026-10-07";

  return [
    ...staticPages.map((p) => ({
      url: url(p),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "/" ? 1 : 0.5,
    })),
    ...categoryList.map((c) => ({
      url: url(`/${c.slug}/`),
      lastModified: now,
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
