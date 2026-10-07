import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Landscape Material Calculator — YardageMath";

export default function Image() {
  return ogImage("Landscape Material Calculator", "Mulch, rock, soil, sand & more");
}
