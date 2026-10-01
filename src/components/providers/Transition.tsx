"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Globe from "@/components/ui/Globe";
import { setTheme } from "@/components/ui/Section";
import { useLenis } from "@/components/providers/SmoothScroll";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { allRoutes, site } from "@/lib/content/site";
import { cn, isExternal } from "@/lib/utils";

type Ctx = { navigate: (href: string) => void; ready: boolean };
const TransitionContext = createContext<Ctx>({ navigate: () => undefined, ready: false });
export const usePageTransition = () => useContext(TransitionContext);

/** Fired once the preloader lifts — heroes time their intros off this. */
export const READY_EVENT = "nightfall:ready";

const labelFor = (href: string) => {
  const path = href.split("#")[0].split("?")[0];
  if (path === "/" || path === "") return { label: "Nightfall", code: "00" };
  const hit = allRoutes.find((n) => n.href === path);
  if (hit) return { label: hit.label, code: hit.code };
  const section = allRoutes.find((n) => path.startsWith(n.href + "/"));
  const last = path.split("/").filter(Boolean).pop() ?? "";
  return { label: last.replace(/-/g, " "), code: section?.code ?? "—" };
};

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const curtain = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const pendingHash = useRef<string | null>(null);
  const firstPath = useRef(pathname);
  const [label, setLabel] = useState("Nightfall");
  const [spinning, setSpinning] = useState(true);
  const [ready, setReady] = useState(false);

  // ── First load: preloader ────────────────────────────────────
  useEffect(() => {
    const el = curtain.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = { v: 0 };
    const tl = gsap.timeline();
    tl.to(count, {
      v: 100,
      duration: reduced ? 0.01 : 1.35,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counter.current) counter.current.textContent = String(Math.round(count.v)).padStart(3, "0");
      },
    });
    Promise.all([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => tl.eventCallback("onComplete", r))]).then(() => {
      window.dispatchEvent(new Event(READY_EVENT));
      setReady(true);
      gsap.to(el, {
        yPercent: -100,
        duration: reduced ? 0.01 : 1.05,
        ease: "expo.inOut",
        onComplete: () => {
          el.style.visibility = "hidden";
          setSpinning(false);
          el.dataset.mode = "nav";
        },
      });
    });
    return () => {
      tl.kill();
    };
  }, []);

  // ── Navigation: cover → push → (pathname effect) → reveal ────
  const navigate = useCallback(
    (href: string) => {
      const [path, hash] = href.split("#");
      if (path === pathname || path === "") {
        if (hash) lenis?.scrollTo(`#${hash}`, { offset: -90, duration: 1.4 });
        else lenis?.scrollTo(0, { duration: 1.4 });
        return;
      }
      if (busy.current) return;
      busy.current = true;
      pendingHash.current = hash ?? null;
      const dest = labelFor(href);
      setLabel(dest.label);
      if (counter.current) counter.current.textContent = dest.code;
      setSpinning(true);
      const el = curtain.current!;
      el.style.visibility = "visible";
      lenis?.stop();
      gsap.fromTo(
        el,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.8,
          ease: "expo.inOut",
          onComplete: () => router.push(path, { scroll: false }),
        },
      );
    },
    [pathname, lenis, router],
  );

  useEffect(() => {
    if (pathname === firstPath.current && !busy.current) return;
    firstPath.current = pathname;
    const el = curtain.current;
    setTheme("day");
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    lenis?.start();

    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (pendingHash.current) {
        lenis?.scrollTo(`#${pendingHash.current}`, { immediate: true, force: true, offset: -90 });
        pendingHash.current = null;
      }
      if (!busy.current || !el) return;
      window.dispatchEvent(new Event(READY_EVENT));
      gsap.to(el, {
        yPercent: -100,
        duration: 0.95,
        delay: 0.15,
        ease: "expo.inOut",
        onComplete: () => {
          el.style.visibility = "hidden";
          busy.current = false;
          setSpinning(false);
        },
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, lenis]);

  return (
    <TransitionContext.Provider value={{ navigate, ready }}>
      {children}
      <div
        ref={curtain}
        data-mode="load"
        className="curtain fixed inset-0 z-[200] flex flex-col bg-[#070707] text-paper"
        aria-hidden={ready}
      >
        {/* scan lines lead the curtain in both directions */}
        <span className="absolute inset-x-0 top-0 h-px bg-rec" />
        <span className="absolute inset-x-0 bottom-0 h-px bg-rec" />
        <div className="pad-x flex items-start justify-between pt-5 t-label text-paper/60">
          <span>{site.wordmark}</span>
          <span className="hidden sm:inline">{site.geo.label}</span>
        </div>
        <div className="relative grid flex-1 place-items-center">
          <div className="absolute aspect-square w-[min(56vmin,520px)]">
            <Globe tone="paper" radius={0.46} speed={70} depth weight={1.15} active={spinning} />
          </div>
          <div className="relative z-10 bg-[#070707] px-4 py-2 text-center">
            <span className="block t-xl text-paper" style={{ fontSize: "clamp(2.2rem, 6vw, 5.5rem)" }}>
              {label}
            </span>
          </div>
        </div>
        <div className="pad-x flex items-end justify-between pb-5">
          <span className="t-label text-paper/60">
            <span className="rec-dot mr-2 align-middle" />
            {label === "Nightfall" ? "Loading" : "Now entering"}
          </span>
          <span className="font-mono text-[clamp(1.4rem,3vw,2.4rem)] leading-none tabular-nums">
            <span ref={counter}>000</span>
          </span>
        </div>
      </div>
      <noscript>
        <style>{`.curtain{display:none!important}`}</style>
      </noscript>
    </TransitionContext.Provider>
  );
}

type TLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & { href: string };

/** Link that runs the nightfall transition for internal routes. */
export function TLink({ href, children, className, onClick, ...rest }: TLinkProps) {
  const { navigate } = usePageTransition();
  if (isExternal(href)) {
    const mail = href.startsWith("mailto:") || href.startsWith("tel:");
    return (
      <a href={href} className={className} onClick={onClick} {...(mail ? {} : { target: "_blank", rel: "noreferrer" })} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className={cn(className)}
      onClick={onClick}
      onNavigate={(e) => {
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
