import type { ReactNode } from "react";
import { toolUrl } from "@/lib/embed";

/**
 * In-frame wrapper for an embedded calculator: a small heading, the calculator,
 * an "estimates only" line and a single credit link back to the full tool page.
 */
export function EmbedFrame({ slug, title, children }: { slug: string; title: string; children: ReactNode }) {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", color: "#14281c", lineHeight: 1.5 }}>
      <h2 style={{ fontSize: "1.1875rem", fontWeight: 700, margin: "0 0 0.75rem" }}>{title}</h2>
      {children}
      <p style={{ fontSize: "0.75rem", color: "#53605a", margin: "0.75rem 0 0" }}>
        Estimates for planning only. Confirm quantities with your supplier.
      </p>
      <p style={{ fontSize: "0.8125rem", margin: "0.375rem 0 0" }}>
        Free calculator by{" "}
        <a href={toolUrl(slug)} target="_blank" rel="noopener" style={{ color: "#236b4b" }}>
          YardageMath
        </a>
      </p>
    </div>
  );
}
