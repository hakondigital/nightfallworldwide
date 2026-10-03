"use client";

import { useBooking } from "@/components/booking/Booking";
import { TLink } from "@/components/providers/Transition";
import { Arrow } from "@/components/ui/Icons";
import { site } from "@/lib/content/site";

type Card = {
  code: string;
  title: string;
  price: string;
  sub: string;
  primary: { label: string; action: "mix" | "studio" | string };
  secondary: { label: string; href: string };
};

const CARDS: Card[] = [
  {
    code: "01",
    title: "Mixing & Mastering",
    price: "From A$300 / track",
    sub: "Nightfall Collective, 3× Grammy-nominated Mike Snell, or DON!",
    primary: { label: "Book a mix", action: "mix" },
    secondary: { label: "Engineers & pricing", href: "/mixing-mastering" },
  },
  {
    code: "02",
    title: "Studio sessions",
    price: "From A$319 / 4 hrs",
    sub: "Dry hire, or with a Nightfall engineer. Burleigh Heads.",
    primary: { label: "Book the studio", action: "studio" },
    secondary: { label: "Packages & gear", href: "/studio" },
  },
  {
    code: "03",
    title: "Distribution",
    price: "You keep 80%",
    sub: "No upfront fees, no lock-in, editorial playlist pitching.",
    primary: { label: "Join the label", action: "/distribution/upload" },
    secondary: { label: "How it works", href: "/distribution" },
  },
  {
    code: "04",
    title: "Beats",
    price: "Licences from A$150",
    sub: "Exclusive beats from the Nightfall producers.",
    primary: { label: "Browse beats", action: site.links.beats },
    secondary: { label: "Licence rates", href: "/rates" },
  },
];

/** The four ways in — each with its booking action up front. */
export default function ServiceCards() {
  const booking = useBooking();
  return (
    <div className="grid gap-(--gap) sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((c) => {
        const primaryClass = "group t-wide-s flex items-center justify-between gap-3 bg-fg px-4 py-3 text-bg transition-colors hover:bg-rec sm:py-3.5";
        const primary =
          c.primary.action === "mix" || c.primary.action === "studio" ? (
            <button onClick={() => booking.open(c.primary.action as "mix" | "studio")} className={primaryClass}>
              {c.primary.label} <Arrow className="transition-transform duration-500 group-hover:rotate-45" />
            </button>
          ) : (
            <TLink href={c.primary.action} className={primaryClass}>
              {c.primary.label} <Arrow className="transition-transform duration-500 group-hover:rotate-45" />
            </TLink>
          );
        return (
          <article key={c.code} className="flex flex-col gap-2 border border-line p-4 sm:gap-4 sm:p-5">
            <span className="t-label hidden text-muted sm:block">{c.code}</span>
            <h3 className="t-m">{c.title}</h3>
            <p className="t-price text-[1.2rem] sm:text-[1.35rem]">{c.price}</p>
            <p className="t-body hidden text-muted sm:block">{c.sub}</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:mt-auto sm:flex-col sm:flex-nowrap sm:items-stretch sm:pt-2">
              {primary}
              <TLink href={c.secondary.href} className="t-label u-draw py-1 text-muted hover:text-fg sm:self-start">
                {c.secondary.label} →
              </TLink>
            </div>
          </article>
        );
      })}
    </div>
  );
}
