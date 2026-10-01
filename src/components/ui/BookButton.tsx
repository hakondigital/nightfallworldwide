"use client";

import { useBooking, type BookingOptions, type BookingTab } from "@/components/booking/Booking";
import { Arrow } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

/** Primary action — solid key with a REC wipe. Opens the booking drawer. */
export default function BookButton({
  tab = "studio",
  opts,
  children,
  className,
  variant = "solid",
  dot = false,
  size = "md",
}: {
  tab?: BookingTab;
  opts?: BookingOptions;
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "line" | "paper";
  dot?: boolean;
  size?: "sm" | "md";
}) {
  const booking = useBooking();
  return (
    <button
      type="button"
      onClick={() => booking.open(tab, opts)}
      className={cn(
        "group relative flex items-center justify-between gap-4 overflow-hidden",
        size === "md" ? "t-wide-s px-5 py-4" : "t-label px-3.5 py-2.5",
        variant === "solid" && "bg-fg text-bg",
        variant === "paper" && "bg-paper text-ink",
        variant === "line" && "border border-line hover:border-fg",
        className,
      )}
    >
      <span className="relative z-10 flex items-center gap-2.5">
        {dot && <span className="rec-dot" />}
        {children}
      </span>
      <Arrow className="relative z-10 transition-transform duration-500 group-hover:rotate-45" />
      {variant !== "line" && (
        <span className="absolute inset-0 origin-left scale-x-0 bg-rec transition-transform duration-500 ease-out group-hover:scale-x-100" />
      )}
    </button>
  );
}
