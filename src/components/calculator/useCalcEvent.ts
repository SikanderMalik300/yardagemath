"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Fire a `calculate` analytics event the first time the user changes inputs
 * away from the default example (build-spec A9).
 */
export function useFirstCalculate(slug: string, signature: string) {
  const initial = useRef(signature);
  const fired = useRef(false);

  useEffect(() => {
    if (!fired.current && signature !== initial.current) {
      fired.current = true;
      trackEvent("calculate", { tool: slug });
    }
  }, [signature, slug]);
}
