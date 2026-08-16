import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Shared interior-page header.
 *
 * The legacy pages each opened with a bare `<img class="h-650">` stretched to
 * `width: 100%` with a fixed 650px height — so every banner was distorted, and
 * on a phone you got a 650px-tall sliver of a photo before any text appeared.
 * Here the band is sized by its content with the image behind it, so the
 * heading is always the first thing you read.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt = "",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image: string;
  imageAlt?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 pt-36 pb-16 md:pt-48 md:pb-24">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        quality={78}
        className="absolute inset-0 -z-10 object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900 via-ink-900/80 to-ink-900/60"
      />

      <div className="container-page">
        <p className="flex items-center gap-3 text-eyebrow uppercase text-brass-300">
          <span aria-hidden className="h-px w-8 bg-brass-400" />
          {eyebrow}
        </p>
        <h1 className="mt-6 max-w-4xl text-h1 text-white text-balance">{title}</h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-300 text-pretty">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
