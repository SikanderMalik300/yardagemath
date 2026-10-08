"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mobile-only sticky result bar (audit Task 5). Shows the primary result at the
 * bottom of the screen after the user changes an input (not for the default
 * example). An in-flow spacer reserves the height so the bar never covers inputs.
 * Hidden at ≥768px via CSS.
 */
export function StickyResultBar({ label, value, unit }: { label: string; value: string; unit?: string }) {
  const initial = useRef(value);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (value !== initial.current) setShown(true);
  }, [value]);

  if (!shown) return null;

  return (
    <>
      <div className="sticky-result-spacer" aria-hidden="true" />
      <div className="sticky-result-bar" aria-live="polite">
        <span className="sticky-result-bar__label">{label}</span>
        <span className="sticky-result-bar__value numeric">
          {value}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
    </>
  );
}
