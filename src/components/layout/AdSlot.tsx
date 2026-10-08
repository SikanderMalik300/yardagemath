/**
 * Reserved ad container (build-spec A10, design.md §18).
 * Renders a fixed-height, visually quiet placeholder so adding ads later
 * causes no layout shift (CLS). Shows NOTHING until NEXT_PUBLIC_ADSENSE_ID is set,
 * and never shows placeholder advertising content during development.
 *
 * Never place between inputs and results, and never above the calculator on mobile.
 */
type AdSlotProps = {
  /** Reserved min-height in px (keeps CLS at 0 when ads switch on). */
  minHeight?: number;
  label?: string;
};

export function AdSlot({ minHeight = 280, label = "Advertisement" }: AdSlotProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  // Until AdSense is enabled, render nothing — no empty reserved gap (audit Task 3).
  // Space is reserved only once ads are actually present, which is when CLS matters.
  if (!adsenseId) return null;

  return (
    <div
      style={{
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "1.5rem 0",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={adsenseId}
        data-ad-format="auto"
        data-full-width-responsive="true"
        aria-label={label}
      />
    </div>
  );
}
