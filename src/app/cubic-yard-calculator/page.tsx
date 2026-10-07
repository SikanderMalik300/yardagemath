import { getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { CubicYardCalculator } from "@/components/calculator/tools/CubicYardCalculator";

const cal = getCalculator("cubic-yard-calculator")!;

export const metadata = buildMetadata({
  title: cal.title,
  description: cal.metaDescription,
  path: `/${cal.slug}/`,
  absoluteTitle: true,
});

export default function Page() {
  return (
    <CalculatorPage cal={cal}>
      <CubicYardCalculator />
    </CalculatorPage>
  );
}
