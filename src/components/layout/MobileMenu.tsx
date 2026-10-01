"use client";

import { useEffect, useRef } from "react";
import { useBooking } from "@/components/booking/Booking";
import { useLenis } from "@/components/providers/SmoothScroll";
import { TLink } from "@/components/providers/Transition";
import { gsap } from "@/lib/gsap";
import { businesses, musicNav, site } from "@/lib/content/site";
import { nightVars } from "@/lib/theme";

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const booking = useBooking();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-menu-item]");
    if (open) {
      lenis?.stop();
      gsap.set(el, { visibility: "visible" });
      gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: "expo.inOut" });
      gsap.fromTo(items, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.03, delay: 0.2 });
    } else {
      lenis?.start();
      gsap.to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.45, ease: "expo.inOut", onComplete: () => gsap.set(el, { visibility: "hidden" }) });
    }
  }, [open, lenis]);

  return (
    <div
      id="mobile-menu"
      ref={ref}
      className="fixed inset-0 z-90 flex flex-col overflow-y-auto bg-[#070707] pt-(--header-h) text-paper lg:hidden"
      style={{ ...nightVars, visibility: "hidden", clipPath: "inset(0 0 100% 0)" }}
      data-lenis-prevent
      aria-hidden={!open}
    >
      <nav aria-label="Mobile" className="pad-x flex-1 pt-4">
        {businesses.map((b) => (
          <div key={b.key} className="border-t border-white/15 py-4">
            <div className="overflow-hidden">
              <TLink href={b.href} onClick={onClose} className="flex items-baseline justify-between" data-menu-item>
                <span className="t-l">{b.label}</span>
                <span className="t-label text-paper/45">{b.code}</span>
              </TLink>
            </div>
            {b.key === "music" && (
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
                {musicNav.map((n) => (
                  <li key={n.href} className="overflow-hidden">
                    <TLink href={n.href} onClick={onClose} className="t-label block py-1.5 text-paper/75" data-menu-item>
                      {n.label}
                      {n.external ? " ↗" : ""}
                    </TLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <div className="overflow-hidden border-y border-white/15 py-4">
          <TLink href="/contact" onClick={onClose} className="flex items-baseline justify-between" data-menu-item>
            <span className="t-l">Contact</span>
            <span className="t-label text-paper/45">04</span>
          </TLink>
        </div>
      </nav>
      <div className="pad-x mt-8 flex flex-col gap-4 pb-8">
        <button
          onClick={() => {
            onClose();
            booking.open("studio");
          }}
          className="t-wide-s flex items-center justify-between bg-rec px-5 py-4 text-white"
        >
          Book a session <span aria-hidden>→</span>
        </button>
        <div className="t-label flex flex-col gap-1.5 text-paper/60">
          <a href={`mailto:${site.email.admin}`}>{site.email.admin}</a>
          <a href={site.links.instagram} target="_blank" rel="noreferrer">
            Instagram {site.links.instagramHandle}
          </a>
        </div>
      </div>
    </div>
  );
}
