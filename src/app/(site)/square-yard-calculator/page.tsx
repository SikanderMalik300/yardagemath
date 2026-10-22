import { getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { SquareYardCalculator } from "@/components/calculator/tools/SquareYardCalculator";

const cal = getCalculator("square-yard-calculator")!;

export const metadata = buildMetadata({
  title: cal.title,
  description: cal.metaDescription,
  path: `/${cal.slug}/`,
  absoluteTitle: true,
});

export default function Page() {
  return (
    <CalculatorPage cal={cal}>
      <SquareYardCalculator />
    </CalculatorPage>
  );
}
