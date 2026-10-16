import { getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { PaverBaseCalculator } from "@/components/calculator/tools/PaverBaseCalculator";

const cal = getCalculator("paver-base-calculator")!;

export const metadata = buildMetadata({
  title: cal.title,
  description: cal.metaDescription,
  path: `/${cal.slug}/`,
  absoluteTitle: true,
});

export default function Page() {
  return (
    <CalculatorPage cal={cal}>
      <PaverBaseCalculator />
    </CalculatorPage>
  );
}
