"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useBooking } from "@/components/booking/Booking";
import MobileMenu from "@/components/layout/MobileMenu";
import { TLink } from "@/components/providers/Transition";
import { businessFor, isMusicPath, musicNav, primaryNav } from "@/lib/content/site";
import { nightVars } from "@/lib/theme";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const booking = useBooking();
  const [menu, setMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const music = isMusicPath(pathname);
  const biz = businessFor(pathname);

  // one clear action per business
  const cta =
    biz === "film"
      ? { label: "Enquire now", short: "Enquire", run: () => booking.open("enquire", { topic: "Film / TV scoring" }) }
      : biz === "whitewall"
        ? { label: "Book now", short: "Book", run: () => booking.open("whitewall") }
        : pathname.startsWith("/mixing-mastering")
          ? { label: "Book a mix", short: "Book", run: () => booking.open("mix") }
          : { label: "Book a session", short: "Book", run: () => booking.open("studio") };

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - lastY.current) > 6) {
          setHidden(y > lastY.current && y > 260);
          lastY.current = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu when the route changes
    setMenu(false);
    setHidden(false);
  }, [pathname]);

  const active = (href: string) => (href === "/music" ? music : pathname === href || pathname.startsWith(href + "/"));

  return (
    <>
      <header
        data-force={menu ? "night" : undefined}
        className={cn(
          "fixed inset-x-0 top-0 z-100 border-b text-fg transition-[transform,background-color,border-color] duration-500 ease-out",
          menu ? "border-transparent bg-transparent" : "border-line bg-bg",
          hidden && !menu ? "-translate-y-full" : "translate-y-0",
        )}
        style={menu ? nightVars : undefined}
      >
        <div className="pad-x flex h-(--header-h) items-center justify-between gap-6">
          <TLink href="/" className="shrink-0" aria-label="Nightfall Worldwide — home">
            {/* the real logo — black by day, white by night */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/nightfall-logo-black.png" alt="Nightfall Worldwide" width={420} height={240} className="logo-day h-11 w-auto sm:h-13" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/nightfall-logo-white.png" alt="" aria-hidden width={420} height={240} className="logo-night h-11 w-auto sm:h-13" />
          </TLink>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-[clamp(20px,2.4vw,40px)]">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <TLink
                    href={item.href}
                    aria-current={active(item.href) ? "page" : undefined}
                    className={cn(
                      "relative py-2 font-display text-[13px] font-bold uppercase tracking-[0.02em] transition-colors duration-300",
                      active(item.href) ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                    <span className={cn("absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-rec transition-transform duration-500 ease-out", active(item.href) ? "scale-x-100" : "scale-x-0")} />
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={cta.run}
              className={cn("group t-label relative flex items-center gap-2 overflow-hidden bg-fg px-4 py-3 text-bg", menu && "invisible")}
            >
              <span className="relative z-10 hidden sm:inline">{cta.label}</span>
              <span className="relative z-10 sm:hidden">{cta.short}</span>
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-rec transition-transform duration-500 ease-out group-hover:scale-y-100" />
            </button>
            <button onClick={() => setMenu((m) => !m)} className="t-label flex items-center gap-2 py-2 lg:hidden" aria-expanded={menu} aria-controls="mobile-menu">
              <span className="relative block h-2.5 w-5">
                <span className={cn("absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500", menu && "translate-y-1.25 rotate-45")} />
                <span className={cn("absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500", menu && "-translate-y-1 -rotate-45")} />
              </span>
              {menu ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {/* Music has its own sub-navigation, as on the original site */}
        {music && !menu && (
          <nav aria-label="Music" className="border-t border-line">
            <ul className="pad-x flex h-(--subnav-h) items-center gap-[clamp(16px,2vw,32px)] overflow-x-auto [scrollbar-width:none]">
              <li className="t-label shrink-0 text-muted">Music —</li>
              {musicNav.map((n) => {
                const on = !n.external && !n.href.includes("#") && (pathname === n.href || pathname.startsWith(n.href + "/"));
                return (
                  <li key={n.href} className="shrink-0">
                    <TLink href={n.href} aria-current={on ? "page" : undefined} className={cn("t-label flex items-center gap-1.5 py-2 transition-colors", on ? "text-fg" : "text-muted hover:text-fg")}>
                      {on && <span className="h-1.25 w-1.25 bg-rec" />}
                      {n.label}
                      {n.external ? " ↗" : ""}
                    </TLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </header>
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
    </>
  );
}
