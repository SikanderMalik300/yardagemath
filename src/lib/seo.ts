import type { Metadata } from "next";
import { SITE } from "./constants";
import type { Calculator, Category } from "@/data/calculators";

const BASE = SITE.url;

/** Canonical author identity, referenced by @id across all schema (audit Task 3). */
export const AUTHOR_URL = `${BASE}/authors/sikander-mushtaq/`;
export const AUTHOR_ID = `${AUTHOR_URL}#person`;

/** Absolute, trailing-slash URL for a path. */
export function absUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const withSlash = clean.endsWith("/") ? clean : `${clean}/`;
  return `${BASE}${withSlash === "//" ? "/" : withSlash}`;
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  /** Pass false to drop the "| YardageMath" template (homepage only). */
  absoluteTitle?: boolean;
  noindex?: boolean;
}

export function buildMetadata(input: PageMetaInput): Metadata {
  const url = absUrl(input.path);
  const title = input.absoluteTitle ? { absolute: input.title } : input.title;
  // Real .png files under /og/<slug>.png so the response is Content-Type: image/png.
  // (Static-export routes have no extension and serve as octet-stream, which some
  // platforms reject.) (audit fix)
  const slug = input.path.replace(/^\/+|\/+$/g, "") || "home";
  const ogImage = `${BASE}/og/${slug}.png`;
  return {
    title,
    description: input.description,
    alternates: { canonical: url },
    robots: input.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE.name,
      type: "website",
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [ogImage],
    },
  };
}

/* ----------------------------- JSON-LD builders ----------------------------- */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: BASE,
    // Google prefers a square logo; versioned filename for cache-busting (audit P1 #4/#5).
    // No trailing slash — this is a file, not a route.
    logo: `${BASE}/brand/icon-512-v2.png`,
    email: SITE.email,
    sameAs: ["https://www.pinterest.com/yardagemath/"],
    founder: {
      "@type": "Person",
      "@id": AUTHOR_ID,
      name: SITE.founder,
      url: AUTHOR_URL,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    name: SITE.name,
    url: BASE,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[], id?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(id ? { "@id": id } : {}),
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}

export function webApplicationJsonLd(cal: Calculator) {
  const u = absUrl(`/${cal.slug}/`);
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${u}#app`,
    name: cal.h1,
    url: u,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: cal.metaDescription,
    datePublished: cal.datePublished,
    dateModified: cal.lastUpdated,
    author: { "@type": "Person", "@id": AUTHOR_ID, name: SITE.founder, url: AUTHOR_URL },
    publisher: { "@type": "Organization", name: SITE.name, url: BASE },
  };
}

/** WebPage node for a tool page, tying together the app, breadcrumb and author (AEO/GEO Fix 1). */
export function webPageJsonLd(cal: Calculator) {
  const u = absUrl(`/${cal.slug}/`);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${u}#webpage`,
    url: u,
    name: cal.title,
    isPartOf: { "@id": `${BASE}/#website` },
    author: { "@id": AUTHOR_ID },
    datePublished: cal.datePublished,
    dateModified: cal.lastUpdated,
    mainEntity: { "@id": `${u}#app` },
    breadcrumb: { "@id": `${u}#breadcrumb` },
  };
}

/** WebPage node for a category hub. */
export function hubWebPageJsonLd(category: Category) {
  const u = absUrl(`/${category.slug}/`);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${u}#webpage`,
    url: u,
    name: category.title,
    isPartOf: { "@id": `${BASE}/#website` },
    author: { "@id": AUTHOR_ID },
    datePublished: category.datePublished,
    dateModified: category.lastUpdated,
    mainEntity: { "@id": `${u}#collection` },
  };
}

/** Plain WebPage node for a utility/legal page (author omitted on legal pages). */
export function utilityWebPageJsonLd(o: {
  path: string;
  name: string;
  datePublished: string;
  dateModified: string;
  withAuthor?: boolean;
}) {
  const u = absUrl(o.path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${u}#webpage`,
    url: u,
    name: o.name,
    isPartOf: { "@id": `${BASE}/#website` },
    ...(o.withAuthor ? { author: { "@id": AUTHOR_ID } } : {}),
    datePublished: o.datePublished,
    dateModified: o.dateModified,
  };
}

export function faqJsonLd(cal: Calculator) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cal.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function collectionPageJsonLd(category: Category, tools: Calculator[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absUrl(`/${category.slug}/`)}#collection`,
    name: category.h1,
    url: absUrl(`/${category.slug}/`),
    description: category.metaDescription,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: tools.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absUrl(`/${t.slug}/`),
        name: t.h1,
      })),
    },
  };
}

export function itemListJsonLd(tools: Calculator[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: tools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absUrl(`/${t.slug}/`),
      name: t.h1,
    })),
  };
}

export function aboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${SITE.name}`,
    url: absUrl("/about/"),
    mainEntity: {
      "@type": "Person",
      "@id": AUTHOR_ID,
      name: SITE.founder,
      url: AUTHOR_URL,
      email: SITE.email,
      description: `Founder of ${SITE.name}.`,
    },
  };
}
