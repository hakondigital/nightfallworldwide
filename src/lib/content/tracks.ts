// Catalogue pulled from the Spotify embeds that lived on the old Squarespace
// site (team + profile pages) plus current releases from the roster.
// `by` records whose page presented the track — not a claimed role.

export type Track = {
  id: string; // Spotify track id
  title: string;
  artists: string;
  date: string; // ISO release date
  dur: number; // seconds
  cover: string; // hash for i.scdn.co — see coverUrl()
  color: string; // Spotify "backgroundBase" swatch
  explicit?: boolean;
  by: TrackOwner[];
};

export type TrackOwner =
  | "mike-snell"
  | "rob-rivers"
  | "mikey-dam"
  | "jarryd-james"
  | "mezmure"
  | "ashley-gall"
  | "kily-safari"
  | "chantel";

/** Artwork is self-hosted (see scripts/build-media.mjs) so it never depends on Spotify's CDN. */
export const coverUrl = (hash: string, size: 300 | 640 = 640) => `/media/covers/${hash}-${size}.webp`;

export const spotifyTrackUrl = (id: string) => `https://open.spotify.com/track/${id}`;
export const spotifyUri = (id: string) => `spotify:track:${id}`;

export const tracks: Track[] = [
  // ── Mike Snell ────────────────────────────────────────────────
  { id: "3s7MCdXyWmwjdcWh7GWXas", title: "Violent Crimes", artists: "Kanye West", date: "2018-06-01", dur: 215, cover: "0cd942c1a864afa4e92d04f2", color: "rgb(16,40,64)", explicit: true, by: ["mike-snell"] },
  { id: "5Pj5LI8U5UfaGEEBsyr18N", title: "Levi High (feat. DaBaby)", artists: "DaniLeigh, DaBaby", date: "2020-03-13", dur: 143, cover: "9081cecb66c16b0872722d92", color: "rgb(39,87,117)", explicit: true, by: ["mike-snell"] },
  { id: "6D53lwtCp4kY6B7aZGkOxB", title: "Gonna Love Me (Remix)", artists: "Teyana Taylor, Ghostface Killah, Method Man, Raekwon", date: "2018-11-02", dur: 289, cover: "37d7551eb51581685a26df20", color: "rgb(139,54,55)", explicit: true, by: ["mike-snell"] },
  { id: "3nXrCAE44KlevAkQB2XWcN", title: "Gonna Love Me", artists: "Teyana Taylor", date: "2018-06-23", dur: 167, cover: "abca6b34e370af95f3b926bd", color: "rgb(76,84,92)", by: ["mike-snell"] },
  { id: "69eXHDgEEQ6itzt03E7fKz", title: "Cravin (feat. G-Eazy)", artists: "DaniLeigh, G-Eazy", date: "2019-10-18", dur: 179, cover: "9351691c007cad99d70d9f3f", color: "rgb(0,92,93)", explicit: true, by: ["mike-snell"] },
  { id: "125kmhAUbQqM4zKOS3L7No", title: "Lowkey (feat. Erykah Badu)", artists: "Teyana Taylor, Erykah Badu", date: "2020-06-19", dur: 258, cover: "3c1d50d3467be460844da7c1", color: "rgb(89,81,81)", explicit: true, by: ["mike-snell"] },
  { id: "6gCABr21D9dn0EGgqCLISM", title: "GANJA", artists: "KILY SAFARI, MIKESN3L", date: "2024-07-19", dur: 298, cover: "1511bf6184d86d3b98e8c869", color: "rgb(56,64,56)", explicit: true, by: ["mike-snell", "kily-safari"] },

  // ── Rob Rivers ────────────────────────────────────────────────
  { id: "1jfnn624fhAS9Ep9mTBDnX", title: "Nothing For Free", artists: "Scopes", date: "2023-10-07", dur: 167, cover: "4ed9a67480beaeb04cfacf29", color: "rgb(83,83,83)", explicit: true, by: ["rob-rivers"] },
  { id: "756EcgXa5cY8aaSkWNfkW8", title: "Shrooms", artists: "AKUA", date: "2024-03-01", dur: 148, cover: "4a9750e89a5a0b24ae1ebbbd", color: "rgb(48,72,104)", by: ["rob-rivers"] },
  { id: "5S854Z8GlAQLKRSggckbL6", title: "AGWA", artists: "AKUA, MEZMURE", date: "2023-11-24", dur: 180, cover: "e6dd3a26bdf487c226551af1", color: "rgb(56,80,136)", by: ["rob-rivers", "mezmure"] },
  { id: "0vf5Fs3wArIdzWCZ4RlLIw", title: "NYASH", artists: "KILY SAFARI, MEZMURE", date: "2023-11-24", dur: 143, cover: "326ff8950037e58af279b0e2", color: "rgb(0,89,114)", explicit: true, by: ["rob-rivers", "kily-safari", "mezmure"] },
  { id: "6IvxSwRsjz0jccQg2pd5pz", title: "Seasons", artists: "Scopes", date: "2024-02-16", dur: 261, cover: "5e09560931428418f611dfff", color: "rgb(141,53,37)", by: ["rob-rivers"] },
  { id: "4JSO7rfQW9rwgNdeUOXpEO", title: "HigherLove432", artists: "AKUA", date: "2024-01-19", dur: 205, cover: "1adf6df4b60b61a4b52ec23a", color: "rgb(76,83,104)", by: ["rob-rivers"] },

  // ── Mikey Dam ─────────────────────────────────────────────────
  { id: "2D1m6jwp6M1RXSdMfmJQjx", title: "The One You Call", artists: "eleven7four, Mikey Dam", date: "2023-03-24", dur: 142, cover: "871523d007524b200df5f49e", color: "rgb(119,63,107)", by: ["mikey-dam"] },
  { id: "7oJOaGYUIjfzmPhCJ73usp", title: "Needed Love", artists: "Mikey Dam", date: "2019-10-18", dur: 199, cover: "8234db36e795dd5d752ac960", color: "rgb(83,83,83)", explicit: true, by: ["mikey-dam"] },
  { id: "29ZE3uE9ezxblQUDORcVE4", title: "Life Feels Good", artists: "Mikey Dam", date: "2021-10-14", dur: 174, cover: "d093fcc29b90ebd1692aeb94", color: "rgb(78,86,71)", explicit: true, by: ["mikey-dam"] },
  { id: "39PEvDhV4y50bAvwbJCtot", title: "Only With You", artists: "Mikey Dam", date: "2022-06-10", dur: 178, cover: "e26bc0d3c7eb120cccbd5d35", color: "rgb(83,83,83)", by: ["mikey-dam"] },
  { id: "2Tf3a4gkBbrN2UbMNbwtdQ", title: "Not My Neighbour", artists: "Niko Walters", date: "2020-11-19", dur: 234, cover: "30adf141800e426d76c214ff", color: "rgb(64,64,64)", by: ["mikey-dam"] },

  // ── Jarryd James ──────────────────────────────────────────────
  { id: "5V53dAjgNInfXNlz2cryvd", title: "Do You Remember", artists: "Jarryd James", date: "2015-09-11", dur: 235, cover: "8819357f0210af47c90a4682", color: "rgb(77,84,91)", by: ["jarryd-james"] },
  { id: "5eeLoiP0m2BKQBkI4jV8zY", title: "Slow Motion", artists: "Jarryd James", date: "2021-01-22", dur: 214, cover: "8b1127739ca9cac1accff713", color: "rgb(108,77,0)", by: ["jarryd-james"] },
  { id: "2DBD3OGjIGgXXInn8lQKfD", title: "1000x", artists: "Jarryd James, BROODS", date: "2016-07-29", dur: 241, cover: "7bdf42468068de4de5331d9f", color: "rgb(83,83,83)", by: ["jarryd-james"] },
  { id: "5KwtMxjFSXoixWutWmxDee", title: "Give Me Something", artists: "Jarryd James", date: "2015-09-11", dur: 191, cover: "8819357f0210af47c90a4682", color: "rgb(77,84,91)", by: ["jarryd-james"] },
  { id: "1kpbM1hlD3sQ2rDKbe2guE", title: "Regardless", artists: "Jarryd James, Julia Stone", date: "2015-09-11", dur: 273, cover: "8819357f0210af47c90a4682", color: "rgb(77,84,91)", by: ["jarryd-james"] },
  { id: "4PHMdyklCcSlTCOvW4sJN5", title: "Miracles", artists: "Jarryd James", date: "2021-01-22", dur: 205, cover: "8b1127739ca9cac1accff713", color: "rgb(108,77,0)", by: ["jarryd-james"] },

  // ── Mezmure (incl. F.K.A. Pharaoh Swami) ─────────────────────
  { id: "5xLGhZO2Dw7NHigfRm0hZa", title: "WOZA", artists: "MEZMURE, KILY SAFARI", date: "2026-08-21", dur: 189, cover: "5e37d8be19b79ba4db876735", color: "rgb(0,40,168)", explicit: true, by: ["mezmure", "kily-safari"] },
  { id: "27pJRayIsaKpjOkenEzYt9", title: "Hold Me While I Disco", artists: "MEZMURE", date: "2026-02-13", dur: 168, cover: "cb6bfdc8d344cac433c70fb4", color: "rgb(152,32,16)", by: ["mezmure"] },
  { id: "3L3w3d9KtsFIHdMipeYmu5", title: "Warcry", artists: "Pharaoh Swami", date: "2020-09-30", dur: 212, cover: "68aeea0335f24953b836f7b4", color: "rgb(48,48,64)", by: ["mezmure"] },
  { id: "7hH82rbmQnN759Hr8oOzxO", title: "Strangers", artists: "Olivia Moana, MEZMURE", date: "2022-07-08", dur: 277, cover: "8de50e210f8755f431bc4bd6", color: "rgb(56,0,8)", by: ["mezmure"] },
  { id: "2jqH1jG2CG3JR2ml7LY2HP", title: "Sms Love", artists: "Pharaoh Swami, Fathe", date: "2021-02-19", dur: 213, cover: "aac36e41482b66a9864ce9c4", color: "rgb(140,52,53)", by: ["mezmure"] },
  { id: "78oKPbo74HyVXTZetPJrDt", title: "Capsize", artists: "Pharaoh Swami", date: "2020-05-15", dur: 192, cover: "021b07bfdc30a31bd248d63d", color: "rgb(83,83,90)", by: ["mezmure"] },
  { id: "3mmMXpXySXYY4GZXDQbT7E", title: "I'm in Love with a Ghost", artists: "Abdul Kay, Goose Esmeralda, MEZMURE", date: "2022-07-08", dur: 240, cover: "8de50e210f8755f431bc4bd6", color: "rgb(56,0,8)", by: ["mezmure"] },
  { id: "55mp6BC9706fCie9PmH043", title: "Lost Up In Your Love", artists: "Tali, Pharaoh Swami", date: "2022-06-24", dur: 195, cover: "23173319cf2741c116e3b8b6", color: "rgb(155,0,71)", by: ["mezmure"] },

  // ── Kily Safari ───────────────────────────────────────────────
  { id: "6EgdS5hDoklBcbJZl2TRIp", title: "Paperweight", artists: "KILY SAFARI, Lowkey, Yxng Ciiber", date: "2024-12-18", dur: 237, cover: "c38a36bcc7bf23885a351ada", color: "rgb(80,72,72)", explicit: true, by: ["kily-safari"] },

  // ── Chantel ───────────────────────────────────────────────────
  { id: "3lHovsQtfOpFf9e91gCsFR", title: "2020", artists: "Chantel", date: "2020-06-08", dur: 210, cover: "3cdd91781778cb9fc2563799", color: "rgb(56,48,48)", by: ["chantel"] },
  { id: "1D3tGuCKtj6Wp1vV7qdx0y", title: "Pressure", artists: "Chantel", date: "2022-12-01", dur: 164, cover: "1de7f679e8b5acfae4ec448e", color: "rgb(70,85,100)", explicit: true, by: ["chantel"] },

  // ── Ashley Gall ───────────────────────────────────────────────
  { id: "6K4Ypx2ljftcJ0gaMf5oq7", title: "Monsters", artists: "Ashley Gall", date: "2024-11-06", dur: 206, cover: "99019a3aec833f28eb6bdf40", color: "rgb(101,80,34)", by: ["ashley-gall"] },
  { id: "2tXDKyXRDFTXaqGstF0GOC", title: "At 21", artists: "Ashley Gall", date: "2024-09-07", dur: 189, cover: "677658fb11de60e3b2ec8705", color: "rgb(83,83,83)", by: ["ashley-gall"] },
  { id: "55MlEaTZIwDCOXLGxuLOe4", title: "21", artists: "Ashley Gall", date: "2024-10-18", dur: 186, cover: "2348e89f694e011e567daa24", color: "rgb(158,1,25)", by: ["ashley-gall"] },
  { id: "2NqNCkdTRr20q2jiU53Oos", title: "Cant Wait", artists: "Ashley Gall", date: "2024-11-07", dur: 149, cover: "0c075a46cc432f759be0dc5d", color: "rgb(158,0,19)", by: ["ashley-gall"] },
];

const byId = new Map(tracks.map((t) => [t.id, t]));
export const track = (id: string) => {
  const t = byId.get(id);
  if (!t) throw new Error(`Unknown track ${id}`);
  return t;
};

export const tracksBy = (owner: TrackOwner) => tracks.filter((t) => t.by.includes(owner));

/** Homepage "Selected works" rail — curated, newest label work first. */
export const selectedWorks = [
  "5xLGhZO2Dw7NHigfRm0hZa", // WOZA
  "3s7MCdXyWmwjdcWh7GWXas", // Violent Crimes
  "6EgdS5hDoklBcbJZl2TRIp", // Paperweight
  "5Pj5LI8U5UfaGEEBsyr18N", // Levi High
  "0vf5Fs3wArIdzWCZ4RlLIw", // NYASH
  "5V53dAjgNInfXNlz2cryvd", // Do You Remember
  "3nXrCAE44KlevAkQB2XWcN", // Gonna Love Me
  "27pJRayIsaKpjOkenEzYt9", // Hold Me While I Disco
  "2DBD3OGjIGgXXInn8lQKfD", // 1000x
  "69eXHDgEEQ6itzt03E7fKz", // Cravin
  "29ZE3uE9ezxblQUDORcVE4", // Life Feels Good
  "6K4Ypx2ljftcJ0gaMf5oq7", // Monsters
  "5S854Z8GlAQLKRSggckbL6", // AGWA
  "1kpbM1hlD3sQ2rDKbe2guE", // Regardless
].map(track);

export const fmtDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
export const releaseYear = (t: Track) => t.date.slice(0, 4);
