import type { ReactNode } from "react";

/**
 * One coherent calculator card with a two-column layout on desktop
 * (inputs left, results right) that stacks on mobile (design.md §7).
 */
export function CalculatorShell({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="calculator-card">
      <div className="calculator-layout">
        <div>{left}</div>
        <div style={{ position: "sticky", top: 80 }}>{right}</div>
      </div>
    </div>
  );
}
