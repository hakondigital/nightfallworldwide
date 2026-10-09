"use client";

import { useCallback, useRef, useState } from "react";
import Section from "@/components/ui/Section";
import Video from "@/components/ui/Video";
import { gsap, useGSAP } from "@/lib/gsap";
import { timecode } from "@/lib/utils";

type Props = {
  base: string;
  poster: string;
  title: [string, string];
  caption: string;
  file: string;
};

/**
 * Night interlude: a small frame in the dark opens to full-bleed as you
 * scroll, SMPTE timecode ticking, with a sound-on toggle.
 */
export default function Showreel({ base, poster, title, caption, file }: Props) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const tc = useRef<HTMLSpanElement>(null);
  const [sound, setSound] = useState(false);

  const onTime = useCallback((t: number) => {
    if (tc.current) tc.current.textContent = timecode(t);
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 768px)", reduced: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const { desktop, reduced } = ctx.conditions as { desktop: boolean; reduced: boolean };
          if (reduced) {
            gsap.set(q("[data-frame]"), { clipPath: "inset(0% 0% 0% 0%)" });
            return;
          }
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8 },
          });
          tl.fromTo(
            q("[data-frame]"),
            // start as a generous framed video, not a thumbnail — on big screens the old
            // 24%/30% insets left most of the viewport black before the scroll kicked in
            { clipPath: desktop ? "inset(10% 18% 10% 18% round 2px)" : "inset(16% 6% 16% 6% round 2px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.6 },
            0,
          )
            .fromTo(q("[data-left]"), { xPercent: 0 }, { xPercent: -120, duration: 0.6 }, 0)
            .fromTo(q("[data-right]"), { xPercent: 0 }, { xPercent: 120, duration: 0.6 }, 0)
            .fromTo(q("[data-video]"), { scale: 1.25 }, { scale: 1, duration: 0.6 }, 0)
            .fromTo(q("[data-hud]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0.5)
            .to({}, { duration: 0.2 });
        },
      );
    },
    { scope: root },
  );

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.play().catch(() => undefined);
    setSound(!v.muted);
  };

  return (
    <Section ref={root} theme="night" className="h-[170svh] motion-reduce:h-svh" aria-label={`${title.join(" ")} showreel`}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <div data-frame className="absolute inset-0 overflow-hidden" style={{ clipPath: "inset(10% 18% 10% 18%)" }}>
          <div data-video className="absolute inset-0">
            <Video ref={video} base={base} poster={poster} onTime={onTime} />
          </div>
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* words either side of the frame */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between">
          <span data-left className="t-xl pl-(--pad) text-paper" style={{ fontSize: "clamp(2.8rem, 6.4vw, 7rem)" }}>
            {title[0]}
          </span>
          <span data-right className="t-xl pr-(--pad) text-right text-paper" style={{ fontSize: "clamp(2.8rem, 6.4vw, 7rem)" }}>
            {title[1]}
          </span>
        </div>

        {/* HUD */}
        <div data-hud className="pad-x absolute inset-x-0 top-(--header-h) flex items-start justify-between pt-4 text-paper opacity-0">
          <span className="t-label flex items-center gap-2">
            <span className="rec-dot" /> REC — {file}
          </span>
          <span className="t-label hidden max-w-[40ch] text-right text-paper/70 sm:block">{caption}</span>
        </div>
        <div data-hud className="pad-x absolute inset-x-0 bottom-0 flex items-end justify-between pb-6 text-paper opacity-0">
          <span className="font-mono text-[clamp(1rem,1.6vw,1.4rem)] leading-none tabular-nums">
            <span ref={tc}>00:00:00:00</span>
          </span>
          <button onClick={toggleSound} data-cursor={sound ? "MUTE" : "SOUND ON"} className="t-label flex items-center gap-3 border border-white/30 px-4 py-3 hover:bg-white hover:text-ink">
            <span className="flex h-3 items-end gap-[2px]" aria-hidden>
              {[0.4, 1, 0.6, 0.85].map((h, i) => (
                <span
                  key={i}
                  className="block w-[2px] origin-bottom bg-current"
                  style={{ height: "100%", transform: `scaleY(${sound ? h : 0.2})`, transition: "transform .4s" }}
                />
              ))}
            </span>
            {sound ? "Sound on" : "Sound off"}
          </button>
        </div>
      </div>
    </Section>
  );
}
