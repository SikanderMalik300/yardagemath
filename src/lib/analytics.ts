/** Lightweight analytics event helper (build-spec A9). No-op until GA is present. */

type GtagWindow = Window & {
  gtag?: (command: string, event: string, params?: Record<string, unknown>) => void;
};

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  if (typeof w.gtag === "function") {
    w.gtag("event", name, params);
  }
}

/** Parse a possibly-empty string input to a safe non-negative number. */
export function num(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}
