"use client";

import { useState } from "react";
import { useBooking } from "@/components/booking/Booking";
import { Arrow } from "@/components/ui/Icons";
import { aud, checkoutLinks, engineers, type Product } from "@/lib/content/services";
import { cn } from "@/lib/utils";

/** A deal (2 for 1, Artist Spotlight): options → live price → order. */
export default function ProductCard({ product }: { product: Product }) {
  const booking = useBooking();
  const [picks, setPicks] = useState<string[]>(() => (product.options ?? []).map((o) => o.values[0]));
  const key = picks.join("|");
  const variant = product.variants.find((v) => v.key === key) ?? product.variants[0];
  const link = checkoutLinks[`${product.slug}|${variant.key}`];
  const engineerName = product.options?.find((o) => o.name === "Engineer") ? picks[0] : undefined;
  const engineer = engineers.find((e) => e.name === engineerName)?.slug;

  return (
    <article id={product.slug} className="flex scroll-mt-40 flex-col gap-5 border border-line p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="t-label text-rec">{product.kicker}</span>
          <h3 className="t-m mt-2">{product.name}</h3>
        </div>
        {variant.was && <span className="t-label shrink-0 bg-fg px-2 py-1 text-bg">Save {aud(variant.was - variant.price)}</span>}
      </div>
      <p className="t-body text-muted">{product.blurb}</p>

      {product.includes && (
        <ul className="border-t border-line">
          {product.includes.map((it) => (
            <li key={it} className="t-body border-b border-line py-2.5">
              {it}
            </li>
          ))}
        </ul>
      )}

      {product.options?.map((o, oi) => (
        <fieldset key={o.name}>
          <legend className="t-label mb-2 text-muted">{o.name}</legend>
          <div className="flex flex-wrap gap-2">
            {o.values.map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={picks[oi] === v}
                onClick={() => setPicks((p) => p.map((x, i) => (i === oi ? v : x)))}
                className={cn("t-label border px-3 py-2 transition-colors duration-300", picks[oi] === v ? "border-fg bg-fg text-bg" : "border-line hover:border-fg")}
              >
                {v}
              </button>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
        <p className="flex items-baseline gap-3">
          <span className="t-price text-[clamp(1.8rem,2.6vw,2.4rem)]">{aud(variant.price)}</span>
          {variant.was && <span className="t-label text-muted line-through">{aud(variant.was)}</span>}
        </p>
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" className="group t-wide-s flex items-center gap-3 bg-fg px-4 py-3.5 text-bg">
            Buy now <Arrow className="transition-transform duration-500 group-hover:rotate-45" />
          </a>
        ) : (
          <button
            onClick={() => booking.open("mix", { pkg: product.slug === "2-for-1" ? "2 for 1 deal" : "Artist Spotlight session", engineer })}
            className="group t-wide-s flex items-center gap-3 bg-fg px-4 py-3.5 text-bg"
          >
            Order <Arrow className="transition-transform duration-500 group-hover:rotate-45" />
          </button>
        )}
      </div>
      {product.fineprint?.map((f) => (
        <p key={f} className="t-label -mt-1 leading-[1.6] text-muted normal-case">
          {f}
        </p>
      ))}
    </article>
  );
}
