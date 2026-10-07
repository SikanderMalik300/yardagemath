import type { Calculator } from "@/data/calculators";
import { getRelated } from "@/data/calculators";
import { ToolCard } from "./ToolCard";

/** 3–5 related tool cards (build-spec A5 step 10). */
export function RelatedTools({ cal }: { cal: Calculator }) {
  const related = getRelated(cal).slice(0, 5);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" style={{ marginTop: "2.5rem" }}>
      <h2 id="related-heading" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Related calculators
      </h2>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        }}
      >
        {related.map((r) => (
          <ToolCard key={r.slug} cal={r} />
        ))}
      </div>
    </section>
  );
}
