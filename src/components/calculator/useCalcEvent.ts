"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Fire GA4 events the first time the user changes inputs away from the default
 * example (audit Task 4): `tool_used` on the first input change, and
 * `tool_result_shown` as the result re-renders from that change. No personal data.
 */
export function useFirstCalculate(slug: string, signature: string) {
  const initial = useRef(signature);
  const fired = useRef(false);

  useEffect(() => {
    if (!fired.current && signature !== initial.current) {
      fired.current = true;
      trackEvent("tool_used", { tool: slug });
      trackEvent("tool_result_shown", { tool: slug });
    }
  }, [signature, slug]);
}
