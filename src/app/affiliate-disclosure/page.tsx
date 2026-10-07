import { buildMetadata } from "@/lib/seo";
import { ContentPage } from "@/components/ContentPage";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Affiliate Disclosure",
  description:
    "YardageMath may earn commissions from qualifying purchases made through links on the site, at no extra cost to you.",
  path: "/affiliate-disclosure/",
});

export default function AffiliateDisclosurePage() {
  return (
    <ContentPage title="Affiliate Disclosure" updated="2026-10-07">
      <p>
        Some links on {SITE.name} are affiliate links. If you click one and make a purchase, we may
        earn a commission at no additional cost to you. This helps keep the calculators free.
      </p>
      <p>
        We only link to products we consider genuinely useful, and a commission never changes the
        numbers a calculator produces or the advice we give.
      </p>
      <p>
        Where we participate in the Amazon Associates Program, we include the required statement:{" "}
        <em>&ldquo;As an Amazon Associate I earn from qualifying purchases.&rdquo;</em> A short
        disclosure also appears near any affiliate link on a page.
      </p>
      <p>
        Questions? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </ContentPage>
  );
}
