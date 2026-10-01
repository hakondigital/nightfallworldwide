import { TLink } from "@/components/providers/Transition";
import Media from "@/components/ui/Media";
import type { Artist } from "@/lib/content/artists";
import { cn } from "@/lib/utils";

/** Photo, name, one line of context. Profile page if they have one, else Spotify. */
export default function ArtistCard({ artist, note, className }: { artist: Artist; note?: string; className?: string }) {
  const href = artist.page ? `/music/${artist.slug}` : (artist.spotify ?? "/music");
  const meta = note ?? artist.origin ?? artist.tags?.join(" · ") ?? "Nightfall collective";
  return (
    <TLink href={href} className={cn("group flex flex-col gap-2", className)}>
      <Media name={artist.image} alt={artist.name} sizes="(min-width: 1024px) 13vw, 40vw" className="aspect-[4/5] w-full bg-panel" />
      <div className="min-w-0">
        <h3 className="t-card truncate group-hover:underline group-hover:underline-offset-4">
          {artist.name}
          {!artist.page && <span className="ml-1 font-normal text-muted">↗</span>}
        </h3>
        <p className="t-label mt-1 truncate text-muted">{meta}</p>
      </div>
    </TLink>
  );
}
