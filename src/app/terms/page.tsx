import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { ContentPage } from "@/components/ContentPage";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description:
    "The terms governing your use of YardageMath: no warranty, limitation of liability, intellectual property, external links and governing law.",
  path: "/terms/",
});

export default function TermsPage() {
  return (
    <ContentPage title="Terms of Use" updated="2026-10-07">
      <p>
        By using {SITE.domain} (the &ldquo;Site&rdquo;) you agree to these Terms. If you do not
        agree, please do not use the Site.
      </p>

      <h2>Use of the site</h2>
      <p>
        The Site provides free calculators and reference information for construction and yard
        projects. You may use it for lawful, personal or commercial estimating purposes. Do not
        attempt to disrupt the Site or misuse it.
      </p>

      <h2>No warranty</h2>
      <p>
        The calculators and content are provided &ldquo;as is&rdquo; for general planning. We make
        no warranty that results are accurate, complete or suitable for your specific project.
        Material quantities, weights and prices vary. See our{" "}
        <Link href="/disclaimer/">disclaimer</Link>.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {SITE.name} is not liable for any loss or damage
        arising from your use of the Site or reliance on its results, including over- or
        under-ordering of materials. Always confirm quantities with your supplier or contractor.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The Site&apos;s text, design, diagrams and code are owned by {SITE.name} unless otherwise
        noted. You may share links and quote short excerpts with attribution, but may not copy the
        Site wholesale.
      </p>

      <h2>External links</h2>
      <p>
        The Site links to third-party websites for reference. We are not responsible for their
        content or practices.
      </p>

      <h2>Changes</h2>
      <p>We may update the Site and these Terms at any time. Continued use means you accept the changes.</p>

      <h2>Governing law</h2>
      <p>
        These Terms are governed by the laws of the United States and the applicable state where
        the owner resides, without regard to conflict-of-laws rules.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </ContentPage>
  );
}
