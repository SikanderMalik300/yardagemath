import Link from "next/link";
import type { Calculator } from "@/data/calculators";
import { photoForSlug, TILE_WIDTHS } from "@/lib/data/photos";
import { HomePhoto } from "./HomePhoto";
import styles from "./home.module.css";

const ARROW = (
  <svg className={styles.tileArrow} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M3 8h9M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** One square photo tile: the whole card is a single link (redesign spec 2). */
export function HomeTile({ cal, fallbackVar }: { cal: Calculator; fallbackVar?: string }) {
  const name = cal.h1.replace(/\s*\(.*\)/, "");
  return (
    <Link href={`/${cal.slug}/`} prefetch={false} className={styles.tile}>
      <span className={styles.tilePhotoWrap}>
        <HomePhoto
          photo={photoForSlug(cal.slug)}
          widths={TILE_WIDTHS}
          sizes="(min-width: 768px) 285px, 45vw"
          ratio="1 / 1"
          imgW={600}
          imgH={600}
          fallbackVar={fallbackVar}
        />
      </span>
      <span className={styles.tileName}>
        <span className={styles.tileNameText}>{name}</span>
        {ARROW}
      </span>
      <span className={styles.tileDesc}>{cal.cardDescription}</span>
    </Link>
  );
}
