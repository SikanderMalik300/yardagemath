import { buildMetadata } from "@/lib/seo";
import { categories } from "@/data/calculators";
import { HubPage } from "@/components/HubPage";

const cat = categories.lawn;

export const metadata = buildMetadata({
  title: cat.title,
  description: cat.metaDescription,
  path: "/lawn/",
});

export default function Page() {
  return <HubPage slug="lawn" />;
}
