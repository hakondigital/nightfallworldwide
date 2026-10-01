"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content/site";
import { fmtClock, fmtCountdown, sunState, type SunState } from "@/lib/sun";
import { cn } from "@/lib/utils";

const compute = () => sunState(site.geo.lat, site.geo.lon, new Date());

/** Live Burleigh Heads time + countdown to the real nightfall (civil dusk). */
export function useNightfall() {
  const [s, setS] = useState<SunState | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only clock, avoids SSR mismatch
    setS(compute());
    const id = window.setInterval(() => setS(compute()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return s;
}

type Props = { variant?: "line" | "full"; className?: string };

export default function NightfallClock({ variant = "line", className }: Props) {
  const s = useNightfall();
  const local = s ? fmtClock(s.now) : "--:--";
  const count = s ? fmtCountdown(s.next.getTime() - s.now.getTime()) : "--:--:--";
  const at = s ? fmtClock(s.next) : "--:--";
  const night = s?.isNight ?? false;

  if (variant === "line") {
    return (
      <p className={cn("t-label flex flex-wrap items-center gap-x-2 gap-y-1", className)} suppressHydrationWarning>
        <span className="rec-dot" />
        {night ? (
          <span>
            It&apos;s night in Burleigh Heads — {local} AEST
          </span>
        ) : (
          <span className="tabular-nums">
            Next nightfall over Burleigh Heads in {count} · {at} AEST
          </span>
        )}
      </p>
    );
  }

  return (
    <div className={cn("t-label grid gap-1", className)} suppressHydrationWarning>
      <span className="text-muted">Local time — Burleigh Heads</span>
      <span className="tabular-nums">{local} AEST</span>
      <span className="mt-2 text-muted">{night ? "Sunrise" : "Nightfall"}</span>
      <span className="tabular-nums">{night ? (s ? fmtClock(s.sunrise) : "--:--") : `${at} — in ${count}`}</span>
    </div>
  );
}
