import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Homepage redesign guardrails (redesign spec 5.2). Runs against the built
 * out/index.html and the fixtures captured from `main` before the redesign.
 */

const OUT = path.join(process.cwd(), "out", "index.html");
const hasBuild = fs.existsSync(OUT);
const html = hasBuild ? fs.readFileSync(OUT, "utf8") : "";
const meta = JSON.parse(fs.readFileSync(path.join(process.cwd(), "tests/fixtures/home-main-meta.json"), "utf8"));
const links = JSON.parse(fs.readFileSync(path.join(process.cwd(), "tests/fixtures/home-main-links.json"), "utf8"));

const g = (re: RegExp) => (html.match(re) || [])[1] || "";
const mainHtml = (html.match(/<main[\s\S]*?<\/main>/i) || [""])[0];

// at least one anchor for each required URL must contain this display text
const EXPECTED_ANCHOR: Record<string, string> = {
  "/cubic-yard-calculator/": "Cubic Yard Calculator",
  "/concrete-block-calculator/": "Concrete Block Calculator",
  "/concrete-slab-cost-calculator/": "Slab Cost Calculator",
  "/topsoil-calculator/": "Topsoil Calculator",
  "/pea-gravel-calculator/": "Pea Gravel Calculator",
  "/concrete/": "View all",
  "/block-wall-calculator/": "Block Wall Calculator",
  "/yards-of-concrete-calculator/": "Yards of Concrete Calculator",
  "/concrete-block-weight/": "Concrete Block Weight",
  "/cmu-block-sizes/": "CMU Block Sizes",
  "/landscaping/": "View all",
  "/square-yard-calculator/": "Square Yard Calculator",
  "/landscape-materials-calculator/": "Landscape Material Calculator",
  "/gutter-slope-calculator/": "Gutter Slope Calculator",
  "/rip-rap-calculator/": "Rip Rap Calculator",
  "/lawn/": "View all",
  "/lawn-mowing-cost-calculator/": "Lawn Mowing Cost Calculator",
  "/acres-per-hour-calculator/": "Acres per Hour Calculator",
  "/how-we-calculate/": "How We Calculate",
  "/about/": "Sikander Mushtaq",
};

function anchorsFor(href: string): string[] {
  const re = new RegExp(`<a\\b[^>]*href="${href.replace(/[/]/g, "\\/")}"[^>]*>([\\s\\S]*?)<\\/a>`, "gi");
  return [...mainHtml.matchAll(re)].map((m) => m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

describe.skipIf(!hasBuild)("homepage redesign: SEO is unchanged", () => {
  it("same <title>", () => {
    expect(g(/<title>([\s\S]*?)<\/title>/i)).toBe(meta.title);
  });
  it("same meta description", () => {
    expect(g(/<meta name="description" content="([^"]*)"/i)).toBe(meta.description);
  });
  it("same canonical", () => {
    expect(g(/<link rel="canonical" href="([^"]*)"/i)).toBe(meta.canonical);
  });
  it("same single H1 text", () => {
    expect((html.match(/<h1/gi) || []).length).toBe(1);
    const h1 = g(/<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    expect(h1).toBe(meta.h1);
  });

  it("JSON-LD Organization, WebSite and ItemList are byte-identical to main", () => {
    const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
    expect(blocks.length).toBe(3);
    const nowNorm = blocks.map((b) => JSON.stringify(JSON.parse(b)));
    for (const expected of meta.jsonld) {
      expect(nowNorm).toContain(JSON.stringify(expected));
    }
    const types = meta.jsonld.map((o: { "@type": string }) => o["@type"]).sort();
    expect(types).toEqual(["ItemList", "Organization", "WebSite"]);
  });

  it("all 20 required URLs are present in <main> with their anchor text", () => {
    for (const { href } of links) {
      expect(mainHtml, `missing ${href}`).toContain(`href="${href}"`);
      const texts = anchorsFor(href).join(" | ");
      expect(texts, `anchor text for ${href}`).toContain(EXPECTED_ANCHOR[href]);
    }
  });

  it("keeps the search placeholder in the static HTML", () => {
    expect(html).toContain("e.g. gravel, concrete, mulch, topsoil…");
  });

  it("the search uses the ARIA combobox pattern", () => {
    const src = fs.readFileSync(path.join(process.cwd(), "src/components/home/HomeSearch.tsx"), "utf8");
    expect(src).toContain('role="combobox"');
    expect(src).toContain("aria-controls");
    expect(src).toContain("aria-activedescendant");
    expect(src).toContain('role="listbox"');
    expect(src).toContain('role="option"');
  });

  it("keeps every section heading", () => {
    for (const heading of [
      "Most popular calculators",
      "Concrete &amp; Block Calculators",
      "Landscaping Material Calculators",
      "Lawn Care Calculators",
      "Popular answers",
      "Why trust these calculators",
      "The math is shown",
      "Sources are cited",
      "Kept up to date",
      "Latest updates",
    ]) {
      expect(html, `missing heading ${heading}`).toContain(heading);
    }
  });
});
