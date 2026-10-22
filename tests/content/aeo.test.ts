import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, resolve, extname } from "node:path";
import { calculators } from "@/data/calculators";
import { fmtDate } from "@/lib/format";

/**
 * AEO/GEO fixes. Runs against built out/*.html when a build is present.
 *  - Fix 1: every tool page has a WebPage node with author, datePublished and
 *    dateModified, and dateModified matches the visible "Last updated" date.
 *  - Fix 2: every <table> in built HTML has a <caption>.
 */

const ROOT = resolve(__dirname, "..", "..");
const OUT = join(ROOT, "out");

function walk(dir: string, exts: string[]): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p, exts));
    else if (exts.includes(extname(p))) out.push(p);
  }
  return out;
}

function jsonLdBlocks(html: string): Record<string, unknown>[] {
  return [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) =>
    JSON.parse(m[1])
  );
}

describe("AEO/GEO: WebPage schema on tool pages", () => {
  it("each tool page has a WebPage with author, datePublished and dateModified = visible date", () => {
    if (!existsSync(OUT)) return; // build not present
    for (const cal of calculators) {
      const file = join(OUT, cal.slug, "index.html");
      if (!existsSync(file)) continue;
      const html = readFileSync(file, "utf8");
      const wp = jsonLdBlocks(html).find((b) => b["@type"] === "WebPage") as Record<string, unknown> | undefined;
      expect(wp, `${cal.slug}: WebPage node`).toBeTruthy();
      expect(wp!.author, `${cal.slug}: WebPage.author`).toBeTruthy();
      expect(wp!.datePublished, `${cal.slug}: datePublished`).toBe(cal.datePublished);
      expect(wp!.dateModified, `${cal.slug}: dateModified`).toBe(cal.lastUpdated);
      expect(html, `${cal.slug}: visible Last updated date`).toContain(fmtDate(cal.lastUpdated));
    }
  });
});

describe("AEO/GEO: every data table has a caption", () => {
  it("no built HTML <table> is missing a <caption>", () => {
    if (!existsSync(OUT)) return; // build not present
    const offenders: string[] = [];
    for (const file of walk(OUT, [".html"])) {
      const html = readFileSync(file, "utf8");
      for (const m of html.matchAll(/<table[\s\S]*?<\/table>/gi)) {
        if (!/<caption[\s>]/i.test(m[0])) {
          offenders.push(file.replace(ROOT, "."));
          break;
        }
      }
    }
    expect(offenders, `tables missing caption: ${offenders.join(", ")}`).toEqual([]);
  });
});
