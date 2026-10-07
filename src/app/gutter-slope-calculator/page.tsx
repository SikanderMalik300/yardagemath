import { getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { GutterSlopeCalculator } from "@/components/calculator/tools/GutterSlopeCalculator";

const cal = getCalculator("gutter-slope-calculator")!;

export const metadata = buildMetadata({
  title: cal.title,
  description: cal.metaDescription,
  path: `/${cal.slug}/`,
});

export default function Page() {
  return (
    <CalculatorPage cal={cal}>
      <GutterSlopeCalculator />
    </CalculatorPage>
  );
}
