import { formInbox, HONEYPOT, type FormKind } from "@/lib/content/forms";
import { mailto } from "@/lib/content/site";

export type SubmitResult = { via: "api" | "mail" };

/**
 * Send a form. It goes to the site's own `/api/send` route, which emails it to
 * the right Nightfall inbox through Resend (the inbox is picked server-side
 * from `kind`). If the route reports that sending isn't configured — or the
 * visitor is offline — we fall back to opening a pre-filled email in their
 * mail app, so the forms always lead somewhere.
 */
export async function submitForm(
  kind: FormKind,
  data: Record<string, string>,
  opts: { subject: string; labels?: Record<string, string> },
): Promise<SubmitResult> {
  let res: Response | undefined;
  try {
    res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ kind, subject: opts.subject, data, labels: opts.labels }),
    });
  } catch {
    // network trouble — handled by the mail fallback below
  }
  if (res?.ok) return { via: "api" };
  if (res && res.status !== 503) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || "We couldn’t send that just now — please try again, or email us directly.");
  }

  const body = Object.entries(data)
    .filter(([k, v]) => k !== HONEYPOT && v && v.trim())
    .map(([k, v]) => `${opts.labels?.[k] ?? k}:\n${v}`)
    .join("\n\n");
  window.location.href = mailto(formInbox[kind], opts.subject, body);
  return { via: "mail" };
}
