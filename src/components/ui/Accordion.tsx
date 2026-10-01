"use client";

import { useId, useState } from "react";
import { Plus } from "@/components/ui/Icons";
import { ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Minimal disclosure row — for terms and specs, not marketing FAQs. */
export default function Accordion({
  title,
  meta,
  children,
  id,
  defaultOpen = false,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
  id?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panel = useId();
  return (
    <div id={id} className="scroll-mt-28 border-b border-line">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panel}
        className="group flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="t-wide-s">{title}</span>
        <span className="flex items-center gap-4">
          {meta && <span className="t-label hidden text-muted sm:inline">{meta}</span>}
          <Plus className={cn("h-4 w-4 transition-transform duration-500 ease-(--ease-out)", open && "rotate-45")} />
        </span>
      </button>
      <div
        id={panel}
        className="grid transition-[grid-template-rows] duration-700 ease-(--ease-out)"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        onTransitionEnd={(e) => e.propertyName === "grid-template-rows" && ScrollTrigger.refresh()}
      >
        <div className="overflow-hidden">
          <div className="pb-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
