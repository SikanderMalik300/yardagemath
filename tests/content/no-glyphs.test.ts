import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, resolve, extname } from "node:path";

/**
 * Batch 4 Day 2, Fix 1 and Fix 2. The built HTML, outside <script>, must not
 * contain:
 *  - Greek letters (U+0370..U+03FF) — the visible "pi" was pulling in a Greek
 *    font subset and hurting LCP; formulas now use 3.1416.
 *  - vulgar-fraction glyphs (U+2150..U+215F) such as the eighths/thirds; sizes
 *    are written as decimals instead.
 *  - em dashes (U+2014); Sources and visible text use ": " / ". " instead.
 * Runs against out/*.html when a build is present (the re-verify step).
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

/** Remove <script> and <style> blocks so JSON-LD and inline JS are not scanned. */
function visibleHtml(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
}

function findChars(text: string, re: RegExp): string[] {
  const g = new RegExp(re.source, "g");
  const hits: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = g.exec(text)) && hits.length < 3) {
    hits.push(`${JSON.stringify(m[0])}@"${text.slice(Math.max(0, m.index - 24), m.index + 6).replace(/\s+/g, " ")}"`);
  }
  return hits;
}

describe("no Greek, fraction glyphs or em dashes in built HTML (Fix 1 & Fix 2)", () => {
  it("out/*.html visible text has no Greek (U+0370-03FF) or fraction glyphs (U+2150-215F)", () => {
    if (!existsSync(OUT)) return; // build not present
    const offenders: string[] = [];
    for (const file of walk(OUT, [".html"])) {
      const text = visibleHtml(readFileSync(file, "utf8"));
      const bad = [...findChars(text, /[Ͱ-Ͽ]/), ...findChars(text, /[⅐-⅟]/)];
      if (bad.length) offenders.push(`${file.replace(ROOT, ".")}: ${bad.join(", ")}`);
    }
    expect(offenders, offenders.join(" | ")).toEqual([]);
  });

  it("out/*.html visible text has no em dashes (U+2014)", () => {
    if (!existsSync(OUT)) return; // build not present
    const offenders: string[] = [];
    for (const file of walk(OUT, [".html"])) {
      const text = visibleHtml(readFileSync(file, "utf8"));
      const bad = findChars(text, /—/);
      if (bad.length) offenders.push(`${file.replace(ROOT, ".")}: ${bad.join(", ")}`);
    }
    expect(offenders, offenders.join(" | ")).toEqual([]);
  });
});
