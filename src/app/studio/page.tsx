import type { Metadata } from "next";
import PackageGrid from "@/components/booking/PackageGrid";
import { TLink } from "@/components/providers/Transition";
import Accordion from "@/components/ui/Accordion";
import BookButton from "@/components/ui/BookButton";
import Media from "@/components/ui/Media";
import PageHero, { HeroAction, Rule } from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { bulkNote, gear, studioPackages, studioRooms } from "@/lib/content/services";
import { site } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Studio — recording studio in Burleigh Heads",
  description:
    "Book the Nightfall recording studio in Burleigh Heads, Gold Coast: 4 or 8 hour sessions, dry hire from A$319 or with an engineer from A$539. ADAM A77H monitoring, UAD Apollo, Neumann.",
  alternates: { canonical: "/studio" },
};

export default function StudioPage() {
  return (
    <>
      <PageHero
        code="01.2"
        kicker="Studio"
        meta={`${site.address.street}, ${site.address.suburb}`}
        title="The Studio"
        lede="A standalone recording studio and creative hub in Burleigh Heads — a place for artists to come and be free, with zero limitations, and work with producers and songwriters from all walks of life."
        aside={
          <HeroAction label="From" value="A$319 / 4 hours" note="With an engineer from A$539 · overtime $75/hr">
            <BookButton dot>Book now</BookButton>
          </HeroAction>
        }
      />

      <Section theme="day" id="packages" className="pad-x scroll-mt-32">
        <Rule left="Sessions" right="Live availability — pick a package" />
        <div className="mt-6">
          <PackageGrid packages={studioPackages} tab="studio" />
        </div>
        <p className="t-label mt-5 max-w-[80ch] leading-[1.7] text-muted">
          {bulkNote} Full price list on <TLink href="/rates" className="u-draw text-fg">rates & licences</TLink>.
        </p>
      </Section>

      <Section theme="day" className="pad-x pt-[clamp(60px,8vw,110px)]">
        <Rule left="The space" right="Live room · Control room" />
        <div className="grid-12 mt-6 gap-y-(--gap)">
          <Media name="studio-control-room" alt="The Nightfall control room" sizes="(min-width: 768px) 58vw, 100vw" className="col-span-12 aspect-[3/2] md:col-span-7" />
          <div className="col-span-12 flex flex-col gap-(--gap) md:col-span-5">
            <Media name="studio-montage" alt="Inside the Nightfall studio — Neumann mic, UAD Apollo, ADAM monitors" sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[3/2] w-full" />
            <div className="grid grid-cols-3 border-y border-line">
              {studioRooms.map((r) => (
                <p key={r.label} className="flex flex-col gap-1 border-r border-line py-4 pr-3 last:border-r-0 not-first:pl-3">
                  <span className="t-price text-[clamp(1.4rem,2vw,1.8rem)]">{r.value}</span>
                  <span className="t-label text-muted">{r.label}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section theme="day" id="gear" className="pad-x scroll-mt-32 py-[clamp(60px,8vw,110px)]">
        <Rule left="Gear list" right={`${gear.reduce((n, g) => n + g.items.length, 0)} items`} />
        <div className="mt-2">
          {gear.map((g) => (
            <Accordion key={g.group} title={g.group} meta={`${g.items.length} items`}>
              <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.map((it) => (
                  <li key={it} className="t-body border-b border-line py-2">
                    {it}
                  </li>
                ))}
              </ul>
            </Accordion>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 md:flex-row md:items-center">
          <p className="t-l max-w-[20ch]">Need it mixed too?</p>
          <div className="flex flex-wrap gap-3">
            <BookButton dot>Book the studio</BookButton>
            <BookButton tab="mix" variant="line">
              Book a mix
            </BookButton>
          </div>
        </div>
      </Section>
    </>
  );
}
