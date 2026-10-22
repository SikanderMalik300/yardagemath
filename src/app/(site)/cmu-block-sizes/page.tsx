import { getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { CmuSizesConverter } from "@/components/calculator/tools/CmuSizesConverter";

const cal = getCalculator("cmu-block-sizes")!;

export const metadata = buildMetadata({
  title: cal.title,
  description: cal.metaDescription,
  path: `/${cal.slug}/`,
  absoluteTitle: true,
});

export default function Page() {
  return (
    <CalculatorPage cal={cal}>
      <CmuSizesConverter />
    </CalculatorPage>
  );
}
