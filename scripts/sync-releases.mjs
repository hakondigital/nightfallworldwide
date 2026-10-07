// Latest releases, straight from the label's catalogue.
//
// Every release Nightfall distributes reaches Deezer tagged with the label
// name, and Deezer's catalogue API is public (no key, no login). So this
// script searches by label, keeps the newest releases plus anything with a
// future date, saves their covers, and writes a small feed the Music page
// reads at build time. No artist list to maintain: new signings show up on
// their own.
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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
for (const a of show) {
  const file = path.join(COVERS, `${a.id}.jpg`);
  if (!existsSync(file) && a.cover) {
    const res = await fetch(a.cover);
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
  }
  if (a.apple === undefined && a.upc) {
    a.apple = await appleLink(a.upc);
    cache.albums[a.id].apple = a.apple;
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
  apple: a.apple ?? null,
  cover: `/media/releases/${a.id}.jpg`,
}));
const previous = await readJson(OUT, null);
const changed = !previous || JSON.stringify(previous.releases) !== JSON.stringify(releases);
const out = { generatedAt: changed ? new Date().toISOString() : previous.generatedAt, label: LABEL, releases };

await mkdir(path.dirname(CACHE), { recursive: true });
await writeFile(CACHE, JSON.stringify(cache, null, 1) + "\n");
if (changed) await writeFile(OUT, JSON.stringify(out, null, 1) + "\n");

console.log(
  `${ours.length} releases on ${LABEL} (${fetched} newly fetched) → ${upcoming.length} upcoming, ${latest.length} latest${changed ? " — feed updated" : " — no change"}`,
);
