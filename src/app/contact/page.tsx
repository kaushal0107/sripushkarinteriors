import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { MapEmbed } from "@/components/map-embed";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free site visit and estimate with Meridian Interiors in Pune. Call +91 98765 43210 or send an enquiry.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us about the space"
        intro="A site visit, a layout and an itemised estimate cost you nothing. We usually call back the same working day."
        image="/images/hero/hero-02.webp"
      />

      <Section className="py-16 md:py-24">
        <div className="container-page grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">

          <Reveal className="space-y-10">
            <div>
              <h2 className="text-eyebrow uppercase text-brass-600">Call us</h2>
              <ul className="mt-4 space-y-2">
                {site.phones.map((p) => (
                  <li key={p.href}>
                    <a
                      href={p.href}
                      className="font-display text-2xl text-ink-900 transition hover:text-brass-600"
                    >
                      {p.display}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-ink-400">
                Monday to Saturday, 9am – 7pm IST
              </p>
            </div>

            <div>
              <h2 className="text-eyebrow uppercase text-brass-600">Email</h2>
              <a
                href={`mailto:${site.email}`}
                className="mt-4 block text-lg text-ink-900 transition hover:text-brass-600"
              >
                {site.email}
              </a>
            </div>

            <div>
              <h2 className="text-eyebrow uppercase text-brass-600">Office</h2>
              <address className="mt-4 not-italic leading-relaxed text-ink-500">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postalCode}
                <br />
                India
              </address>
            </div>

            <div className="rounded-sm border border-bone-300 bg-bone-100 p-6">
              <h2 className="text-h3">Before you call</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500 text-pretty">
                We are a contracting firm, not a recruitment desk. We do not have
                vacancies to discuss over the phone — if you are looking for work,
                email a CV to {site.email} instead.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-sm border border-bone-300 bg-bone-100 p-6 md:p-10">
              <h2 className="text-h2">Request a consultation</h2>
              <p className="mt-3 max-w-md leading-relaxed text-ink-500 text-pretty">
                Fill this in and a designer will call to arrange a visit. Nothing
                is charged and nothing is committed until you approve a drawing
                and an estimate.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <section aria-label="Office location" className="border-t border-bone-200">
        <MapEmbed />
      </section>
    </>
  );
}
