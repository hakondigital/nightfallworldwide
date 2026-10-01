"use client";

import { useRef } from "react";
import { READY_EVENT, TLink } from "@/components/providers/Transition";
import FitText from "@/components/ui/FitText";
import Globe, { type GlobeHandle } from "@/components/ui/Globe";
import { Arrow } from "@/components/ui/Icons";
import Section from "@/components/ui/Section";
import { gsap, useGSAP } from "@/lib/gsap";
import { businesses, site } from "@/lib/content/site";

/**
 * The front door, as on the original site: the logo (alive), one line
 * about Nightfall, and the three businesses. Everything else lives inside.
 */
export default function Landing() {
  const root = useRef<HTMLElement>(null);
  const globe = useRef<GlobeHandle>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(el);
      gsap.set(q("[data-band]"), { scaleX: 0 });
      gsap.set(q("[data-char]"), { yPercent: 105 });
      gsap.set(q("[data-rise]"), { autoAlpha: 0, y: 24 });
      const intro = () => {
        globe.current?.replay();
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .to(q("[data-band]"), { scaleX: 1, duration: 1, ease: "expo.inOut" })
          .to(q("[data-char]"), { yPercent: 0, duration: 1.1, stagger: { each: 0.03, from: "center" } }, "-=0.45")
          .to(q("[data-rise]"), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07 }, "-=0.8");
      };
      const curtain = document.querySelector(".curtain");
      const lifted = curtain?.getAttribute("data-mode") === "nav" && getComputedStyle(curtain).visibility === "hidden";
      if (lifted) intro();
      else window.addEventListener(READY_EVENT, intro, { once: true });
      return () => window.removeEventListener(READY_EVENT, intro);
    },
    { scope: root },
  );

  const word = (w: string) =>
    w.split("").map((c, i) => (
      <span key={i} className="inline-block overflow-hidden align-top">
        <span data-char className="inline-block">
          {c}
        </span>
      </span>
    ));

  return (
    <Section ref={root} theme="day" className="flex min-h-svh flex-col pt-(--header-h)" aria-label="Nightfall Worldwide">
      {/* the logo, alive */}
      <div className="relative min-h-[46svh] flex-1">
        <div className="absolute inset-0">
          <Globe ref={globe} cities arcs interactive radius={0.43} />
        </div>
        <h1 className="pad-x absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
          <span className="sr-only">Nightfall Worldwide</span>
          {/* phones: stacked */}
          <span aria-hidden className="relative flex w-full flex-col items-center sm:hidden">
            <span data-band className="absolute -inset-x-1 -inset-y-2.5 origin-center bg-bg" />
            <span className="relative block w-full">
              <FitText className="font-display font-bold leading-[0.86] tracking-[-0.025em]">{word("NIGHTFALL")}</FitText>
            </span>
            <span className="relative block w-full">
              <FitText className="font-display font-bold leading-[0.86] tracking-[-0.025em]">{word("WORLDWIDE")}</FitText>
            </span>
          </span>
          {/* tablet + desktop: one line, like the logo */}
          <span aria-hidden className="relative hidden w-[min(88vw,1180px)] sm:block">
            <FitText className="font-display font-bold leading-[0.84] tracking-[-0.025em]">
              <span className="relative flex items-center">
                <span data-band className="absolute inset-x-[-0.22em] inset-y-[-0.3em] origin-center bg-bg" />
                <span className="relative">{word("NIGHTFALL-WORLDWIDE")}</span>
              </span>
            </FitText>
          </span>
        </h1>
      </div>

      <p data-rise className="pad-x mx-auto max-w-[64ch] py-[clamp(16px,2.4vw,28px)] text-center t-body text-muted">
        {site.description}
      </p>

      {/* the three businesses */}
      <nav aria-label="Nightfall businesses" className="grid border-t border-line md:grid-cols-3">
        {businesses.map((b) => (
          <TLink
            key={b.key}
            href={b.href}
            data-rise
            className="group relative flex flex-col gap-3 overflow-hidden border-b border-line px-(--pad) py-[clamp(20px,2.6vw,36px)] md:border-b-0 md:border-r md:last:border-r-0"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-fg transition-transform duration-500 ease-out group-hover:scale-y-100" />
            <span className="relative flex items-start justify-between">
              <span className="t-label text-muted transition-colors group-hover:text-bg/60">{b.code}</span>
              <Arrow className="h-5 w-5 transition-[transform,color] duration-500 group-hover:rotate-45 group-hover:text-bg" />
            </span>
            <span className="relative font-display text-[clamp(1.9rem,3.3vw,3.4rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em] transition-colors group-hover:text-bg">
              {b.label}
            </span>
            <span className="relative t-label text-muted transition-colors group-hover:text-bg/70">{b.lines.join(" · ")}</span>
          </TLink>
        ))}
      </nav>
    </Section>
  );
}
