import type { Metadata } from "next";
import { TopsoilCalculator } from "@/components/calculator/tools/TopsoilCalculator";
import { EmbedFrame } from "@/components/embed/EmbedFrame";
import { toolUrl } from "@/lib/embed";

export const metadata: Metadata = {
  title: "Topsoil Calculator",
  robots: { index: false, follow: true },
  alternates: { canonical: toolUrl("topsoil-calculator") },
};

export default function Page() {
  return (
    <EmbedFrame slug="topsoil-calculator" title="Topsoil Calculator">
      <TopsoilCalculator />
    </EmbedFrame>
  );
}
