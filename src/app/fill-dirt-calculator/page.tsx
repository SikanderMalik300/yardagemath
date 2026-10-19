import { getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { FillDirtCalculator } from "@/components/calculator/tools/FillDirtCalculator";

const cal = getCalculator("fill-dirt-calculator")!;

export const metadata = buildMetadata({
  title: cal.title,
  description: cal.metaDescription,
  path: `/${cal.slug}/`,
  absoluteTitle: true,
});

export default function Page() {
  return (
    <CalculatorPage cal={cal}>
      <FillDirtCalculator />
    </CalculatorPage>
  );
}
