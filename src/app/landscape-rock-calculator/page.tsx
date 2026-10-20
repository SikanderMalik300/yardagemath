import { getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { LandscapeRockCalculator } from "@/components/calculator/tools/LandscapeRockCalculator";

const cal = getCalculator("landscape-rock-calculator")!;

export const metadata = buildMetadata({
  title: cal.title,
  description: cal.metaDescription,
  path: `/${cal.slug}/`,
  absoluteTitle: true,
});

export default function Page() {
  return (
    <CalculatorPage cal={cal}>
      <LandscapeRockCalculator />
    </CalculatorPage>
  );
}
