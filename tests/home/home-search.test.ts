import { describe, it, expect } from "vitest";
import { searchCalculators, tileName } from "@/lib/data/homeSearch";

/**
 * Homepage search logic (redesign fixes Task 5). The keyboard/combobox
 * behaviour lives in the client component and is verified in the browser; here
 * we test the pure matching/ranking the component uses.
 */

const slugs = (q: string) => searchCalculators(q).map((c) => c.slug);

describe("home search", () => {
  it("'gravel' returns at least Pea Gravel, Cubic Yard and Landscape Material", () => {
    const r = slugs("gravel");
    expect(r).toContain("pea-gravel-calculator");
    expect(r).toContain("cubic-yard-calculator");
    expect(r).toContain("landscape-materials-calculator");
  });

  it("'driveway' returns Concrete Slab Cost and Yards of Concrete", () => {
    const r = slugs("driveway");
    expect(r).toContain("concrete-slab-cost-calculator");
    expect(r).toContain("yards-of-concrete-calculator");
  });

  it("'xyzzy' returns no results", () => {
    expect(searchCalculators("xyzzy")).toEqual([]);
  });

  it("empty query returns nothing", () => {
    expect(searchCalculators("")).toEqual([]);
    expect(searchCalculators("   ")).toEqual([]);
  });

  it("name matches rank before keyword matches", () => {
    // "gravel" is in the Pea Gravel name but only a keyword for Cubic Yard.
    const r = slugs("gravel");
    expect(r[0]).toBe("pea-gravel-calculator");
    expect(r.indexOf("pea-gravel-calculator")).toBeLessThan(r.indexOf("cubic-yard-calculator"));
  });

  it("ArrowDown then Enter would open the first result (results[0])", () => {
    // The component highlights index 0 on the first ArrowDown and opens it on Enter.
    expect(searchCalculators("gravel")[0].slug).toBe("pea-gravel-calculator");
    expect(searchCalculators("block wall")[0] && tileName(searchCalculators("block wall")[0])).toContain("Block Wall");
  });

  it("partial words match (e.g. 'grav' -> gravel)", () => {
    expect(slugs("grav")).toContain("pea-gravel-calculator");
  });

  it("is case-insensitive", () => {
    expect(slugs("GRAVEL")).toContain("pea-gravel-calculator");
  });

  it("returns at most 8 results", () => {
    expect(searchCalculators("a").length).toBeLessThanOrEqual(8);
    expect(searchCalculators("calculator").length).toBeLessThanOrEqual(8);
  });
});
