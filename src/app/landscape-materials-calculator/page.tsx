import { getCalculator } from "@/data/calculators";
import { buildMetadata } from "@/lib/seo";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { LandscapeMaterialsCalculator } from "@/components/calculator/tools/LandscapeMaterialsCalculator";

const cal = getCalculator("landscape-materials-calculator")!;

export const metadata = buildMetadata({
  title: cal.title,
  description: cal.metaDescription,
  path: `/${cal.slug}/`,
});

export default function Page() {
  return (
    <CalculatorPage cal={cal}>
      <LandscapeMaterialsCalculator />
    </CalculatorPage>
  );
}
