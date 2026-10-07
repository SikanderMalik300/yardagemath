import { ImageResponse } from "next/og";

// Default OG image, generated once at build (static export).
export const dynamic = "force-static";
export const alt = "YardageMath – Free Construction & Yard Calculators";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#f7f8f6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#17201b" }}>
          <span>Yardage</span>
          <span style={{ color: "#236b4b" }}>Math</span>
        </div>
        <div style={{ marginTop: 24, fontSize: 40, fontWeight: 600, color: "#17201b", maxWidth: 900 }}>
          Free Construction &amp; Yard Calculators
        </div>
        <div style={{ marginTop: 16, fontSize: 28, color: "#53605a", maxWidth: 900 }}>
          Cubic yards, tons, bags and costs — with the math shown.
        </div>
        <div
          style={{
            marginTop: 40,
            height: 8,
            width: 160,
            background: "#236b4b",
            borderRadius: 4,
          }}
        />
      </div>
    ),
    size
  );
}
