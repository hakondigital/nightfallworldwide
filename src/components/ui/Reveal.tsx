"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "div" | "span";

/**
 * Masked line reveal — lines rise out of their own baseline.
 * Re-splits on resize (SplitText autoSplit) so wrapping stays correct.
 */
export function Lines({
  children,
  as: T = "div",
  className,
  delay = 0,
  stagger = 0.08,
  start = "top 88%",
  immediate = false,
}: {
  children: React.ReactNode;
  as?: Tag;
  className?: string;
  delay?: number;
  stagger?: number;
  start?: string;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.style.visibility = "visible";
        return;
      }
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit(self) {
          el.style.visibility = "visible";
          return gsap.from(self.lines, {
            yPercent: 112,
            duration: 1.25,
            ease: "expo.out",
            stagger,
            delay,
            scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
          });
        },
      });
    },
    { scope: ref },
  );
  return (
    <T ref={ref as React.Ref<never>} className={cn(className)} style={{ visibility: "hidden" }}>
      {children}
    </T>
  );
}

/** Block fade/rise on enter. */
export function Rise({
  children,
  className,
  delay = 0,
  y = 40,
  as: T = "div",
  start = "top 90%",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: Tag;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(el, {
        y,
        autoAlpha: 0,
        duration: 1.2,
        delay,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref },
  );
  return (
    <T ref={ref as React.Ref<never>} className={className}>
      {children}
    </T>
  );
}

/** Children stagger in (each direct child). */
export function Stagger({
  children,
  className,
  y = 28,
  each = 0.06,
  start = "top 88%",
  as: T = "div",
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  each?: number;
  start?: string;
  as?: "div" | "ul" | "ol";
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(el.children, {
        y,
        autoAlpha: 0,
        duration: 1,
        ease: "expo.out",
        stagger: each,
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref },
  );
  return (
    <T ref={ref as React.Ref<never>} className={className}>
      {children}
    </T>
  );
}
