import feed from "./releases.generated.json";
import { artists } from "./artists";
import { spotifyTrackUrl, tracks } from "./tracks";

/** One record from the label's catalogue, as written by scripts/sync-releases.mjs. */
export type Release = {
  id: number;
  title: string;
  artists: string[];
  artistId?: number;
  releaseDate: string; // YYYY-MM-DD
  recordType: string; // single | ep | album
  tracks: number;
  explicit: boolean;
  upc?: string;
  link: string; // Deezer — where the feed is read from; never where we send people
  spotify?: string | null; // the record on Spotify, when the sync could match it
  spotifyArtist?: string | null; // the main artist's Spotify profile, likewise
  apple?: string | null;
  cover: string; // /media/releases/<id>.jpg
};

export const releaseFeed = feed as { generatedAt: string; label: string; releases: Release[] };

/** Today in Burleigh Heads, as YYYY-MM-DD — the feed's dates are local release dates. */
const todayAU = () => new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Brisbane" });

export const upcomingReleases = () => releaseFeed.releases.filter((r) => r.releaseDate > todayAU());
export const latestReleases = (n = 8) => releaseFeed.releases.filter((r) => r.releaseDate <= todayAU()).slice(0, n);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Where a release opens: Spotify, always. The exact record when we have it (our
 * own catalogue, or the sync's match), else the artist's profile, else a Spotify
 * search for it — never the Deezer page the feed was read from.
 */
export const spotifyFor = (r: Release) => {
  const own = tracks.find((t) => norm(t.title) === norm(r.title) && r.artists.some((a) => norm(t.artists).includes(norm(a))));
  if (own) return spotifyTrackUrl(own.id);
  if (r.spotify) return r.spotify;
  if (r.spotifyArtist) return r.spotifyArtist;
  const known = artists.find((a) => r.artists.some((n) => norm(n) === norm(a.name) || (a.lineup && norm(n) === norm(a.lineup))));
  if (known?.spotify) return known.spotify;
  return `https://open.spotify.com/search/${encodeURIComponent([r.title, r.artists[0]].filter(Boolean).join(" "))}`;
};

export const releaseDateLabel = (r: Release, withYear = true) =>
  new Date(`${r.releaseDate}T00:00:00`).toLocaleDateString("en-AU", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) });
