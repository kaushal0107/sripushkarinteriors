import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { Section, SectionHeading } from "@/components/ui";
import { benchmark, decisions, disclosure, findings, repoStats } from "@/data/case-study";

export const metadata: Metadata = {
  title: "Rebuild case study",
  description:
    "How a 2019 Bootstrap-and-jQuery brochure site became a Next.js application: measured before-and-after numbers, the defects found in the original, and the trade-offs taken.",
  alternates: { canonical: "/case-study" },
  robots: { index: true, follow: true },
};

const SEVERITY: Record<string, string> = {
  high: "bg-red-100 text-red-900",
  medium: "bg-amber-100 text-amber-900",
  low: "bg-bone-200 text-ink-600",
};

export default function CaseStudyPage() {
  return (
    <>
      <section className="border-b border-bone-200 bg-bone-100 pt-36 pb-16 md:pt-44 md:pb-24">
        <div className="container-page">
          <p className="flex items-center gap-3 text-eyebrow uppercase text-brass-600">
            <span aria-hidden className="h-px w-8 bg-brass-400" />
            Engineering write-up
          </p>
          <h1 className="mt-6 max-w-4xl text-h1 text-balance">
            Rebuilding a site I wrote as a student
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-500 text-pretty">
            The first version of this site went up in 2019 — Bootstrap 4 from a
            CDN, jQuery three times over, 280 MB of unresized phone photographs,
            and a PHP mail handler with an open header-injection hole. This is
            what changed, measured rather than asserted.
          </p>
          <p className="mt-8 text-sm text-ink-400">
            The original is preserved in git history at commit{" "}
            <code className="rounded bg-bone-200 px-1.5 py-0.5 font-mono text-xs text-ink-700">
              8b4d0cc
            </code>
            . Every number below was taken against it.
          </p>
        </div>
      </section>

      <Section className="py-14 md:py-20">
        <div className="container-page">
          <div className="max-w-3xl rounded-sm border border-brass-300/60 bg-brass-300/10 p-6 md:p-8">
            <h2 className="text-h3">{disclosure.heading}</h2>
            {disclosure.body.map((paragraph) => (
              <p key={paragraph} className="mt-4 leading-relaxed text-ink-600 text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section className="pt-0 pb-16 md:pb-24">
        <div className="container-page grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {repoStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <p className="font-display text-3xl text-ink-900 md:text-4xl">{s.value}</p>
              <p className="mt-3 text-sm font-medium text-ink-700">{s.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-400">{s.detail}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-y border-bone-200 bg-bone-100 py-16 md:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Measured"
            title="Same laptop, same network, both versions"
            intro="Both builds served locally and loaded cold, loading the same photographs. The one row that got worse is left in."
          />

          <p className="mt-8 text-xs uppercase tracking-wider text-ink-400 md:hidden">
            Scroll the table sideways
          </p>

          <div className="mt-4 -mx-5 overflow-x-auto px-5 md:mt-10 md:mx-0 md:px-0">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">
                Performance comparison between the 2019 site and the rebuild
              </caption>
              <thead>
                <tr className="border-b border-bone-300 text-eyebrow uppercase text-ink-400">
                  <th scope="col" className="py-4 pr-4 font-sans font-normal">
                    Metric
                  </th>
                  <th scope="col" className="py-4 pr-4 text-right font-sans font-normal">
                    v1 (2019)
                  </th>
                  <th scope="col" className="py-4 pr-4 text-right font-sans font-normal">
                    Rebuild
                  </th>
                  <th scope="col" className="py-4 text-right font-sans font-normal">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {benchmark.rows.map((row) => (
                  <tr key={row.metric} className="border-b border-bone-200">
                    <th scope="row" className="py-4 pr-4 font-sans text-sm font-medium text-ink-700">
                      {row.metric}
                    </th>
                    <td className="py-4 pr-4 text-right font-mono text-sm tabular-nums text-ink-500">
                      {row.legacy}
                    </td>
                    <td className="py-4 pr-4 text-right font-mono text-sm tabular-nums text-ink-900">
                      {row.rebuild}
                    </td>
                    <td
                      className={`py-4 text-right font-mono text-sm tabular-nums ${
                        row.better ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {row.delta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 max-w-3xl leading-relaxed text-ink-600 text-pretty">
            <strong className="font-medium text-ink-900">Why photographs on both sides.</strong>{" "}
            {benchmark.caveat}
          </p>

          <div className="mt-10 max-w-3xl rounded-sm border border-bone-300 bg-bone-50 p-6 md:p-8">
            <h3 className="text-h3">What this build actually ships</h3>
            <p className="mt-3 leading-relaxed text-ink-500 text-pretty">
              {benchmark.current.note}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
              {benchmark.current.rows.map((row) => (
                <div key={row.metric} className="border-t border-bone-300 pt-3">
                  <dt className="text-xs uppercase tracking-wider text-ink-400">{row.metric}</dt>
                  <dd className="mt-1 font-mono text-sm tabular-nums text-ink-900">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-400">
            <strong className="font-medium text-ink-600">Method.</strong>{" "}
            {benchmark.method} Measured {benchmark.date}. Largest Contentful
            Paint and Cumulative Layout Shift were collected with a buffered
            PerformanceObserver rather than{" "}
            <code className="font-mono text-xs">getEntriesByType</code>, which
            does not return LCP entries.
          </p>
        </div>
      </Section>

      <Section className="py-16 md:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Findings"
            title="What was actually wrong"
            intro="Nine issues found reading the v1 source, in rough order of how much they mattered."
          />

          <ol className="mt-10 space-y-px overflow-hidden rounded-sm bg-bone-200 md:mt-14">
            {findings.map((finding, i) => (
              <Reveal as="li" key={finding.problem} delay={i * 40} className="bg-bone-50">
                <article className="grid gap-6 p-6 md:grid-cols-[9rem_1fr] md:p-10">
                  <div className="flex flex-row items-center gap-3 md:flex-col md:items-start">
                    <span className="font-display text-sm text-brass-500 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wider text-ink-500">
                      {finding.tag}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider ${
                        SEVERITY[finding.severity]
                      }`}
                    >
                      {finding.severity}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-h3 text-balance">{finding.problem}</h3>
                    <p className="mt-3 leading-relaxed text-ink-500 text-pretty">
                      {finding.detail}
                    </p>
                    <p className="mt-4 border-l-2 border-brass-400 pl-4 leading-relaxed text-ink-600 text-pretty">
                      <strong className="font-medium text-ink-900">Replaced with:</strong>{" "}
                      {finding.fix}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <Section className="border-t border-bone-200 bg-bone-100 py-16 md:py-24">
        <div className="container-page grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="Trade-offs"
              title="Decisions worth defending"
              intro="The questions a reviewer should ask, answered before they have to."
            />
          </div>

          <div className="divide-y divide-bone-300 border-y border-bone-300">
            {decisions.map((d, i) => (
              <Reveal key={d.q} delay={i * 50}>
                <details className="group py-6" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-h3 marker:hidden">
                    <span className="text-pretty">{d.q}</span>
                    <span
                      aria-hidden
                      className="mt-2 shrink-0 text-brass-500 transition-transform duration-300 group-open:rotate-45"
                    >
                      <svg viewBox="0 0 16 16" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5">
                        <path d="M8 2v12M2 8h12" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl leading-relaxed text-ink-500 text-pretty">{d.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 md:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Stack" title="What it is built from" />
          <dl className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Framework", "Next.js 16, App Router, React 19"],
              ["Language", "TypeScript, strict mode"],
              ["Styling", "Tailwind CSS v4, tokens defined in @theme"],
              ["Images", "Generated SVG → WebP via sharp, served through next/image"],
              ["Forms", "Zod schema shared by client and server route"],
              ["Type", "Fraunces and Inter, self-hosted via next/font"],
              ["Runtime deps", "React, Next and Zod — nothing else"],
              ["Client JS", "Header, gallery, hero and form only"],
              ["Hosting", "Static pages plus one dynamic route"],
            ].map(([term, detail]) => (
              <div key={term} className="border-t border-bone-200 pt-4">
                <dt className="text-eyebrow uppercase text-brass-600">{term}</dt>
                <dd className="mt-2 leading-relaxed text-ink-600">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section className="bg-ink-900 py-16 md:py-20">
        <div className="container-page flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="max-w-xl leading-relaxed text-bone-300 text-pretty">
            This page documents the rebuild. The site it describes starts at the
            home page.
          </p>
          <Link
            href="/"
            className="shrink-0 rounded-full bg-bone-200 px-7 py-3.5 text-sm font-medium text-ink-900 transition hover:bg-white"
          >
            View the site
          </Link>
        </div>
      </Section>
    </>
  );
}
