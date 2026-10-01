"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** max font size in px */
  max?: number;
  /** fraction of the parent width to fill */
  fill?: number;
  as?: "span" | "div" | "h1" | "h2" | "p";
};

/** Sizes a single line of type to exactly fill its parent's width. */
export default function FitText({ children, className, max = 2000, fill = 1, as: Tag = "span" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const fit = () => {
      el.style.fontSize = "100px";
      const natural = el.scrollWidth;
      const target = parent.clientWidth * fill;
      if (natural > 0) el.style.fontSize = `${Math.min(max, (100 * target) / natural)}px`;
      el.style.visibility = "visible";
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [max, fill]);

  return (
    <Tag ref={ref as React.Ref<never>} className={cn("inline-block whitespace-nowrap", className)} style={{ visibility: "hidden" }}>
      {children}
    </Tag>
  );
}
