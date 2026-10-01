"use client";

import { usePlayer } from "@/components/player/Player";
import { Pause, Play } from "@/components/ui/Icons";
import { coverUrl, releaseYear, type Track } from "@/lib/content/tracks";
import { cn } from "@/lib/utils";

type Props = { track: Track; className?: string; size?: "md" | "lg" };

/** Cover + title. Click to preview in the player dock. */
export default function ReleaseCard({ track, className, size = "md" }: Props) {
  const player = usePlayer();
  const isCurrent = player.track?.id === track.id;
  const playing = isCurrent && !player.paused;

  return (
    <article className={cn("flex flex-col gap-3", className)}>
      <button
        onClick={() => (isCurrent ? player.toggle() : player.play(track))}
        className="relative block aspect-square w-full overflow-hidden text-left"
        style={{ backgroundColor: track.color }}
        aria-label={`${playing ? "Pause" : "Play"} ${track.title} by ${track.artists}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl(track.cover, size === "lg" ? 640 : 300)}
          srcSet={`${coverUrl(track.cover, 300)} 300w, ${coverUrl(track.cover, 640)} 640w`}
          sizes={size === "lg" ? "(min-width: 768px) 25vw, 50vw" : "(min-width: 768px) 16vw, 45vw"}
          alt={`${track.title} — cover art`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className={cn("absolute bottom-2.5 left-2.5 grid h-10 w-10 place-items-center transition-colors", playing ? "bg-rec text-white" : "bg-paper text-ink")}>
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </span>
      </button>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="t-wide-s truncate">{track.title}</h3>
          <p className="t-label mt-1 truncate text-muted">{track.artists}</p>
        </div>
        <span className="t-label shrink-0 text-muted">{releaseYear(track)}</span>
      </div>
    </article>
  );
}
