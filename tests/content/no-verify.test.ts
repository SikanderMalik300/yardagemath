import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, resolve, extname } from "node:path";

/**
 * Audit P1 #2: no user-visible "verify" wording (the word "verified" is allowed).
 * Internal `VERIFY` comments live only in constants.ts and are not rendered.
 *
 * We check two things:
 *  1. Rendered-content source files (pages/components/data) with inline + block
 *     comments stripped — this catches reintroductions during normal `npm test`.
 *  2. The built out/*.html, when a build is present (as in the re-verify step).
 */

const ROOT = resolve(__dirname, "..", "..");
const NEEDLE = /verif(?!ied)/i; // flags verify/verifying/verification, allows "verified"

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

function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

describe("no user-visible 'verify' wording", () => {
  it("rendered-content source files contain no 'verify'", () => {
    const dirs = [
      join(ROOT, "src", "app"),
      join(ROOT, "src", "components"),
      join(ROOT, "src", "data"),
    ];
    // constants.ts holds internal VERIFY comments + a `verify?` type field; sources.ts is data.
    const exclude = /constants\.ts$|sources\.ts$|\.test\./;

    const offenders: string[] = [];
    for (const dir of dirs) {
      for (const file of walk(dir, [".ts", ".tsx"])) {
        if (exclude.test(file)) continue;
        const code = stripComments(readFileSync(file, "utf8"));
        if (NEEDLE.test(code)) offenders.push(file.replace(ROOT, "."));
      }
    }
    expect(offenders, `files with 'verify' text: ${offenders.join(", ")}`).toEqual([]);
  });

  it("built out/*.html contains no 'verify' (when a build is present)", () => {
    const outDir = join(ROOT, "out");
    if (!existsSync(outDir)) return; // build not present — covered by the source-file check above
    const offenders: string[] = [];
    for (const file of walk(outDir, [".html"])) {
      if (NEEDLE.test(readFileSync(file, "utf8"))) offenders.push(file.replace(ROOT, "."));
    }
    expect(offenders, `HTML with 'verify' text: ${offenders.join(", ")}`).toEqual([]);
  });
});
