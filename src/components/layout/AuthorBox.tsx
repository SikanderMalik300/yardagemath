import Link from "next/link";
import { fmtDate } from "@/lib/format";
import { SITE } from "@/lib/constants";

/** Author & update box (build-spec A5 step 11). No ratings/reviews. */
export function AuthorBox({ sources, lastUpdated }: { sources: string[]; lastUpdated: string }) {
  return (
    <section
      aria-label="About this calculator"
      style={{
        marginTop: "2.5rem",
        padding: "1.125rem 1.25rem",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        background: "var(--surface-muted)",
        fontSize: "0.875rem",
        color: "var(--text-secondary)",
      }}
    >
      <p style={{ margin: 0 }}>
        Built and maintained by{" "}
        <Link href="/authors/sikander-mushtaq/" style={{ fontWeight: 700 }}>
          {SITE.founder}
        </Link>
        . Formulas checked against {sources.join(", ")}.{" "}
        <Link href="/how-we-calculate/">See our methodology and sources</Link>, or{" "}
        <Link href="/about/">learn about YardageMath</Link>.{" "}
        <Link href="/editorial-policy/">See our editorial policy</Link>.
      </p>
      <p style={{ margin: "0.5rem 0 0", color: "var(--text-muted)" }}>
        Last updated: <time dateTime={lastUpdated}>{fmtDate(lastUpdated)}</time>
      </p>
    </section>
  );
}

/** One-line estimates disclaimer shown on every calculator page. */
export function DisclaimerLine() {
  return (
    <p style={{ marginTop: "1.5rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
      Estimates only. Confirm quantities with your supplier or contractor.{" "}
      <Link href="/disclaimer/">Read the full disclaimer</Link>.
    </p>
  );
}
