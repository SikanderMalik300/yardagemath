import Link from "next/link";
import { buildMetadata, aboutPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContentPage } from "@/components/ContentPage";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "About",
  description:
    "YardageMath is a set of free, carefully checked construction and yard calculators built and maintained by Neo. Learn why it exists and how the tools are made.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <ContentPage
      title={`About ${SITE.name}`}
      intro="Free, accurate calculators for construction and yard projects — built by one person who got tired of guessing material quantities."
    >
      <JsonLd data={aboutPageJsonLd()} />

      <h2>Why I built this</h2>
      <p>
        I&apos;m {SITE.founder}, and I built YardageMath after one too many trips back to the
        supply yard for &ldquo;just a little more&rdquo; gravel. Most online calculators either
        hide their math, bury the tool under a wall of filler text, or spit out a number with no
        way to check it. I wanted tools that are fast, show their working, and are honest about
        where the numbers come from.
      </p>

      <h2>How the calculators are made and checked</h2>
      <p>
        Every formula lives in tested code, not buried in a web page, and each one has unit tests
        that confirm the worked examples you see on the page. The densities, bag yields, coverage
        figures and slope rules come from manufacturer and industry sources — each listed, with
        the date it was checked, on <Link href="/how-we-calculate/">How We Calculate</Link>.
      </p>
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

      <h2>Editorial policy &amp; corrections</h2>
      <p>
        Corrections are genuinely welcome. If a number looks off or a source has changed, email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and I&apos;ll check it. When content
        changes meaningfully, I update the &ldquo;Last updated&rdquo; date on that page.
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
