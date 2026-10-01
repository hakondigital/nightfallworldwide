import type { Metadata } from "next";
import Tracklist from "@/components/music/Tracklist";
import Accordion from "@/components/ui/Accordion";
import EnquireButton from "@/components/ui/EnquireButton";
import Media from "@/components/ui/Media";
import PageHero, { Spec, StreamsStat } from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { team } from "@/lib/content/team";
import { tracksBy } from "@/lib/content/tracks";

export const metadata: Metadata = {
  title: "The Team — Rob Rivers, Mike Snell, Mikey Dam, Jarryd James, MEZMURE",
  description:
    "Meet the Nightfall team: founder Rob Rivers, 3× Grammy-nominated engineer Mike Snell, and songwriter-producers Mikey Dam, Jarryd James and MEZMURE.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        code="01.5"
        kicker="Team"
        meta="Nightfall Studio presents"
        title="The Team"
        lede="An artist collective born out of a small apartment studio in 2018 — now a standalone recording studio and creative hub in Burleigh Heads, and a place for artists to create with zero limitations."
        aside={<StreamsStat className="border-t border-line pt-4" />}
      >
        <nav aria-label="Team members" className="mt-[clamp(28px,4vw,48px)] flex flex-wrap gap-2">
          {team.map((m) => (
            <a key={m.slug} href={`#${m.slug}`} className="t-label border border-line px-3 py-2 transition-colors hover:border-fg">
              {m.name}
            </a>
          ))}
        </nav>
      </PageHero>

      <Section theme="day" className="pad-x flex flex-col gap-[clamp(48px,6vw,80px)]">
        {team.map((m, i) => {
          const catalogue = tracksBy(m.slug);
          const more = m.bio.slice(1);
          return (
            <article key={m.slug} id={m.slug} className="grid-12 scroll-mt-32 gap-y-5 border-t border-line pt-5 md:grid-rows-[auto_1fr]">
              <Media
                name={m.portrait}
                alt={`${m.name} — ${m.role}`}
                sizes="(min-width: 768px) 24vw, 40vw"
                className="col-span-5 aspect-[4/5] w-full self-start sm:col-span-4 md:col-span-3 md:row-span-2"
                position="50% 25%"
              />
              <header className="col-span-7 flex flex-col gap-3 sm:col-span-8 md:col-start-5">
                <span className="t-label text-muted">
                  {String(i + 1).padStart(2, "0")} — {m.role}
                </span>
                <h2 className="t-l">{m.name}</h2>
                <p className="t-lede max-w-[40ch]">{m.headline}</p>
              </header>
              <div className="col-span-12 flex flex-col gap-5 md:col-span-8 md:col-start-5">
                <p className="t-body max-w-[68ch] text-muted">{m.bio[0]}</p>
                {(m.accolades || m.link) && (
                  <Spec
                    className="max-w-[68ch]"
                    rows={[
                      ...(m.accolades ? [{ k: "Accolades", v: m.accolades.join(" · ") }] : []),
                      ...(m.link ? [{ k: "Credits", v: <a className="u-draw" href={m.link.href} target="_blank" rel="noreferrer">{m.link.label} ↗</a> }] : []),
                    ]}
                  />
                )}
                {(more.length > 0 || catalogue.length > 0) && (
                  <div className="border-t border-line">
                    {more.length > 0 && (
                      <Accordion title={`More about ${m.name}`}>
                        <div className="flex max-w-[68ch] flex-col gap-4">
                          {more.map((p, pi) => (
                            <p key={pi} className="t-body text-muted">
                              {p}
                            </p>
                          ))}
                          {m.clients && m.clients.length > 1 && (
                            <p className="t-body">
                              <span className="t-label mr-2 text-muted">Clients</span>
                              {m.clients.join(", ")}
                            </p>
                          )}
                        </div>
                      </Accordion>
                    )}
                    {catalogue.length > 0 && (
                      <Accordion title="Catalogue" meta={`${catalogue.length} tracks — tap to preview`}>
                        <Tracklist tracks={catalogue} showOwner={false} />
                      </Accordion>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </Section>

      <Section theme="day" className="pad-x py-[clamp(60px,8vw,110px)]">
        <div className="flex flex-col items-start justify-between gap-6 border-t border-line pt-6 md:flex-row md:items-end">
          <h2 className="t-l max-w-[16ch]">Work with the team</h2>
          <EnquireButton topic="Artist development">Start a conversation</EnquireButton>
        </div>
      </Section>
    </>
  );
}
