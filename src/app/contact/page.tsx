import type { Metadata } from "next";
import EnquiryForm from "@/components/forms/EnquiryForm";
import BookButton from "@/components/ui/BookButton";
import EnquireButton from "@/components/ui/EnquireButton";
import { InstagramGlyph } from "@/components/ui/Icons";
import NightfallClock from "@/components/ui/NightfallClock";
import PageHero, { Rule } from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { site } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Nightfall Worldwide — studio bookings, releases, mixing & mastering, brand briefs and WhiteWall hire. 1/1 Rothcote Court, Burleigh Heads QLD.",
  alternates: { canonical: "/contact" },
};

const LINES = [
  { k: "General & bookings", v: site.email.admin },
  { k: "Studio & pitching", v: site.email.studio },
  { k: "Masters & artwork", v: site.email.distribution },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        code="04"
        kicker="Contact"
        meta={site.geo.label}
        title="Contact"
        lede="Sessions, releases, briefs — or just to say hello. Pick a topic and it lands with the right person."
        aside={
          <div className="flex flex-col gap-2.5 border-t border-line pt-4">
            <span className="t-label mb-2 text-muted">Book directly</span>
            <BookButton>Book the studio</BookButton>
            <BookButton tab="mix" variant="line">
              Book a mix
            </BookButton>
            <BookButton tab="whitewall" variant="line">
              Book the WhiteWall
            </BookButton>
            <EnquireButton topic="Film / TV scoring" variant="line">
              Film & advertising enquiry
            </EnquireButton>
          </div>
        }
      />
      <Section theme="day" className="pad-x pb-[clamp(60px,8vw,110px)]">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 md:col-span-7">
            <Rule left="Send a message" right="We reply within a couple of days" className="mb-6" />
            <EnquiryForm />
          </div>
          <aside className="col-span-12 flex flex-col gap-10 md:col-span-4 md:col-start-9">
            <div>
              <Rule left="Direct lines" />
              <ul className="mt-2">
                {LINES.map((l) => (
                  <li key={l.v} className="border-b border-line py-3">
                    <span className="t-label block text-muted">{l.k}</span>
                    <a href={`mailto:${l.v}`} className="t-body u-draw">
                      {l.v}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Rule left="Visit" />
              <address className="t-lede mt-4 not-italic">
                {site.address.street}
                <br />
                {site.address.suburb} {site.address.state} {site.address.postcode}
              </address>
              <p className="t-label mt-2 text-muted">{site.address.note}</p>
              <a href={site.links.maps} target="_blank" rel="noreferrer" className="t-label u-draw mt-3 inline-block">
                Directions ↗
              </a>
            </div>
            <NightfallClock variant="full" />
            <a href={site.links.instagram} target="_blank" rel="noreferrer" className="t-wide-s u-draw flex items-center gap-2 self-start">
              <InstagramGlyph /> {site.links.instagramHandle}
            </a>
          </aside>
        </div>
      </Section>
    </>
  );
}
