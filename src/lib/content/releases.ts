import feed from "./releases.generated.json";

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
  link: string; // Deezer
  apple?: string | null;
  cover: string; // /media/releases/<id>.jpg
};

export const releaseFeed = feed as { generatedAt: string; label: string; releases: Release[] };

/** Today in Burleigh Heads, as YYYY-MM-DD — the feed's dates are local release dates. */
const todayAU = () => new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Brisbane" });

export const upcomingReleases = () => releaseFeed.releases.filter((r) => r.releaseDate > todayAU());
export const latestReleases = (n = 8) => releaseFeed.releases.filter((r) => r.releaseDate <= todayAU()).slice(0, n);

export const releaseDateLabel = (r: Release, withYear = true) =>
  new Date(`${r.releaseDate}T00:00:00`).toLocaleDateString("en-AU", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) });
