"use client";

import { useMemo, useState } from "react";
import { usePlayer } from "@/components/player/Player";
import { Pause, Play } from "@/components/ui/Icons";
import VuMeter from "@/components/ui/VuMeter";
import { member } from "@/lib/content/team";
import { coverUrl, fmtDuration, releaseYear, spotifyTrackUrl, type Track, type TrackOwner } from "@/lib/content/tracks";
import { cn } from "@/lib/utils";

const OWNER_LABEL: Record<TrackOwner, string> = {
  "mike-snell": "Mike Snell",
  "rob-rivers": "Rob Rivers",
  "mikey-dam": "Mikey Dam",
  "jarryd-james": "Jarryd James",
  mezmure: "MEZMURE",
  "ashley-gall": "Ashley Gall",
  "kily-safari": "Kily Safari",
  chantel: "Chantel",
};

type Props = { tracks: Track[]; filters?: boolean; className?: string; showOwner?: boolean };

/** A playable tracklist — rows load into the Spotify dock. */
export default function Tracklist({ tracks, filters = false, className, showOwner = true }: Props) {
  const player = usePlayer();
  const owners = useMemo(() => Array.from(new Set(tracks.flatMap((t) => t.by))), [tracks]);
  const [filter, setFilter] = useState<TrackOwner | "all">("all");
  const list = filter === "all" ? tracks : tracks.filter((t) => t.by.includes(filter));

  return (
    <div className={className}>
      {filters && (
        <div className="mb-6 flex flex-wrap gap-2" role="toolbar" aria-label="Filter the catalogue">
          {(["all", ...owners] as const).map((o) => (
            <button
              key={o}
              onClick={() => setFilter(o)}
              aria-pressed={filter === o}
              className={cn(
                "t-label border px-3 py-2 transition-colors duration-300",
                filter === o ? "border-fg bg-fg text-bg" : "border-line hover:border-fg",
              )}
            >
              {o === "all" ? `All · ${tracks.length}` : OWNER_LABEL[o]}
            </button>
          ))}
        </div>
      )}

      <ol className="border-t border-line">
        {list.map((t, i) => {
          const current = player.track?.id === t.id;
          const playing = current && !player.paused;
          return (
            <li key={t.id} className={cn("group border-b border-line transition-colors duration-300", current ? "bg-fg text-bg" : "hover:bg-panel")}>
              <div className="grid grid-cols-[2.2rem_3rem_1fr_auto] items-center gap-x-3 py-2.5 pr-3 sm:grid-cols-[2.6rem_3.4rem_minmax(0,1.3fr)_minmax(0,1fr)_7rem_6.5rem_2rem] sm:gap-x-5">
                <span className="t-label pl-2 text-muted tabular-nums">
                  {playing ? <VuMeter mode="play" className="text-rec" /> : String(i + 1).padStart(2, "0")}
                </span>
                <button
                  onClick={() => (current ? player.toggle() : player.play(t))}
                  className="relative block aspect-square w-full overflow-hidden bg-panel"
                  aria-label={`${playing ? "Pause" : "Play"} ${t.title}`}
                  data-cursor={playing ? "PAUSE" : "PLAY ▶"}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverUrl(t.cover, 300)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  <span className={cn("absolute inset-0 grid place-items-center bg-black/45 text-white transition-opacity", playing ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                    {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  </span>
                </button>
                <button onClick={() => (current ? player.toggle() : player.play(t))} className="min-w-0 text-left">
                  <span className="t-wide-s block truncate">{t.title}</span>
                  <span className={cn("t-label mt-0.5 block truncate sm:hidden", current ? "text-bg/60" : "text-muted")}>{t.artists}</span>
                </button>
                <span className={cn("t-body hidden truncate sm:block", current ? "text-bg/70" : "text-muted")}>{t.artists}</span>
                <span className={cn("t-label hidden sm:block", current ? "text-bg/60" : "text-muted")}>
                  {showOwner ? OWNER_LABEL[t.by[0]] ?? member(t.by[0])?.name : releaseYear(t)}
                </span>
                <span className={cn("t-label hidden tabular-nums sm:block", current ? "text-bg/60" : "text-muted")}>
                  {showOwner ? `${releaseYear(t)} · ${fmtDuration(t.dur)}` : fmtDuration(t.dur)}
                </span>
                <a
                  href={spotifyTrackUrl(t.id)}
                  target="_blank"
                  rel="noreferrer"
                  className={cn("t-label justify-self-end", current ? "text-bg" : "text-muted hover:text-fg")}
                  aria-label={`Open ${t.title} in Spotify`}
                >
                  ↗
                </a>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
