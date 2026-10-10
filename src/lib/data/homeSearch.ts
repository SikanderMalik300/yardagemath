import { calculators, type Calculator } from "@/data/calculators";

/**
 * Home-only search synonyms (redesign fixes Task 5). Kept here, not on the
 * registry, so the registry / JSON-LD / other pages stay byte-identical. These
 * are used only by the homepage search and are never shown on the page.
 */
export const SEARCH_KEYWORDS: Record<string, string[]> = {
  "cubic-yard-calculator": ["yard", "yards", "gravel", "dirt", "fill", "soil", "sand", "stone", "rock", "mulch"],
  "concrete-block-calculator": ["cmu", "cinder", "block", "blocks", "wall", "mortar"],
  "concrete-slab-cost-calculator": ["slab", "patio", "driveway", "pad", "concrete cost", "sidewalk"],
  "yards-of-concrete-calculator": ["concrete", "ready mix", "truck", "driveway", "patio", "footing", "column", "sonotube"],
  "block-wall-calculator": ["retaining wall", "garden wall", "cmu wall", "grout", "rebar"],
  "concrete-block-weight": ["weight", "heavy", "pallet", "truck", "load"],
  "cmu-block-sizes": ["size", "dimensions", "8x8x16", "nominal", "actual", "course"],
  "topsoil-calculator": ["soil", "dirt", "garden", "raised bed", "lawn"],
  "pea-gravel-calculator": ["gravel", "stone", "path", "patio", "rock"],
  "square-yard-calculator": ["carpet", "flooring", "sod", "turf", "square feet"],
  "landscape-materials-calculator": ["mulch", "rock", "stone", "sand", "bark", "gravel", "river rock"],
  "gutter-slope-calculator": ["downspout", "pitch", "drainage", "roof"],
  "rip-rap-calculator": ["riprap", "boulders", "erosion", "shoreline", "creek"],
  "lawn-mowing-cost-calculator": ["mow", "mowing", "grass", "lawn care", "price"],
  "acres-per-hour-calculator": ["mower", "acres", "field", "riding mower", "time"],
};

export function tileName(c: Calculator): string {
  return c.h1.replace(/\s*\(.*\)/, "");
}

/**
 * Search the calculators by name, description and keywords (case-insensitive,
 * partial-word / substring). Name matches are ranked before keyword matches.
 * Returns at most `limit` results (default 8).
 */
export function searchCalculators(query: string, limit = 8): Calculator[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const nameMatches: Calculator[] = [];
  const keywordMatches: Calculator[] = [];
  for (const c of calculators) {
    if (tileName(c).toLowerCase().includes(q)) {
      nameMatches.push(c);
      continue;
    }
    const hay = [c.cardDescription, c.primaryKeyword, ...c.secondaryKeywords, ...(SEARCH_KEYWORDS[c.slug] ?? [])]
      .join(" ")
      .toLowerCase();
    if (hay.includes(q)) keywordMatches.push(c);
  }
  return [...nameMatches, ...keywordMatches].slice(0, limit);
}
