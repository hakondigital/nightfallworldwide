"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { scrollState } from "@/components/providers/SmoothScroll";
import { cn, clamp, lerp } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// The Nightfall globe — the wireframe logo, alive.
// Orthographic projection on a 2D canvas: tilted orbits, the
// Australia silhouette, and signal arcs from the Gold Coast out to
// the cities the collective works with.
// ─────────────────────────────────────────────────────────────

type V3 = [number, number, number];
const D = Math.PI / 180;

// Mainland outline (lat, lon) — from Cape York, round the Gulf, west, south, and back up the east coast.
const AUSTRALIA: [number, number][] = [
  [-10.69, 142.53], [-11.1, 142.2], [-12.0, 141.9], [-12.6, 141.6], [-13.5, 141.5], [-14.5, 141.55], [-15.6, 141.4],
  [-16.5, 141.1], [-17.3, 140.8], [-17.6, 140.1], [-17.7, 139.4], [-17.2, 138.9], [-16.8, 138.3], [-16.4, 137.6],
  [-15.9, 137.0], [-15.4, 136.6], [-15.0, 135.9], [-14.6, 135.6], [-14.2, 135.8], [-13.8, 135.9], [-13.3, 136.1],
  [-12.8, 136.6], [-12.25, 136.95], [-11.9, 136.5], [-12.0, 135.8], [-12.2, 135.1], [-11.95, 134.3], [-12.1, 133.6],
  [-11.7, 132.9], [-11.4, 132.2], [-11.6, 131.5], [-12.2, 131.0], [-12.45, 130.84], [-12.8, 130.3], [-13.3, 130.1],
  [-14.0, 129.6], [-14.7, 129.5], [-15.1, 129.0], [-14.8, 128.4], [-14.9, 128.0], [-14.3, 127.6], [-14.0, 127.0],
  [-13.8, 126.4], [-14.1, 125.9], [-14.5, 125.4], [-15.1, 124.9], [-15.6, 124.4], [-16.1, 123.8], [-16.5, 123.2],
  [-17.2, 123.6], [-17.4, 122.9], [-17.95, 122.2], [-18.5, 121.8], [-19.2, 121.3], [-19.9, 120.2], [-20.3, 119.2],
  [-20.3, 118.6], [-20.6, 117.4], [-20.8, 116.7], [-21.4, 115.5], [-21.8, 114.8], [-22.4, 114.2], [-21.8, 114.1],
  [-22.3, 113.7], [-23.2, 113.8], [-24.0, 113.4], [-24.9, 113.6], [-25.7, 113.3], [-26.2, 113.7], [-26.6, 113.5],
  [-27.4, 113.9], [-28.0, 114.1], [-28.8, 114.6], [-29.7, 114.95], [-30.6, 115.1], [-31.4, 115.5], [-31.95, 115.75],
  [-32.6, 115.65], [-33.3, 115.6], [-33.55, 115.0], [-34.0, 115.0], [-34.35, 115.15], [-34.9, 116.0], [-35.05, 117.0],
  [-34.95, 117.9], [-34.4, 118.9], [-33.95, 119.9], [-33.9, 121.0], [-33.85, 121.9], [-33.6, 123.3], [-32.9, 124.0],
  [-32.3, 125.5], [-31.9, 126.9], [-31.7, 128.9], [-31.6, 130.4], [-31.55, 131.2], [-31.95, 132.3], [-32.2, 133.4],
  [-32.8, 134.1], [-33.3, 134.5], [-33.9, 135.1], [-34.7, 135.4], [-34.85, 136.0], [-34.2, 136.3], [-33.6, 136.9],
  [-33.0, 137.5], [-32.5, 137.8], [-33.1, 137.9], [-33.9, 137.6], [-34.9, 137.4], [-35.25, 136.9], [-35.0, 137.8],
  [-34.2, 138.1], [-34.93, 138.5], [-35.6, 138.1], [-35.6, 138.9], [-35.9, 139.4], [-36.7, 139.8], [-37.5, 140.0],
  [-38.05, 140.75], [-38.3, 141.6], [-38.4, 142.5], [-38.65, 143.2], [-38.85, 143.55], [-38.4, 144.2], [-38.3, 144.65],
  [-38.5, 145.1], [-38.7, 145.8], [-39.15, 146.4], [-38.7, 146.8], [-38.2, 147.6], [-37.85, 148.4], [-37.8, 149.2],
  [-37.5, 149.95], [-36.9, 149.95], [-36.2, 150.1], [-35.7, 150.2], [-35.1, 150.75], [-34.5, 150.9], [-33.9, 151.25],
  [-33.4, 151.45], [-32.9, 151.8], [-32.5, 152.5], [-31.9, 152.7], [-31.45, 152.95], [-30.9, 153.05], [-30.3, 153.15],
  [-29.45, 153.35], [-28.64, 153.64], [-28.17, 153.55], [-27.95, 153.43], [-27.4, 153.4], [-26.8, 153.15], [-26.4, 153.1],
  [-25.9, 153.1], [-25.3, 152.9], [-24.9, 152.4], [-24.2, 151.8], [-23.85, 151.3], [-23.4, 150.9], [-22.7, 150.6],
  [-22.2, 150.0], [-21.7, 149.5], [-21.14, 149.2], [-20.6, 148.8], [-20.3, 148.7], [-20.0, 148.2], [-19.6, 147.6],
  [-19.25, 146.8], [-18.7, 146.3], [-18.2, 146.0], [-17.6, 146.1], [-16.9, 145.75], [-16.4, 145.4], [-15.5, 145.25],
  [-14.8, 145.0], [-14.5, 144.6], [-14.25, 144.3], [-14.05, 143.7], [-13.6, 143.5], [-12.9, 143.35], [-12.3, 143.1],
  [-11.6, 142.9], [-11.0, 142.75],
];
const TASMANIA: [number, number][] = [
  [-40.75, 144.7], [-40.9, 145.3], [-41.1, 146.0], [-41.05, 146.8], [-40.85, 147.5], [-40.95, 148.3], [-41.6, 148.3],
  [-42.2, 148.1], [-42.8, 147.95], [-43.15, 147.9], [-43.55, 147.1], [-43.6, 146.6], [-43.35, 146.0], [-42.7, 145.5],
  [-42.2, 145.25], [-41.5, 144.8],
];

export type City = { name: string; sub?: string; lat: number; lon: number; hq?: boolean };

export const CITIES: City[] = [
  { name: "Gold Coast", sub: "HQ · Ribby247", lat: -28.09, lon: 153.45, hq: true },
  { name: "Sydney", sub: "4orttune · Jords · DON!", lat: -33.87, lon: 151.21 },
  { name: "Bali", sub: "MEZMURE", lat: -8.65, lon: 115.22 },
  { name: "Kinshasa, DRC", sub: "Kily Safari", lat: -4.32, lon: 15.31 },
  { name: "London", sub: "Gorillaz", lat: 51.51, lon: -0.13 },
  { name: "New York", sub: "Mike Snell", lat: 40.71, lon: -74.01 },
  { name: "Los Angeles", sub: "Doechii", lat: 34.05, lon: -118.24 },
];

const fromLatLon = (lat: number, lon: number): V3 => {
  const la = lat * D;
  const lo = lon * D;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
};
const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

type Ring = { u: V3; v: V3; c: V3; r: number };

// Orbits echo the hand-drawn logo: three meridians, two parallels, two tilted rings.
const ring = (normal: V3, c: V3 = [0, 0, 0], r = 1): Ring => {
  const n = norm(normal);
  const helper: V3 = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const u = norm(cross(n, helper));
  const v = norm(cross(n, u));
  return { u, v, c, r };
};
const RINGS: Ring[] = [
  ring([1, 0, 0]),
  ring([Math.cos(58 * D), 0, -Math.sin(58 * D)]),
  ring([Math.cos(118 * D), 0, -Math.sin(118 * D)]),
  ring([0, 1, 0], [0, Math.sin(32 * D), 0], Math.cos(32 * D) * 1.015),
  ring([0, 1, 0], [0, Math.sin(-18 * D), 0], Math.cos(-18 * D)),
  ring([0.35, 0.82, 0.45]),
  ring([-0.55, 0.62, 0.3], [0, 0, 0], 1.03),
];

export type GlobeHandle = {
  /** 0 = free spin, 1 = locked onto the Gold Coast */
  setFocus: (v: number) => void;
  setZoom: (v: number) => void;
  setOffsetY: (v: number) => void;
  setOpacity: (v: number) => void;
  /** restart the draw-in intro */
  replay: () => void;
};

type Props = {
  className?: string;
  /** colour source: live theme foreground, or fixed paper/ink */
  tone?: "fg" | "paper" | "ink";
  weight?: number; // stroke weight multiplier
  radius?: number; // fraction of min(w,h)
  cities?: boolean;
  arcs?: boolean;
  depth?: boolean;
  interactive?: boolean;
  speed?: number; // deg / s
  active?: boolean;
  labelFont?: string;
};

const parseColor = (s: string): [number, number, number] => {
  const c = s.trim();
  if (c.startsWith("#")) {
    const h = c.length === 4 ? c.replace(/#(.)(.)(.)/, "#$1$1$2$2$3$3") : c;
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }
  const m = c.match(/[\d.]+/g);
  return m ? [+m[0], +m[1], +m[2]] : [10, 10, 10];
};

const Globe = forwardRef<GlobeHandle, Props>(function Globe(
  {
    className,
    tone = "fg",
    weight = 1,
    radius = 0.42,
    cities = false,
    arcs = false,
    depth = true,
    interactive = false,
    speed = 9,
    active = true,
    labelFont,
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const params = useRef({ focus: 0, zoom: 1, offsetY: 0, opacity: 1 });
  const activeRef = useRef(active);
  const bornRef = useRef(0);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useImperativeHandle(ref, () => ({
    setFocus: (v) => void (params.current.focus = clamp(v)),
    setZoom: (v) => void (params.current.zoom = v),
    setOffsetY: (v) => void (params.current.offsetY = v),
    setOpacity: (v) => void (params.current.opacity = clamp(v)),
    replay: () => void (bornRef.current = performance.now()),
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let visible = true;
    let raf = 0;
    let last = performance.now();
    let yaw = -120 * D;
    let yawVel = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    if (!bornRef.current) bornRef.current = performance.now();

    const root = document.documentElement;
    const readTone = () =>
      parseColor(
        tone === "paper" ? "#f3f3f0" : tone === "ink" ? "#0a0a0a" : getComputedStyle(root).getPropertyValue("--fg") || "#0a0a0a",
      );
    const readBg = () =>
      parseColor(
        tone === "paper" ? "#0a0a0a" : tone === "ink" ? "#f3f3f0" : getComputedStyle(root).getPropertyValue("--bg") || "#f3f3f0",
      );
    let col = readTone();
    let target = col;
    let bg = readBg();
    let bgTarget = bg;
    const rec: [number, number, number] = [255, 59, 20];
    const themeObs = new MutationObserver(() => {
      target = readTone();
      bgTarget = readBg();
    });
    if (tone === "fg") themeObs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    const fontFamily =
      labelFont ??
      (getComputedStyle(root).getPropertyValue("--font-fragment").trim() || "ui-monospace, monospace");

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(rect.width * dpr));
      h = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (interactive) window.addEventListener("pointermove", onMove, { passive: true });

    const rgba = (c: [number, number, number], a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || !activeRef.current || document.hidden) return;

      // colour easing between themes
      col = [lerp(col[0], target[0], 0.08), lerp(col[1], target[1], 0.08), lerp(col[2], target[2], 0.08)];
      bg = [lerp(bg[0], bgTarget[0], 0.08), lerp(bg[1], bgTarget[1], 0.08), lerp(bg[2], bgTarget[2], 0.08)];

      const p = params.current;
      // spin — scroll velocity kicks the globe like a record
      yawVel = lerp(yawVel, clamp(scrollState.velocity * 0.35, -40, 40), 0.06);
      if (!reduced) yaw += (speed + yawVel) * D * dt * (1 - p.focus);
      mouse.x = lerp(mouse.x, mouse.tx, 0.05);
      mouse.y = lerp(mouse.y, mouse.ty, 0.05);

      const f = p.focus;
      const ease = f * f * (3 - 2 * f);
      const focusYaw = -CITIES[0].lon * D;
      // unwrap yaw so the focus lerp takes the short way round
      const dy = Math.atan2(Math.sin(focusYaw - yaw), Math.cos(focusYaw - yaw));
      const Y = yaw + dy * ease + mouse.x * 0.35 * (1 - ease);
      const P = lerp(-14 * D + mouse.y * 0.22, CITIES[0].lat * D, ease);
      const Rl = lerp(-21 * D, 0, ease);

      const cy = Math.cos(Y), sy = Math.sin(Y);
      const cp = Math.cos(P), sp = Math.sin(P);
      const cr = Math.cos(Rl), sr = Math.sin(Rl);

      const R = Math.min(w, h) * radius * p.zoom;
      const cx0 = w / 2;
      const cy0 = h / 2 + p.offsetY * h;

      const rot = (v: V3): V3 => {
        const x1 = v[0] * cy + v[2] * sy;
        const z1 = -v[0] * sy + v[2] * cy;
        const y2 = v[1] * cp - z1 * sp;
        const z2 = v[1] * sp + z1 * cp;
        const x3 = x1 * cr - y2 * sr;
        const y3 = x1 * sr + y2 * cr;
        return [x3, y3, z2];
      };
      const sx = (v: V3) => cx0 + v[0] * R;
      const syy = (v: V3) => cy0 - v[1] * R;

      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = p.opacity;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const born = bornRef.current;
      const lw = Math.max(1.1 * dpr, Math.min(w, h) * radius * 0.0165 * weight * Math.sqrt(p.zoom));

      // intro: rings draw themselves in
      const intro = reduced ? 1 : clamp((now - born) / 1600);
      const introE = 1 - Math.pow(1 - intro, 3);

      // ── orbits ────────────────────────────────────────────
      const N = 132;
      RINGS.forEach((rg, ri) => {
        const reveal = clamp(introE * 1.35 - ri * 0.05);
        const steps = Math.max(2, Math.floor(N * reveal));
        let prev: V3 | null = null;
        let prevFront = true;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const t = (i / N) * Math.PI * 2 + ri;
          const c = Math.cos(t) * rg.r, s = Math.sin(t) * rg.r;
          const pt: V3 = rot([rg.c[0] + rg.u[0] * c + rg.v[0] * s, rg.c[1] + rg.u[1] * c + rg.v[1] * s, rg.c[2] + rg.u[2] * c + rg.v[2] * s]);
          const front = pt[2] >= -0.02;
          if (!prev || front !== prevFront) {
            if (prev) {
              ctx.strokeStyle = rgba(col, depth && !prevFront ? 0.2 : 1);
              ctx.lineWidth = depth && !prevFront ? lw * 0.55 : lw;
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(sx(prev), syy(prev));
            } else ctx.moveTo(sx(pt), syy(pt));
          }
          ctx.lineTo(sx(pt), syy(pt));
          prev = pt;
          prevFront = front;
        }
        ctx.strokeStyle = rgba(col, depth && !prevFront ? 0.2 : 1);
        ctx.lineWidth = depth && !prevFront ? lw * 0.55 : lw;
        ctx.stroke();
      });

      // ── landmass ─────────────────────────────────────────
      const land = (poly: [number, number][]) => {
        const pts = poly.map(([la, lo]) => rot(fromLatLon(la, lo)));
        const zc = pts.reduce((a, q) => a + q[2], 0) / pts.length;
        const a = clamp((zc - 0.05) / 0.35) * introE;
        if (a <= 0.01) return;
        ctx.beginPath();
        pts.forEach((q, i) => (i ? ctx.lineTo(sx(q), syy(q)) : ctx.moveTo(sx(q), syy(q))));
        ctx.closePath();
        ctx.fillStyle = rgba(col, a);
        ctx.fill();
      };
      land(AUSTRALIA);
      land(TASMANIA);

      // ── arcs + cities ────────────────────────────────────
      if (arcs || cities) {
        const hq = fromLatLon(CITIES[0].lat, CITIES[0].lon);
        const t = now / 1000;
        CITIES.slice(1).forEach((c, ci) => {
          const to = fromLatLon(c.lat, c.lon);
          const omega = Math.acos(clamp(hq[0] * to[0] + hq[1] * to[1] + hq[2] * to[2], -1, 1));
          if (arcs) {
            const grow = reduced ? 1 : clamp((now - born - 900 - ci * 180) / 1400);
            const M = 64;
            const lift = 0.05 + 0.13 * (omega / Math.PI);
            ctx.setLineDash([lw * 1.2, lw * 1.6]);
            ctx.lineDashOffset = -t * 18 * dpr;
            ctx.lineWidth = Math.max(1 * dpr, lw * 0.5);
            ctx.strokeStyle = rgba(rec, 0.95);
            ctx.beginPath();
            let pen = false;
            for (let i = 0; i <= M * grow; i++) {
              const k = i / M;
              const s0 = Math.sin((1 - k) * omega) / Math.sin(omega);
              const s1 = Math.sin(k * omega) / Math.sin(omega);
              const e = 1 + lift * Math.sin(Math.PI * k);
              const q = rot([(hq[0] * s0 + to[0] * s1) * e, (hq[1] * s0 + to[1] * s1) * e, (hq[2] * s0 + to[2] * s1) * e]);
              const vis = q[2] > 0 || q[0] * q[0] + q[1] * q[1] > 1.0;
              if (vis) {
                if (pen) ctx.lineTo(sx(q), syy(q));
                else ctx.moveTo(sx(q), syy(q));
                pen = true;
              } else pen = false;
            }
            ctx.stroke();
            ctx.setLineDash([]);
          }
          if (cities) {
            const q = rot(to);
            if (q[2] > 0.08 && p.focus < 0.9) {
              const a = clamp((q[2] - 0.08) / 0.25) * introE * (1 - clamp(p.focus / 0.6));
              ctx.beginPath();
              ctx.arc(sx(q), syy(q), 2.6 * dpr, 0, Math.PI * 2);
              ctx.fillStyle = rgba(col, a);
              ctx.fill();
              ctx.lineWidth = 1.2 * dpr;
              ctx.strokeStyle = rgba(bg, a);
              ctx.stroke();
              // label with a knockout halo so it reads over land and lines
              ctx.font = `${10 * dpr}px ${fontFamily}`;
              ctx.lineWidth = 3.5 * dpr;
              ctx.strokeStyle = rgba(bg, a);
              const lx = sx(q) + 8 * dpr;
              const name = c.name.toUpperCase();
              ctx.strokeText(name, lx, syy(q) - 2 * dpr);
              ctx.fillStyle = rgba(col, a);
              ctx.fillText(name, lx, syy(q) - 2 * dpr);
              if (c.sub) {
                const sub = c.sub.toUpperCase();
                ctx.strokeText(sub, lx, syy(q) + 10 * dpr);
                ctx.fillStyle = rgba(col, a * 0.6);
                ctx.fillText(sub, lx, syy(q) + 10 * dpr);
              }
            }
          }
        });

        // HQ beacon
        const q = rot(hq);
        if (q[2] > 0) {
          const pulse = (t % 1.8) / 1.8;
          ctx.fillStyle = rgba(rec, 1);
          ctx.beginPath();
          ctx.arc(sx(q), syy(q), 3.4 * dpr, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = rgba(rec, (1 - pulse) * 0.8);
          ctx.lineWidth = 1.2 * dpr;
          ctx.beginPath();
          ctx.arc(sx(q), syy(q), (4 + pulse * 18) * dpr, 0, Math.PI * 2);
          ctx.stroke();
          // the home city gets a label too — same halo treatment, but set to the LEFT of the
          // beacon so it never collides with Sydney's label just below it
          if (cities && p.focus < 0.9) {
            const a = clamp((q[2] - 0.08) / 0.25) * introE * (1 - clamp(p.focus / 0.6));
            const home = CITIES[0];
            const lx = sx(q) - 9 * dpr;
            ctx.textAlign = "right";
            ctx.font = `${10 * dpr}px ${fontFamily}`;
            ctx.lineWidth = 3.5 * dpr;
            ctx.strokeStyle = rgba(bg, a);
            // stacked upward: Sydney's label sits one line below the beacon
            const name = home.name.toUpperCase();
            ctx.strokeText(name, lx, syy(q) - 14 * dpr);
            ctx.fillStyle = rgba(rec, a);
            ctx.fillText(name, lx, syy(q) - 14 * dpr);
            if (home.sub) {
              const sub = home.sub.toUpperCase();
              ctx.strokeText(sub, lx, syy(q) - 2 * dpr);
              ctx.fillStyle = rgba(col, a * 0.6);
              ctx.fillText(sub, lx, syy(q) - 2 * dpr);
            }
            ctx.textAlign = "left";
          }
        }
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      if (interactive) window.removeEventListener("pointermove", onMove);
    };
  }, [tone, weight, radius, cities, arcs, depth, interactive, speed, labelFont]);

  return <canvas ref={canvasRef} aria-hidden className={cn("h-full w-full", className)} />;
});

export default Globe;
