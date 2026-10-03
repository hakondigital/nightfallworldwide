import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArtistCard from "@/components/music/ArtistCard";
import ReleaseCard from "@/components/music/ReleaseCard";
import Tracklist from "@/components/music/Tracklist";
import { TLink } from "@/components/providers/Transition";
import { SpotifyGlyph } from "@/components/ui/Icons";
import Media from "@/components/ui/Media";
import PageHero, { Rule, Spec } from "@/components/ui/PageHero";
import Rail from "@/components/ui/Rail";
import Section from "@/components/ui/Section";
import { artist, artistPages, collective } from "@/lib/content/artists";
import { mailto, site } from "@/lib/content/site";
import { track, tracksBy } from "@/lib/content/tracks";
import { mediaInfo, mediaSrc } from "@/lib/media";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return artistPages.map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/music/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const a = artist(slug);
  if (!a) return {};
  return {
    title: a.name,
    description: a.lede ?? `${a.name} — part of the Nightfall Worldwide collective.`,
    alternates: { canonical: `/music/${a.slug}` },
    openGraph: { images: [{ url: mediaSrc(a.image, 1280) }] },
  };
}

const space = "pt-[clamp(48px,6vw,80px)]";

export default async function ArtistPage(props: PageProps<"/music/[slug]">) {
  const { slug } = await props.params;
  const a = artist(slug);
  if (!a || !a.page) notFound();

  const catalogue = a.owner ? tracksBy(a.owner) : [];
  const more = collective.filter((x) => x.slug !== a.slug && x.page).slice(0, 6);
  const photos = [a.image, ...(a.gallery ?? [])].slice(0, 3);
  // On laptops the strip is one row: show only as many photos as fit side by side.
  let width = 0;
  const fits = photos.map((p) => {
    const { w, h } = mediaInfo(p);
    width += w / h;
    return width <= 2.4;
  });

  return (
    <>
      <PageHero
        code="01.4"
        kicker={`Artists — ${a.tags?.join(" / ") ?? "Nightfall collective"}`}
        meta={a.origin}
        title={a.name}
        lede={a.lede}
        aside={
          <Spec
            rows={[
              ...(a.origin ? [{ k: "From", v: a.origin }] : []),
              ...(a.tags ? [{ k: "Roles", v: a.tags.join(" · ") }] : []),
              ...(a.spotify
                ? [
                    {
                      k: "Listen",
                      v: (
                        <a href={a.spotify} target="_blank" rel="noreferrer" className="u-draw inline-flex items-center gap-2">
                          <SpotifyGlyph /> Spotify ↗
                        </a>
                      ),
                    },
                  ]
                : []),
              {
                k: "Bookings",
                v: (
                  <a className="u-draw" href={mailto(site.email.studio, `Booking enquiry — ${a.name}`)}>
                    {site.email.studio}
                  </a>
                ),
              },
            ]}
          />
        }
      />

      {/* photos — one row at a fixed height, each at its own aspect ratio */}
      <Section theme="day" className="pad-x">
        <div className="-mx-(--pad) flex h-[clamp(260px,40vw,520px)] gap-(--gap) overflow-x-auto overscroll-x-contain px-(--pad) [scrollbar-width:none] lg:mx-0 lg:px-0">
          {photos.map((p, i) => (
            <Media
              key={p}
              name={p}
              alt={i === 0 ? `${a.name} — portrait` : a.name}
              sizes="(min-width: 768px) 32vw, 60vw"
              ratio
              className={cn("h-full shrink-0", !fits[i] && i > 0 && "lg:hidden")}
              priority={i === 0}
            />
          ))}
        </div>
      </Section>

      {/* bio */}
      {a.bio && (
        <Section theme="day" className={`pad-x ${space}`}>
          <Rule left="Biography" right={a.name} />
          <div className="mt-6 flex max-w-[68ch] flex-col gap-4 md:ml-[calc(100%/3)]">
            {a.bio.map((p, i) => (
              <p key={i} className={i === 0 ? "t-lede" : "t-body text-muted"}>
                {p}
              </p>
            ))}
          </div>
        </Section>
      )}

      {/* releases */}
      {a.releases?.map((r) => {
        const sp = r.spotifyTrack ? track(r.spotifyTrack) : null;
        return (
          <Section key={r.title} theme="day" className={`pad-x ${space}`}>
            <Rule left="Release" right={r.note} />
            <div className="grid-12 mt-6 items-start gap-y-6">
              <div className="col-span-8 sm:col-span-5 md:col-span-4">
                {sp ? (
                  <ReleaseCard track={sp} size="lg" />
                ) : (
                  <Media name={r.cover} alt={`${r.title} — artwork`} ratio sizes="(min-width: 768px) 32vw, 66vw" className="w-full" />
                )}
              </div>
              <div className="col-span-12 flex flex-col gap-4 md:col-span-7 md:col-start-6">
                <h2 className="t-l">{r.title}</h2>
                {r.body?.map((p, i) => (
                  <p key={i} className={i === 0 ? "t-lede max-w-[52ch]" : "t-body max-w-[68ch] text-muted"}>
                    {p}
                  </p>
                ))}
                {a.spotify && (
                  <a
                    href={sp ? `https://open.spotify.com/track/${sp.id}` : a.spotify}
                    target="_blank"
                    rel="noreferrer"
                    className="t-wide-s mt-2 inline-flex items-center gap-3 self-start border border-line px-5 py-3.5 transition-colors hover:border-fg"
                  >
                    <SpotifyGlyph /> Listen on Spotify ↗
                  </a>
                )}
              </div>
            </div>
          </Section>
        );
      })}

      {/* catalogue */}
      {catalogue.length > 0 && (
        <Section theme="day" className={`pad-x ${space}`}>
          <Rule left="Tracks" right={`${catalogue.length} records · previews via Spotify`} />
          <Tracklist tracks={catalogue} showOwner={false} className="mt-6" />
        </Section>
      )}

      {/* more */}
      <Section theme="day" className={`pad-x ${space} pb-[clamp(60px,8vw,110px)]`}>
        <Rule left="More from the collective" right={<TLink href="/music#artists" className="u-draw">All artists →</TLink>} />
        <Rail cols={5} className="mt-6">
          {more.map((m) => (
            <ArtistCard key={m.slug} artist={m} />
          ))}
        </Rail>
      </Section>
    </>
  );
}
