import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Concrete Slab Cost Calculator — YardageMath";

export default function Image() {
  return ogImage("Concrete Slab Cost Calculator", "Cubic yards, bags vs ready-mix & total cost");
}
