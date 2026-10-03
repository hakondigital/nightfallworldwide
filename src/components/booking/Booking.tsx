"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import EnquiryForm from "@/components/forms/EnquiryForm";
import MixOrderForm, { PACKAGES } from "@/components/forms/MixOrderForm";
import { useLenis } from "@/components/providers/SmoothScroll";
import { Close } from "@/components/ui/Icons";
import { gsap } from "@/lib/gsap";
import { acuityEmbed, acuityType, site } from "@/lib/content/site";
import { dayVars } from "@/lib/theme";
import { cn } from "@/lib/utils";

export type BookingTab = "studio" | "mix" | "whitewall" | "enquire";
export type BookingOptions = {
  /** Acuity appointment type id — opens that package's calendar directly */
  appointmentType?: string;
  /** preset enquiry topic */
  topic?: string;
  /** preset engineer / package for the mix order */
  engineer?: string;
  pkg?: (typeof PACKAGES)[number];
};

type Ctx = { open: (tab?: BookingTab, opts?: BookingOptions) => void; close: () => void };

const BookingContext = createContext<Ctx>({ open: () => undefined, close: () => undefined });
export const useBooking = () => useContext(BookingContext);

const TABS: { id: BookingTab; label: string; note: string }[] = [
  { id: "studio", label: "Studio", note: "Recording sessions" },
  { id: "mix", label: "Mix & master", note: "Order a mix" },
  { id: "whitewall", label: "WhiteWall", note: "Photo & video hire" },
  { id: "enquire", label: "Enquire", note: "Film, distribution & more" },
];

export default function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [tab, setTab] = useState<BookingTab>("studio");
  const [opts, setOpts] = useState<BookingOptions>({});
  const [loaded, setLoaded] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  const open = useCallback((t: BookingTab = "studio", o: BookingOptions = {}) => {
    setTab(t);
    setOpts(o);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  // GSAP owns the transform from the start (an inline translate would be parsed as a fixed px offset)
  useEffect(() => {
    if (panel.current) gsap.set(panel.current, { xPercent: 100 });
  }, []);

  useEffect(() => {
    const p = panel.current;
    const b = backdrop.current;
    if (!p || !b) return;
    if (isOpen) {
      lenis?.stop();
      gsap.set([p, b], { visibility: "visible" });
      gsap.to(b, { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(p, { xPercent: 100 }, { xPercent: 0, duration: 0.7, ease: "expo.out" });
      closeBtn.current?.focus();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    lenis?.start();
    gsap.to(b, { opacity: 0, duration: 0.3 });
    gsap.to(p, { xPercent: 100, duration: 0.5, ease: "expo.in", onComplete: () => gsap.set([p, b], { visibility: "hidden" }) });
  }, [isOpen, lenis]);

  const calendar =
    tab === "studio" || tab === "whitewall"
      ? acuityEmbed(opts.appointmentType ? acuityType(opts.appointmentType) : tab === "studio" ? site.links.bookStudio : site.links.bookWhitewall)
      : null;

  return (
    <BookingContext.Provider value={{ open, close }}>
      {children}
      <div ref={backdrop} onClick={close} className="fixed inset-0 z-160 bg-black/50" style={{ opacity: 0, visibility: "hidden" }} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Book with Nightfall"
        className="fixed inset-y-0 right-0 z-170 flex w-full max-w-[760px] flex-col bg-paper text-ink"
        style={{ ...dayVars, visibility: "hidden" }}
        data-lenis-prevent
      >
        <div className="flex items-center justify-between border-b border-ink/15 px-5 py-3 sm:px-7">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/nightfall-logo-black.png" alt="Nightfall Worldwide" className="h-11 w-auto" />
          <button ref={closeBtn} onClick={close} className="t-label flex items-center gap-2 hover:text-rec" aria-label="Close booking">
            Close <Close className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 border-b border-ink/15 sm:grid-cols-4" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => {
                setTab(t.id);
                setOpts({});
              }}
              className={cn(
                "flex flex-col items-start gap-1 border-b border-r border-ink/15 px-4 py-3 text-left sm:border-b-0 sm:[&:nth-child(4)]:border-r-0",
                tab === t.id ? "bg-ink text-paper" : "hover:bg-ink/5",
              )}
            >
              <span className="t-wide-s">{t.label}</span>
              <span className={cn("t-label", tab === t.id ? "text-paper/60" : "text-ink/50")}>{t.note}</span>
            </button>
          ))}
        </div>

        <div className="relative min-h-0 flex-1 overflow-y-auto" data-lenis-prevent>
          {calendar ? (
            <>
              {loaded !== calendar && (
                <div className="absolute inset-0 grid place-items-center">
                  <span className="t-label flex items-center gap-2 text-ink/60">
                    <span className="rec-dot" /> Loading live availability…
                  </span>
                </div>
              )}
              {isOpen && (
                <iframe
                  key={calendar}
                  src={calendar}
                  title={tab === "studio" ? "Book the Nightfall studio" : "Book the WhiteWall"}
                  className="relative h-full min-h-[640px] w-full bg-white"
                  allow="payment"
                  onLoad={() => setLoaded(calendar)}
                />
              )}
            </>
          ) : tab === "mix" ? (
            <div className="px-5 py-7 sm:px-7">
              <MixOrderForm key={`${opts.engineer}-${opts.pkg}`} defaultEngineer={opts.engineer} defaultPackage={opts.pkg} />
            </div>
          ) : (
            <div className="px-5 py-7 sm:px-7">
              <EnquiryForm key={opts.topic ?? "default"} compact defaultTopic={opts.topic} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/15 px-5 py-3 t-label text-ink/55 sm:px-7">
          <span>
            {site.address.street}, {site.address.suburb} {site.address.state} {site.address.postcode}
          </span>
          <a className="u-draw" href={`mailto:${site.email.studio}`}>
            {site.email.studio}
          </a>
        </div>
      </div>
    </BookingContext.Provider>
  );
}
