import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ArrowIcon, Button, Section, SectionHeading } from "@/components/ui";
import { photos } from "@/data/gallery";
import { faqs, process, services } from "@/data/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Residential interiors, commercial fit-outs, civil construction and turnkey project management in Pune — priced from an itemised bill of quantities.",
  alternates: { canonical: "/services" },
};

/** One representative photograph per service, picked by hand. */
const SERVICE_IMAGE: Record<string, string> = {
  residential: "/images/projects/residential/residential-03.webp",
  commercial: "/images/projects/commercial/commercial-01.webp",
  civil: "/images/projects/civil/civil-01.webp",
  turnkey: "/images/projects/commercial/commercial-05.webp",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Four ways we get hired"
        intro="Most work is turnkey — one contract covering design through handover. But we also take single-trade jobs and pure civil packages, and we will tell you when a job is too small to be worth contracting to us."
        image="/images/hero/hero-03.webp"
      />

      {services.map((service, i) => {
        const count = photos.filter((p) => p.category === service.gallery).length;
        return (
          <Section
            key={service.slug}
            id={service.slug}
            className={`scroll-mt-24 ${i % 2 === 1 ? "bg-bone-100" : ""}`}
          >
            <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <Reveal
                className={`relative aspect-[4/3] overflow-hidden rounded-sm bg-bone-200 ${
                  i % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={SERVICE_IMAGE[service.slug]}
                  alt={`${service.title} — example project`}
                  fill
                  sizes="(min-width: 1024px) 46vw, 92vw"
                  className="object-cover"
                />
              </Reveal>

              <Reveal delay={100}>
                <p className="flex items-center gap-3 text-eyebrow uppercase text-brass-600">
                  <span aria-hidden className="h-px w-8 bg-brass-400" />
                  {String(i + 1).padStart(2, "0")} — {service.gallery === "all" ? "All work" : service.gallery}
                </p>
                <h2 className="mt-5 text-h2 text-balance">{service.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-ink-500 text-pretty">
                  {service.summary}
                </p>
                <p className="mt-4 leading-relaxed text-ink-500 text-pretty">{service.detail}</p>

                <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {service.scope.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-ink-600">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-brass-400"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Button href="/contact">Discuss a project</Button>
                  {service.gallery !== "all" && (
                    <span className="text-sm text-ink-400">
                      {count} pieces in the {service.gallery} gallery
                    </span>
                  )}
                </div>
              </Reveal>
            </div>
          </Section>
        );
      })}

      {/* ---------------------------------------------------------------- */}
      <Section className="border-t border-bone-200">
        <div className="container-page grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="How it runs"
              title="Six stages, one contract"
              intro="From the first site visit to the end of the defects period."
            />
          </div>
          <ol>
            {process.map((p, i) => (
              <Reveal
                as="li"
                key={p.step}
                delay={i * 60}
                className="grid grid-cols-[3rem_1fr] gap-6 border-t border-bone-200 py-8 first:border-t-0 first:pt-0 md:grid-cols-[4rem_1fr]"
              >
                <span className="font-display text-2xl text-brass-400 tabular-nums">{p.step}</span>
                <div>
                  <h3 className="text-h3">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-500 text-pretty">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section className="bg-bone-100">
        <div className="container-page grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="Before you ask"
              title="Questions we get every week"
            />
          </div>

          <div className="divide-y divide-bone-300 border-y border-bone-300">
            {faqs.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 50}>
                <details className="group py-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-h3 marker:hidden">
                    <span className="text-pretty">{faq.q}</span>
                    <span
                      aria-hidden
                      className="mt-2 shrink-0 text-brass-500 transition-transform duration-300 group-open:rotate-45"
                    >
                      <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5">
                        <path d="M8 2v12M2 8h12" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl leading-relaxed text-ink-500 text-pretty">
                    {faq.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section className="bg-ink-900 py-20 md:py-28">
        <div className="container-page flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <h2 className="max-w-xl text-h2 text-white text-balance">
            Not sure which of these you need? Neither are most people.
          </h2>
          <Button href="/contact" variant="secondary" className="shrink-0">
            Get a free estimate
            <ArrowIcon />
          </Button>
        </div>
      </Section>
    </>
  );
}
