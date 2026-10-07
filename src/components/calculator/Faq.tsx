import type { Faq as FaqItem } from "@/data/calculators";

/**
 * FAQ accordion (build-spec A5 step 9, design.md §12).
 * Native <details> — keyboard accessible and the answer text is in the static
 * HTML word-for-word, matching the FAQPage JSON-LD.
 */
export function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  return (
    <section aria-labelledby="faq-heading" style={{ marginTop: "2.5rem" }}>
      <h2 id="faq-heading" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Frequently asked questions
      </h2>
      <div style={{ display: "grid", gap: "0.625rem" }}>
        {faqs.map((f, i) => (
          <details
            key={i}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              background: "var(--surface)",
            }}
          >
            <summary
              style={{
                padding: "0.875rem 1rem",
                fontWeight: 600,
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                color: "var(--text-primary)",
              }}
            >
              <span>{f.q}</span>
              <span aria-hidden="true" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                ▾
              </span>
            </summary>
            <div style={{ padding: "0 1rem 1rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {f.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
