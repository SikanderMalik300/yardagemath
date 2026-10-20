import { describe, it, expect } from "vitest";
import { searchCalculators, tileName } from "@/lib/data/homeSearch";

/**
 * Homepage search logic (redesign fixes Task 5). The keyboard/combobox
 * behaviour lives in the client component and is verified in the browser; here
 * we test the pure matching/ranking the component uses.
 */

const slugs = (q: string) => searchCalculators(q).map((c) => c.slug);

describe("home search", () => {
  it("'gravel' returns Gravel, Pea Gravel, Cubic Yard and Landscape Material", () => {
    const r = slugs("gravel");
    expect(r).toContain("gravel-calculator");
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

  it("name matches rank before keyword matches, name-starts-with wins", () => {
    // "Gravel Calculator" starts with "gravel" so it ranks first; "Pea Gravel
    // Calculator" only contains it; "Cubic Yard" has it only as a keyword.
    const r = slugs("gravel");
    expect(r[0]).toBe("gravel-calculator");
    expect(r.indexOf("gravel-calculator")).toBeLessThan(r.indexOf("pea-gravel-calculator"));
    expect(r.indexOf("pea-gravel-calculator")).toBeLessThan(r.indexOf("cubic-yard-calculator"));
  });

  it("ArrowDown then Enter would open the first result (results[0])", () => {
    // The component highlights index 0 on the first ArrowDown and opens it on Enter.
    expect(searchCalculators("gravel")[0].slug).toBe("gravel-calculator");
    expect(searchCalculators("block wall")[0] && tileName(searchCalculators("block wall")[0])).toContain("Block Wall");
  });

  it("'brick' and 'mortar' both resolve to the Brick Calculator first", () => {
    expect(slugs("brick")[0]).toBe("brick-calculator");
    // "mortar" is an explicit keyword for brick but only a blurb word for the
    // block calc, so brick ranks first.
    const m = slugs("mortar");
    expect(m[0]).toBe("brick-calculator");
    expect(m.indexOf("brick-calculator")).toBeLessThan(m.indexOf("concrete-block-calculator"));
  });

  it("'paver' and 'patio' both resolve to the Paver Calculator first", () => {
    expect(slugs("paver")[0]).toBe("paver-calculator");
    // "patio" also matches the slab and pea-gravel pages, but the Paver
    // Calculator is forced to the top.
    const p = slugs("patio");
    expect(p[0]).toBe("paver-calculator");
    expect(p).toContain("concrete-slab-cost-calculator");
  });

  it("'paver base' resolves to the Paver Base Calculator first", () => {
    // Name starts with "paver base"; plain "paver" still goes to the Paver Calculator.
    expect(slugs("paver base")[0]).toBe("paver-base-calculator");
    expect(slugs("paver")[0]).toBe("paver-calculator");
  });

  it("'retaining wall' and 'block wall' go to their own pages", () => {
    expect(slugs("retaining wall")[0]).toBe("retaining-wall-calculator");
    expect(slugs("block wall")[0]).toBe("block-wall-calculator");
  });

  it("'fill dirt', 'fill' and 'dirt' resolve to Fill Dirt first, Topsoil second for 'dirt'", () => {
    expect(slugs("fill dirt")[0]).toBe("fill-dirt-calculator");
    expect(slugs("fill")[0]).toBe("fill-dirt-calculator");
    const d = slugs("dirt");
    expect(d[0]).toBe("fill-dirt-calculator");
    expect(d[1]).toBe("topsoil-calculator");
  });

  it("'landscape rock', 'river rock' and 'lava rock' resolve to the Landscape Rock Calculator first; 'rock' shows it and Gravel", () => {
    expect(slugs("landscape rock")[0]).toBe("landscape-rock-calculator");
    expect(slugs("river rock")[0]).toBe("landscape-rock-calculator");
    expect(slugs("lava rock")[0]).toBe("landscape-rock-calculator");
    const r = slugs("rock");
    expect(r[0]).toBe("landscape-rock-calculator");
    expect(r).toContain("gravel-calculator");
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
