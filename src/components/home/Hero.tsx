import Link from "next/link";
import { HERO, HERO_WIDTHS } from "@/lib/data/photos";
import { HomePhoto } from "./HomePhoto";
import { HomeSearch } from "./HomeSearch";
import styles from "./home.module.css";

const CHIPS = [
  { label: "Cubic yards", href: "/cubic-yard-calculator/" },
  { label: "Concrete blocks", href: "/concrete-block-calculator/" },
  { label: "Topsoil", href: "/topsoil-calculator/" },
];

/** Split hero: sand color block (content) + real photo (redesign spec 2). */
export function Hero() {
  return (
    <>
      <div className={`${styles.band} ${styles.hero}`}>
        <div className={styles.heroBlock}>
          <div className={styles.heroInner}>
            <h1 className={styles.h1}>Free Construction &amp; Yard Calculators</h1>
            <p className={styles.intro}>
              Fast, accurate calculators for concrete, blocks, gravel, topsoil, mulch, gutters and
              lawn care. Enter your measurements and get cubic yards, tons, bags and costs in
              seconds, with the formula shown so you can check every result. Built for homeowners,
              contractors and landscapers in the US.
            </p>
            <HomeSearch />
            <div className={styles.chips}>
              {CHIPS.map((c) => (
                <Link key={c.href} href={c.href} prefetch={false} className={styles.chip}>
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.heroPhotoWrap}>
          {/* Hero mode: eager load with fetchpriority=auto so the desktop right
              half is not blank on first paint. On mobile the photo sits below the
              full-height text block, so the H1/intro still wins the LCP. */}
          <HomePhoto
            photo={HERO}
            widths={HERO_WIDTHS}
            sizes="(min-width: 768px) 45vw, 100vw"
            ratio="4 / 3"
            imgW={1280}
            imgH={854}
            hero
            fallbackVar="--ym-sand"
          />
        </div>
      </div>
      {HERO && (
        <div className={styles.container}>
          <p className={styles.heroCaption}>
            Photo: {HERO.photographer} /{" "}
            <a href={HERO.sourceUrl} target="_blank" rel="noopener noreferrer">
              {HERO.source}
            </a>
          </p>
        </div>
      )}
    </>
  );
}
