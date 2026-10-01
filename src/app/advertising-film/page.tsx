import type { Metadata } from "next";
import EnquiryForm from "@/components/forms/EnquiryForm";
import EnquireButton from "@/components/ui/EnquireButton";
import Media from "@/components/ui/Media";
import PageHero, { HeroAction, Rule } from "@/components/ui/PageHero";
import ReelBand from "@/components/ui/ReelBand";
import { Stagger } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { filmTopics } from "@/lib/content/forms";
import { film, filmServices } from "@/lib/content/services";
import { site } from "@/lib/content/site";
import { awards, brandClients, member } from "@/lib/content/team";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Advertising & Film — film scoring, sonic identity & sync",
  description:
    "Film and TV scoring for post-production, music for advertising, sonic identity and sync from Nightfall Worldwide. 8× BADC and 4× Muse Creative Awards. Clients include Jaguar, Casio G-Shock, Shell, XXXX and Coopers Brewery.",
  alternates: { canonical: "/advertising-film" },
};

export default function FilmPage() {
  const rob = member("rob-rivers")!;
  const mike = member("mike-snell")!;
  return (
    <>
      <PageHero
        code="02"
        kicker="Advertising & Film"
        meta="Scoring · Sonic identity · Sync"
        title="Advertising & Film"
        lede="Original score for film and TV in post-production, music for advertising, sonic identity and sync — from award-winning composer Rob Rivers and 3× Grammy-nominated Mike Snell."
        aside={
          <HeroAction label="Award-winning" value="8× BADC · 4× Muse" note="Tell us about your film or campaign — we reply within a couple of days">
            <EnquireButton topic="Film / TV scoring">Enquire now</EnquireButton>
          </HeroAction>
        }
      />

      {/* flips to night once the reel is well into view, so the page always opens in day */}
      <Section theme="night" line={38}>
        <ReelBand base="/media/video/reel-commercial" poster="/media/video/reel-commercial-poster.webp" file="COMMERCIAL.MP4 — SELECTED CAMPAIGNS" />
      </Section>

      {/* services */}
      <Section theme="day" id="services" className="pad-x scroll-mt-32 pt-[clamp(60px,8vw,110px)]">
        <Rule left="What we do" right="From brief to final mix" />
        <p className="t-lede mt-6 max-w-[60ch]">{film.statement}</p>
        <Stagger className="mt-8 grid gap-(--gap) sm:grid-cols-2 lg:grid-cols-4">
          {filmServices.map((s, i) => (
            <div key={s.title} className="flex flex-col gap-3 border-t border-fg pt-4">
              <span className="t-label text-muted">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="t-m">{s.title}</h3>
              <p className="t-body text-muted">{s.body}</p>
            </div>
          ))}
        </Stagger>
      </Section>

      {/* awards */}
      <Section theme="day" className="pad-x pt-[clamp(60px,8vw,110px)]">
        <Rule left="Recognition" right="Awards" />
        <div className="mt-6 grid gap-(--gap) md:grid-cols-2">
          {awards.map((a) => (
            <div key={a.name} className="flex items-center gap-4 border border-line p-4 sm:gap-6 sm:p-5">
              <div className={cn("relative shrink-0 grayscale", a.logo === "award-badc" ? "h-12 w-12 sm:h-16 sm:w-16" : "h-9 w-24 sm:h-12 sm:w-36")}>
                <Media name={a.logo} alt={a.name} fit="contain" sizes="160px" className="h-full w-full" />
              </div>
              <div>
                <p className="t-price text-[1.35rem] sm:text-[1.6rem]">
                  {a.count}× <span className="t-wide-s">{a.name}</span>
                </p>
                <p className="t-body mt-1 text-muted">{a.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* work */}
      <Section theme="day" id="work" className="pad-x scroll-mt-32 pt-[clamp(60px,8vw,110px)]">
        <Rule left="Selected work" right="Stills from campaigns & films" />
        <div className="mt-6 grid grid-cols-2 gap-(--gap) md:grid-cols-3 lg:grid-cols-4">
          {film.work.map((w) => (
            <figure key={w.name}>
              <Media name={w.name} alt={w.caption} sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 50vw" className="aspect-[4/3] w-full" />
              <figcaption className="t-label mt-2 text-muted">{w.caption}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* composers */}
      <Section theme="day" className="pad-x pt-[clamp(60px,8vw,110px)]">
        <Rule left="The composers" right="Who you'll work with" />
        <div className="mt-6 grid gap-x-(--gap) gap-y-12 md:grid-cols-2">
          {[
            { m: rob, img: "rob-rivers-studio" as const },
            { m: mike, img: "mike-snell-jersey" as const },
          ].map(({ m, img }) => (
            <div key={m.slug} className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-x-4 gap-y-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:grid-rows-[auto_1fr] sm:items-start sm:gap-x-5">
              <Media name={img} alt={m.name} sizes="(min-width: 768px) 18vw, 96px" className="aspect-[4/5] w-full sm:row-span-2" position="50% 25%" />
              <div className="flex flex-col gap-2 sm:gap-3">
                <span className="t-label text-muted">{m.role}</span>
                <h3 className="t-m">{m.name}</h3>
              </div>
              <div className="col-span-2 flex flex-col gap-3 sm:col-span-1 sm:col-start-2">
                <p className="t-body text-muted">{m.filmBio}</p>
                <p className="t-label text-muted">{m.accolades?.join(" · ")}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* clients */}
      <Section theme="day" className="pad-x pt-[clamp(60px,8vw,110px)]">
        <Rule left="Brand clients" right={`${brandClients.length} brands`} />
        <p className="mt-6 max-w-[90ch] font-display text-[clamp(1.1rem,1.7vw,1.7rem)] font-bold leading-snug tracking-[-0.02em]">
          {brandClients.map((c, i) => (
            <span key={c}>
              {c}
              {i < brandClients.length - 1 && <span className="text-rec"> · </span>}
            </span>
          ))}
        </p>
      </Section>

      {/* brief */}
      <Section theme="day" id="enquire" className="pad-x scroll-mt-32 py-[clamp(60px,8vw,110px)]">
        <Rule left="Start a project" right="We reply within a couple of days" />
        <div className="grid-12 mt-6 gap-y-8">
          <div className="col-span-12 flex flex-col gap-4 md:col-span-4">
            <h2 className="t-l">Tell us about your project</h2>
            <p className="t-body text-muted">
              Scoring a film in post, launching a campaign or building a sonic identity — send the brief and we&apos;ll come back with ideas, timing and a quote. Prefer email?{" "}
              <a className="u-draw text-fg" href={`mailto:${site.email.admin}?subject=Brief`}>
                {site.email.admin}
              </a>
            </p>
          </div>
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <EnquiryForm topics={filmTopics} defaultTopic="Film / TV scoring" />
          </div>
        </div>
      </Section>
    </>
  );
}
