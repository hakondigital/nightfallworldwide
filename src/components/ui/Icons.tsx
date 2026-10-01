import { cn } from "@/lib/utils";

type P = { className?: string };

/** Hand-set arrow — a stroke, a head, nothing else. */
export function Arrow({ className, dir = "ne" }: P & { dir?: "ne" | "e" | "s" | "n" | "w" }) {
  const rot = { ne: -45, e: 0, s: 90, n: -90, w: 180 }[dir];
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("h-[0.8em] w-[0.8em]", className)} style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M2 12h19M13 4l8 8-8 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
    </svg>
  );
}

export function Plus({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("h-[0.8em] w-[0.8em]", className)}>
      <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

export function Play({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("h-[0.8em] w-[0.8em]", className)}>
      <path d="M6 3.5v17l14-8.5z" fill="currentColor" />
    </svg>
  );
}

export function Pause({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("h-[0.8em] w-[0.8em]", className)}>
      <path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor" />
    </svg>
  );
}

export function Close({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("h-[0.8em] w-[0.8em]", className)}>
      <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}

export function SpotifyGlyph({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("h-[1em] w-[1em]", className)}>
      <path
        fill="currentColor"
        d="M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21Zm4.82 15.14a.65.65 0 0 1-.9.22c-2.46-1.5-5.55-1.84-9.2-1.01a.65.65 0 1 1-.29-1.27c3.99-.91 7.42-.52 10.17 1.16.31.19.41.59.22.9Zm1.28-2.86a.82.82 0 0 1-1.12.27c-2.81-1.73-7.1-2.23-10.43-1.22a.82.82 0 1 1-.47-1.56c3.8-1.15 8.53-.59 11.75 1.39.38.24.5.74.27 1.12Zm.11-2.98C14.84 8.8 9.27 8.61 6.05 9.59a.98.98 0 1 1-.57-1.88c3.7-1.12 9.84-.9 13.72 1.4a.98.98 0 0 1-1 1.69Z"
      />
    </svg>
  );
}

export function InstagramGlyph({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("h-[1em] w-[1em]", className)}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
    </svg>
  );
}
