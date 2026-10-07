"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Copy result / Share link / Print / Reset (build-spec A5 step 4, design.md §8).
 * Share link encodes inputs as query params; the page canonical stays clean.
 */
export function ResultActions({
  slug,
  getSummary,
  getShareParams,
  onReset,
}: {
  slug: string;
  getSummary: () => string;
  getShareParams: () => Record<string, string | number>;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState<"none" | "result" | "link">("none");

  async function copyText(text: string, which: "result" | "link") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      window.setTimeout(() => setCopied("none"), 1800);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — fail quietly.
    }
  }

  function handleCopy() {
    copyText(getSummary(), "result");
    trackEvent("copy_result", { tool: slug });
  }

  function handleShare() {
    const params = new URLSearchParams(
      Object.entries(getShareParams()).map(([k, v]) => [k, String(v)])
    );
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    copyText(url, "link");
    trackEvent("share_link", { tool: slug });
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
      <button type="button" className="button-primary" onClick={handleCopy}>
        {copied === "result" ? "Copied ✓" : "Copy result"}
      </button>
      <button type="button" className="button-secondary" onClick={handleShare}>
        {copied === "link" ? "Link copied ✓" : "Share link"}
      </button>
      <button type="button" className="button-secondary" onClick={() => window.print()}>
        Print
      </button>
      <button type="button" className="button-secondary" onClick={onReset}>
        Reset example
      </button>
    </div>
  );
}
