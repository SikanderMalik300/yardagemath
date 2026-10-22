import type { Metadata } from "next";
import { GravelCalculator } from "@/components/calculator/tools/GravelCalculator";
import { EmbedFrame } from "@/components/embed/EmbedFrame";
import { toolUrl } from "@/lib/embed";

export const metadata: Metadata = {
  title: "Gravel Calculator",
  robots: { index: false, follow: true },
  alternates: { canonical: toolUrl("gravel-calculator") },
};

export default function Page() {
  return (
    <EmbedFrame slug="gravel-calculator" title="Gravel Calculator">
      <GravelCalculator />
    </EmbedFrame>
  );
}
