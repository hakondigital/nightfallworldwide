"use client";

import { useEffect, useRef } from "react";
import { scrollState } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/utils";

type Props = {
  bars?: number;
  className?: string;
  /** "scroll": levels follow scroll velocity; "play": animated signal; "idle": flat */
  mode?: "scroll" | "play" | "idle";
};

/** A tiny level meter — it dances when you scroll or when music plays. */
export default function VuMeter({ bars = 5, className, mode = "scroll" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nodes = Array.from(el.children) as HTMLElement[];
    const levels = nodes.map(() => 0.15);
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const v = Math.min(1, Math.abs(scrollState.velocity) / 40);
      nodes.forEach((n, i) => {
        let target = 0.12;
        if (mode === "scroll") target = 0.12 + v * (0.55 + 0.45 * Math.abs(Math.sin(now / 90 + i * 1.7)));
        if (mode === "play") target = 0.25 + 0.75 * Math.abs(Math.sin(now / (140 + i * 37) + i * 2.1)) * (0.6 + 0.4 * Math.sin(now / 420));
        levels[i] += (target - levels[i]) * (target > levels[i] ? 0.5 : 0.12);
        n.style.transform = `scaleY(${reduced ? 0.3 : levels[i]})`;
      });
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  return (
    <span ref={ref} aria-hidden className={cn("inline-flex h-3 items-end gap-[2px]", className)}>
      {Array.from({ length: bars }, (_, i) => (
        <span key={i} className="block h-full w-[2px] origin-bottom bg-current" style={{ transform: "scaleY(0.15)" }} />
      ))}
    </span>
  );
}
