/** Embeddable calculators: the 4 tools offered as iframes, plus snippet helpers. */
import { SITE } from "./constants";

export interface EmbedTool {
  slug: string;
  /** Tool page H1, used for the iframe title and the embed heading. */
  title: string;
  /** Credit text shown under the frame, e.g. "Mulch calculator". */
  credit: string;
  /** One line describing what the tool works out (index page). */
  blurb: string;
}

export const EMBED_TOOLS: EmbedTool[] = [
  { slug: "mulch-calculator", title: "Mulch Calculator", credit: "Mulch calculator", blurb: "How much mulch for beds and tree rings: cubic yards, bags and coverage." },
  { slug: "gravel-calculator", title: "Gravel Calculator", credit: "Gravel calculator", blurb: "How much gravel for a driveway, path or patio: cubic yards, tons and bags." },
  { slug: "topsoil-calculator", title: "Topsoil Calculator", credit: "Topsoil calculator", blurb: "How much topsoil for lawns and beds: cubic yards, tons and bags." },
  { slug: "yards-of-concrete-calculator", title: "Yards of Concrete Calculator", credit: "Concrete calculator", blurb: "How many cubic yards of concrete for a slab, footing or column, with bags and cost." },
];

export const EMBED_SLUGS: string[] = EMBED_TOOLS.map((t) => t.slug);

export function isEmbeddable(slug: string): boolean {
  return EMBED_SLUGS.includes(slug);
}

export function embedUrl(slug: string): string {
  return `${SITE.url}/embed/${slug}/`;
}

export function toolUrl(slug: string): string {
  return `${SITE.url}/${slug}/`;
}

export function embedTool(slug: string): EmbedTool | undefined {
  return EMBED_TOOLS.find((t) => t.slug === slug);
}

/** The copy-paste snippet: a responsive iframe plus a plain credit link outside it. */
export function embedSnippet(t: EmbedTool): string {
  return (
    `<iframe src="${embedUrl(t.slug)}" title="${t.title} by YardageMath" width="100%" height="620" style="border:0;max-width:700px" loading="lazy"></iframe>\n` +
    `<p style="font-size:13px;margin:4px 0 0">${t.credit} by <a href="${toolUrl(t.slug)}">YardageMath</a></p>`
  );
}
