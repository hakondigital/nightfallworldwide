"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { READY_EVENT } from "@/components/providers/Transition";
import Section, { type Theme } from "@/components/ui/Section";
import { gsap, useGSAP } from "@/lib/gsap";
import { isMusicPath, site } from "@/lib/content/site";
import { cn } from "@/lib/utils";

type Props = {
  code: string;
  kicker: string;
  meta?: React.ReactNode;
  title: string;
  lede?: React.ReactNode;
  /** right-hand column: key fact + the page's main action (same spot on every page) */
  aside?: React.ReactNode;
  theme?: Theme;
  children?: React.ReactNode;
  className?: string;
};

/** Inner-page masthead: data row, title + lede on the left, key action on the right. */
export default function PageHero({ code, kicker, meta, title, lede, aside, theme = "day", children, className }: Props) {
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const music = isMusicPath(pathname);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = gsap.utils.selector(el);
      gsap.set(q("[data-word]"), { yPercent: 105 });
      gsap.set(q("[data-in]"), { autoAlpha: 0, y: 18 });
      const play = () => {
        gsap.to(q("[data-word]"), { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.06, delay: 0.05 });
        gsap.to(q("[data-in]"), { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, delay: 0.25 });
      };
      const curtain = document.querySelector(".curtain");
      const lifted = curtain?.getAttribute("data-mode") === "nav" && getComputedStyle(curtain).visibility === "hidden";
      if (lifted) play();
      else window.addEventListener(READY_EVENT, play, { once: true });
      return () => window.removeEventListener(READY_EVENT, play);
    },
    { scope: root },
  );

  return (
    <Section
      ref={root}
      theme={theme}
      className={cn(
        "pad-x pb-[clamp(40px,5vw,72px)]",
        music ? "pt-[calc(var(--header-h)+var(--subnav-h)+clamp(28px,4vw,56px))]" : "pt-[calc(var(--header-h)+clamp(28px,4vw,56px))]",
        className,
      )}
    >
      <div data-in className="flex items-end justify-between gap-6 border-t border-line pt-4">
        <span className="t-label">
          {code} — {kicker}
        </span>
        {meta && <span className="t-label min-w-0 text-right text-muted [overflow-wrap:anywhere]">{meta}</span>}
      </div>

      <div className="grid-12 mt-[clamp(20px,3vw,40px)] items-end gap-y-10">
        <div className="col-span-12 lg:col-span-7">
          <h1 className="t-xl">
            {title.split(" ").map((w, i) => (
              <span key={i} className="mr-[0.2em] inline-block overflow-hidden pb-[0.04em] align-top last:mr-0">
                <span data-word className="inline-block">
                  {w}
                </span>
              </span>
            ))}
          </h1>
          {lede && (
            <div data-in className="t-lede mt-6 max-w-[46ch] text-muted">
              {lede}
            </div>
          )}
        </div>
        {aside && (
          <div data-in className="col-span-12 lg:col-span-4 lg:col-start-9">
            {aside}
          </div>
        )}
      </div>
      {children}
    </Section>
  );
}

/** Key fact over the page's primary action — e.g. "From $100 / hour" + Book now. */
export function HeroAction({ label, value, note, children }: { label: string; value: React.ReactNode; note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="border-t border-line pt-4">
        <span className="t-label text-muted">{label}</span>
        <p className="t-price mt-2 text-[clamp(1.8rem,2.6vw,2.5rem)]">{value}</p>
        {note && <p className="t-label mt-2 text-muted">{note}</p>}
      </div>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

/** Lifetime streams, presented as on the original site: label, figure, Spotify. */
export function StreamsStat({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="t-label text-muted">Lifetime streams</span>
      <span className="t-price text-[clamp(1.8rem,2.6vw,2.5rem)]">{site.streams.toLocaleString("en-AU")}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/spotify-logo-black.png" alt="Spotify" width={240} height={72} className="mt-1 h-5.5 w-auto self-start opacity-90 [:root[data-theme=night]_&]:invert" />
    </div>
  );
}

/** A compact spec list — label / value rows with hairlines. */
export function Spec({ rows, className }: { rows: { k: string; v: React.ReactNode }[]; className?: string }) {
  return (
    <dl className={cn("border-t border-line", className)}>
      {rows.map((r) => (
        <div key={r.k} className="grid grid-cols-[112px_1fr] gap-4 border-b border-line py-3">
          <dt className="t-label pt-0.75 text-muted">{r.k}</dt>
          <dd className="t-body">{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Section header row used throughout inner pages. */
export function Rule({ left, right, className }: { left: React.ReactNode; right?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-end justify-between gap-6 border-t border-line pt-4", className)}>
      <span className="t-label">{left}</span>
      {right && <span className="t-label text-right text-muted">{right}</span>}
    </div>
  );
}
