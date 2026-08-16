import type { Metadata } from "next";
import Image from "next/image";

import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { ArrowIcon, Button, Section, SectionHeading } from "@/components/ui";
import { partnerLogos } from "@/data/gallery";
import { site, stats, team, values } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sri Pushkar Interiors has been designing and building interiors in Mumbai since 2009 — a single firm handling drawings, procurement, site execution and handover.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the practice"
        title="Fifteen years of finishing what we drew"
        intro="Sri Pushkar Interiors began in 2009 as a civil contracting outfit in Kandivali. The design studio came later, for a simple reason: too many jobs were arriving with drawings that could not actually be built."
        image="/images/hero/hero-02.webp"
      />

      {/* ---------------------------------------------------------------- */}
      <Section>
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <Reveal className="space-y-6 text-lg leading-relaxed text-ink-500">
            <p className="text-pretty">
              Most firms sit on one side of the line. Designers hand over a set of
              renders and leave you to find a contractor. Contractors build what
              they are given and charge for every change the drawings did not
              anticipate. The client absorbs the difference, in money and in months.
            </p>
            <p className="text-pretty">
              We do both halves. The people producing your elevations are in the
              same office as the people ordering the ply and standing on site, so
              a detail that cannot be built gets caught on paper — where fixing it
              costs an afternoon rather than a fortnight.
            </p>
            <p className="text-pretty">
              It is not a glamorous pitch. But it is the reason our estimates and
              our final bills tend to look like each other.
            </p>
          </Reveal>

          <Reveal delay={120} className="relative aspect-[4/3] overflow-hidden rounded-sm bg-bone-200 lg:self-center">
            <Image
              src="/images/projects/living/living-11.webp"
              alt="Completed living room with fitted seating and cove lighting"
              fill
              sizes="(min-width: 1024px) 45vw, 92vw"
              className="object-cover"
            />
          </Reveal>
        </div>

        <div className="container-page mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-bone-200 pt-14 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <p className="font-display text-5xl text-ink-900 md:text-6xl">{s.value}</p>
              <p className="mt-3 text-sm font-medium text-ink-700">{s.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-400">{s.detail}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section className="bg-bone-100">
        <div className="container-page">
          <SectionHeading
            eyebrow="How we work"
            title="What you are actually buying"
            intro="Six things that decide whether an interior project goes well — and how we handle each one."
          />
          <ul className="mt-16 grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 70}>
                <p className="font-display text-sm text-brass-500 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-h3 text-balance">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-500 text-pretty">{v.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      <Section>
        <div className="container-page">
          <SectionHeading
            eyebrow="The people"
            title="Who you will actually deal with"
            intro="A small team. The person who quotes your job is the person who runs it."
          />

          <ul className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <Reveal as="li" key={member.name} delay={i * 90}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-bone-200">
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-6 text-h3">{member.name}</h3>
                <p className="mt-1 text-sm text-brass-600">{member.role}</p>
                <p className="mt-3 leading-relaxed text-ink-500 text-pretty">{member.bio}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {partnerLogos.length > 0 && (
        <Section className="border-t border-bone-200 py-16 md:py-20 lg:py-24">
          <div className="container-page">
            <p className="text-center text-eyebrow uppercase text-ink-400">
              Some of the clients we have built for
            </p>
            <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-2 items-center gap-x-10 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {partnerLogos.map((logo) => (
                <li key={logo.src} className="flex items-center justify-center">
                  <Image
                    src={logo.src}
                    alt=""
                    width={logo.width}
                    height={logo.height}
                    sizes="160px"
                    className="h-9 w-auto max-w-[9rem] object-contain opacity-70 mix-blend-multiply grayscale transition duration-500 hover:opacity-100 hover:grayscale-0"
                  />
                </li>
              ))}
            </ul>
            <p className="mt-10 text-center text-xs text-ink-400">
              Client marks shown to indicate completed work. All trademarks
              belong to their respective owners.
            </p>
          </div>
        </Section>
      )}

      {/* ---------------------------------------------------------------- */}
      <Section className="bg-ink-900 py-20 md:py-28">
        <div className="container-page flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <h2 className="max-w-xl text-h2 text-white text-balance">
              Want to see whether we are the right fit?
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-bone-300 text-pretty">
              The first site visit, layout and estimate are free. Call {site.phones[0].display} or
              send us the details of your space.
            </p>
          </div>
          <Button href="/contact" variant="secondary" className="shrink-0">
            Book a consultation
            <ArrowIcon />
          </Button>
        </div>
      </Section>
    </>
  );
}
