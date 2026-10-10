import type { Photo } from "@/lib/data/photos";

/**
 * Responsive <picture> (AVIF -> WebP -> JPEG) with a focal object-position.
 * When no photo is available yet, renders a neutral on-brand color block of
 * the same aspect ratio (never a broken image, illustration or stock art).
 */
export function HomePhoto({
  photo,
  widths,
  sizes,
  ratio,
  imgW,
  imgH,
  priority = false,
  fallbackVar = "--ym-stone",
  className,
}: {
  photo: Photo | undefined;
  widths: number[];
  sizes: string;
  ratio: string; // e.g. "1 / 1"
  imgW: number;
  imgH: number;
  priority?: boolean;
  fallbackVar?: string;
  className?: string;
}) {
  if (!photo) {
    return (
      <div
        className={className}
        aria-hidden="true"
        style={{ aspectRatio: ratio, background: `var(${fallbackVar})`, width: "100%", height: "100%" }}
      />
    );
  }

  const src = (w: number, ext: string) => `/photos/${photo.file}-${w}.${ext}`;
  const srcset = (ext: string) => widths.map((w) => `${src(w, ext)} ${w}w`).join(", ");
  const largest = widths[widths.length - 1];

  return (
    <picture>
      <source type="image/avif" srcSet={srcset("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset("webp")} sizes={sizes} />
      <img
        src={src(largest, "jpg")}
        srcSet={srcset("jpg")}
        sizes={sizes}
        alt={photo.alt}
        width={imgW}
        height={imgH}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "auto" : "async"}
        fetchPriority={priority ? "high" : "low"}
        className={className}
        style={{ objectFit: "cover", objectPosition: `${photo.focalX * 100}% ${photo.focalY * 100}%`, width: "100%", height: "100%", display: "block" }}
      />
    </picture>
  );
}
