"use client";

import { useState } from "react";

import { ArrowIcon } from "@/components/ui";
import { site } from "@/data/site";

/**
 * Click-to-load map.
 *
 * The v1 contact page embedded a Google Maps iframe directly, so every visitor
 * loaded Google's scripts and cookies before deciding they wanted a map. Here
 * the embed is only requested once someone asks for it; until then the panel
 * shows the address and a direct link, which is what most people actually want
 * from a contact page anyway.
 */
export function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  const query = encodeURIComponent(site.mapQuery);
  const embedSrc = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${query}`;

  if (loaded) {
    return (
      <iframe
        title={`Map showing ${site.legalName} in ${site.address.city}`}
        src={embedSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[380px] w-full border-0 md:h-[480px]"
      />
    );
  }

  return (
    <div className="relative flex h-[380px] w-full flex-col items-center justify-center gap-6 overflow-hidden bg-bone-100 px-6 text-center md:h-[480px]">
      {/* Blueprint grid, drawn in CSS — no image request. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-bone-300) 1px, transparent 1px), linear-gradient(to bottom, var(--color-bone-300) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="mx-auto h-8 w-8 text-brass-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>

        <address className="mt-5 not-italic leading-relaxed text-ink-600">
          {site.address.street}
          <br />
          {site.address.city}, {site.address.region} {site.address.postalCode}
        </address>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-bone-50 transition hover:bg-ink-700"
          >
            Load the map
          </button>
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-ink-900/20 px-6 py-3 text-sm font-medium text-ink-900 transition hover:border-ink-900/50"
          >
            Open in Google Maps
            <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        <p className="mt-5 text-xs text-ink-400">
          The map is loaded from Google only when you ask for it.
        </p>
      </div>
    </div>
  );
}
