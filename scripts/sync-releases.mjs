// Latest releases, straight from the label's catalogue.
//
// Every release Nightfall distributes reaches Deezer tagged with the label
// name, and Deezer's catalogue API is public (no key, no login). So this
// script searches by label, keeps the newest releases plus anything with a
// future date, saves their covers, and writes a small feed the Music page
// reads at build time. No artist list to maintain: new signings show up on
// their own.
//
// Deezer is only where we *read* the catalogue — the site sends listeners to
// Spotify. So each release is also matched to its Spotify album and main
// artist by barcode, through Spotify's Web API, whenever the script has a
// Spotify app's credentials (SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET — free
// at developer.spotify.com, see .env.example). Without them the site falls
// back to the artist's Spotify profile or a Spotify search for the record.
// Apple Music links come from Apple's free barcode lookup.
//
// Run by .github/workflows/sync-releases.yml every six hours (or locally with
// `npm run releases`). It only rewrites the feed when the releases change, so
// a quiet run commits nothing and triggers no deploy.

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const LABEL = "Nightfall Worldwide";
const LATEST_COUNT = 8;
const CACHE = "data/releases-cache.json"; // every album we've looked at, keyed by Deezer id
const OUT = "src/lib/content/releases.generated.json"; // what the site reads
const COVERS = "public/media/releases";

try {
  process.loadEnvFile(".env");
} catch {
  // no .env — fine, the credentials are optional
}
const SPOTIFY =
  process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET
    ? { id: process.env.SPOTIFY_CLIENT_ID, secret: process.env.SPOTIFY_CLIENT_SECRET }
    : null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => (s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Deezer's public API, politely: ~8 requests a second, back off on quota errors. */
async function deezer(pathname, attempt = 0) {
  const res = await fetch("https://api.deezer.com" + pathname);
  const json = await res.json();
  if (json.error) {
    if (json.error.code === 4 && attempt < 5) {
      await sleep(5000);
      return deezer(pathname, attempt + 1);
    }
    throw new Error(`Deezer ${pathname}: ${json.error.message}`);
  }
  await sleep(120);
  return json;
}

async function searchLabel() {
  const ids = [];
  for (let index = 0; index < 5000; index += 100) {
    const page = await deezer(`/search/album?q=${encodeURIComponent(`label:"${LABEL}"`)}&limit=100&index=${index}`);
    for (const a of page.data ?? []) ids.push(a.id);
    if (!page.next) break;
  }
  return [...new Set(ids)];
}

// The search is fuzzy, so confirm the label on the album itself.
const isOurs = (label) => (label ?? "").toLowerCase().replace(/\s+/g, " ").trim().startsWith("nightfall worldwide");

async function album(id) {
  const a = await deezer(`/album/${id}`);
  const main = (a.contributors ?? []).filter((c) => c.role === "Main");
  return {
    id: a.id,
    title: a.title,
    artists: (main.length ? main : [a.artist]).map((c) => c.name),
    artistId: a.artist?.id,
    releaseDate: a.release_date,
    recordType: a.record_type,
    tracks: a.nb_tracks,
    explicit: Boolean(a.explicit_lyrics),
    label: a.label,
    upc: a.upc,
    link: a.link,
    cover: a.cover_big,
    isOurs: isOurs(a.label),
  };
}

/** Apple's catalogue lookup is also public — gives us an Apple Music link by barcode. */
async function appleLink(upc) {
  try {
    const res = await fetch(`https://itunes.apple.com/lookup?upc=${upc}&country=AU`);
    const json = await res.json();
    return json.results?.[0]?.collectionViewUrl ?? null;
  } catch {
    return null;
  }
}

// ── Spotify (optional) ──────────────────────────────────────────
let spotifyToken;

/** Client-credentials token — no user login, just the app's id and secret. */
async function spotifyAuth() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${SPOTIFY.id}:${SPOTIFY.secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`Spotify auth failed (${res.status}) — check SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET`);
  spotifyToken = (await res.json()).access_token;
}

async function spotifySearch(q, attempt = 0) {
  if (!spotifyToken) await spotifyAuth();
  const res = await fetch(`https://api.spotify.com/v1/search?type=album&limit=5&q=${encodeURIComponent(q)}`, {
    headers: { Authorization: `Bearer ${spotifyToken}` },
  });
  if (res.status === 429 && attempt < 3) {
    await sleep((Number(res.headers.get("retry-after")) || 5) * 1000 + 500);
    return spotifySearch(q, attempt + 1);
  }
  if (res.status === 401 && attempt < 1) {
    spotifyToken = undefined; // expired — get a fresh one
    return spotifySearch(q, attempt + 1);
  }
  if (!res.ok) throw new Error(`Spotify search: ${res.status}`);
  return (await res.json()).albums?.items ?? [];
}

/**
 * The release on Spotify — by barcode first, then by name — as its album URL
 * and the main artist's profile URL. Null when it isn't on Spotify (yet).
 */
async function spotifyLinks(a) {
  let items = a.upc ? await spotifySearch(`upc:${a.upc}`) : [];
  if (!items.length) {
    const byName = await spotifySearch(`album:${a.title} artist:${a.artists[0]}`);
    items = byName.filter((x) => norm(x.name) === norm(a.title) && x.artists.some((ar) => a.artists.some((n) => norm(n) === norm(ar.name))));
  }
  const hit = items[0];
  if (!hit) return null;
  return { album: hit.external_urls?.spotify ?? null, artist: hit.artists?.[0]?.external_urls?.spotify ?? null };
}

const readJson = async (file, fallback) => (existsSync(file) ? JSON.parse(await readFile(file, "utf8")) : fallback);

const cache = await readJson(CACHE, { albums: {} });
const ids = await searchLabel();
let fetched = 0;
for (const id of ids) {
  if (!cache.albums[id]) {
    cache.albums[id] = await album(id);
    fetched++;
  }
}

// Newest first; drop duplicate editions of the same record.
// (These are the cache's own objects, so anything we learn below is cached too.)
const seen = new Set();
const ours = Object.values(cache.albums)
  .filter((a) => a.isOurs && a.releaseDate)
  .sort((x, y) => y.releaseDate.localeCompare(x.releaseDate) || y.id - x.id)
  .filter((a) => {
    const key = `${a.title}|${a.artists.join(",")}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

const today = new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Brisbane" }); // YYYY-MM-DD
const upcoming = ours.filter((a) => a.releaseDate > today);
const latest = ours.filter((a) => a.releaseDate <= today).slice(0, LATEST_COUNT);
const show = [...upcoming, ...latest];

await mkdir(COVERS, { recursive: true });
let spotifyFailed = false;
for (const a of show) {
  const file = path.join(COVERS, `${a.id}.jpg`);
  if (!existsSync(file) && a.cover) {
    const res = await fetch(a.cover);
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
  }
  if (a.apple === undefined && a.upc) a.apple = await appleLink(a.upc);
  // Keep trying releases Spotify hasn't got yet (pre-release delivery) — a match is kept for good.
  if (SPOTIFY && !spotifyFailed && typeof a.spotify !== "string") {
    try {
      const hit = await spotifyLinks(a);
      a.spotify = hit?.album ?? null;
      if (hit?.artist) a.spotifyArtist = hit.artist;
    } catch (e) {
      console.warn(`Spotify: ${e.message}`);
      spotifyFailed = true; // leave the rest for the next run rather than hammer a failing API
    }
  }
}

const releases = show.map((a) => ({
  id: a.id,
  title: a.title,
  artists: a.artists,
  artistId: a.artistId,
  releaseDate: a.releaseDate,
  recordType: a.recordType,
  tracks: a.tracks,
  explicit: a.explicit,
  upc: a.upc,
  link: a.link,
  spotify: a.spotify ?? null,
  spotifyArtist: a.spotifyArtist ?? null,
  apple: a.apple ?? null,
  cover: `/media/releases/${a.id}.jpg`,
}));
const previous = await readJson(OUT, null);
const changed = !previous || JSON.stringify(previous.releases) !== JSON.stringify(releases);
const out = { generatedAt: changed ? new Date().toISOString() : previous.generatedAt, label: LABEL, releases };

await mkdir(path.dirname(CACHE), { recursive: true });
await writeFile(CACHE, JSON.stringify(cache, null, 1) + "\n");
if (changed) await writeFile(OUT, JSON.stringify(out, null, 1) + "\n");

const onSpotify = SPOTIFY ? `${releases.filter((r) => r.spotify).length}/${releases.length} matched on Spotify` : "no Spotify credentials — cards fall back to artist profiles / search";
console.log(
  `${ours.length} releases on ${LABEL} (${fetched} newly fetched) → ${upcoming.length} upcoming, ${latest.length} latest · ${onSpotify}${changed ? " — feed updated" : " — no change"}`,
);
