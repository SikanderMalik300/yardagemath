import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { EMBED_TOOLS, embedSnippet, embedUrl, toolUrl } from "@/lib/embed";

/** Embeddable calculators (built HTML + static files). */

const ROOT = resolve(__dirname, "..", "..");
const OUT = join(ROOT, "out");
const read = (p: string) => readFileSync(join(OUT, p), "utf8");
const primaryValue = (html: string) => (html.match(/primary-result__value">([^<]*)</) || [])[1]?.trim();

describe("embeddable calculators", () => {
  it("each embed route renders the same default primary result as its main page", () => {
    if (!existsSync(OUT)) return;
    for (const t of EMBED_TOOLS) {
      const mainV = primaryValue(read(`${t.slug}/index.html`));
      const embV = primaryValue(read(`embed/${t.slug}/index.html`));
      expect(embV, `${t.slug}: embed primary result`).toBeTruthy();
      expect(embV, `${t.slug}: embed matches main default`).toBe(mainV);
    }
  });

  it("each embed page is noindex, canonical to the main page, and has no JSON-LD", () => {
    if (!existsSync(OUT)) return;
    for (const t of EMBED_TOOLS) {
      const html = read(`embed/${t.slug}/index.html`);
      expect(html, `${t.slug}: noindex`).toMatch(/<meta name="robots" content="noindex/i);
      expect(html, `${t.slug}: canonical to main`).toContain(`<link rel="canonical" href="${toolUrl(t.slug)}"`);
      expect(html.includes("application/ld+json"), `${t.slug}: no JSON-LD`).toBe(false);
    }
  });

  it("no embed route appears in the sitemap or llms.txt", () => {
    if (!existsSync(OUT)) return;
    const sitemap = read("sitemap.xml");
    const llms = read("llms.txt");
    for (const t of EMBED_TOOLS) {
      expect(sitemap.includes(`/embed/${t.slug}/`), `${t.slug}: not in sitemap`).toBe(false);
      expect(llms.includes(`/embed/${t.slug}/`), `${t.slug}: not in llms.txt`).toBe(false);
    }
  });

  it("the snippet carries the right embed URL and credit link, on both the tool page and the index page", () => {
    if (!existsSync(OUT)) return;
    const index = read("free-calculators-for-your-website/index.html");
    for (const t of EMBED_TOOLS) {
      const snip = embedSnippet(t);
      expect(snip).toContain(embedUrl(t.slug));
      expect(snip).toContain(`href="${toolUrl(t.slug)}"`);
      // the embed URL appears in the index page (textarea + live preview) and the tool page box
      expect(index, `${t.slug}: index page snippet`).toContain(`/embed/${t.slug}/`);
      expect(read(`${t.slug}/index.html`), `${t.slug}: tool-page embed box`).toContain(`/embed/${t.slug}/`);
    }
  });

  it("built _headers allows framing /embed/* with frame-ancestors *", () => {
    const headers = readFileSync(join(ROOT, "public", "_headers"), "utf8");
    expect(headers).toMatch(/\/embed\/\*/);
    expect(headers).toContain("frame-ancestors *");
  });

  it("no embed route is selected for IndexNow (derived from the sitemap)", () => {
    if (!existsSync(OUT)) return;
    const sitemap = read("sitemap.xml");
    expect(sitemap.includes("/embed/")).toBe(false);
  });
});
