export const site = {
  name: "Nightfall Worldwide",
  wordmark: "NIGHTFALL-WORLDWIDE",
  url: "https://www.nightfallworldwide.com",
  tagline: "Nightfall will always come again",
  description:
    "Nightfall Worldwide is a multi-award winning artist collective, working across artist development, music production, publishing and distribution, as well as film and advertising composition and sync.",
  seoDescription:
    "Gold Coast recording studio, label services and artist collective in Burleigh Heads. Studio bookings, mixing & mastering with 3× Grammy-nominated Mike Snell, distribution, sonic identity for brands and the WhiteWall photo studio.",
  established: 2018,
  streams: 2_118_546_665,

  address: {
    street: "1/1 Rothcote Court",
    suburb: "Burleigh Heads",
    state: "QLD",
    postcode: "4220",
    country: "Australia",
    note: "On-site parking available.",
  },
  // Burleigh Heads — used for the live clock + nightfall countdown.
  geo: { lat: -28.0906, lon: 153.4498, tz: "Australia/Brisbane", label: "28.09°S 153.45°E" },

  email: {
    admin: "admin@nightfallworldwide.com",
    studio: "studio@nightfallworldwide.com",
    distribution: "distribution@nightfallworldwide.com",
  },

  links: {
    bookStudio:
      "https://app.acuityscheduling.com/schedule.php?owner=28156026&appointmentType=category:Nightfall%20Studios",
    bookWhitewall:
      "https://app.acuityscheduling.com/schedule.php?owner=28156026&appointmentType=category:WhiteWall",
    beats: "https://nightfallww.beatstars.com/music/tracks",
    distroPortal: "https://www.distro.direct/nightfallworldwide/login.php",
    instagram: "https://www.instagram.com/nightfall___studio/",
    instagramHandle: "@nightfall___studio",
    mikeSnellCredits: "https://credits.muso.ai/profile/d0806c6a-9d09-498b-b2cc-e3b687ab0a5d",
    maps: "https://www.google.com/maps/search/?api=1&query=1%2F1+Rothcote+Court+Burleigh+Heads+QLD+4220",
  },
} as const;

export const acuityEmbed = (url: string) => `${url}&ref=embedded_csp`;
/** Deep link straight to one Acuity package's calendar. */
export const acuityType = (appointmentType: string) =>
  `https://app.acuityscheduling.com/schedule.php?owner=28156026&appointmentType=${appointmentType}`;

export const mailto = (to: string, subject?: string, body?: string) => {
  const q = new URLSearchParams();
  if (subject) q.set("subject", subject);
  if (body) q.set("body", body);
  const qs = q.toString().replace(/\+/g, "%20");
  return `mailto:${to}${qs ? `?${qs}` : ""}`;
};

export type NavItem = { label: string; href: string; code: string; external?: boolean };

/** Nightfall runs three separate businesses — the site is organised around them. */
export type Business = {
  key: "music" | "film" | "whitewall";
  label: string;
  href: string;
  code: string;
  lines: string[];
};

export const businesses: Business[] = [
  { key: "music", label: "Music", href: "/music", code: "01", lines: ["Mixing & mastering", "Studio sessions", "Distribution", "Artists"] },
  { key: "film", label: "Advertising & Film", href: "/advertising-film", code: "02", lines: ["Film & TV scoring", "Sonic identity", "Advertising & sync"] },
  { key: "whitewall", label: "WhiteWall", href: "/whitewall", code: "03", lines: ["Photo & video studio hire", "From $100 per hour"] },
];

export const primaryNav: NavItem[] = [
  ...businesses.map((b) => ({ label: b.label, href: b.href, code: b.code })),
  { label: "Contact", href: "/contact", code: "04" },
];

/** The Music business has its own sub-navigation, as on the original site. */
export const musicNav: NavItem[] = [
  { label: "Mixing & Mastering", href: "/mixing-mastering", code: "01.1" },
  { label: "Studio", href: "/studio", code: "01.2" },
  { label: "Distribution", href: "/distribution", code: "01.3" },
  { label: "Artists", href: "/music#artists", code: "01.4" },
  { label: "Team", href: "/team", code: "01.5" },
  { label: "Rates", href: "/rates", code: "01.6" },
  { label: "Beats", href: site.links.beats, code: "01.7", external: true },
];

const MUSIC_PATHS = ["/music", "/mixing-mastering", "/studio", "/distribution", "/team", "/rates"];
export const isMusicPath = (path: string) => MUSIC_PATHS.some((p) => path === p || path.startsWith(p + "/"));

/** Which business a route belongs to — drives the header's call to action. */
export const businessFor = (path: string): Business["key"] | null =>
  isMusicPath(path) ? "music" : path.startsWith("/advertising-film") ? "film" : path.startsWith("/whitewall") ? "whitewall" : null;

/** Every internal destination with a human label (page transition + menus). */
export const allRoutes: NavItem[] = [
  ...primaryNav,
  ...musicNav.filter((n) => !n.external),
  { label: "Upload a release", href: "/distribution/upload", code: "01.3" },
  { label: "Playlist pitching", href: "/distribution/pitching", code: "01.3" },
];
