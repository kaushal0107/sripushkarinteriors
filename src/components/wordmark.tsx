/**
 * Vector redraw of the firm's logo.
 *
 * The original asset was a 600×196 PNG with a grey drop shadow baked into the
 * pixels and a semi-opaque halo around the star. It could not be recoloured for
 * a dark background — inverting it produced a white smudge — and it was the
 * heaviest above-the-fold request on the page.
 *
 * This keeps the identity (eight-point star mandala + the two-line lockup) but
 * draws it in ~2KB of markup that inherits `currentColor`, so the same mark
 * works on the transparent hero, the light header and the dark footer.
 */
export function Wordmark({
  className = "",
  showTagline = true,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Mark className="h-9 w-9 shrink-0 md:h-10 md:w-10" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl tracking-tight md:text-2xl">
          sri pushkar
        </span>
        {showTagline && (
          <span className="mt-1 text-[0.5rem] uppercase tracking-[0.2em] opacity-70 md:text-[0.55rem]">
            Interiors &amp; Civil Contractor
          </span>
        )}
      </span>
    </span>
  );
}

export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      {/* Two offset squares make the eight-point star of the original mandala. */}
      <g stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        <rect x="9" y="9" width="30" height="30" />
        <rect
          x="9"
          y="9"
          width="30"
          height="30"
          transform="rotate(45 24 24)"
        />
      </g>
      <circle cx="24" cy="24" r="9" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="24" cy="24" r="3.25" fill="currentColor" />
    </svg>
  );
}
