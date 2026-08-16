"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ArrowIcon } from "@/components/ui";
import { heroImages } from "@/data/gallery";

const WORDS = ["turnkey.", "commercial.", "residential.", "civil."];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [word, setWord] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const slides = setInterval(
      () => setIndex((i) => (i + 1) % heroImages.length),
      6500,
    );
    const words = setInterval(
      () => setWord((w) => (w + 1) % WORDS.length),
      2600,
    );
    return () => {
      clearInterval(slides);
      clearInterval(words);
    };
  }, []);

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink-900">
      {heroImages.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={i === 0 ? img.alt : ""}
          fill
          priority={i === 0}
          sizes="100vw"
          quality={80}
          className={`absolute inset-0 -z-10 object-cover transition-opacity duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900 via-ink-900/45 to-transparent"
      />

      <div className="container-page relative pb-14 pt-32 md:pb-20">
        <p className="flex items-center gap-3 text-eyebrow uppercase text-bone-300">
          <span aria-hidden className="h-px w-8 bg-brass-400" />
          Pune · since 2009
        </p>

        <h1 className="mt-7 max-w-5xl text-display text-white text-balance">
          We build interiors,
          <br className="hidden sm:block" /> end to end.
        </h1>

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-md text-lg leading-relaxed text-bone-200 text-pretty">
            Design, materials, labour and site supervision under one contract —
            so there is one schedule, one bill of quantities, and one person
            answerable for the handover date.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-medium text-ink-900 transition hover:bg-bone-200"
            >
              Book a free consultation
              <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-4 text-sm font-medium text-white transition hover:border-white/70 hover:bg-white/10"
            >
              See the work
            </Link>
          </div>
        </div>

        <div className="mt-14 flex items-center gap-3 border-t border-white/15 pt-6 text-bone-300">
          <span className="text-sm">We do</span>
          <span className="relative block h-10 min-w-[16ch] overflow-hidden">
            {WORDS.map((w, i) => (
              <span
                key={w}
                aria-hidden={i !== word}
                className={`absolute inset-x-0 top-0 font-display text-2xl leading-10 text-brass-300 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  i === word
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0"
                }`}
              >
                {w}
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="container-page relative pb-10">
        <div className="flex gap-2" role="group" aria-label="Hero image">
          {heroImages.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1} of ${heroImages.length}`}
              aria-current={i === index}
              className="group py-3"
            >
              <span
                className={`block h-0.5 w-10 transition-all duration-500 ${
                  i === index
                    ? "bg-white"
                    : "bg-white/30 group-hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
