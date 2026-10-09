import Image from "next/image";
import Link from "next/link";
import { buildMetadata, breadcrumbJsonLd, AUTHOR_URL, AUTHOR_ID } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContentPage } from "@/components/ContentPage";
import { SITE } from "@/lib/constants";
import { calculators } from "@/data/calculators";

export const metadata = buildMetadata({
  title: "Sikander Mushtaq – Author at YardageMath",
  description:
    "Sikander Mushtaq builds and maintains the YardageMath calculators. How he checks formulas and sources, and every tool he maintains.",
  path: "/authors/sikander-mushtaq/",
  absoluteTitle: true,
});

const profileJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: AUTHOR_URL,
  mainEntity: {
    "@type": "Person",
    "@id": AUTHOR_ID,
    name: "Sikander Mushtaq",
    url: AUTHOR_URL,
    image: `${SITE.url}/brand/profile-v1.jpg`,
    email: SITE.email,
    worksFor: { "@type": "Organization", name: SITE.name, url: SITE.url },
    sameAs: [],
  },
};

export default function AuthorPage() {
  return (
    <ContentPage title="Sikander Mushtaq">
      <JsonLd
        data={[
          profileJsonLd,
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Sikander Mushtaq", path: "/authors/sikander-mushtaq/" },
          ]),
        ]}
      />

      <figure style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "0 0 1.5rem" }}>
        <Image
          src="/brand/profile-v1.jpg"
          alt="Sikander Mushtaq"
          width={96}
          height={96}
          style={{ borderRadius: "50%", flexShrink: 0 }}
        />
        <figcaption style={{ margin: 0, color: "var(--text-secondary)" }}>
          Founder &amp; maintainer of YardageMath ·{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </figcaption>
      </figure>

      <p>
        I build and maintain every calculator on YardageMath. I check each formula against
        manufacturer and industry sources, work the examples by hand, and back every tool with
        automated tests. If something looks off, email me at{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and I&apos;ll fix it.
      </p>

      <h2>Calculators I maintain</h2>
      <ul>
        {calculators.map((c) => (
          <li key={c.slug}>
            <Link href={`/${c.slug}/`}>{c.h1.replace(/\s*\(.*\)/, "")}</Link>
          </li>
        ))}
      </ul>

      <h2>More</h2>
      <ul>
        <li>
          <Link href="/about/">About YardageMath</Link>
        </li>
        <li>
          <Link href="/editorial-policy/">Editorial policy</Link>
        </li>
        <li>
          <Link href="/how-we-calculate/">How we calculate</Link>
        </li>
        <li>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </li>
      </ul>
    </ContentPage>
  );
}
