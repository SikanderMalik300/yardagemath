import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

// Default/home OG image, generated once at build (static export).
export const dynamic = "force-static";
export const alt = "YardageMath – Free Construction & Yard Calculators";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage("Free Construction & Yard Calculators", "Cubic yards, tons, bags and costs — with the math shown");
}
