import type { Metadata } from "next";

import { Gallery } from "@/components/gallery";
import { PageHero } from "@/components/page-hero";
import { ArrowIcon, Button, Section } from "@/components/ui";
import { categories } from "@/data/gallery";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Photographs from completed residential interiors, commercial fit-outs and civil construction projects across Mumbai.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const total = categories[0].count;

  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="Photographs from site"
        intro={`${total} images from completed projects — homes, bank branches, restaurants and structural work. Filter by type, or open any image to step through the set.`}
        image="/images/hero/hero-01.webp"
      />

      {/* An honest version of the legacy site's disclaimer, which read as a
          brush-off. Same point, without the defensiveness. */}
      <div className="border-b border-bone-200 bg-bone-100">
        <div className="container-page py-8">
          <p className="max-w-3xl text-sm leading-relaxed text-ink-500">
            These are working photographs taken on site, not a styled shoot — and
            we only publish images where the client is happy for us to. For
            recent work we cannot show publicly, a designer can bring the full
            portfolio to you. Call{" "}
            <a href={site.phones[0].href} className="text-ink-900 underline underline-offset-4">
              {site.phones[0].display}
            </a>
            .
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
              Tell us which images you liked and we will bring comparable
              material samples to the first site visit.
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
