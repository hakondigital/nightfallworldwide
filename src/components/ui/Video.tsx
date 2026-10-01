"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** base path without suffix, e.g. /media/video/reel-music */
  base?: string;
  /** explicit single source (used for short previews) */
  src?: string;
  poster?: string;
  className?: string;
  eager?: boolean;
  loop?: boolean;
  onTime?: (t: number, d: number) => void;
};

/**
 * Background-style video: lazy attaches its source near the viewport,
 * pauses off-screen, chooses 1080p only for large, fast screens.
 */
const Video = forwardRef<HTMLVideoElement | null, Props>(function Video(
  { base, src, poster, className, eager = false, loop = true, onTime },
  ref,
) {
  const el = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => el.current as HTMLVideoElement);

  useEffect(() => {
    const v = el.current;
    if (!v) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const fast = !conn?.saveData && (!conn?.effectiveType || conn.effectiveType === "4g");
    const big = window.innerWidth * Math.min(2, window.devicePixelRatio || 1) >= 1800;
    const source = src ?? `${base}-${big && fast ? "1080" : "720"}.mp4`;

    let attached = false;
    const attach = () => {
      if (attached) return;
      attached = true;
      v.src = source;
      v.load();
    };
    if (eager) attach();

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          attach();
          v.play().catch(() => undefined);
        } else if (!v.paused) v.pause();
      },
      { rootMargin: "35% 0px" },
    );
    io.observe(v);

    const time = () => onTime?.(v.currentTime, v.duration || 0);
    v.addEventListener("timeupdate", time);
    return () => {
      io.disconnect();
      v.removeEventListener("timeupdate", time);
    };
  }, [base, src, eager, onTime]);

  return (
    <video
      ref={el}
      className={cn("h-full w-full object-cover", className)}
      poster={poster}
      muted
      loop={loop}
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden
    />
  );
});

export default Video;
