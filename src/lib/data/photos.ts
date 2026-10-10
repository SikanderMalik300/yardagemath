/**
 * Homepage photography metadata (redesign spec section 3).
 * Real photographs only, all from Pexels (Pexels License, free for commercial
 * use). The hero caption and the Photo credits section are generated from here.
 *
 * `file` is the base name (the Pexels photo ID); the <picture> component builds
 *   /photos/<file>-<width>.<avif|webp|jpg>
 * at the widths in HERO_WIDTHS / TILE_WIDTHS. `sourceUrl` resolves to the photo
 * page on Pexels, which names the photographer.
 */

export type PhotoSource = "Unsplash" | "Pexels";

export interface Photo {
  id: string;
  file: string;
  sourceUrl: string;
  photographer: string;
  photographerUrl: string;
  source: PhotoSource;
  license: string;
  alt: string;
  focalX: number;
  focalY: number;
  usedOn: string[];
}

export const HERO_WIDTHS = [640, 1280];
export const TILE_WIDTHS = [300, 600];

const PEXELS_LICENSE = "Pexels License (free for commercial use)";
const pexels = (id: string) => `https://www.pexels.com/photo/${id}/`;

function p(
  id: string,
  photographer: string,
  alt: string,
  usedOn: string[],
  focalX = 0.5,
  focalY = 0.5
): Photo {
  return {
    id,
    file: id,
    sourceUrl: pexels(id),
    photographer,
    photographerUrl: pexels(id),
    source: "Pexels",
    license: PEXELS_LICENSE,
    alt,
    focalX,
    focalY,
    usedOn,
  };
}

export const HERO: Photo = p(
  "37121398",
  "Betongsmcsg",
  "Fresh concrete slab being smoothed with a power screed",
  ["hero"],
  0.5,
  0.6
);

export const TOOL_PHOTOS: Record<string, Photo> = {
  "cubic-yard-calculator": p("9060032", "Brett Sayles", "A large mound of landscaping soil", ["cubic-yard-calculator"]),
  "concrete-block-calculator": p("8180037", "Ian Panelo", "A pile of grey concrete blocks outdoors", ["concrete-block-calculator"]),
  "concrete-slab-cost-calculator": p("13041122", "Perqued", "A poured concrete patio in front of a modern house", ["concrete-slab-cost-calculator"], 0.5, 0.68),
  "topsoil-calculator": p("11573789", "Alfo Medeiros", "A shovel in a pile of dark topsoil", ["topsoil-calculator"]),
  "pea-gravel-calculator": p("26925731", "Dr Photographer 152", "A shovel in a pile of pea gravel", ["pea-gravel-calculator"]),
  "block-wall-calculator": p("15576553", "Ulrick T", "Concrete block walls under construction", ["block-wall-calculator"]),
  "yards-of-concrete-calculator": p("26107204", "Piotr Jachowicz", "Fresh concrete poured into a footing form", ["yards-of-concrete-calculator"]),
  "concrete-block-weight": p("37528607", "Shox", "Grey concrete blocks stacked on a wooden pallet", ["concrete-block-weight"], 0.5, 0.55),
  "cmu-block-sizes": p("14408706", "Huys Photography", "Grey hollow concrete blocks showing the cores", ["cmu-block-sizes"]),
  "square-yard-calculator": p("39901273", "Shadow Photography", "A yellow tape measure extended across a surface", ["square-yard-calculator"]),
  "landscape-materials-calculator": p("9890699", "Magda Ehlers", "Brown bark mulch in a garden bed", ["landscape-materials-calculator"]),
  "gutter-slope-calculator": p("20113440", "Zeynep Sude Emek", "A rain gutter along a house roof edge", ["gutter-slope-calculator"], 0.5, 0.4),
  "rip-rap-calculator": p("11845363", "Henry Chau", "Large angular rip rap rock along a shoreline", ["rip-rap-calculator"], 0.5, 0.62),
  "lawn-mowing-cost-calculator": p("17151642", "Vanda Bako", "A lawn mower on a freshly cut striped lawn", ["lawn-mowing-cost-calculator"]),
  "acres-per-hour-calculator": p("9229815", "introspectivedsgn", "A riding mower on a large green lawn", ["acres-per-hour-calculator"]),
};

export function photoForSlug(slug: string): Photo | undefined {
  return TOOL_PHOTOS[slug];
}

/** All photos used on the homepage, for the Photo credits section. */
export function allHomePhotos(): Photo[] {
  const seen = new Set<string>();
  const list: Photo[] = [];
  for (const ph of [HERO, ...Object.values(TOOL_PHOTOS)]) {
    if (seen.has(ph.id)) continue;
    seen.add(ph.id);
    list.push(ph);
  }
  return list;
}
