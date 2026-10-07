import { getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { AcresPerHourCalculator } from "@/components/calculator/tools/AcresPerHourCalculator";

const cal = getCalculator("acres-per-hour-calculator")!;

export const metadata = buildMetadata({
  title: cal.title,
  description: cal.metaDescription,
  path: `/${cal.slug}/`,
});

export default function Page() {
  return (
    <CalculatorPage cal={cal}>
      <AcresPerHourCalculator />
    </CalculatorPage>
  );
}
