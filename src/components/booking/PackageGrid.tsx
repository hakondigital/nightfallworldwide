"use client";

import { useBooking, type BookingTab } from "@/components/booking/Booking";
import { Arrow } from "@/components/ui/Icons";
import { aud, type Package } from "@/lib/content/services";

/** Live Acuity packages — "Book" opens that package's calendar directly. */
export default function PackageGrid({ packages, tab }: { packages: Package[]; tab: BookingTab }) {
  const booking = useBooking();
  return (
    <div className="grid grid-cols-2 gap-(--gap) lg:grid-cols-4">
      {packages.map((p) => (
        <article key={p.id} className="flex flex-col gap-3 border border-line p-4 sm:p-5">
          <span className="t-label text-muted">{p.note}</span>
          <h3 className="t-wide-s">{p.name}</h3>
          <p className="t-price mt-auto pt-2 text-[clamp(1.5rem,2.4vw,2.2rem)] sm:pt-4">{aud(p.price)}</p>
          <button
            onClick={() => booking.open(tab, { appointmentType: p.id })}
            className="group t-wide-s flex items-center justify-between gap-3 bg-fg px-4 py-3 text-bg transition-colors hover:bg-rec sm:py-3.5"
          >
            Book <Arrow className="transition-transform duration-500 group-hover:rotate-45" />
          </button>
        </article>
      ))}
    </div>
  );
}
