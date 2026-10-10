import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Homepage redesign style guardrails (redesign spec 5.3). Fails if any homepage
 * component contains a gradient, a banned hue, an emoji, or an em dash.
 */

const FILES = [
  "src/app/page.tsx",
  "src/components/home/Hero.tsx",
  "src/components/home/HomeTile.tsx",
  "src/components/home/HomeSearch.tsx",
  "src/components/home/HomePhoto.tsx",
  "src/components/home/homeFont.ts",
  "src/components/home/home.module.css",
  "src/lib/data/photos.ts",
];

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}]/u;

describe("homepage redesign: no banned styles or characters", () => {
  for (const rel of FILES) {
    const file = path.join(process.cwd(), rel);
    const src = fs.readFileSync(file, "utf8").toLowerCase();
    const raw = fs.readFileSync(file, "utf8");

    it(`${rel}: no gradient`, () => {
      expect(src.includes("gradient")).toBe(false);
    });
    it(`${rel}: no purple / violet / fuchsia`, () => {
      expect(src.includes("purple")).toBe(false);
      expect(src.includes("violet")).toBe(false);
      expect(src.includes("fuchsia")).toBe(false);
    });
    it(`${rel}: no em dash (U+2014)`, () => {
      expect(raw.includes("—")).toBe(false);
    });
    it(`${rel}: no emoji`, () => {
      expect(EMOJI.test(raw)).toBe(false);
    });
  }
});
