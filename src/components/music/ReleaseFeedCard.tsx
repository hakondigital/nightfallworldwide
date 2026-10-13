import { SpotifyGlyph } from "@/components/ui/Icons";
import { releaseDateLabel, spotifyFor, type Release } from "@/lib/content/releases";

/** A release from the label's catalogue feed — cover, who, when, and Spotify to listen. */
export default function ReleaseFeedCard({ r, upcoming = false }: { r: Release; upcoming?: boolean }) {
  const spotify = spotifyFor(r);
  const link = "t-label u-draw inline-flex items-center gap-1.5";
  return (
    <article className="flex flex-col gap-3">
      <a href={spotify} target="_blank" rel="noreferrer" className="relative block aspect-square w-full overflow-hidden bg-panel" aria-label={`${r.title} by ${r.artists.join(", ")} on Spotify`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={r.cover} alt={`${r.title} — cover art`} width={500} height={500} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        {upcoming && <span className="t-label absolute left-2.5 top-2.5 bg-rec px-2 py-1 text-white">Out {releaseDateLabel(r, false)}</span>}
      </a>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="t-card truncate">{r.title}</h3>
          <p className="t-label mt-1 truncate text-muted">{r.artists.join(", ")}</p>
        </div>
        {!upcoming && <span className="t-label shrink-0 text-muted">{releaseDateLabel(r)}</span>}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <a href={spotify} target="_blank" rel="noreferrer" className={link}>
          <SpotifyGlyph className="h-3 w-3" /> Spotify ↗
        </a>
        {r.apple && (
          <a href={r.apple} target="_blank" rel="noreferrer" className={link}>
            Apple Music ↗
          </a>
        )}
      </div>
    </article>
  );
}
