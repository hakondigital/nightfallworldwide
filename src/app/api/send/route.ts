import { formInbox, HONEYPOT, type FormKind } from "@/lib/content/forms";
import { site } from "@/lib/content/site";

// Form submissions → Resend → the right Nightfall inbox.
//
// One API key serves all three inboxes: which one a message lands in is decided
// here from `kind` (see `formInbox`), never by the browser, so the route can't
// be used to send mail anywhere else. Without RESEND_API_KEY the route answers
// 503 and the forms fall back to opening a pre-filled email (see `submitForm`).

const KINDS = Object.keys(formInbox) as FormKind[];
const MAX_BODY = 32_000; // characters of JSON
const MAX_FIELDS = 40;
const MAX_VALUE = 5_000; // characters per field
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const reply = (status: number, body: Record<string, unknown>) => Response.json(body, { status });
// Control characters never belong in mail headers or bodies; values keep their line breaks.
const oneLine = (s: string, max: number) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max);
const multiLine = (s: string, max: number) =>
  s.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max);
const ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ENTITIES[c]);
const FONT = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set — form fell back to mailto");
    return reply(503, { error: "Email sending isn’t set up on this site yet." });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) return reply(413, { error: "That’s too much text for one message — please shorten it." });
  let payload: { kind?: unknown; subject?: unknown; data?: unknown; labels?: unknown };
  try {
    payload = JSON.parse(raw);
  } catch {
    return reply(400, { error: "Bad request." });
  }

  const kind = KINDS.find((k) => k === payload.kind);
  if (!kind) return reply(400, { error: "Unknown form." });
  if (!payload.data || typeof payload.data !== "object" || Array.isArray(payload.data)) return reply(400, { error: "Bad request." });
  const labels: Record<string, unknown> = payload.labels && typeof payload.labels === "object" ? (payload.labels as Record<string, unknown>) : {};

  const rows: [string, string][] = [];
  let trapped = false;
  for (const [key, v] of Object.entries(payload.data).slice(0, MAX_FIELDS)) {
    if (typeof v !== "string") continue;
    const value = multiLine(v, MAX_VALUE);
    if (key === HONEYPOT) {
      if (value) trapped = true;
      continue;
    }
    // A blank answer stays in when the form labelled the question, so the email lists every question asked.
    if (!value && !(key in labels)) continue;
    rows.push([key, value]);
  }
  // The honeypot is a field people never see. Bots fill it in — thank them and drop it.
  if (trapped) return reply(200, { ok: true });
  if (!rows.some(([, v]) => v)) return reply(400, { error: "Nothing to send." });

  const label = (key: string) => {
    const l = labels[key];
    return typeof l === "string" && l.trim() ? oneLine(l, 80) : key;
  };
  const subject = oneLine(typeof payload.subject === "string" ? payload.subject : "", 150) || `Website form — ${kind}`;
  const replyTo = rows.find(([k, v]) => k === "email" && EMAIL.test(v))?.[1];
  const from = process.env.RESEND_FROM || `${site.name} <website@nightfallworldwide.com>`;
  const to = process.env.RESEND_TO_OVERRIDE || formInbox[kind];
  const host = site.url.replace(/^https?:\/\//, "");

  const text = rows.map(([k, v]) => `${label(k)}:\n${v || "—"}`).join("\n\n") + `\n\n—\nSent from the ${kind} form on ${host}`;
  const html =
    `<table style="border-collapse:collapse;font:15px/1.5 ${FONT}">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 20px 6px 0;color:#777;vertical-align:top;white-space:nowrap">${escapeHtml(label(k))}</td>` +
          `<td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v) || '<span style="color:#bbb">—</span>'}</td></tr>`,
      )
      .join("") +
    `</table><p style="margin-top:28px;font:13px ${FONT};color:#999">Sent from the ${kind} form on <a href="${site.url}" style="color:#999">${host}</a></p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: replyTo, subject, text, html, tags: [{ name: "form", value: kind }] }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { message?: string } | null;
    console.error(`resend ${res.status}: ${err?.message ?? "unknown error"}`);
    return reply(502, { error: "We couldn’t send that just now — please try again, or email us directly." });
  }
  return reply(200, { ok: true });
}
