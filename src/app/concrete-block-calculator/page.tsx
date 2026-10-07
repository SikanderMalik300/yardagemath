import { getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { ConcreteBlockCalculator } from "@/components/calculator/tools/ConcreteBlockCalculator";

const cal = getCalculator("concrete-block-calculator")!;

export const metadata = buildMetadata({
  title: cal.title,
  description: cal.metaDescription,
  path: `/${cal.slug}/`,
});

export default function Page() {
  return (
    <CalculatorPage cal={cal}>
      <ConcreteBlockCalculator />
    </CalculatorPage>
  );
}
