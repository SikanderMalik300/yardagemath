import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Landscaping & Yardage Calculators — YardageMath";

export default function Image() {
  return ogImage("Landscaping & Yardage Calculators", "Soil, gravel, mulch and more");
}
