import { getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { PeaGravelCalculator } from "@/components/calculator/tools/PeaGravelCalculator";

const cal = getCalculator("pea-gravel-calculator")!;

export const metadata = buildMetadata({
  title: cal.title,
  description: cal.metaDescription,
  path: `/${cal.slug}/`,
});

export default function Page() {
  return (
    <CalculatorPage cal={cal}>
      <PeaGravelCalculator />
    </CalculatorPage>
  );
}
