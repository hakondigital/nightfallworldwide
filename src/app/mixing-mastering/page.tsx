import type { Metadata } from "next";
import MixOrderForm from "@/components/forms/MixOrderForm";
import EngineerCards from "@/components/mix/EngineerCards";
import ProductCard from "@/components/mix/ProductCard";
import Accordion from "@/components/ui/Accordion";
import BookButton from "@/components/ui/BookButton";
import PageHero, { HeroAction, Rule } from "@/components/ui/PageHero";
import { Stagger } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { fileSpecs, products, terms, type TermsKey } from "@/lib/content/services";
import { site } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Mixing & Mastering — Grammy-nominated engineers",
  description:
    "Book mixing and mastering with the Nightfall Collective, 3× Grammy-nominated engineer Mike Snell or Grammy-nominated DON!. From A$300 per track, 3 revisions included, ~7 business day turnaround.",
  alternates: { canonical: "/mixing-mastering" },
};

const FLOW = [
  { t: "Send stems", d: "WAV only · 16-bit/44.1k or 24-bit up to 192k" },
  { t: "Mix", d: "Balance, clarity and depth" },
  { t: "Master", d: "Loud, warm, streaming-ready" },
  { t: "3 revisions", d: "Included — $50 each after" },
  { t: "Delivery", d: "24-bit/48 kHz WAV + 320 kbps MP3" },
];

export default function MixPage() {
  return (
    <>
      <PageHero
        code="01.1"
        kicker="Mixing & Mastering"
        meta="Hip-hop · R&B · EDM · Pop"
        title="Mixing & Mastering"
        lede="Radio-ready mixing and mastering — from our in-house Nightfall Collective to Grammy-nominated engineers like Mike Snell and DON!."
        aside={
          <HeroAction label="From" value="A$300 per track" note="3 revisions included · about 7 business days">
            <BookButton tab="mix">Book a mix</BookButton>
          </HeroAction>
        }
      />

      <Section theme="day" id="engineers" className="pad-x scroll-mt-32">
        <Rule left="Choose your engineer" right="Grammy-nominated options" />
        <div className="mt-6">
          <EngineerCards />
        </div>
      </Section>

      <Section theme="day" id="deals" className="pad-x scroll-mt-32 pt-[clamp(60px,8vw,110px)]">
        <Rule left="Deals" right="Prices in AUD" />
        <div className="mt-6 grid gap-(--gap) md:grid-cols-2">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Section>

      <Section theme="day" className="pad-x pt-[clamp(60px,8vw,110px)]">
        <Rule left="How it works" right="Stems in — masters out" />
        <Stagger as="ol" className="mt-6 grid gap-(--gap) sm:grid-cols-5">
          {FLOW.map((f, i) => (
            <li key={f.t} className="flex flex-col gap-2 border-t border-fg pt-3">
              <span className="t-label text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="t-wide-s">{f.t}</span>
              <span className="t-body text-muted">{f.d}</span>
            </li>
          ))}
        </Stagger>
      </Section>

      <Section theme="day" id="order" className="pad-x scroll-mt-32 pt-[clamp(60px,8vw,110px)]">
        <Rule left="Order" right="No payment until we confirm" />
        <div className="grid-12 mt-6 gap-y-8">
          <div className="col-span-12 flex flex-col gap-4 md:col-span-4">
            <h2 className="t-l">Place your order</h2>
            <p className="t-body text-muted">
              Pick your engineer and tell us the size of the job. We&apos;ll confirm the quote, turnaround and a payment link by email — questions to{" "}
              <a className="u-draw text-fg" href={`mailto:${site.email.admin}`}>
                {site.email.admin}
              </a>
              .
            </p>
          </div>
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <MixOrderForm />
          </div>
        </div>
      </Section>

      <Section theme="day" className="pad-x py-[clamp(60px,8vw,110px)]">
        <Rule left="The fine print" />
        <div className="mt-2">
          <Accordion title="Preparing your stems" meta="File requirements">
            <ul className="border-t border-line">
              {fileSpecs.audio.map((s) => (
                <li key={s} className="t-body border-b border-line py-2.5">
                  {s}
                </li>
              ))}
            </ul>
          </Accordion>
          {(Object.keys(terms) as TermsKey[]).map((k) => (
            <Accordion key={k} id={`terms-${k}`} title={terms[k].title} meta={`${terms[k].sections.length} sections`}>
              <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
                {terms[k].sections.map((s, si) => (
                  <div key={s.heading}>
                    <p className="t-label mb-2 text-muted">
                      {String(si + 1).padStart(2, "0")} — {s.heading}
                    </p>
                    <ol className="flex flex-col gap-2">
                      {s.items.map((it, ii) => (
                        <li key={ii} className="t-body flex gap-3">
                          <span className="t-label pt-1 text-muted">
                            {si + 1}.{ii + 1}
                          </span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </Accordion>
          ))}
        </div>
      </Section>
    </>
  );
}
