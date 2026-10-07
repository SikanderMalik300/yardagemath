import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "About YardageMath — YardageMath";

export default function Image() {
  return ogImage("About YardageMath", "Free, accurate calculators — with the math shown");
}
