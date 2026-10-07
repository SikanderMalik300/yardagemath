import { getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { BlockWallCalculator } from "@/components/calculator/tools/BlockWallCalculator";

const cal = getCalculator("block-wall-calculator")!;

export const metadata = buildMetadata({
  title: cal.title,
  description: cal.metaDescription,
  path: `/${cal.slug}/`,
});

export default function Page() {
  return (
    <CalculatorPage cal={cal}>
      <BlockWallCalculator />
    </CalculatorPage>
  );
}
