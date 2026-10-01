import type { Metadata } from "next";
import { TLink } from "@/components/providers/Transition";
import BookButton from "@/components/ui/BookButton";
import PageHero, { Rule, StreamsStat } from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { bulkNote, distribution, engineers, licenceRates, products, studioRates, whitewall } from "@/lib/content/services";
import { site } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Rates & licences 2025/26",
  description:
    "Nightfall Studios price list 2025/26: studio dry hire from $319, engineering from $220, exclusive track licences from $250, mixing & mastering from $300, Mike Snell mix & master $1,000, distribution at 20%.",
  alternates: { canonical: "/rates" },
};

type Row = { label: string; detail?: string; price: string };

function Sheet({ title, rows, note }: { title: string; rows: Row[]; note?: string }) {
  return (
    <div className="flex flex-col">
      <p className="t-wide-s border-b border-fg pb-3">{title}</p>
      <ul>
        {rows.map((r, i) => (
          <li key={r.label + i} className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-line py-3">
            <span>
              <span className="t-body block">{r.label}</span>
              {r.detail && <span className="t-label mt-1 block text-muted">{r.detail}</span>}
            </span>
            <span className="t-price text-[clamp(1.2rem,1.6vw,1.5rem)]">{r.price}</span>
          </li>
        ))}
      </ul>
      {note && <p className="t-label mt-3 leading-[1.6] text-muted">{note}</p>}
    </div>
  );
}

const gap = "mt-[clamp(48px,6vw,80px)]";

export default function RatesPage() {
  const deals = products.flatMap((p) =>
    p.variants.map((v) => ({
      label: p.name,
      detail: v.key ? v.key.replace(/\|/g, " · ") : p.kicker,
      price: `$${v.price.toLocaleString("en-AU")}`,
    })),
  );
  return (
    <>
      <PageHero
        code="01.6"
        kicker="Rates"
        meta={`Price list ${studioRates.year} · AUD`}
        title="Rates"
        lede="Nightfall Studios’ full price list — studio time, engineering, beats, mixing and mastering, distribution and the WhiteWall."
        aside={
          <div className="flex flex-col gap-5">
            <StreamsStat className="border-t border-line pt-4" />
            <BookButton>Book a session</BookButton>
          </div>
        }
      />

      <Section theme="day" className="pad-x pb-[clamp(60px,8vw,110px)]">
        <Rule left="Studio" right={<TLink href="/studio#packages" className="u-draw">Book a package →</TLink>} />
        <div className="mt-6 grid gap-x-(--gap) gap-y-10 md:grid-cols-2">
          {studioRates.groups.map((g) => (
            <Sheet key={g.title} title={g.title} rows={g.rows} />
          ))}
        </div>

        <Rule left="Mixing & mastering" right={<TLink href="/mixing-mastering" className="u-draw">Book a mix →</TLink>} className={gap} />
        <div className="mt-6 grid gap-x-(--gap) gap-y-10 md:grid-cols-2">
          <Sheet title="Choose your engineer" rows={engineers.map((e) => ({ label: e.name, detail: e.badge, price: e.price.replace(/ per track$/, "").replace("A$", "$").replace(/^From/, "from") }))} note="Per track." />
          <Sheet title="Deals" rows={deals} note="2 for 1: buy mixing & mastering for one track, get a second free. Artist Spotlight runs monthly with 8 spots." />
        </div>

        <Rule left="Beats & licences" right={<a href={site.links.beats} target="_blank" rel="noreferrer" className="u-draw">Browse beats ↗</a>} className={gap} />
        <div className="mt-6 grid gap-x-(--gap) gap-y-10 md:grid-cols-2">
          {licenceRates
            .filter((g) => g.title !== "Mixing & mastering")
            .map((g) => (
              <Sheet key={g.title} title={g.title} rows={g.rows} />
            ))}
        </div>

        <div className={`${gap} grid gap-x-(--gap) gap-y-10 md:grid-cols-2`}>
          <div>
            <Rule left="Distribution" right={<TLink href="/distribution" className="u-draw">Join the label →</TLink>} />
            <div className="mt-6">
              <Sheet
                title="Distribution & publishing"
                rows={[...distribution.costs.map((c) => ({ label: c.label, price: c.value })), { label: "Publishing", detail: "Coming soon", price: "—" }]}
                note="No lock-in contracts. Full ownership retained."
              />
            </div>
          </div>
          <div>
            <Rule left="WhiteWall" right={<TLink href="/whitewall#packages" className="u-draw">Book the WhiteWall →</TLink>} />
            <div className="mt-6">
              <Sheet
                title="Photo & video studio"
                rows={[
                  { label: "WhiteWall hire", detail: "Per hour", price: `from ${whitewall.from}` },
                  ...whitewall.lighting.rates.map((r) => ({ label: `Lighting package — ${r.label.toLowerCase()}`, price: r.price })),
                ]}
              />
            </div>
          </div>
        </div>

        <div className={`${gap} flex flex-col items-start justify-between gap-6 border-t border-line pt-6 md:flex-row md:items-end`}>
          <div className="flex max-w-[60ch] flex-col gap-3">
            <h2 className="t-l">Bigger project?</h2>
            <p className="t-body text-muted">
              {bulkNote}{" "}
              <a className="u-draw text-fg" href={`mailto:${site.email.admin}?subject=Rates`}>
                {site.email.admin}
              </a>
            </p>
          </div>
          <TLink href="/contact" className="t-wide-s u-draw shrink-0">
            Contact us →
          </TLink>
        </div>
      </Section>
    </>
  );
}
