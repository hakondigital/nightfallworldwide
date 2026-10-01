"use client";

import { useState } from "react";
import { Arrow } from "@/components/ui/Icons";
import { enquiryTopics, filmTopics } from "@/lib/content/forms";
import { site } from "@/lib/content/site";
import { endpoints, submitForm } from "@/lib/submit";
import { cn } from "@/lib/utils";

type Props = { defaultTopic?: string; topics?: string[]; className?: string; compact?: boolean };

export default function EnquiryForm({ defaultTopic, topics, className, compact }: Props) {
  const list = topics ?? (defaultTopic && filmTopics.includes(defaultTopic) ? filmTopics : enquiryTopics);
  const [topic, setTopic] = useState(defaultTopic ?? list[0]);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "mail" | "error">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      topic,
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    setStatus("sending");
    try {
      const r = await submitForm(endpoints.enquiry, data, {
        to: site.email.admin,
        subject: `Website enquiry — ${topic}`,
        labels: { topic: "Topic", name: "Name", email: "Email", phone: "Phone", message: "Message" },
      });
      setStatus(r.via === "api" ? "done" : "mail");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  if (status === "done" || status === "mail") {
    return (
      <div className={cn("flex flex-col gap-4 py-8", className)}>
        <span className="t-label text-muted">
          <span className="rec-dot mr-2 align-middle" />
          {status === "done" ? "Received" : "Opening your email app"}
        </span>
        <p className="t-l">{status === "done" ? "Signal received." : "Almost there."}</p>
        <p className="t-body max-w-md text-muted">
          {status === "done"
            ? "Thanks — the team will get back to you shortly."
            : `We’ve drafted the email for you. If nothing opened, write to ${site.email.admin}.`}
        </p>
        <button className="t-label u-draw self-start" onClick={() => setStatus("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-7", className)}>
      <fieldset>
        <legend className="t-label mb-3 text-muted">What’s it about?</legend>
        <div className="flex flex-wrap gap-2">
          {list.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTopic(t)}
              aria-pressed={topic === t}
              className={cn(
                "t-label border px-3 py-2 transition-colors duration-300",
                topic === t ? "border-fg bg-fg text-bg" : "border-line hover:border-fg",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>
      <div className={cn("grid gap-x-6 gap-y-5", !compact && "sm:grid-cols-2")}>
        <label className="block">
          <span className="t-label text-muted">Name *</span>
          <input name="name" required autoComplete="name" className="field" />
        </label>
        <label className="block">
          <span className="t-label text-muted">Email *</span>
          <input name="email" type="email" required autoComplete="email" className="field" />
        </label>
        <label className={cn("block", !compact && "sm:col-span-2")}>
          <span className="t-label text-muted">Phone</span>
          <input name="phone" type="tel" autoComplete="tel" className="field" />
        </label>
        <label className={cn("block", !compact && "sm:col-span-2")}>
          <span className="t-label text-muted">Message *</span>
          <textarea name="message" required rows={4} className="field" placeholder="Tell us about the project, dates, links…" />
        </label>
      </div>
      {status === "error" && <p className="t-label text-rec">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="group relative flex items-center justify-between overflow-hidden bg-fg px-5 py-4 text-bg disabled:opacity-60"
      >
        <span className="t-wide-s relative z-10">{status === "sending" ? "Transmitting…" : "Send enquiry"}</span>
        <Arrow className="relative z-10 transition-transform duration-500 group-hover:rotate-45" />
        <span className="absolute inset-0 origin-left scale-x-0 bg-rec transition-transform duration-500 ease-(--ease-out) group-hover:scale-x-100" />
      </button>
    </form>
  );
}
