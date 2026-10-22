import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Name the main search and AI crawlers explicitly so it is clear they are
      // welcome, then allow everything else. All serve the same allow-all policy.
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
