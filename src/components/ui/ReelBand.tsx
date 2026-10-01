"use client";

import { useCallback, useRef, useState } from "react";
import Parallax from "@/components/ui/Parallax";
import Video from "@/components/ui/Video";
import { cn, timecode } from "@/lib/utils";

/** A full-bleed video band with timecode + sound toggle (non-pinned). */
export default function ReelBand({
  base,
  poster,
  file,
  className,
  ratio = "aspect-[4/5] sm:aspect-[21/9]",
}: {
  base: string;
  poster: string;
  file: string;
  className?: string;
  ratio?: string;
}) {
  const video = useRef<HTMLVideoElement | null>(null);
  const tc = useRef<HTMLSpanElement>(null);
  const [sound, setSound] = useState(false);
  const onTime = useCallback((t: number) => {
    if (tc.current) tc.current.textContent = timecode(t);
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.play().catch(() => undefined);
    setSound(!v.muted);
  };

  return (
    <div className={cn("relative bg-ink text-paper", className)}>
      <Parallax className={cn("w-full", ratio)} amount={8}>
        <Video ref={video} base={base} poster={poster} onTime={onTime} />
      </Parallax>
      <div className="pad-x pointer-events-none absolute inset-0 flex flex-col justify-between py-4">
        <div className="flex items-center justify-between">
          <span className="t-label flex items-center gap-2">
            <span className="rec-dot" /> {file}
          </span>
          <span className="font-mono text-[clamp(0.95rem,1.4vw,1.25rem)] leading-none tabular-nums">
            <span ref={tc}>00:00:00:00</span>
          </span>
        </div>
        <div className="flex justify-end">
          <button onClick={toggle} data-cursor={sound ? "MUTE" : "SOUND ON"} className="t-label pointer-events-auto border border-white/40 bg-black/30 px-4 py-3 hover:bg-white hover:text-ink">
            {sound ? "Sound on ●" : "Sound off ○"}
          </button>
        </div>
      </div>
    </div>
  );
}
