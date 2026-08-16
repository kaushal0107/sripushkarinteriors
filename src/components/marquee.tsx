const ITEMS = [
  "Modular kitchens",
  "False ceilings",
  "Bank branches",
  "Wardrobes",
  "RCC structure",
  "Office fit-outs",
  "Cove lighting",
  "Restaurants",
  "Masonry & plaster",
  "Wall panelling",
  "Showrooms",
  "Waterproofing",
];

/**
 * Pure-CSS marquee.
 *
 * The old site's partner-logo scroller used a `width: 1500px` fixed track with
 * `translateX(-100%)`, which left a visible dead gap on every loop and blew out
 * the horizontal scrollbar below 400px. Duplicating the track and translating
 * by exactly -50% makes the loop seamless at any width.
 */
export function Marquee() {
  return (
    <section
      aria-label="What we build"
      className="overflow-hidden border-y border-bone-200 bg-bone-50 py-6"
    >
      <div className="flex w-max animate-[marquee_48s_linear_infinite] items-center gap-10 motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-10" aria-hidden={copy === 1}>
            {ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-10">
                <span className="whitespace-nowrap font-display text-2xl text-ink-400 md:text-3xl">
                  {item}
                </span>
                <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-brass-400" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </section>
  );
}
