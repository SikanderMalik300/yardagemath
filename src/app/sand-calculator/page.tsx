import { getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { SandCalculator } from "@/components/calculator/tools/SandCalculator";

const cal = getCalculator("sand-calculator")!;

export const metadata = buildMetadata({
  title: cal.title,
  description: cal.metaDescription,
  path: `/${cal.slug}/`,
  absoluteTitle: true,
});

export default function Page() {
  return (
    <CalculatorPage cal={cal}>
      <SandCalculator />
    </CalculatorPage>
  );
}
