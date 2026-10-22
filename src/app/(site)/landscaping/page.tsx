import { buildMetadata } from "@/lib/seo";
import { categories } from "@/data/calculators";
import { HubPage } from "@/components/HubPage";

const cat = categories.landscaping;

export const metadata = buildMetadata({
  title: cat.title,
  description: cat.metaDescription,
  path: "/landscaping/",
});

export default function Page() {
  return <HubPage slug="landscaping" />;
}
