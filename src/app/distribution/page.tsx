import type { Metadata } from "next";
import ArtistCard from "@/components/music/ArtistCard";
import { TLink } from "@/components/providers/Transition";
import Accordion from "@/components/ui/Accordion";
import { Arrow } from "@/components/ui/Icons";
import PageHero, { HeroAction, Rule } from "@/components/ui/PageHero";
import Rail from "@/components/ui/Rail";
import { Stagger } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { collective } from "@/lib/content/artists";
import { distribution, fileSpecs } from "@/lib/content/services";
import { site } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Distribution — join the Nightfall label",
  description:
    "Join Nightfall Distribution: global release to every major DSP, editorial playlist pitching, transparent splits and full ownership. No upfront fees, you keep 80%, no lock-in contracts.",
  alternates: { canonical: "/distribution" },
};

const STEPS = [
  { n: "01", t: "Join & upload", d: "Register with the label and send your release details. Masters and artwork go to our distribution inbox.", href: "/distribution/upload", cta: "Join the label" },
  { n: "02", t: "Get pitched", d: "Tell us the story, markets and moods so we can pitch to Spotify and other DSP editors.", href: "/distribution/pitching", cta: "Pitching form" },
  { n: "03", t: "Track & get paid", d: "Analytics, releases and royalty payouts via Wise — all in the artist portal.", href: site.links.distroPortal, cta: "Artist login ↗" },
];

const btn = "group t-wide-s flex items-center justify-between gap-3 px-5 py-4";

export default function DistributionPage() {
  const releasing = collective.filter((a) => a.spotify);
  return (
    <>
      <PageHero
        code="01.3"
        kicker="Distribution"
        meta="Nightfall Distribution"
        title="Distribution"
        lede={distribution.lede}
        aside={
          <HeroAction label="You keep" value="80% of royalties" note="No upfront fees · no lock-in">
            <TLink href="/distribution/upload" className={`${btn} bg-fg text-bg transition-colors hover:bg-rec`}>
              Join the label <Arrow className="transition-transform duration-500 group-hover:rotate-45" />
            </TLink>
            <a href={site.links.distroPortal} target="_blank" rel="noreferrer" className={`${btn} border border-line hover:border-fg`}>
              Artist login <Arrow className="transition-transform duration-500 group-hover:rotate-45" />
            </a>
          </HeroAction>
        }
      />

      {/* join */}
      <Section theme="day" id="join" className="pad-x scroll-mt-32">
        <Rule left="Join our distribution label" right="Three steps" />
        <Stagger className="mt-6 grid gap-(--gap) md:grid-cols-3">
          {STEPS.map((s) => (
            <TLink key={s.n} href={s.href} className="group flex flex-col gap-3 border border-line p-5 transition-colors hover:border-fg">
              <span className="t-label text-muted">{s.n}</span>
              <span className="t-m">{s.t}</span>
              <span className="t-body text-muted">{s.d}</span>
              <span className="t-wide-s mt-auto flex items-center gap-2 pt-3 text-rec">
                {s.cta} <Arrow className="transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </TLink>
          ))}
        </Stagger>
        <p className="t-label mt-5 max-w-[80ch] leading-[1.7] text-muted">{distribution.pitchLeadTime}</p>
      </Section>

      {/* the deal */}
      <Section theme="day" className="pad-x pt-[clamp(60px,8vw,110px)]">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 md:col-span-7">
            <Rule left="What you get" />
            <ul className="mt-2">
              {distribution.get.map((g) => (
                <li key={g} className="t-body flex items-baseline gap-3 border-b border-line py-3">
                  <span className="h-1.5 w-1.5 shrink-0 translate-y-[-2px] bg-rec" />
                  {g}
                </li>
              ))}
            </ul>
            <p className="t-body mt-6 max-w-[60ch] text-muted">{distribution.intro}</p>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9">
            <Rule left="What it costs" />
            <ul className="mt-2">
              {distribution.costs.map((c) => (
                <li key={c.label} className="flex items-baseline justify-between border-b border-line py-3">
                  <span className="t-body">{c.label}</span>
                  <span className="t-price text-[1.5rem]">{c.value}</span>
                </li>
              ))}
              <li className="flex items-baseline justify-between border-b border-line py-3">
                <span className="t-body">Publishing</span>
                <span className="t-label text-rec">Coming soon</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* specs */}
      <Section theme="day" className="pad-x pt-[clamp(60px,8vw,110px)]">
        <Rule left="Delivery specs" right={<a className="u-draw" href={`mailto:${site.email.distribution}`}>{site.email.distribution}</a>} />
        <div className="mt-2">
          <Accordion title="Audio" meta={`${fileSpecs.audio.length} requirements`}>
            <ul>
              {fileSpecs.audio.map((s) => (
                <li key={s} className="t-body border-b border-line py-2.5">
                  {s}
                </li>
              ))}
            </ul>
          </Accordion>
          <Accordion title="Artwork" meta={`${fileSpecs.artwork.length} requirements`}>
            <ul>
              {fileSpecs.artwork.map((s) => (
                <li key={s} className="t-body border-b border-line py-2.5">
                  {s}
                </li>
              ))}
            </ul>
          </Accordion>
        </div>
      </Section>

      {/* roster */}
      <Section theme="day" className="pad-x py-[clamp(60px,8vw,110px)]">
        <Rule left="Releasing through Nightfall" right={`${releasing.length} artists`} />
        <Rail cols={7} className="mt-6 gap-y-8">
          {releasing.map((a) => (
            <ArtistCard key={a.slug} artist={a} />
          ))}
        </Rail>
      </Section>
    </>
  );
}
