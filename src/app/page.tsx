import Link from "next/link";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  calculators,
  categoryList,
  calculatorsInCategory,
  getCalculator,
  popularSlugs,
  type CategorySlug,
} from "@/data/calculators";
import { fmtDate } from "@/lib/format";
import { figtree } from "@/components/home/homeFont";
import { Hero } from "@/components/home/Hero";
import { HomeTile } from "@/components/home/HomeTile";
import styles from "@/components/home/home.module.css";

export const metadata = buildMetadata({
  title: "YardageMath – Free Construction & Yard Calculators",
  description:
    "Free calculators for concrete, blocks, gravel, topsoil, mulch, gutters and lawn care. Get cubic yards, tons, bags and costs fast, with the math shown.",
  path: "/",
  absoluteTitle: true,
});

const BAND_INTRO: Record<CategorySlug, string> = {
  concrete: "Estimate slabs, blocks and full walls: cubic yards, block counts, mortar and cost.",
  landscaping: "Work out soil, gravel, mulch, stone and square yards from your area and depth.",
  lawn: "Price a mow, or work out how fast you can cover a lawn or field.",
};

const BAND_STYLE: Record<CategorySlug, { band: string; fallback: string }> = {
  concrete: { band: styles.bandStone, fallback: "--ym-stone" },
  landscaping: { band: styles.bandSage, fallback: "--ym-sage" },
  lawn: { band: styles.bandGrass, fallback: "--ym-grass" },
};

const POPULAR_ANSWERS: { fact: string; href: string; cta: string }[] = [
  { fact: "1 cubic yard covers 108 sq ft at 3 in deep", href: "/cubic-yard-calculator/", cta: "Cubic Yard Calculator" },
  { fact: "112.5 blocks per 100 sq ft of wall", href: "/concrete-block-calculator/", cta: "Concrete Block Calculator" },
  { fact: "≈45 bags of 80-lb concrete per cubic yard", href: "/concrete-slab-cost-calculator/", cta: "Slab Cost Calculator" },
];

const ARROW = (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" focusable="false" style={{ flexShrink: 0 }}>
    <path d="M3 8h9M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function HomePage() {
  const popular = popularSlugs.map((s) => getCalculator(s)).filter(Boolean);
  const latest = [...calculators]
    .sort((a, b) => (a.lastUpdated < b.lastUpdated ? 1 : -1))
    .slice(0, 6);

  return (
    <div className={`${styles.home} ${figtree.variable}`}>
      <JsonLd data={itemListJsonLd(calculators)} />

      <Hero />

        {/* Most popular calculators */}
        <section className={`${styles.section} ${styles.sep}`}>
          <div className={styles.container}>
            <div className={styles.sectionHead}>
              <h2 className={styles.h2}>Most popular calculators</h2>
            </div>
            <div className={styles.tileGrid}>
              {popular.map((c) => c && <HomeTile key={c.slug} cal={c} />)}
            </div>
          </div>
        </section>

        {/* Category bands */}
        {categoryList.map((cat) => (
          <section key={cat.slug} className={`${styles.band} ${styles.sep} ${BAND_STYLE[cat.slug].band}`}>
            <div className={`${styles.container} ${styles.section}`}>
              <div className={styles.sectionHead}>
                <h2 className={styles.h2}>{cat.title}</h2>
                <Link href={`/${cat.slug}/`} prefetch={false} className={styles.viewAll}>
                  View all {ARROW}
                </Link>
              </div>
              <p className={styles.bandIntro}>{BAND_INTRO[cat.slug]}</p>
              <div className={styles.tileGrid}>
                {calculatorsInCategory(cat.slug).map((c) => (
                  <HomeTile key={c.slug} cal={c} fallbackVar={BAND_STYLE[cat.slug].fallback} />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Popular answers */}
        <section className={`${styles.band} ${styles.sep} ${styles.bandPaper}`}>
          <div className={`${styles.container} ${styles.section}`}>
            <h2 className={styles.h2}>Popular answers</h2>
            <div className={styles.answerGrid}>
              {POPULAR_ANSWERS.map((a) => (
                <div key={a.href} className={styles.answerCard}>
                  <p className={styles.answerFact}>
                    <span className={styles.answerNum}>{a.fact}</span>
                  </p>
                  <Link href={a.href} prefetch={false} className={styles.answerLink}>
                    {a.cta} {ARROW}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why trust these calculators */}
        <section className={`${styles.section} ${styles.sep}`}>
          <div className={styles.container}>
            <h2 className={styles.h2}>Why trust these calculators</h2>
            <div className={styles.trustGrid}>
              <div>
                <h3 className={styles.h3}>The math is shown</h3>
                <p className={styles.trustText}>
                  Every tool has a &ldquo;Show the math&rdquo; panel with your numbers plugged into the
                  formula, nothing is hidden.
                </p>
              </div>
              <div>
                <h3 className={styles.h3}>Sources are cited</h3>
                <p className={styles.trustText}>
                  Densities, bag yields and slope rules come from manufacturer and industry sources,
                  listed on <Link href="/how-we-calculate/" prefetch={false}>How We Calculate</Link>.
                </p>
              </div>
              <div>
                <h3 className={styles.h3}>Kept up to date</h3>
                <p className={styles.trustText}>
                  Each page shows when it was last reviewed. Built and maintained by{" "}
                  <Link href="/about/" prefetch={false}>Sikander Mushtaq</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Latest updates */}
        <section className={`${styles.section} ${styles.sep}`}>
          <div className={styles.container}>
            <h2 className={styles.h2}>Latest updates</h2>
            <ul className={styles.updates}>
              {latest.map((c) => (
                <li key={c.slug} className={styles.updateRow}>
                  <Link href={`/${c.slug}/`} prefetch={false}>{c.h1.replace(/\s*\(.*\)/, "")}</Link>
                  <time dateTime={c.lastUpdated} className={styles.updateDate}>
                    {fmtDate(c.lastUpdated)}
                  </time>
                </li>
              ))}
            </ul>
          </div>
        </section>
    </div>
  );
}
