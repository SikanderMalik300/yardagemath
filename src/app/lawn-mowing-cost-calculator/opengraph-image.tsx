import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Lawn Mowing Cost Calculator — YardageMath";

export default function Image() {
  return ogImage("Lawn Mowing Cost Calculator", "Price per cut & per acre");
}
