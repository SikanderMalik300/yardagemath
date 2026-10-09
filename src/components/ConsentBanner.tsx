"use client";

import { useEffect, useState } from "react";

/**
 * GDPR consent banner (audit Task 4). Shown ONLY to visitors in the EEA, UK and
 * Switzerland, where Consent Mode defaults analytics to denied. Everywhere else
 * analytics is granted by default and no banner appears.
 *
 * Region is detected from the browser time zone (a static site has no server-side
 * geo). The check is deliberately over-inclusive for European zones, which only
 * means a few extra visitors are asked to opt in.
 */
const STORAGE_KEY = "ym-consent";

const EXTRA_EURO_ZONES = new Set([
  "Atlantic/Reykjavik", // Iceland
  "Atlantic/Canary", // Spain
  "Atlantic/Madeira", // Portugal
  "Atlantic/Azores", // Portugal
]);

function inConsentRegion(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    return tz.startsWith("Europe/") || EXTRA_EURO_ZONES.has(tz);
  } catch {
    return false;
  }
}

type Choice = "granted" | "denied";

function updateConsent(choice: Choice) {
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", {
      analytics_storage: choice,
      ad_storage: choice,
      ad_user_data: choice,
      ad_personalization: choice,
    });
  }
}

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // No GA configured -> nothing to consent to.
    if (!process.env.NEXT_PUBLIC_GA_ID) return;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage blocked */
    }
    if (stored === "granted" || stored === "denied") {
      updateConsent(stored);
      return;
    }
    if (inConsentRegion()) setShow(true);
  }, []);

  function choose(choice: Choice) {
    updateConsent(choice);
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* storage blocked */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 60,
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        boxShadow: "0 -2px 10px rgba(23, 32, 27, 0.12)",
        padding: "1rem",
      }}
    >
      <div
        className="container-content"
        style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", justifyContent: "space-between" }}
      >
        <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: 640 }}>
          We use Google Analytics cookies to see which calculators people use and how the site
          performs. Analytics stays off until you accept.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
          <button type="button" className="button-secondary" onClick={() => choose("denied")}>
            Decline
          </button>
          <button type="button" className="button-primary" onClick={() => choose("granted")}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
