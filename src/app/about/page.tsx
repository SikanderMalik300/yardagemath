import Image from "next/image";
import Link from "next/link";
import { buildMetadata, aboutPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContentPage } from "@/components/ContentPage";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Free, carefully checked construction and yard calculators — why the site exists, how the tools are made, and how to send corrections.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <ContentPage
      title={`About ${SITE.name}`}
      intro="Free, accurate calculators for construction and yard projects — built by one person who got tired of guessing material quantities."
    >
      <JsonLd data={aboutPageJsonLd()} />

      <figure
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          margin: "0 0 1.5rem",
          padding: "1rem",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          background: "var(--surface)",
        }}
      >
        <Image
          src="/brand/profile-v1.jpg"
          alt={`${SITE.founder}, founder of ${SITE.name}`}
          width={88}
          height={88}
          style={{ borderRadius: "50%", flexShrink: 0 }}
        />
        <figcaption style={{ margin: 0 }}>
          <strong style={{ color: "var(--text-primary)" }}>{SITE.founder}</strong>
          <br />
          <span style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
            Founder &amp; maintainer · <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </span>
        </figcaption>
      </figure>

      <h2>Why I built this</h2>
      <p>
        I&apos;m {SITE.founder}, and I built YardageMath after one too many trips back to the
        supply yard for &ldquo;just a little more&rdquo; gravel. Most online calculators either
        hide their math, bury the tool under a wall of filler text, or spit out a number with no
        way to check it. I wanted tools that are fast, show their working, and are honest about
        where the numbers come from.
      </p>

      <h2>How I build and test each calculator</h2>
      <p>Every calculator goes through the same three steps before it is published:</p>
      <ol>
        <li>
          <strong>Formulas cross-checked against sources.</strong> Each formula is checked against
          manufacturer data sheets (for example, Quikrete bag yields and Quikrete mortar coverage)
          and industry references (NCMA/CMHA for masonry, ASABE for field efficiency, FHWA/USACE for
          riprap). Every figure is listed with its source and date on{" "}
          <Link href="/how-we-calculate/">How We Calculate</Link>.
        </li>
        <li>
          <strong>Hand-calculated worked examples.</strong> I work each example by hand and show it
          on the page, so you can follow the math with your own numbers in the &ldquo;Show the
          math&rdquo; panel.
        </li>
        <li>
          <strong>Automated unit tests for every formula.</strong> The formulas live in tested
          TypeScript, not buried in a web page. A test suite confirms the worked example on each page
          matches the code to two decimals, so a change can&apos;t quietly break a result.
        </li>
      </ol>
      <p>
        I review every page before it goes live. When a figure can vary — like material weight or
        local prices — the calculator lets you edit it, and I say so plainly rather than pretending
        there&apos;s a single right answer.
      </p>

      <h2>My experience — honestly</h2>
      <p>
        I&apos;m not a licensed contractor or engineer, and I don&apos;t claim to be. What I do is
        check every formula against manufacturer and industry sources, test the math, and keep the
        pages current. For anything structural or permitted — retaining walls, footings, channel
        work — please confirm with a professional and your local building department.
      </p>

      <h2>Corrections</h2>
      <p>
        Found an error? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and I&apos;ll fix it
        and note the update date on the page. Corrections are genuinely welcome — accurate numbers
        matter more than being right the first time.
      </p>

      <h2>Get in touch</h2>
      <p>
        Questions, suggestions or a tool you wish existed? Use the{" "}
        <Link href="/contact/">contact page</Link> or email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </ContentPage>
  );
}
