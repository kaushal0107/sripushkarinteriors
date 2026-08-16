import type { Metadata } from "next";
import Link from "next/link";

import { Gallery } from "@/components/gallery";
import { PageHero } from "@/components/page-hero";
import { ArrowIcon, Button, Section } from "@/components/ui";
import { categories } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected residential interiors, commercial fit-outs and civil construction projects across Pune.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const total = categories[0].count;

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Selected work"
        intro={`${total} pieces across homes, workplaces and structural work. Filter by type, or open any one to step through the set.`}
        image="/images/hero/hero-01.webp"
      />

      {/* The legacy page opened with a defensive note explaining why the real
          portfolio was not online. This states the actual situation instead. */}
      <div className="border-b border-bone-200 bg-bone-100">
        <div className="container-page py-8">
          <p className="max-w-3xl text-sm leading-relaxed text-ink-500">
            <strong className="font-medium text-ink-700">A note on the imagery.</strong>{" "}
            This is a portfolio build, so the project photography has been
            replaced with generated architectural compositions — see the{" "}
            <Link href="/case-study" className="text-ink-900 underline underline-offset-4">
              rebuild notes
            </Link>
            . Everything else on the page — the filtering, the lightbox, the
            keyboard handling — works exactly as it would with real photographs.
          </p>
        </div>
      </div>

      <Section className="py-14 md:py-20">
        <Gallery />
      </Section>

      <Section className="bg-ink-900 py-20 md:py-28">
        <div className="container-page flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <h2 className="max-w-xl text-h2 text-white text-balance">
              Seen something you want in your own space?
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-bone-300 text-pretty">
              Tell us what caught your eye and we will bring comparable material
              samples to the first site visit.
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
