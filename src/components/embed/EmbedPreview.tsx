"use client";

import { useState } from "react";

/**
 * Placeholder button that inserts the iframe only on click, so the index page
 * loads no embed iframes (and their ~110 kB each) on first paint. The button is
 * the same height as the iframe, so revealing it shifts nothing.
 */
export function EmbedPreview({ src, title }: { src: string; title: string }) {
  const [show, setShow] = useState(false);

  if (show) {
    return (
      <iframe
        src={src}
        title={title}
        width="100%"
        height={620}
        style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", maxWidth: 700, display: "block" }}
        loading="lazy"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShow(true)}
      aria-label={`Show live preview of ${title}`}
      style={{
        width: "100%",
        maxWidth: 700,
        height: 620,
        border: "1px dashed var(--border)",
        borderRadius: "var(--radius-sm)",
        background: "var(--surface-muted)",
        color: "var(--brand)",
        fontWeight: 600,
        fontSize: "1rem",
        cursor: "pointer",
        display: "block",
      }}
    >
      Show live preview
    </button>
  );
}
