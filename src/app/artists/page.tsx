import type { Metadata } from "next";
import { TLink } from "@/components/providers/Transition";
import BookButton from "@/components/ui/BookButton";
import { Arrow, SpotifyGlyph } from "@/components/ui/Icons";
import Media from "@/components/ui/Media";
import PageHero, { Rule, Spec } from "@/components/ui/PageHero";
import { Stagger } from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { collective, globalArtists, type Artist } from "@/lib/content/artists";
import { site } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Artists — the Nightfall collective",
  description:
    "Every artist in the Nightfall Worldwide collective — MEZMURE, Kily Safari, Chantel, Jarryd James, Ashley Gall and more — plus the global artists Nightfall has worked with. Profiles and Spotify links.",
  alternates: { canonical: "/artists" },
};

const GRID = "mt-6 grid grid-cols-2 gap-x-(--gap) gap-y-10 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7";

/** One artist: photo, name, then straight to their profile or Spotify. */
function Card({ a, note }: { a: Artist; note?: string }) {
  const meta = note ?? a.origin ?? a.tags?.join(" · ") ?? "Nightfall collective";
  const primary = a.page ? `/music/${a.slug}` : a.spotify;
  const photo = <Media name={a.image} alt={a.name} sizes="(min-width: 1280px) 13vw, (min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw" className="aspect-[4/5] w-full bg-panel" />;
  return (
    <article className="flex flex-col gap-3">
      {primary ? (
        <TLink href={primary} className="block" aria-label={a.page ? `${a.name} — profile` : `${a.name} on Spotify`}>
          {photo}
        </TLink>
      ) : (
        photo
      )}
      <div className="min-w-0">
        <h3 className="t-card truncate">{a.name}</h3>
        <p className="t-label mt-1 truncate text-muted">{meta}</p>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-2.5">
        {a.page && (
          <TLink href={`/music/${a.slug}`} className="t-label u-draw">
            Profile →
          </TLink>
        )}
        {a.spotify && (
          <a href={a.spotify} target="_blank" rel="noreferrer" className="t-label u-draw inline-flex items-center gap-1.5">
            <SpotifyGlyph className="h-3 w-3" /> Spotify ↗
          </a>
        )}
      </div>
    </article>
  );
}

export default function ArtistsPage() {
  return (
    <>
      <PageHero
        code="01.4"
        kicker="Artists"
        meta={`${collective.length + globalArtists.length} artists`}
        title="Artists"
        lede="The Nightfall collective, and the global artists the team has worked with. Open an artist for their story and releases, or go straight to Spotify."
        aside={
          <Spec
            rows={[
              { k: "Collective", v: `${collective.length} artists` },
              { k: "Worked with", v: globalArtists.map((a) => a.name).join(", ") },
              { k: "Bookings", v: <a className="u-draw" href={`mailto:${site.email.studio}`}>{site.email.studio}</a> },
            ]}
          />
        }
      />

      <Section theme="day" id="collective" className="pad-x scroll-mt-32">
        <Rule left="The collective" right={`${collective.length} artists`} />
        <Stagger className={GRID}>
          {collective.map((a) => (
            <Card key={a.slug} a={a} />
          ))}
        </Stagger>
      </Section>

      <Section theme="day" id="worked-with" className="pad-x scroll-mt-32 pt-[clamp(60px,8vw,110px)]">
        <Rule left="Nightfall has worked with" right="Global artists" />
        <Stagger className={GRID}>
          {globalArtists.map((a) => (
            <Card key={a.slug} a={a} note={a.origin} />
          ))}
        </Stagger>
      </Section>

      <Section theme="day" className="pad-x py-[clamp(60px,8vw,110px)]">
        <div className="flex flex-col items-start justify-between gap-6 border-t border-line pt-6 md:flex-row md:items-end">
          <div className="flex max-w-[52ch] flex-col gap-3">
            <h2 className="t-l">Want in?</h2>
            <p className="t-body text-muted">Join Nightfall Distribution — no upfront fees, you keep 80%, no lock-in — or book a session with the team.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <TLink href="/distribution/upload" className="group t-wide-s flex items-center gap-3 bg-fg px-5 py-4 text-bg transition-colors hover:bg-rec">
              Join the label <Arrow className="transition-transform duration-500 group-hover:rotate-45" />
            </TLink>
            <BookButton variant="line">Book a session</BookButton>
          </div>
        </div>
      </Section>
    </>
  );
}
