import { mailto } from "@/lib/content/site";

// Formspree endpoints (e.g. https://formspree.io/f/xxxxxx). Leave unset and
// forms fall back to opening a pre-filled email to the right inbox.
const ENQUIRY = process.env.NEXT_PUBLIC_FORMSPREE_ENQUIRY; // admin@ — questions, contracts, briefs
const STUDIO = process.env.NEXT_PUBLIC_FORMSPREE_STUDIO ?? ENQUIRY; // studio@ — bookings
export const endpoints = {
  enquiry: ENQUIRY,
  studio: STUDIO,
  mix: process.env.NEXT_PUBLIC_FORMSPREE_MIX ?? STUDIO,
  upload: process.env.NEXT_PUBLIC_FORMSPREE_UPLOAD,
} as const;

export type SubmitResult = { via: "api" | "mail" };

export async function submitForm(
  endpoint: string | undefined,
  data: Record<string, string>,
  fallback: { to: string; subject: string; labels?: Record<string, string> },
): Promise<SubmitResult> {
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...data, _subject: fallback.subject }),
    });
    if (!res.ok) throw new Error("We couldn’t send that just now — please try again, or email us directly.");
    return { via: "api" };
  }
  const body = Object.entries(data)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${fallback.labels?.[k] ?? k}:\n${v}`)
    .join("\n\n");
  window.location.href = mailto(fallback.to, fallback.subject, body);
  return { via: "mail" };
}
