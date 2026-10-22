import type { Metadata } from "next";
import { YardsOfConcreteCalculator } from "@/components/calculator/tools/YardsOfConcreteCalculator";
import { EmbedFrame } from "@/components/embed/EmbedFrame";
import { toolUrl } from "@/lib/embed";

export const metadata: Metadata = {
  title: "Yards of Concrete Calculator",
  robots: { index: false, follow: true },
  alternates: { canonical: toolUrl("yards-of-concrete-calculator") },
};

export default function Page() {
  return (
    <EmbedFrame slug="yards-of-concrete-calculator" title="Yards of Concrete Calculator">
      <YardsOfConcreteCalculator />
    </EmbedFrame>
  );
}
