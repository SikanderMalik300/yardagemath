import type { Metadata } from "next";
import { MulchCalculator } from "@/components/calculator/tools/MulchCalculator";
import { EmbedFrame } from "@/components/embed/EmbedFrame";
import { toolUrl } from "@/lib/embed";

export const metadata: Metadata = {
  title: "Mulch Calculator",
  robots: { index: false, follow: true },
  alternates: { canonical: toolUrl("mulch-calculator") },
};

export default function Page() {
  return (
    <EmbedFrame slug="mulch-calculator" title="Mulch Calculator">
      <MulchCalculator />
    </EmbedFrame>
  );
}
