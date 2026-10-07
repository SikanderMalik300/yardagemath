import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { ContentPage } from "@/components/ContentPage";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Disclaimer",
  description:
    "YardageMath results are estimates for planning only — not professional engineering, construction, legal or financial advice. Always verify with professionals and local codes.",
  path: "/disclaimer/",
});

export default function DisclaimerPage() {
  return (
    <ContentPage title="Disclaimer" updated="2026-10-07">
      <p>
        <strong>
          All results on {SITE.name} are estimates for planning. They are not professional
          engineering, construction, legal or financial advice.
        </strong>
      </p>
      <p>
        Material densities, coverage, bag yields and prices vary by supplier, region, moisture and
        product. The calculators apply typical industry figures and a waste allowance you can edit,
        but your actual project may differ. Always verify quantities with your supplier or
        contractor before ordering, and confirm structural, drainage, shoreline and permitting
        requirements with a qualified professional and your local building department.
      </p>
      <p>
        For retaining walls, footings, channel and shoreline work and anything load-bearing, follow
        an engineer&apos;s design and local code. We accept no liability for over- or
        under-ordering or for work carried out based on these estimates.
      </p>
      <p>
        See also our <Link href="/terms/">Terms of Use</Link> and{" "}
        <Link href="/how-we-calculate/">How We Calculate</Link> for the sources behind each figure.
      </p>
    </ContentPage>
  );
}
