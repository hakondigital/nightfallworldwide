"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Clips its child and drifts it against the scroll. */
export default function Parallax({ children, className, amount = 10 }: { children: React.ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        el.firstElementChild,
        { yPercent: -amount },
        { yPercent: amount, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-x-0" style={{ top: `-${amount}%`, bottom: `-${amount}%` }}>
        {children}
      </div>
    </div>
  );
}
