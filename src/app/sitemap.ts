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
  // Honest per-page lastmod: pages whose content changed on 2026-10-08 carry that
  // date; untouched pages keep 2026-10-07.
  const staticPages: { path: string; lastmod: string }[] = [
    { path: "/", lastmod: "2026-10-08" },
    { path: "/about/", lastmod: "2026-10-09" },
    { path: "/authors/sikander-mushtaq/", lastmod: "2026-10-09" },
    { path: "/sitemap/", lastmod: "2026-10-09" },
    { path: "/editorial-policy/", lastmod: "2026-10-10" },
    { path: "/how-we-calculate/", lastmod: "2026-10-09" },
    { path: "/contact/", lastmod: "2026-10-07" },
    { path: "/privacy-policy/", lastmod: "2026-10-09" },
    { path: "/terms/", lastmod: "2026-10-07" },
    { path: "/disclaimer/", lastmod: "2026-10-07" },
    { path: "/affiliate-disclosure/", lastmod: "2026-10-07" },
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
      lastModified: "2026-10-08",
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
