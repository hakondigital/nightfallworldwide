"use client";

import { useBooking } from "@/components/booking/Booking";
import { Arrow } from "@/components/ui/Icons";
import Media from "@/components/ui/Media";
import { engineers } from "@/lib/content/services";

/** Choose who mixes your record — each engineer books straight into the order form. */
export default function EngineerCards() {
  const booking = useBooking();
  return (
    <div className="grid gap-(--gap) md:grid-cols-3">
      {engineers.map((e) => (
        <article key={e.slug} id={e.slug} className="flex scroll-mt-40 flex-col border border-line">
          <div className="flex items-center gap-4 p-4 md:block md:p-0">
            {e.image ? (
              <Media name={e.image} alt={e.name} sizes="(min-width: 768px) 30vw, 96px" className="aspect-square w-24 shrink-0 bg-panel md:aspect-[4/3] md:w-full" position="50% 30%" />
            ) : (
              <div className="grid aspect-square w-24 shrink-0 place-items-center bg-fg text-bg md:aspect-[4/3] md:w-full" aria-hidden>
                <span className="font-display text-[clamp(1.5rem,4.4vw,4.4rem)] font-bold uppercase leading-none tracking-[-0.03em]">{e.name}</span>
              </div>
            )}
            <div className="flex min-w-0 flex-col gap-1.5 md:hidden">
              <span className="t-label text-rec">{e.badge}</span>
              <h3 className="t-m">{e.name}</h3>
              <p className="t-price text-[1.15rem]">{e.price}</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3 px-4 pb-4 md:p-5">
            <span className="t-label hidden text-rec md:block">{e.badge}</span>
            <h3 className="t-m hidden md:block">{e.name}</h3>
            <p className="t-body text-muted">{e.credit}</p>
            {e.link && (
              <a href={e.link.href} target="_blank" rel="noreferrer" className="t-label u-draw self-start">
                {e.link.label} ↗
              </a>
            )}
            <p className="t-price mt-auto hidden pt-2 text-[1.35rem] md:block">{e.price}</p>
            <button
              onClick={() => booking.open("mix", { engineer: e.slug })}
              className="group t-wide-s flex items-center justify-between gap-3 bg-fg px-4 py-3.5 text-bg transition-colors hover:bg-rec"
            >
              {e.perTrack ? `Book with ${e.name}` : `Enquire with ${e.name}`}
              <Arrow className="transition-transform duration-500 group-hover:rotate-45" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
