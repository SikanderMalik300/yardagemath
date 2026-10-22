"use client";

import { useState } from "react";
import { embedSnippet, embedUrl, type EmbedTool } from "@/lib/embed";

/** Collapsed "add this calculator to your site" box shown on the 4 embeddable tool pages. */
export function EmbedBox({ tool }: { tool: EmbedTool }) {
  const [copied, setCopied] = useState(false);
  const snippet = embedSnippet(tool);
  const id = `embed-code-${tool.slug}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.getElementById(id) as HTMLTextAreaElement | null;
      if (ta) {
        ta.focus();
        ta.select();
      }
    }
  };

  return (
    <details style={{ marginTop: "2rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", maxWidth: "var(--reading-max-width)" }}>
      <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--text-primary)" }}>Add this free calculator to your website</summary>
      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: "0.75rem 0 0.5rem" }}>
        Copy this code into your page. It&apos;s free to use; please keep the credit link.
      </p>
      <textarea
        id={id}
        readOnly
        value={snippet}
        rows={4}
        onFocus={(e) => e.currentTarget.select()}
        style={{ width: "100%", boxSizing: "border-box", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.75rem", lineHeight: 1.5, padding: "0.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", resize: "vertical", background: "var(--surface-muted)" }}
      />
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", alignItems: "center" }}>
        <button type="button" className="button-secondary" onClick={copy} style={{ minHeight: 40 }}>
          {copied ? "Copied" : "Copy code"}
        </button>
        <a href={embedUrl(tool.slug)} target="_blank" rel="noopener" style={{ fontSize: "0.875rem" }}>
          Preview
        </a>
      </div>
    </details>
  );
}
