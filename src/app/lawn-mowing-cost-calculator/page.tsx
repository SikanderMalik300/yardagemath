import { getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { LawnMowingCalculator } from "@/components/calculator/tools/LawnMowingCalculator";

const cal = getCalculator("lawn-mowing-cost-calculator")!;

export const metadata = buildMetadata({
  title: cal.title,
  description: cal.metaDescription,
  path: `/${cal.slug}/`,
  absoluteTitle: true,
});

export default function Page() {
  return (
    <CalculatorPage cal={cal}>
      <LawnMowingCalculator />
    </CalculatorPage>
  );
}
