"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { categories, galleryPhotos, type GalleryCategory } from "@/data/gallery";

export function Gallery() {
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(24);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? galleryPhotos
        : galleryPhotos.filter((p) => p.category === filter),
    [filter],
  );

  const shown = filtered.slice(0, visibleCount);

  const close = useCallback(() => {
    setOpenIndex(null);
    lastFocused.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((i) => (i === null ? null : (i + delta + filtered.length) % filtered.length)),
    [filtered.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prev;
    };
  }, [openIndex, close, step]);

  const active = openIndex === null ? null : filtered[openIndex];

  return (
    <>
      <div className="container-page">
        <div
          role="tablist"
          aria-label="Filter projects by type"
          className="flex flex-wrap gap-2 border-b border-bone-200 pb-6"
        >
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              role="tab"
              aria-selected={filter === c.value}
              onClick={() => {
                setFilter(c.value);
                setVisibleCount(24);
              }}
              className={`inline-flex items-baseline gap-2 rounded-full px-5 py-2.5 text-sm transition ${
                filter === c.value
                  ? "bg-ink-900 text-bone-50"
                  : "bg-bone-100 text-ink-500 hover:bg-bone-200 hover:text-ink-900"
              }`}
            >
              {c.label}
              <span
                className={`text-xs tabular-nums ${
                  filter === c.value ? "text-bone-400" : "text-ink-400"
                }`}
              >
                {c.count}
              </span>
            </button>
          ))}
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
          {shown.map((photo, i) => (
            <li key={photo.src}>
              <button
                type="button"
                onClick={(e) => {
                  lastFocused.current = e.currentTarget;
                  setOpenIndex(i);
                }}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-sm bg-bone-200 text-left"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1280px) 23vw, (min-width: 768px) 31vw, 47vw"
                  loading={i < 8 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <span className="text-sm text-white">{photo.set}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        {shown.length < filtered.length && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + 24)}
              className="rounded-full border border-ink-900/20 px-7 py-3.5 text-sm font-medium text-ink-900 transition hover:border-ink-900/50 hover:bg-bone-100"
            >
              Show more ({filtered.length - shown.length} remaining)
            </button>
          </div>
        )}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.set}: image ${(openIndex ?? 0) + 1} of ${filtered.length}`}
          className="fixed inset-0 z-[60] flex flex-col bg-ink-900/97 backdrop-blur-sm"
          onClick={close}
        >
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="text-sm text-bone-300">
              {active.set}
              <span className="ml-3 tabular-nums text-bone-400">
                {(openIndex ?? 0) + 1} / {filtered.length}
              </span>
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:bg-white/10"
            >
              <span className="sr-only">Close</span>
              <svg viewBox="0 0 20 20" aria-hidden className="h-5 w-5" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center px-4 pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => step(-1)}
              className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full text-white transition hover:bg-white/10 md:left-6"
            >
              <span className="sr-only">Previous image</span>
              <svg viewBox="0 0 20 20" aria-hidden className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" fill="none">
                <path d="M12.5 4L6.5 10l6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <Image
              key={active.src}
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              sizes="92vw"
              quality={88}
              className="max-h-full w-auto max-w-full object-contain"
            />

            <button
              type="button"
              onClick={() => step(1)}
              className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full text-white transition hover:bg-white/10 md:right-6"
            >
              <span className="sr-only">Next image</span>
              <svg viewBox="0 0 20 20" aria-hidden className="h-6 w-6" stroke="currentColor" strokeWidth="1.5" fill="none">
                <path d="M7.5 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
