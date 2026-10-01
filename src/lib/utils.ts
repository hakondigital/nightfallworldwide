import { clsx, type ClassValue } from "clsx";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const mapRange = (v: number, a: number, b: number, c = 0, d = 1) => clamp((v - a) / (b - a)) * (d - c) + c;

export const isExternal = (href: string) => /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

export const pad = (n: number, len = 2) => String(Math.floor(Math.abs(n))).padStart(len, "0");

/** SMPTE-ish timecode HH:MM:SS:FF at 25fps */
export const timecode = (seconds: number, fps = 25) => {
  const s = Math.max(0, seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const f = Math.floor((s % 1) * fps);
  return `${pad(h)}:${pad(m)}:${pad(sec)}:${pad(f)}`;
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches;
