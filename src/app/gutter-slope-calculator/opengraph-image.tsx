import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Gutter Slope Calculator — YardageMath";

export default function Image() {
  return ogImage("Gutter Slope Calculator", "Pitch, drop & downspouts");
}
