import { describe, it, expect } from "vitest";
import { selectUrls } from "../../scripts/indexnow-urls.mjs";

/**
 * IndexNow URL selection (yardagemath-indexnow-timezone-fix.md).
 * Submit every URL whose lastmod is yesterday, today or tomorrow in UTC.
 */

const u = (slug: string) => `https://yardagemath.com/${slug}/`;
const url = (slug: string, lastmod?: string) =>
  `<url><loc>${u(slug)}</loc>${lastmod === undefined ? "" : `<lastmod>${lastmod}</lastmod>`}</url>`;

// now = 2026-10-11T20:30Z -> UTC window is {2026-10-10, 2026-10-11, 2026-10-12}
const NOW = new Date("2026-10-11T20:30:00Z");

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${url("concrete-footing-calculator", "2026-10-12")}
  ${url("cinder-block-fill-calculator", "2026-10-12")}
  ${url("today", "2026-10-11")}
  ${url("yesterday", "2026-10-10")}
  ${url("two-days-old", "2026-10-09")}
  ${url("offset-ts", "2026-10-12T00:00:00+05:00")}
  ${url("no-lastmod")}
  ${url("empty-lastmod", "")}
</urlset>`;

describe("selectUrls", () => {
  it("selects a URL with lastmod 2026-10-12 at now=2026-10-11T20:30Z (Day 4/5 case)", () => {
    const r = selectUrls(SAMPLE, NOW);
    expect(r).toContain(u("concrete-footing-calculator"));
    expect(r).toContain(u("cinder-block-fill-calculator"));
  });

  it("selects yesterday, today and tomorrow; a date 2 days old is not selected", () => {
    const r = selectUrls(SAMPLE, NOW);
    expect(r).toContain(u("yesterday")); // 2026-10-10
    expect(r).toContain(u("today")); // 2026-10-11
    expect(r).toContain(u("concrete-footing-calculator")); // 2026-10-12 (tomorrow)
    expect(r).not.toContain(u("two-days-old")); // 2026-10-09
  });

  it("handles a lastmod given as a full timestamp with offset", () => {
    // 2026-10-12T00:00:00+05:00 == 2026-10-11T19:00:00Z -> UTC date 2026-10-11 (today)
    expect(selectUrls(SAMPLE, NOW)).toContain(u("offset-ts"));
  });

  it("skips empty or missing lastmod without crashing", () => {
    const r = selectUrls(SAMPLE, NOW);
    expect(r).not.toContain(u("no-lastmod"));
    expect(r).not.toContain(u("empty-lastmod"));
    // and it did not throw (we got here)
    expect(Array.isArray(r)).toBe(true);
  });

  it("returns at most 100 matches, newest lastmod first", () => {
    const pad = (n: number) => String(n).padStart(2, "0");
    // 120 URLs, all today (2026-10-11) with distinct minute timestamps.
    const blocks: string[] = [];
    for (let i = 0; i < 120; i++) {
      const ts = `2026-10-11T${pad(Math.floor(i / 60))}:${pad(i % 60)}:00Z`;
      blocks.push(url(`p${pad(i)}`, ts));
    }
    const xml = `<urlset>${blocks.join("")}</urlset>`;
    const r = selectUrls(xml, NOW);
    expect(r.length).toBe(100);
    expect(r[0]).toBe(u("p119")); // newest timestamp first
    expect(r[99]).toBe(u("p20")); // 100 newest -> p119..p20
    expect(r).not.toContain(u("p00")); // the 20 oldest are dropped
    expect(r).not.toContain(u("p19"));
  });
});
