"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Close } from "@/components/ui/Icons";
import VuMeter from "@/components/ui/VuMeter";
import { gsap } from "@/lib/gsap";
import { spotifyTrackUrl, spotifyUri, type Track } from "@/lib/content/tracks";
import { cn, timecode } from "@/lib/utils";

// ── Spotify iFrame API types (the parts we use) ─────────────────
type PlaybackUpdate = { data: { isPaused: boolean; isBuffering: boolean; duration: number; position: number } };
type EmbedController = {
  loadUri: (uri: string) => void;
  play: () => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  destroy: () => void;
  addListener: (ev: "ready" | "playback_update", cb: (e: PlaybackUpdate) => void) => void;
};
type IFrameAPI = {
  createController: (el: HTMLElement, opts: { uri: string; width?: string | number; height?: string | number }, cb: (c: EmbedController) => void) => void;
};
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
    __spotifyApi?: IFrameAPI;
  }
}

type State = { track: Track | null; paused: boolean; position: number; duration: number };
type Ctx = State & { play: (t: Track) => void; toggle: () => void; close: () => void };

const PlayerContext = createContext<Ctx | null>(null);
export const usePlayer = () => {
  const c = useContext(PlayerContext);
  if (!c) throw new Error("usePlayer outside provider");
  return c;
};

let apiPromise: Promise<IFrameAPI> | null = null;
const loadApi = () => {
  if (window.__spotifyApi) return Promise.resolve(window.__spotifyApi);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    window.onSpotifyIframeApiReady = (api) => {
      window.__spotifyApi = api;
      resolve(api);
    };
    const s = document.createElement("script");
    s.src = "https://open.spotify.com/embed/iframe-api/v1";
    s.async = true;
    document.body.appendChild(s);
  });
  return apiPromise;
};

export default function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>({ track: null, paused: true, position: 0, duration: 0 });
  const controller = useRef<EmbedController | null>(null);
  const mount = useRef<HTMLDivElement>(null);
  const dock = useRef<HTMLDivElement>(null);
  const creating = useRef<Promise<EmbedController> | null>(null);

  const ensure = useCallback(async (uri: string) => {
    if (controller.current) return controller.current;
    if (creating.current) return creating.current;
    creating.current = loadApi().then(
      (api) =>
        new Promise<EmbedController>((resolve) => {
          const host = document.createElement("div");
          mount.current!.innerHTML = "";
          mount.current!.appendChild(host);
          api.createController(host, { uri, width: "100%", height: 80 }, (c) => {
            c.addListener("playback_update", (e) =>
              setState((s) => ({ ...s, paused: e.data.isPaused, position: e.data.position / 1000, duration: e.data.duration / 1000 })),
            );
            controller.current = c;
            resolve(c);
          });
        }),
    );
    return creating.current;
  }, []);

  const play = useCallback(
    async (t: Track) => {
      setState((s) => ({ ...s, track: t, paused: true, position: 0, duration: t.dur }));
      const uri = spotifyUri(t.id);
      const fresh = !controller.current;
      const c = await ensure(uri);
      if (!fresh) c.loadUri(uri);
      // Spotify needs a beat after loading before play() is honoured
      window.setTimeout(() => c.play(), fresh ? 700 : 350);
    },
    [ensure],
  );

  const toggle = useCallback(() => controller.current?.togglePlay(), []);
  const close = useCallback(() => {
    controller.current?.pause();
    setState((s) => ({ ...s, track: null, paused: true }));
  }, []);

  useEffect(() => {
    if (dock.current) gsap.set(dock.current, { yPercent: 130 });
  }, []);

  // dock in / out
  useEffect(() => {
    const el = dock.current;
    if (!el) return;
    gsap.to(el, { yPercent: state.track ? 0 : 130, autoAlpha: state.track ? 1 : 0, duration: 0.8, ease: "expo.out" });
  }, [state.track]);

  const progress = state.duration ? Math.min(1, state.position / state.duration) : 0;

  return (
    <PlayerContext.Provider value={{ ...state, play, toggle, close }}>
      {children}
      <div
        ref={dock}
        className="fixed bottom-3 left-3 right-3 z-150 sm:left-auto sm:right-5 sm:bottom-5 sm:w-[400px]"
        style={{ visibility: "hidden", opacity: 0 }}
        role="region"
        aria-label="Now playing"
      >
        <div className="border border-white/15 bg-[#070707] text-paper shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between gap-3 px-3 py-2.5 t-label">
            <span className="flex min-w-0 items-center gap-2.5">
              <VuMeter mode={state.paused ? "idle" : "play"} className="text-rec" />
              <span className={cn("shrink-0", state.paused ? "text-paper/50" : "text-paper")}>{state.paused ? "Paused" : "On air"}</span>
              <span className="truncate text-paper/50">{state.track ? `${state.track.title} — ${state.track.artists}` : ""}</span>
            </span>
            <span className="flex shrink-0 items-center gap-3">
              <span className="tabular-nums text-paper/50">{timecode(state.position).slice(3, 8)}</span>
              <button onClick={close} aria-label="Close player" className="grid h-6 w-6 place-items-center text-paper/70 hover:text-paper">
                <Close className="h-3 w-3" />
              </button>
            </span>
          </div>
          <div className="h-px bg-white/10">
            <div className="h-px origin-left bg-rec" style={{ transform: `scaleX(${progress})` }} />
          </div>
          <div ref={mount} className="h-[80px] bg-[#121212]" />
          <div className="flex items-center justify-between px-3 py-2 t-label text-paper/40">
            <span>Preview via Spotify</span>
            {state.track && (
              <a href={spotifyTrackUrl(state.track.id)} target="_blank" rel="noreferrer" className="u-draw text-paper/70">
                Open in Spotify ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </PlayerContext.Provider>
  );
}
