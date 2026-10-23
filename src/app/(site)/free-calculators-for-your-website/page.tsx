import Link from "next/link";
import { buildMetadata, breadcrumbJsonLd, utilityWebPageJsonLd, absUrl } from "@/lib/seo";
import { ContentPage } from "@/components/ContentPage";
import { FaqSection } from "@/components/calculator/Faq";
import { EMBED_TOOLS, embedUrl, embedSnippet } from "@/lib/embed";
import { EmbedPreview } from "@/components/embed/EmbedPreview";
import { SITE } from "@/lib/constants";

const PATH = "/free-calculators-for-your-website/";

export const metadata = buildMetadata({
  title: "Free Calculators for Your Website – Mulch, Gravel & More",
  description:
    "Add free mulch, gravel, topsoil and concrete calculators to your website with one line of code. No sign-up, no ads, no tracking. Just copy and paste.",
  path: PATH,
  absoluteTitle: true,
});

const FAQS = [
  { q: "Is it free?", a: "Yes. It's free for any website. We only ask that you keep the credit link under the calculator." },
  { q: "Does it track my visitors?", a: "No. The embedded calculators set no cookies and load no analytics or ads." },
  { q: "Can I change the size?", a: "Yes. Change the width or height in the code. The calculator fits widths from 300 to 700 pixels." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function FreeCalculatorsPage() {
  return (
    <ContentPage
      title="Free Calculators for Your Website"
      intro="Garden centers, landscape suppliers, contractors and bloggers can add our calculators to their own pages for free. Each one runs in a small frame, loads fast, has no ads and no tracking, and uses the same sourced math as our full calculators."
      updated="2026-10-23"
      jsonLd={[
        utilityWebPageJsonLd({ path: PATH, name: "Free Calculators for Your Website", datePublished: "2026-10-22", dateModified: "2026-10-23", withAuthor: true }),
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Free calculators for your website", path: PATH }], `${absUrl(PATH)}#breadcrumb`),
        faqJsonLd,
      ]}
    >
      {EMBED_TOOLS.map((t, i) => (
        <section key={t.slug} style={{ marginTop: i === 0 ? "1rem" : "2.5rem" }}>
          <h2>{t.title}</h2>
          <p>{t.blurb}</p>
          <EmbedPreview src={embedUrl(t.slug)} title={`${t.title} by YardageMath`} />
          <p style={{ fontWeight: 600, margin: "1rem 0 0.25rem" }}>Copy this code</p>
          <textarea
            readOnly
            rows={4}
            value={embedSnippet(t)}
            style={{ width: "100%", maxWidth: 700, boxSizing: "border-box", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: "0.75rem", lineHeight: 1.5, padding: "0.5rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", resize: "vertical", background: "var(--surface-muted)" }}
          />
          <p style={{ marginTop: "0.5rem" }}>
            <Link href={`/${t.slug}/`} prefetch={false}>Open the full {t.credit}</Link>
          </p>
        </section>
      ))}

      <FaqSection faqs={FAQS} />

      <p style={{ marginTop: "1.5rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
        Built and maintained by{" "}
        <Link href="/authors/sikander-mushtaq/" prefetch={false}>{SITE.founder}</Link>.
      </p>
    </ContentPage>
  );
}
