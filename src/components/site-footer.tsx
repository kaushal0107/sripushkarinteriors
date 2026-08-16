import Link from "next/link";

import { Wordmark } from "@/components/wordmark";
import { nav, services, site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="bg-ink-900 text-bone-200">
      <div className="container-page py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Wordmark className="text-bone-100" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-bone-400">
              Turnkey interiors and civil contracting in Mumbai since {site.founded}.
              Design, materials, labour and supervision under one contract.
            </p>
          </div>

          <nav aria-labelledby="footer-nav-heading">
            <h2 id="footer-nav-heading" className="font-sans text-eyebrow uppercase text-bone-400">
              Pages
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1 text-bone-200 transition hover:text-brass-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-services-heading">
            <h2
              id="footer-services-heading"
              className="font-sans text-eyebrow uppercase text-bone-400"
            >
              Services
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services#${s.slug}`}
                    className="inline-block py-1 text-bone-200 transition hover:text-brass-300"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-sans text-eyebrow uppercase text-bone-400">Contact</h2>
            <address className="mt-5 space-y-3 text-sm not-italic">
              {site.phones.map((p) => (
                <div key={p.href}>
                  <a href={p.href} className="inline-block py-1 text-bone-200 transition hover:text-brass-300">
                    {p.display}
                  </a>
                </div>
              ))}
              <div>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-block py-1 text-bone-200 transition hover:text-brass-300"
                >
                  {site.email}
                </a>
              </div>
              <p className="pt-1 leading-relaxed text-bone-400">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postalCode}
              </p>
            </address>

            <ul className="mt-6 flex gap-4 text-sm">
              {site.social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-1 text-bone-400 transition hover:text-brass-300"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-bone-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>Mumbai, Maharashtra</span>
            <Link href="/case-study" className="inline-block py-1 transition hover:text-brass-300">
              Colophon &amp; rebuild notes
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
