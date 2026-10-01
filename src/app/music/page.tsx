import type { Metadata } from "next";
import ArtistCard from "@/components/music/ArtistCard";
import ReleaseCard from "@/components/music/ReleaseCard";
import ServiceCards from "@/components/music/ServiceCards";
import Showreel from "@/components/music/Showreel";
import Tracklist from "@/components/music/Tracklist";
import { TLink } from "@/components/providers/Transition";
import Accordion from "@/components/ui/Accordion";
import BookButton from "@/components/ui/BookButton";
import Media from "@/components/ui/Media";
import PageHero, { Rule, StreamsStat } from "@/components/ui/PageHero";
import Rail from "@/components/ui/Rail";
import Section from "@/components/ui/Section";
import { collective, globalArtists } from "@/lib/content/artists";
import { team } from "@/lib/content/team";
import { track, tracks } from "@/lib/content/tracks";

export const metadata: Metadata = {
  title: "Music — mixing, studio, distribution & artists",
  description:
    "Book mixing & mastering (including 3× Grammy-nominated Mike Snell), studio sessions in Burleigh Heads, and distribution with Nightfall — home of MEZMURE, Kily Safari, Chantel, Jarryd James, Mikey Dam and Ashley Gall.",
  alternates: { canonical: "/music" },
};

const LATEST = [
  "5xLGhZO2Dw7NHigfRm0hZa", // WOZA
  "27pJRayIsaKpjOkenEzYt9", // Hold Me While I Disco
  "6EgdS5hDoklBcbJZl2TRIp", // Paperweight
  "2NqNCkdTRr20q2jiU53Oos", // Cant Wait
  "6gCABr21D9dn0EGgqCLISM", // GANJA
  "756EcgXa5cY8aaSkWNfkW8", // Shrooms
].map(track);

export default function MusicPage() {
  return (
    <>
      <PageHero
        code="01"
        kicker="Music"
        meta="Burleigh Heads · Gold Coast"
        title="Music"
        lede="Nightfall has worked with global stars such as Lil Pump, NLE Choppa and ZieZie, and collaborates closely with local artists like Jarryd James, Chantel and Kily Safari — with 3× Grammy-nominated engineer and producer Mike Snell on the team."
        aside={
          <div className="flex flex-col gap-5">
            <StreamsStat className="border-t border-line pt-4" />
            <BookButton dot>Book a session</BookButton>
          </div>
        }
      />

      <Section theme="day" id="book" className="pad-x scroll-mt-32 pb-[clamp(60px,8vw,110px)]">
        <ServiceCards />
      </Section>

      <Showreel
        base="/media/video/reel-music"
        poster="/media/video/reel-music-poster.webp"
        title={["In", "session"]}
        file="MUSIC.MP4"
        caption="Sessions at Nightfall and records from across the team — from Lil Pump in the pink room to credits with Kanye West and Teyana Taylor."
      />

      {/* artists */}
      <Section theme="day" id="artists" className="pad-x scroll-mt-32 pt-[clamp(60px,8vw,110px)]">
        <Rule left="Artists" right={`${collective.length} in the collective · ${globalArtists.length} global collaborators`} />
        <Rail cols={8} className="mt-6 gap-y-8">
          {globalArtists.map((a) => (
            <ArtistCard key={a.slug} artist={a} note={`Worked with · ${a.origin}`} />
          ))}
          {collective.map((a) => (
            <ArtistCard key={a.slug} artist={a} />
          ))}
        </Rail>
      </Section>

      {/* releases */}
      <Section theme="day" id="catalogue" className="pad-x scroll-mt-32 pt-[clamp(60px,8vw,110px)]">
        <Rule left="Latest releases" right="Tap a cover for a 30-second preview" />
        <Rail cols={6} className="mt-6">
          {LATEST.map((t) => (
            <ReleaseCard key={t.id} track={t} />
          ))}
        </Rail>
        <div className="mt-10 border-t border-line">
          <Accordion title="Full catalogue" meta={`${tracks.length} tracks from across the team`}>
            <Tracklist tracks={tracks} filters />
          </Accordion>
        </div>
      </Section>

      {/* team */}
      <Section theme="day" className="pad-x py-[clamp(60px,8vw,110px)]">
        <Rule left="The team" right={<TLink href="/team" className="u-draw">Meet the team →</TLink>} />
        <Rail cols={5} className="mt-6">
          {team.map((m) => (
            <TLink key={m.slug} href={`/team#${m.slug}`} className="group flex flex-col gap-2">
              <Media name={m.portrait} alt={`${m.name} — ${m.role}`} sizes="(min-width: 1024px) 18vw, 40vw" className="aspect-[4/5] w-full bg-panel" />
              <span className="t-card group-hover:underline group-hover:underline-offset-4">{m.name}</span>
              <span className="t-label -mt-1 text-muted">{m.role}</span>
            </TLink>
          ))}
        </Rail>
        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 md:flex-row md:items-center">
          <p className="t-l max-w-[18ch]">Ready when you are</p>
          <div className="flex flex-wrap gap-3">
            <BookButton dot>Book a session</BookButton>
            <BookButton tab="mix" variant="line">
              Book a mix
            </BookButton>
          </div>
        </div>
      </Section>
    </>
  );
}
