"use client";

import { useState } from "react";
import Honeypot from "@/components/forms/Honeypot";
import { Arrow } from "@/components/ui/Icons";
import { formInbox, HONEYPOT } from "@/lib/content/forms";
import { aud, engineers, mixRates, products } from "@/lib/content/services";
import { submitForm } from "@/lib/submit";
import { cn } from "@/lib/utils";

export const PACKAGES = ["Mix & master", "2 for 1 deal", "Artist Spotlight session"] as const;
type Pkg = (typeof PACKAGES)[number];
const STEMS = ["1–12 stems", "13–24 stems"];
const dealVariant = (engineerName: string, stems: string) => products.find((p) => p.slug === "2-for-1")?.variants.find((x) => x.key === `${engineerName}|${stems}`);

function estimate(engineerSlug: string, pkg: Pkg, stems: string, tracks: number) {
  const eng = engineers.find((e) => e.slug === engineerSlug);
  if (!eng?.perTrack) return null;
  if (pkg === "Artist Spotlight session") return products.find((p) => p.slug === "artist-spotlight")?.variants[0].price ?? null;
  if (pkg === "2 for 1 deal") {
    const v = dealVariant(eng.name, stems);
    return v ? v.price * (tracks / 2) : null; // sold in pairs
  }
  return (eng.perTrack + (stems === STEMS[1] ? mixRates.bigSession : 0)) * tracks;
}

/** Order a mix: pick the engineer, tell us the size of the job, get an estimate. */
export default function MixOrderForm({ defaultEngineer, defaultPackage, className }: { defaultEngineer?: string; defaultPackage?: Pkg; className?: string }) {
  const [engineer, setEngineer] = useState(defaultEngineer ?? engineers[0].slug);
  const [pkg, setPkg] = useState<Pkg>(defaultPackage ?? "Mix & master");
  const [stems, setStems] = useState(STEMS[0]);
  const [tracks, setTracks] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "mail" | "error">("idle");
  const [error, setError] = useState("");

  const eng = engineers.find((e) => e.slug === engineer) ?? engineers[0];
  const est = estimate(engineer, pkg, stems, tracks);
  const spotlight = pkg === "Artist Spotlight session";
  const deal = pkg === "2 for 1 deal";
  const step = deal ? 2 : 1;
  // Two or more tracks at the single rate? The deal is cheaper — say so.
  const dealTracks = Math.ceil(tracks / 2) * 2;
  const dealPrice = pkg === "Mix & master" && tracks >= 2 ? dealVariant(eng.name, stems)?.price : undefined;
  const dealEst = dealPrice !== undefined && est !== null && dealPrice * (dealTracks / 2) < est ? dealPrice * (dealTracks / 2) : null;
  const choosePkg = (p: Pkg) => {
    setPkg(p);
    // the 2 for 1 deal comes in pairs — one paid, one free
    if (p === "2 for 1 deal") setTracks((t) => Math.max(2, Math.ceil(t / 2) * 2));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      engineer: eng.name,
      package: pkg,
      stems: spotlight ? "Beat .wav + vocals" : stems,
      tracks: spotlight ? "1" : String(tracks),
      estimate: est ? `from ${aud(est)}` : "Quote on request",
      artist: String(fd.get("artist") ?? ""),
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      files: String(fd.get("files") ?? ""),
      notes: String(fd.get("notes") ?? ""),
      [HONEYPOT]: String(fd.get(HONEYPOT) ?? ""),
    };
    setStatus("sending");
    try {
      const r = await submitForm("mix", data, {
        subject: `Mix & master order — ${eng.name}`,
        labels: {
          engineer: "Engineer",
          package: "Package",
          stems: "Stems",
          tracks: "Tracks",
          estimate: "Estimate",
          artist: "Artist / project",
          name: "Name",
          email: "Email",
          phone: "Phone",
          files: "Files",
          notes: "Notes",
        },
      });
      setStatus(r.via === "api" ? "done" : "mail");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  if (status === "done" || status === "mail") {
    return (
      <div className={cn("flex flex-col gap-4 py-6", className)}>
        <span className="t-label flex items-center gap-2 text-muted">
          <span className="rec-dot" /> {status === "done" ? "Order received" : "Opening your email app"}
        </span>
        <p className="t-l">{status === "done" ? "We’re on it." : "Almost there."}</p>
        <p className="t-body max-w-md text-muted">
          {status === "done"
            ? "Thanks — we’ll confirm your quote, turnaround and payment details by email."
            : `We’ve drafted your order email — just press send. If nothing opened, write to ${formInbox.mix}.`}
        </p>
        <button className="t-label u-draw self-start" onClick={() => setStatus("idle")}>
          Place another order
        </button>
      </div>
    );
  }

  const chip = (on: boolean) => cn("t-label border px-3 py-2 transition-colors duration-300", on ? "border-fg bg-fg text-bg" : "border-line hover:border-fg");

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-7", className)}>
      <Honeypot />
      <fieldset>
        <legend className="t-label mb-3 text-muted">Engineer</legend>
        <div className="flex flex-wrap gap-2">
          {engineers.map((e) => (
            <button key={e.slug} type="button" aria-pressed={engineer === e.slug} onClick={() => setEngineer(e.slug)} className={chip(engineer === e.slug)}>
              {e.name} <span className="opacity-60">· {e.badge}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="t-label mb-3 text-muted">Package</legend>
        <div className="flex flex-wrap gap-2">
          {PACKAGES.map((p) => (
            <button key={p} type="button" aria-pressed={pkg === p} onClick={() => choosePkg(p)} className={chip(pkg === p)}>
              {p}
            </button>
          ))}
        </div>
      </fieldset>

      {!spotlight && (
        <div className="grid gap-6 sm:grid-cols-2">
          <fieldset>
            <legend className="t-label mb-3 text-muted">Stems per track</legend>
            <div className="flex flex-wrap gap-2">
              {STEMS.map((s) => (
                <button key={s} type="button" aria-pressed={stems === s} onClick={() => setStems(s)} className={chip(stems === s)}>
                  {s}
                </button>
              ))}
            </div>
            <p className="t-label mt-2 text-muted">13–24 stems: +{aud(mixRates.bigSession)} per track</p>
          </fieldset>
          <fieldset>
            <legend className="t-label mb-3 text-muted">Tracks</legend>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setTracks((t) => Math.max(step, t - step))} className={chip(false)} aria-label="Fewer tracks">
                −
              </button>
              <span className="t-price w-10 text-center text-xl" aria-live="polite">
                {tracks}
              </span>
              <button type="button" onClick={() => setTracks((t) => Math.min(30, t + step))} className={chip(false)} aria-label="More tracks">
                +
              </button>
            </div>
            {deal && (
              <p className="t-label mt-2 text-muted">
                {tracks / 2} paid · {tracks / 2} free
              </p>
            )}
          </fieldset>
        </div>
      )}

      <div className="flex flex-col gap-2 border-y border-line py-4">
        <div className="flex items-end justify-between gap-4">
          <span className="t-label text-muted">Estimate</span>
          <span className="t-price text-[clamp(1.6rem,2.4vw,2.2rem)]">{est ? `from ${aud(est)}` : "Quote on request"}</span>
        </div>
        {dealEst !== null && (
          <button type="button" onClick={() => choosePkg("2 for 1 deal")} className="t-label u-draw self-end text-rec">
            Or {dealTracks} tracks for {aud(dealEst)} on the 2 for 1 deal →
          </button>
        )}
      </div>

      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <label className="block">
          <span className="t-label text-muted">Name *</span>
          <input name="name" required autoComplete="name" className="field" />
        </label>
        <label className="block">
          <span className="t-label text-muted">Email *</span>
          <input name="email" type="email" required autoComplete="email" className="field" />
        </label>
        <label className="block">
          <span className="t-label text-muted">Phone</span>
          <input name="phone" type="tel" autoComplete="tel" className="field" />
        </label>
        <label className="block">
          <span className="t-label text-muted">Artist / project</span>
          <input name="artist" className="field" />
        </label>
        <label className="block sm:col-span-2">
          <span className="t-label text-muted">Link to your files (optional)</span>
          <input name="files" type="url" placeholder="WeTransfer, Dropbox, Google Drive…" className="field" />
        </label>
        <label className="block sm:col-span-2">
          <span className="t-label text-muted">Notes</span>
          <textarea name="notes" rows={3} className="field" placeholder="References, deadline, anything we should know" />
        </label>
      </div>

      {status === "error" && <p className="t-label text-rec">{error}</p>}
      <button type="submit" disabled={status === "sending"} className="group relative flex items-center justify-between overflow-hidden bg-fg px-5 py-4 text-bg disabled:opacity-60">
        <span className="t-wide-s relative z-10">{status === "sending" ? "Sending…" : `Order with ${eng.name}`}</span>
        <Arrow className="relative z-10 transition-transform duration-500 group-hover:rotate-45" />
        <span className="absolute inset-0 origin-left scale-x-0 bg-rec transition-transform duration-500 ease-out group-hover:scale-x-100" />
      </button>
      <p className="t-label text-muted">No payment now — we confirm the quote, turnaround and payment link by email.</p>
    </form>
  );
}
