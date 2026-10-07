import type { Metadata } from "next";
import { SITE } from "./constants";
import type { Calculator, Category } from "@/data/calculators";

const BASE = SITE.url;

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
      // og:image is supplied by the app/opengraph-image.tsx file convention.
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
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
    logo: absUrl("/icon.png"),
    email: SITE.email,
    founder: { "@type": "Person", name: SITE.founder },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: BASE,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}

export function webApplicationJsonLd(cal: Calculator) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: cal.h1,
    url: absUrl(`/${cal.slug}/`),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: cal.metaDescription,
    dateModified: cal.lastUpdated,
    author: { "@type": "Organization", name: SITE.name, url: BASE },
    publisher: { "@type": "Organization", name: SITE.name, url: BASE },
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
      name: SITE.founder,
      description: `Founder of ${SITE.name}.`,
    },
  };
}
