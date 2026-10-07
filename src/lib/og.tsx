import { ImageResponse } from "next/og";

/** Shared Open Graph image renderer (audit P1 #3). 1200×630 PNG, generated at build. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function ogImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#f7f8f6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 40, fontWeight: 700 }}>
          <span style={{ color: "#17201b" }}>Yardage</span>
          <span style={{ color: "#236b4b" }}>Math</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 700, color: "#17201b", lineHeight: 1.08, maxWidth: 1000 }}>
            {title}
          </div>
          <div style={{ marginTop: 20, fontSize: 34, color: "#53605a", maxWidth: 1000 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ height: 10, width: 200, background: "#236b4b", borderRadius: 5 }} />
          <div style={{ fontSize: 26, color: "#748078" }}>yardagemath.com</div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
