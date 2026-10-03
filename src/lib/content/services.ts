import type { MediaName } from "@/lib/media.generated";
import { site } from "./site";

// ── Bookable packages (live in Acuity — ids open that package's calendar) ──
export type Package = { id: string; name: string; note: string; price: number; hours: number };

export const studioPackages: Package[] = [
  { id: "53834547", name: "Studio — 4 hours", note: "Dry hire", price: 319, hours: 4 },
  { id: "62441283", name: "Studio + engineer — 4 hours", note: "With a Nightfall engineer", price: 539, hours: 4 },
  { id: "40882436", name: "Studio — 8 hours", note: "Dry hire", price: 495, hours: 8 },
  { id: "62441314", name: "Studio + engineer — 8 hours", note: "With a Nightfall engineer", price: 935, hours: 8 },
];

export const whitewallPackages: Package[] = [
  { id: "82129271", name: "2 hours", note: "Quick shoot", price: 200, hours: 2 },
  { id: "82129886", name: "Half day — 4 hours", note: "Most booked", price: 400, hours: 4 },
  { id: "82131109", name: "Full day — 8 hours", note: "Campaign day", price: 800, hours: 8 },
  { id: "82343459", name: "Day/Night — 12 hours", note: "Big productions", price: 1000, hours: 12 },
];

// ── Mixing & mastering engineers ────────────────────────────────
export type Engineer = {
  slug: string;
  name: string;
  badge: string;
  credit: string;
  price: string;
  perTrack?: number; // AUD, for the order estimate
  image?: MediaName;
  link?: { label: string; href: string };
};

export const engineers: Engineer[] = [
  {
    slug: "nightfall-collective",
    name: "Nightfall Collective",
    badge: "In-house engineers",
    credit: "The Nightfall engineering team — award-winning mixes across hip-hop, R&B, EDM, pop and more.",
    price: "From A$300 per track",
    perTrack: 300,
    image: "studio-control-room",
  },
  {
    slug: "mike-snell",
    name: "Mike Snell",
    badge: "3× Grammy-nominated",
    credit: "Kanye West, Teyana Taylor, Pusha T, Rick Ross, Kodak Black, Ty Dolla $ign, NLE Choppa and more.",
    price: "A$1,000 per track",
    perTrack: 1000,
    image: "team-mike-snell",
    link: { label: "Credits on Muso.ai", href: site.links.mikeSnellCredits },
  },
  {
    // TODO(client): confirm DON!'s per-track rate.
    slug: "don",
    name: "DON!",
    badge: "Sydney · produced for Grammy-winner Daya",
    credit: "Don Sahand — Sydney producer, mixing and mastering engineer. Credits include Daya, Jords, 4orttune, Kobie Dee, Ta-ku, Young Franco and Cult Shφtta.",
    price: "Price on request",
    image: "team-don",
    link: { label: "Work & credits", href: "https://www.donsahand.com/" },
  },
];

// ── Advertising & film ──────────────────────────────────────────
export const filmServices = [
  { title: "Film & TV scoring", body: "Original score for features, shorts and series — composed, produced and delivered for post-production." },
  { title: "Advertising", body: "Music for campaigns and commercials, written to the edit and the brief." },
  { title: "Sonic identity", body: "Audio branding that expresses the unique characteristics of a brand, campaign or story." },
  { title: "Sync", body: "Licensing from the Nightfall catalogue and collective for picture." },
];

// ── Studio ──────────────────────────────────────────────────────
export const studioRates = {
  year: "2025/26",
  groups: [
    {
      title: "Studio — dry hire",
      rows: [
        { label: "4 hour session", price: "$319" },
        { label: "8 hour session", price: "$495" },
      ],
    },
    {
      title: "Engineering & producer",
      rows: [
        { label: "4 hour session", price: "$220" },
        { label: "8 hour session", price: "$440" },
        { label: "Overtime", price: "$75 / hr" },
      ],
    },
  ],
};

export const licenceRates = [
  {
    title: "Beat licences",
    rows: [
      { label: "Premium licence", detail: "Non-exclusive — as listed on BeatStars", price: "$150" },
      { label: "Exclusive licence", detail: "Exclusive rights — as listed on BeatStars", price: "$300" },
    ],
  },
  {
    title: "Mixing & mastering",
    rows: [
      { label: "Standard mix & master", detail: "Per track", price: "from $300" },
      { label: "Mike Snell mix & master", detail: "3× Grammy-nominated", price: "$1,000" },
    ],
  },
  {
    title: "Track, mix & master combo",
    rows: [
      { label: "Exclusive licence + mix & master", detail: "Distribution split 95% artist / 5% producer", price: "from $750" },
      { label: "Exclusive licence + mix & master", detail: "Distribution split 50% artist / 50% producer", price: "from $500" },
    ],
  },
];

export const bulkNote =
  "We also negotiate discounted bulk pricing for larger projects and long-term studio commitments — email us for details.";

// Third-party listing (Creative Spaces) — confirm with the studio before launch.
export const studioRooms = [
  { label: "Live room", value: "34 m²" },
  { label: "Control room", value: "22 m²" },
  { label: "Capacity", value: "Up to 20" },
];

export const gear: { group: string; items: string[] }[] = [
  {
    group: "Outboard & workflow",
    items: [
      "ADAM A77H 3-way monitors",
      "ADAM 10″ sub",
      "Yamaha HS8 monitors",
      "Mackie Big Knob Studio",
      "UAD Apollo x6 QUAD",
      "UAD Apollo x6",
      "UAD Apollo Twin MkII",
      "Samsung 34″ curved monitor",
      "TCL 75″ 4K Ultra LED TV",
    ],
  },
  { group: "Microphones", items: ["1 × Neumann TLM 102", "2 × RØDE NTK", "4 × RØDE NT55"] },
  { group: "DAWs", items: ["Ableton Live 11", "Logic Pro", "Pro Tools", "FL Studio"] },
  { group: "Controllers", items: ["NI Komplete Kontrol 61-key", "Akai MPK49 MIDI keyboard"] },
  {
    group: "Instruments",
    items: ["Fender Stratocaster", "Epiphone SG electric", "Yamaha bass guitar", "Tanglewood acoustic", "Nylon-string acoustic"],
  },
  {
    group: "Plugins",
    items: [
      "Arturia V Collection",
      "Soundtoys",
      "Waves Premium",
      "Guitar Rig Pro",
      "Antares Auto-Tune Pro",
      "iZotope Collection",
      "Rob Papen SubBoomBass 2",
      "u-he Hive",
      "u-he Diva",
      "u-he Presswerk",
      "UAD Avalon",
      "NI Kontakt",
      "NI Battery 4",
    ],
  },
];

// ── Mixing & mastering (products from the old Squarespace shop) ──
export type Product = {
  slug: string;
  name: string;
  kicker: string;
  image: MediaName;
  blurb: string;
  points?: { title: string; body: string }[];
  includes?: string[];
  fineprint?: string[];
  options?: { name: string; values: string[] }[];
  /** price per variant key "optA|optB" in AUD; `was` = pre-sale price */
  variants: { key: string; price: number; was?: number }[];
  stock?: string;
  terms: TermsKey;
};

export const products: Product[] = [
  {
    slug: "2-for-1",
    name: "2 for 1 Mixing & Mastering",
    kicker: "Limited-time offer",
    image: "studio-control-room",
    blurb:
      "Buy mixing and mastering for one track and get a second track mixed and mastered free. Industry-standard mixing and mastering that gives your music the clarity, depth and professional polish it deserves.",
    points: [
      { title: "Crystal-clear mixing", body: "Balancing every element for a professional, radio-ready sound." },
      { title: "Studio-quality mastering", body: "Loudness, depth and dynamics for every streaming platform." },
      { title: "Fast turnaround", body: "Final masters delivered quickly without compromising quality." },
      { title: "Multi-genre", body: "Hip-hop, R&B, EDM, pop and more." },
    ],
    options: [
      { name: "Engineer", values: ["Nightfall Collective", "Mike Snell"] },
      { name: "Stems", values: ["1–12 stems", "13–24 stems"] },
    ],
    variants: [
      { key: "Nightfall Collective|1–12 stems", price: 600, was: 1200 },
      { key: "Nightfall Collective|13–24 stems", price: 700, was: 1400 },
      { key: "Mike Snell|1–12 stems", price: 1200, was: 2400 },
      { key: "Mike Snell|13–24 stems", price: 1300, was: 2600 },
    ],
    terms: "mix",
  },
  {
    slug: "artist-spotlight",
    name: "Artist Spotlight Session",
    kicker: "Monthly · 8 spots",
    image: "artist-kily-safari",
    blurb: "A monthly spotlight session: record, mix, master and release — the fastest way from demo to DSPs with Nightfall behind you.",
    includes: [
      "1 hour recording session to your beat",
      "Mixing & mastering (3 revisions)*",
      "Free upload to the Nightfall Worldwide distribution platform",
      "Playlist pitching",
    ],
    fineprint: [
      "Afterpay available on request — email admin@nightfallworldwide.com or DM us on Instagram for a payment link.",
      "*Mixing and mastering covers a single beat .wav and vocals recorded on the day. Extra stems may incur additional fees and are subject to studio approval.",
    ],
    variants: [{ key: "", price: 350, was: 850 }],
    stock: "8 spots per month",
    terms: "spotlight",
  },
];

export const aud = (n: number) => `A$${n.toLocaleString("en-AU")}`;

/**
 * Payment links per product variant (e.g. Stripe Payment Links).
 * Key: `${product.slug}|${variant.key}` — e.g. "2-for-1|Mike Snell|1–12 stems".
 * Anything without a link falls back to a pre-filled order email.
 */
export const checkoutLinks: Record<string, string> = {};

// ── Terms & conditions (verbatim structure from the product pages) ──
export type TermsKey = "mix" | "snell" | "spotlight";

const shared = {
  ownership: [
    "The client retains full ownership of the recorded material upon full payment.",
    "The studio reserves the right to use snippets of the session for promotional purposes unless a written agreement states otherwise.",
    "If beats or instrumentals are provided by the studio, licensing terms must be agreed upon separately.",
  ],
  liability: [
    "The studio is not responsible for lost or corrupted files after the final delivery. Clients are advised to back up all files immediately.",
    "The studio is not liable for personal items lost, stolen, or damaged on the premises.",
  ],
  confidentiality: [
    "The studio ensures that all recorded material remains confidential and will not be shared without the client’s permission, except for promotional use if agreed upon.",
  ],
  agreement: [
    "By booking a session, the client acknowledges and agrees to these terms and conditions.",
    "Any disputes arising will be resolved under the jurisdiction of Queensland.",
  ],
  payment: [
    "Payment is due prior to the session commencement date or per the conditions of the promotion.",
    "Any additional services requested beyond the agreed-upon scope may incur additional charges.",
    "There is a no-refunds policy on all promotional services due to demand — please read the conditions and available session dates carefully.",
  ],
  mixing: [
    "Mixing and mastering begins once the recording session is completed and full payment is received.",
    "The client is entitled to 3 free revisions. Additional revisions may incur an extra charge of $50 per revision.",
    "Turnaround is approximately 7 business days unless stated otherwise.",
    "Final masters are delivered as MP3 & WAV: −0 dB · 24-bit · 48 kHz .wav (hi-res for distributors) and 320 kbps .mp3 (for press kits).",
  ],
};

export const terms: Record<TermsKey, { title: string; sections: { heading: string; items: string[] }[] }> = {
  mix: {
    title: "Terms — Mixing & Mastering",
    sections: [
      { heading: "Introduction", items: ["These terms govern the use of our music mixing and mastering services. By engaging our services, you agree to be bound by these terms."] },
      { heading: "Payment", items: shared.payment },
      { heading: "Mixing & mastering", items: shared.mixing },
      { heading: "Turnaround", items: ["Estimated delivery times are provided on project confirmation. Delays may occur due to unforeseen circumstances; we will communicate any changes promptly."] },
      { heading: "Client responsibilities", items: ["Clients must provide high-quality audio files in the required format. We are not responsible for issues arising from poor-quality recordings or improper file formats."] },
      { heading: "Ownership & rights", items: shared.ownership },
      { heading: "Liability", items: shared.liability },
      { heading: "Confidentiality", items: shared.confidentiality },
      { heading: "Agreement", items: shared.agreement },
    ],
  },
  snell: {
    title: "Terms — Mike Snell",
    sections: [
      { heading: "Introduction", items: ["These terms govern the use of our music mixing and mastering services. By engaging our services, you agree to be bound by these terms."] },
      { heading: "Payment", items: shared.payment },
      { heading: "Mixing & mastering", items: shared.mixing },
      { heading: "Turnaround", items: ["Estimated delivery times are provided on project confirmation and depend on Mike Snell’s schedule. Delays may occur due to unforeseen circumstances; we will communicate any changes promptly."] },
      { heading: "Client responsibilities", items: ["Clients must provide high-quality audio files in the required format. We are not responsible for issues arising from poor-quality recordings or improper file formats."] },
      { heading: "Ownership & rights", items: shared.ownership },
      { heading: "Liability", items: shared.liability },
      { heading: "Confidentiality", items: shared.confidentiality },
      { heading: "Agreement", items: shared.agreement },
    ],
  },
  spotlight: {
    title: "Terms — Artist Spotlight",
    sections: [
      { heading: "Booking & payment", items: shared.payment },
      {
        heading: "Studio rules & conduct",
        items: [
          "Clients must arrive on time. Time lost due to late arrival will not be compensated.",
          "The studio environment must be respected. Any damage to equipment caused by the client or their guests is the client’s financial responsibility.",
          "No smoking, alcohol or illegal substances on studio premises unless previously agreed.",
          "The studio reserves the right to refuse service to anyone displaying inappropriate or disruptive behaviour.",
        ],
      },
      {
        heading: "Recording session",
        items: [
          "The studio provides a professional recording environment, including necessary equipment and an engineer.",
          "The client is responsible for bringing all necessary materials, including instrumentals, lyrics and any required files.",
          "Sessions end at the scheduled time unless extended by prior arrangement and additional payment.",
        ],
      },
      { heading: "Mixing & mastering", items: shared.mixing },
      { heading: "Ownership & rights", items: shared.ownership },
      { heading: "Liability", items: shared.liability },
      { heading: "Confidentiality", items: shared.confidentiality },
      { heading: "Agreement", items: shared.agreement },
    ],
  },
};

// ── Distribution ────────────────────────────────────────────────
export const distribution = {
  intro:
    "We wanted to change the way distribution works — 100% transparency on who takes what and how much you get, with no lock-in contracts. If we aren’t performing, you can pull your music at any time. But we think you’ll want to be part of what’s to come.",
  lede: "Releasing through Nightfall Worldwide puts the power of distribution in your hands, backed by an industry leader in the music business.",
  get: [
    "Editorial playlist pitching",
    "Global music distribution",
    "Transparent royalty splits — full ownership retained",
    "Fast, reliable delivery to all major DSPs worldwide",
    "Direct access to Nightfall’s creative ecosystem & infrastructure",
    "Global analytics for marketing analysis",
    "No lock-in contracts",
  ],
  costs: [
    { label: "Upfront fees", value: "$0" },
    { label: "Upload costs", value: "$0" },
    { label: "Distribution royalties", value: "20%" },
  ],
  pitchLeadTime:
    "Want your release pitched to playlists? Once you’ve joined, we send you our pitching form — allow a minimum of 6 weeks between your upload and the release date.",
  pitchDisclaimer:
    "We have good relationships with the digital service providers, but we can’t guarantee placements — the final decision rests with Spotify and each platform’s playlist curators.",
};

export const fileSpecs = {
  audio: [
    "WAV only — 250 MB max per track",
    "16-bit 44.1 kHz, or 24-bit 44.1 / 48 / 96 / 192 kHz only",
    "No 32-bit WAV files",
    "Don’t rename extensions (e.g. .mp3 → .wav) without properly converting",
    "25 tracks maximum per album",
  ],
  artwork: [
    "Name on artwork must match the release name",
    ".jpg / .jpeg / .png in RGB colour (not CMYK)",
    "10 MB max file size",
    "At least 3000 × 3000 px, perfect square",
    "No website addresses or social media links",
    "Don’t upsize images — blurry art may be rejected",
  ],
};

// ── WhiteWall ───────────────────────────────────────────────────
export const whitewall = {
  features: [
    "5.5 m × 7.2 m cyclorama",
    "Amazing natural light",
    "Green room area",
    "Exterior 3 m × 2 m white textured wall (natural light)",
    "Air conditioning",
    "Kitchenette",
  ],
  lede: "The Gold Coast’s tallest whitewall, housed within a vibrant creative precinct — available for bookings from only $100 per hour.",
  from: "$100",
  lighting: {
    rates: [
      { label: "Half day", price: "$150" },
      { label: "Full day", price: "$300" },
    ],
    groups: [
      {
        group: "LED lighting",
        items: [
          "3 × Amaran P60c RGB panel",
          "Aputure LS 60x bi-colour fixture",
          "Aputure LS 60d daylight fixture",
          "Amaran 200x bi-colour COB",
          "Amaran 60x bi-colour COB",
        ],
      },
      { group: "Light modifiers", items: ["Aputure Light Dome III", "Aputure Light Dome Mini II"] },
      { group: "Hardware", items: ["7 × light stands", "5 × 10 kg shot bags", "3 × 5 kg shot bags", "10 × 10 A extension cables"] },
    ],
  },
  gallery: ["ww-armchair", "ww-cap", "ww-ball-chair", "ww-denim", "ww-tank", "ww-phone", "ww-records"] as MediaName[],
};

// ── Advertising & film ──────────────────────────────────────────
export const film = {
  statement:
    "Nightfall Worldwide works strategically with business and creative leaders to craft compelling, world-class sonic identities that deeply express the unique characteristics of a brand, campaign, or story.",
  work: [
    { name: "work-jaguar", caption: "Jaguar" },
    { name: "work-coopers", caption: "Coopers Brewery" },
    { name: "work-maritimo", caption: "Maritimo" },
    { name: "work-superboost", caption: "Super Boost" },
    { name: "work-teal", caption: "Campaign still" },
    { name: "work-pivotel", caption: "Pivotel" },
    { name: "work-chef", caption: "Campaign still" },
    { name: "work-sequins", caption: "Campaign still" },
    { name: "work-editorial", caption: "Campaign still" },
    { name: "work-pour", caption: "Campaign still" },
    { name: "work-painter", caption: "Campaign still" },
    { name: "work-bush-tucker", caption: "Bush Tucker Blends" },
  ] as { name: MediaName; caption: string }[],
};
