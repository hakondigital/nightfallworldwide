"use client";

import { useCallback, useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export type Theme = "day" | "night";

export const setTheme = (t: Theme) => {
  const root = document.documentElement;
  if (root.dataset.theme !== t) root.dataset.theme = t;
};

type Props = React.HTMLAttributes<HTMLElement> & {
  theme?: Theme;
  as?: "section" | "div" | "footer" | "header" | "article";
  /** viewport line where the theme flips (percentage from top) */
  line?: number;
  ref?: React.Ref<HTMLElement>;
};

/**
 * A page section that owns the document theme while it crosses the
 * "horizon" line of the viewport. Night sections turn the whole page dark —
 * nightfall happens as you scroll, then day comes back.
 */
export default function Section({ theme = "day", as: Tag = "section", line = 55, className, children, ref: outer, ...rest }: Props) {
  const inner = useRef<HTMLElement | null>(null);

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      inner.current = node;
      if (typeof outer === "function") outer(node);
      else if (outer) (outer as React.RefObject<HTMLElement | null>).current = node;
    },
    [outer],
  );

  useGSAP(
    () => {
      const el = inner.current;
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: `top ${line}%`,
        end: `bottom ${line}%`,
        onToggle: (self) => self.isActive && setTheme(theme),
      });
    },
    { scope: inner, dependencies: [theme, line] },
  );

  return (
    <Tag ref={setRef as React.Ref<never>} data-section-theme={theme} className={cn("relative", className)} {...rest}>
      {children}
    </Tag>
  );
}
