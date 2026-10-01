"use client";

import { useRef, useState } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";
import { Arrow } from "@/components/ui/Icons";
import type { Field, FormDef } from "@/lib/content/forms";
import { submitForm } from "@/lib/submit";
import { cn } from "@/lib/utils";

type Values = Record<string, string | string[]>;

const isEmpty = (v: string | string[] | undefined) => (Array.isArray(v) ? v.length === 0 : !v || !v.trim());
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const urlOk = (v: string) => /^(https?:\/\/)?[\w-]+(\.[\w-]+)+\S*$/i.test(v);

function validate(fields: Field[], values: Values) {
  const errs: Record<string, string> = {};
  for (const f of fields) {
    const v = values[f.name];
    if (f.required && isEmpty(v)) errs[f.name] = "Required";
    else if (typeof v === "string" && v.trim()) {
      if (f.type === "email" && !emailOk(v)) errs[f.name] = "Check the email address";
      if (f.type === "url" && !urlOk(v)) errs[f.name] = "Check the link";
    }
  }
  return errs;
}

export default function FormStepper({ def, endpoint }: { def: FormDef; endpoint?: string }) {
  const lenis = useLenis();
  const top = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "mail" | "error">("idle");
  const [error, setError] = useState("");

  const steps = def.steps;
  const reviewing = step === steps.length;
  const labels = Object.fromEntries(steps.flatMap((s) => s.fields.map((f) => [f.name, f.label])));

  const set = (name: string, v: string | string[]) => {
    setValues((s) => ({ ...s, [name]: v }));
    setErrors((e) => {
      if (!e[name]) return e;
      const n = { ...e };
      delete n[name];
      return n;
    });
  };

  const go = (to: number) => {
    setStep(to);
    if (top.current) lenis?.scrollTo(top.current, { offset: -110, duration: 1 });
  };

  const next = () => {
    const errs = validate(steps[step].fields, values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    go(step + 1);
  };

  const send = async () => {
    setStatus("sending");
    const data = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : v]));
    try {
      const r = await submitForm(endpoint, data, { to: def.to, subject: `${def.subject} — ${data.release_title || data.track_name || data.artist_name || data.main_artist || ""}`, labels });
      setStatus(r.via === "api" ? "done" : "mail");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  };

  if (status === "done" || status === "mail") {
    return (
      <div className="flex flex-col gap-5 border border-line p-6 sm:p-10">
        <span className="t-label flex items-center gap-2 text-muted">
          <span className="rec-dot" /> {status === "done" ? "Received" : "Opening your email app"}
        </span>
        <p className="t-xl">{status === "done" ? "Locked in." : "One last step."}</p>
        <p className="t-body max-w-[52ch] text-muted">
          {status === "done"
            ? `Thanks — the Nightfall team has your ${def.title.toLowerCase()}. We'll be in touch at the email you provided.`
            : `We've drafted an email with everything you entered — just hit send. If nothing opened, email ${def.to}.`}
        </p>
      </div>
    );
  }

  return (
    <div ref={top} className="grid-12 gap-y-10">
      {/* step rail */}
      <aside className="col-span-12 md:col-span-3">
        <div className="flex flex-col gap-4 md:sticky md:top-[calc(var(--header-h)+24px)]">
          <div className="h-px w-full bg-line">
            <div className="h-px origin-left bg-rec transition-transform duration-700 ease-(--ease-out)" style={{ transform: `scaleX(${step / steps.length})` }} />
          </div>
          <ol className="flex gap-2 overflow-x-auto md:flex-col md:gap-0">
            {[...steps.map((s) => s.title), "Review"].map((t, i) => (
              <li key={t} className="shrink-0">
                <button
                  onClick={() => i < step && go(i)}
                  disabled={i > step}
                  className={cn(
                    "t-label flex w-full items-center gap-3 border-line py-2 text-left md:border-b",
                    i === step ? "text-fg" : i < step ? "text-muted hover:text-fg" : "text-faint",
                  )}
                >
                  <span className={cn("grid h-5 w-5 place-items-center border text-[10px]", i === step ? "border-fg bg-fg text-bg" : "border-line")}>
                    {i < step ? "✓" : i + 1}
                  </span>
                  {t}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </aside>

      <div className="col-span-12 md:col-span-8 md:col-start-5">
        {!reviewing ? (
          <div className="flex flex-col gap-8">
            <div>
              <p className="t-label text-muted">
                Step {step + 1} of {steps.length}
              </p>
              <h2 className="t-l mt-2">{steps[step].title}</h2>
              {steps[step].intro && <p className="t-body mt-3 max-w-[60ch] text-muted">{steps[step].intro}</p>}
            </div>
            <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
              {steps[step].fields.map((f) => (
                <FieldInput key={f.name} field={f} value={values[f.name]} error={errors[f.name]} onChange={(v) => set(f.name, v)} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div>
              <p className="t-label text-muted">Final check</p>
              <h2 className="t-l mt-2">Review & send</h2>
            </div>
            {steps.map((s, si) => (
              <div key={s.title} className="border-t border-line pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="t-wide-s">{s.title}</span>
                  <button onClick={() => go(si)} className="t-label u-draw text-muted">
                    Edit
                  </button>
                </div>
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {s.fields.map((f) => {
                    const v = values[f.name];
                    return (
                      <div key={f.name} className={cn(f.type === "textarea" && "sm:col-span-2")}>
                        <dt className="t-label text-muted">{f.label}</dt>
                        <dd className="t-body mt-0.5 whitespace-pre-wrap break-words">{isEmpty(v) ? "—" : Array.isArray(v) ? v.join(", ") : v}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            ))}
            {status === "error" && <p className="t-label text-rec">{error}</p>}
          </div>
        )}

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
          <button onClick={() => go(Math.max(0, step - 1))} disabled={step === 0} className="t-label u-draw disabled:opacity-30">
            ← Back
          </button>
          {!reviewing ? (
            <button onClick={next} className="group t-wide-s relative flex items-center gap-4 overflow-hidden bg-fg px-6 py-4 text-bg">
              <span className="relative z-10">{step === steps.length - 1 ? "Review" : "Next"}</span>
              <Arrow dir="e" className="relative z-10 transition-transform duration-500 group-hover:translate-x-1" />
              <span className="absolute inset-0 origin-left scale-x-0 bg-rec transition-transform duration-500 ease-(--ease-out) group-hover:scale-x-100" />
            </button>
          ) : (
            <button onClick={send} disabled={status === "sending"} className="group t-wide-s relative flex items-center gap-4 overflow-hidden bg-rec px-6 py-4 text-white disabled:opacity-60">
              <span className="rec-dot bg-white" />
              {status === "sending" ? "Transmitting…" : "Send"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldInput({ field: f, value, error, onChange }: { field: Field; value: string | string[] | undefined; error?: string; onChange: (v: string | string[]) => void }) {
  const wide = !f.half || f.type === "textarea" || f.type === "multi";
  const label = (
    <span className="t-label flex justify-between gap-3 text-muted">
      <span>
        {f.label}
        {f.required && <span className="text-rec"> *</span>}
      </span>
      {error && <span className="text-rec">{error}</span>}
    </span>
  );
  const hint = f.hint && <span className="t-body mt-2 block text-[0.88rem] leading-snug text-faint">{f.hint}</span>;

  if (f.type === "choice" || f.type === "multi") {
    const arr = Array.isArray(value) ? value : value ? [value] : [];
    return (
      <fieldset className={cn(wide && "sm:col-span-2")}>
        <legend className="mb-3 w-full">{label}</legend>
        <div className="flex flex-wrap gap-2">
          {f.options?.map((o) => {
            const on = arr.includes(o);
            return (
              <button
                key={o}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  if (f.type === "choice") return onChange(on ? "" : o);
                  const nextArr = on ? arr.filter((x) => x !== o) : f.max && arr.length >= f.max ? [...arr.slice(1), o] : [...arr, o];
                  onChange(nextArr);
                }}
                className={cn("t-label border px-3 py-2 transition-colors duration-300", on ? "border-fg bg-fg text-bg" : "border-line hover:border-fg")}
              >
                {o}
              </button>
            );
          })}
        </div>
        {f.max && <span className="t-label mt-2 block text-faint">Up to {f.max}</span>}
        {hint}
      </fieldset>
    );
  }

  const common = {
    id: f.name,
    name: f.name,
    value: typeof value === "string" ? value : "",
    placeholder: f.placeholder,
    "aria-invalid": !!error,
    className: cn("field", error && "border-rec"),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
  };

  return (
    <label htmlFor={f.name} className={cn("block", wide && "sm:col-span-2")}>
      {label}
      {f.type === "textarea" ? <textarea rows={4} {...common} /> : <input type={f.type} {...common} />}
      {hint}
    </label>
  );
}
