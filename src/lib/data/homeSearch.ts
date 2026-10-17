import { calculators, type Calculator } from "@/data/calculators";

/**
 * Home-only search synonyms (redesign fixes Task 5). Kept here, not on the
 * registry, so the registry / JSON-LD / other pages stay byte-identical. These
 * are used only by the homepage search and are never shown on the page.
 */
export const SEARCH_KEYWORDS: Record<string, string[]> = {
  "cubic-yard-calculator": ["yard", "yards", "gravel", "dirt", "fill", "soil", "sand", "stone", "rock", "mulch"],
  "concrete-block-calculator": ["cmu", "cinder", "block", "blocks", "wall"],
  "concrete-slab-cost-calculator": ["slab", "patio", "driveway", "pad", "concrete cost", "sidewalk"],
  "yards-of-concrete-calculator": ["concrete", "ready mix", "truck", "driveway", "patio", "footing", "column", "sonotube"],
  "block-wall-calculator": ["retaining wall", "garden wall", "cmu wall", "grout", "rebar"],
  "concrete-block-weight": ["weight", "heavy", "pallet", "truck", "load"],
  "cmu-block-sizes": ["size", "dimensions", "8x8x16", "nominal", "actual", "course"],
  // "brick" resolves here first (name starts with it); "mortar" resolves here
  // first because it is an explicit keyword, beating the block calc's blurb mention.
  "brick-calculator": ["brick", "bricks", "brick wall", "masonry", "mortar", "veneer", "modular", "queen", "king", "pavers brick"],
  "topsoil-calculator": ["soil", "dirt", "garden", "raised bed", "lawn"],
  "pea-gravel-calculator": ["gravel", "stone", "path", "patio", "rock"],
  // "gravel" resolves to the Gravel Calculator first (its name starts with the
  // query, which beats Pea Gravel's name-contains match), then Pea Gravel, then
  // Cubic Yard via its keyword.
  "gravel-calculator": ["gravel", "crushed stone", "rock", "driveway", "#57", "crusher run", "road base", "river rock", "tons", "base"],
  // "sand" resolves to the Sand Calculator first (its name starts with the query).
  "sand-calculator": ["sand", "play sand", "sandbox", "paver sand", "leveling sand", "mason sand", "concrete sand", "bedding", "polymeric"],
  // "paver" resolves here first (name starts with it); "patio" is forced here first
  // via QUERY_PRIORITY, ahead of the slab and pea-gravel patio keywords.
  "paver-calculator": ["paver", "pavers", "patio", "walkway", "brick pavers", "herringbone", "stone pavers", "patio stones", "hardscape"],
  // "paver base" resolves here first (the name starts with it); "paver" alone
  // still goes to the Paver Calculator, which is earlier in the registry.
  "paver-base-calculator": ["paver base", "base gravel", "crusher run", "road base", "compaction", "patio base", "driveway base", "sub-base"],
  // "retaining wall" resolves here first (the name starts with it); "block wall"
  // still goes to the Block Wall Calculator, whose name starts with that.
  "retaining-wall-calculator": ["retaining wall", "wall blocks", "garden wall", "landscape blocks", "segmental", "cap blocks", "terrace"],
  "square-yard-calculator": ["carpet", "flooring", "sod", "turf", "square feet"],
  "landscape-materials-calculator": ["mulch", "rock", "stone", "sand", "bark", "gravel", "river rock"],
  // "mulch" resolves to the Mulch Calculator first because its name matches (name
  // matches rank before keyword matches); these add bed/ring/bag synonyms.
  "mulch-calculator": ["mulch", "bark", "wood chips", "bags", "flower bed", "garden bed", "tree ring", "cover"],
  "gutter-slope-calculator": ["downspout", "pitch", "drainage", "roof"],
  "rip-rap-calculator": ["riprap", "boulders", "erosion", "shoreline", "creek"],
  "lawn-mowing-cost-calculator": ["mow", "mowing", "grass", "lawn care", "price"],
  "acres-per-hour-calculator": ["mower", "acres", "field", "riding mower", "time"],
};

export function tileName(c: Calculator): string {
  return c.h1.replace(/\s*\(.*\)/, "");
}

/**
 * For a few generic queries that several tools legitimately match, force the
 * best page to the top. ("patio" matches the slab and pea-gravel pages too, but
 * the Paver Calculator is the intended landing page for a patio search.)
 */
const QUERY_PRIORITY: Record<string, string> = {
  patio: "paver-calculator",
};

/**
 * Search the calculators by name, description and keywords (case-insensitive,
 * partial-word / substring). Name matches are ranked before keyword matches.
 * Returns at most `limit` results (default 8).
 */
export function searchCalculators(query: string, limit = 8): Calculator[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const nameStarts: Calculator[] = [];
  const nameContains: Calculator[] = [];
  const keywordExplicit: Calculator[] = [];
  const keywordDesc: Calculator[] = [];
  for (const c of calculators) {
    const name = tileName(c).toLowerCase();
    if (name.startsWith(q)) {
      nameStarts.push(c);
      continue;
    }
    if (name.includes(q)) {
      nameContains.push(c);
      continue;
    }
    const explicit = [c.primaryKeyword, ...c.secondaryKeywords, ...(SEARCH_KEYWORDS[c.slug] ?? [])]
      .join(" ")
      .toLowerCase();
    if (explicit.includes(q)) {
      keywordExplicit.push(c);
      continue;
    }
    if (c.cardDescription.toLowerCase().includes(q)) keywordDesc.push(c);
  }
  // Ranking tiers: name-starts-with, name-contains, an explicit keyword match
  // (primary/secondary/search keywords), then a description-only match. This is
  // why "mortar" resolves to the Brick Calculator (an explicit keyword) before
  // the Concrete Block Calculator (which only mentions mortar in its blurb).
  const results = [...nameStarts, ...nameContains, ...keywordExplicit, ...keywordDesc];
  const preferred = QUERY_PRIORITY[q];
  if (preferred) {
    const i = results.findIndex((c) => c.slug === preferred);
    if (i > 0) results.unshift(results.splice(i, 1)[0]);
  }
  return results.slice(0, limit);
}
