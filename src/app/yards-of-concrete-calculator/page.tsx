import { getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { YardsOfConcreteCalculator } from "@/components/calculator/tools/YardsOfConcreteCalculator";

const cal = getCalculator("yards-of-concrete-calculator")!;

export const metadata = buildMetadata({
  title: cal.title,
  description: cal.metaDescription,
  path: `/${cal.slug}/`,
  absoluteTitle: true,
});

export default function Page() {
  return (
    <CalculatorPage cal={cal}>
      <YardsOfConcreteCalculator />
    </CalculatorPage>
  );
}
