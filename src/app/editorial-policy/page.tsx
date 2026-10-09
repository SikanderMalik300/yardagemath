import Link from "next/link";
import { buildMetadata, breadcrumbJsonLd, absUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContentPage } from "@/components/ContentPage";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Editorial Policy",
  description:
    "How YardageMath calculators and pages are written, checked, sourced and corrected, including how AI tools are used and how to report an error.",
  path: "/editorial-policy/",
});

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Editorial Policy",
  url: absUrl("/editorial-policy/"),
  description:
    "How YardageMath calculators and pages are written, checked, sourced and corrected, including how AI tools are used and how to report an error.",
  publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
};

export default function EditorialPolicyPage() {
  return (
    <ContentPage title="Editorial Policy" updated="2026-10-10">
      <JsonLd
        data={[
          webPageJsonLd,
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Editorial Policy", path: "/editorial-policy/" },
          ]),
        ]}
      />

      <h2>Who writes YardageMath</h2>
      <p>
        Every calculator and page on YardageMath is built and maintained by me, Sikander Mushtaq.
        I&apos;m not a licensed contractor or engineer, so I don&apos;t give structural or legal
        advice. What I do is make sure the math is right, the numbers come from real sources, and
        the pages are easy to use.
      </p>

      <h2>How I build a calculator</h2>
      <ol>
        <li>
          I start with the formula and check it against at least one manufacturer, industry or
          government source. Those sources are listed on each page and on{" "}
          <Link href="/how-we-calculate/">How We Calculate</Link>.
        </li>
        <li>
          Every worked example is calculated step by step, then locked in with automated tests, so
          the calculator always gives the same answer as the worked example.
        </li>
        <li>Every page shows the math, so you can check the result yourself.</li>
        <li>
          Where a manufacturer has its own calculator, I compare results. For example, our concrete
          bag counts match Quikrete&apos;s calculator exactly, and our mortar estimate was changed to
          match theirs.
        </li>
      </ol>

      <h2>How I use AI tools</h2>
      <p>
        I use AI tools to help with research, first drafts and code. Nothing goes live until the
        numbers have been checked against the cited sources and covered by automated tests, and
        I&apos;ve reviewed the page. Formulas, default values and sources are always verified against
        real references, never taken from an AI tool on trust.
      </p>

      <h2>Sources and prices</h2>
      <p>
        Material weights, bag yields and rules of thumb come from manufacturer data sheets,
        standards bodies and supplier charts. Prices are national averages from named cost guides,
        with the year shown. They&apos;re there for planning, not as a quote.
      </p>

      <h2>Updates</h2>
      <p>
        Each page shows a &ldquo;Last updated&rdquo; date. I change that date only when the content
        actually changes, like new prices each year or a corrected value.
      </p>

      <h2>Corrections</h2>
      <p>
        If you spot an error, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. I&apos;ll
        check it, fix it if I got it wrong, and update the page date. Mistakes I&apos;ve fixed are
        listed below.
      </p>

      <h3>Corrections log</h3>
      <ul>
        <li>
          10 Oct 2026: Yards of Concrete Calculator. A rounding error made some bag counts one bag
          too high (for example 89 instead of 88 for a 12 × 12 slab at 4 inches with 10% extra).
          Fixed on all calculators.
        </li>
        <li>
          9 Oct 2026: Mortar estimate. We changed from about 13 to about 12 blocks per 80-lb bag to
          match Quikrete&apos;s own Mortar Mix calculator. A 142-block wall now shows 12 bags instead
          of 11.
        </li>
        <li>
          9 Oct 2026: Pea Gravel Calculator FAQ. Coverage per ton was understated. Corrected to
          about 115 sq ft at 2 inches and 77 sq ft at 3 inches.
        </li>
      </ul>

      <h2>Ads and affiliate links</h2>
      <p>
        YardageMath may show ads and use affiliate links in the future. They never change a
        calculator&apos;s result. See the <Link href="/affiliate-disclosure/">Affiliate Disclosure</Link>{" "}
        for details.
      </p>
    </ContentPage>
  );
}
