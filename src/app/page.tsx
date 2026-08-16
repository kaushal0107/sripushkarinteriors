import Image from "next/image";
import Link from "next/link";

import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { Reveal } from "@/components/reveal";
import { ArrowIcon, Button, Eyebrow, Section, SectionHeading } from "@/components/ui";
import { featuredPhotos } from "@/data/gallery";
import { process, services, site, stats, values } from "@/data/site";

export default function HomePage() {
  const showcase = featuredPhotos;

  return (
    <>
      <Hero />

      <Section className="border-b border-bone-200">
        <div className="container-page grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <Reveal>
            <Eyebrow>Who we are</Eyebrow>
            <h2 className="mt-5 text-h2 text-balance">
              A contractor that draws, and a designer that builds.
            </h2>
          </Reveal>

          <Reveal delay={120} className="space-y-6 text-lg leading-relaxed text-ink-500">
            <p className="text-pretty">
              Most interior jobs fail in the gap between the person who
              drew it and the people who build it. We closed that gap by doing
              both — the same firm produces the drawings, prices the bill of
              quantities, buys the material and runs the site.
            </p>
            <p className="text-pretty">
              It means fewer surprises on the final bill, and no afternoon spent
              on the phone working out whether the carpenter or the electrician
              is the reason nothing happened this week.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 border-b border-ink-900/25 pb-1 text-sm font-medium text-ink-900 transition hover:border-ink-900"
              >
                More about the practice
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="container-page mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-bone-200 pt-10 md:mt-20 md:gap-y-12 md:pt-14 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <p className="font-display text-5xl text-ink-900 md:text-6xl">{s.value}</p>
              <p className="mt-3 text-sm font-medium text-ink-700">{s.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-400">{s.detail}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-bone-100">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              eyebrow="What we do"
              title="Four ways we get hired"
              intro="Most projects are turnkey — but we take on single-trade work and pure civil packages too."
            />
            <Button href="/services" variant="ghost">
              All services
            </Button>
          </div>

          <ul className="mt-10 grid gap-px overflow-hidden rounded-sm bg-bone-300 sm:grid-cols-2 md:mt-16">
            {services.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={i * 80} className="bg-bone-50">
                <Link
                  href={`/services#${s.slug}`}
                  className="group flex h-full flex-col p-8 transition-colors duration-500 hover:bg-white md:p-12"
                >
                  <span className="font-display text-sm text-brass-500 tabular-nums">
                    0{i + 1}
                  </span>
                  <h3 className="mt-6 text-h3">{s.title}</h3>
                  <p className="mt-4 flex-1 leading-relaxed text-ink-500 text-pretty">
                    {s.summary}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink-900">
                    Read more
                    <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading eyebrow="Selected work" title="Recent projects" />
            <Button href="/projects" variant="ghost">
              View all {" "}
              <ArrowIcon />
            </Button>
          </div>
        </div>

        <div className="container-page mt-10 grid grid-cols-2 gap-3 md:mt-16 md:gap-4 lg:grid-cols-4">
          {showcase.map((photo, i) => (
            <Reveal
              key={photo.src}
              delay={i * 60}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-bone-200"
            >
              <Link href="/projects" className="block h-full w-full">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 24vw, 48vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-900/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                >
                  <span className="text-sm text-white">{photo.set}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Marquee />

      <Section className="bg-bone-100">
        <div className="container-page">
          <SectionHeading
            eyebrow="Why us"
            title="What you are actually buying"
            intro="Six things that decide whether an interior project goes well — and how we handle each one."
          />

          <ul className="mt-10 grid gap-x-12 gap-y-12 md:mt-16 md:grid-cols-2 md:gap-y-14 lg:grid-cols-3">
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

      <Section>
        <div className="container-page grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="How it runs"
              title="Six stages, one contract"
              intro="From the first site visit to the end of the defects period."
            />
            <div className="mt-8">
              <Button href="/contact">Start with a site visit</Button>
            </div>
          </div>

          <ol className="space-y-0">
            {process.map((p, i) => (
              <Reveal
                as="li"
                key={p.step}
                delay={i * 60}
                className="grid grid-cols-[3rem_1fr] gap-6 border-t border-bone-200 py-8 first:border-t-0 first:pt-0 md:grid-cols-[4rem_1fr]"
              >
                <span className="font-display text-2xl text-brass-400 tabular-nums">
                  {p.step}
                </span>
                <div>
                  <h3 className="text-h3">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-500 text-pretty">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <section className="relative isolate overflow-hidden bg-ink-900 py-24 md:py-36">
        <Image
          src="/images/hero/hero-03.webp"
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 -z-10 object-cover opacity-25"
        />
        <div className="container-page relative text-center">
          <Reveal>
            <p className="text-eyebrow uppercase text-brass-300">Free, no obligation</p>
            <h2 className="mx-auto mt-6 max-w-3xl text-h1 text-white text-balance">
              Tell us about the space. We&rsquo;ll come and measure it.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-bone-300 text-pretty">
              A site visit, a layout and an itemised estimate cost you nothing.
              You only commit once you have seen the drawings and the numbers.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-medium text-ink-900 transition hover:bg-bone-200"
              >
                Book a consultation
                <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href={site.phones[0].href}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-4 text-sm font-medium text-white transition hover:border-white/70 hover:bg-white/10"
              >
                {site.phones[0].display}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
