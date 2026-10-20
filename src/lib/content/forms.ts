import { site } from "@/lib/content/site";

// Field definitions migrated from the Squarespace /uploadform block,
// grouped into steps for the stepper UI. (Playlist pitching is handled
// by the label directly — Kinch sends artists the form himself.)

/** Which form a submission came from. The `/api/send` route turns this into an inbox. */
export type FormKind = "enquiry" | "studio" | "mix" | "upload" | "pitching";

/**
 * Where each form lands. studio@ takes bookings (sessions, WhiteWall); admin@
 * takes mix & master orders and enquiries, questions, contracts and film
 * briefs; distribution@ takes release uploads and playlist pitches. Also the
 * mailto fallback address.
 */
export const formInbox: Record<FormKind, string> = {
  enquiry: site.email.admin,
  studio: site.email.studio,
  mix: site.email.admin,
  upload: site.email.distribution,
  pitching: site.email.distribution,
};

/** Name of the hidden anti-spam field — see components/forms/Honeypot. */
export const HONEYPOT = "website";

export type FieldType = "text" | "email" | "tel" | "url" | "date" | "textarea" | "choice" | "multi";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  options?: string[];
  max?: number; // for multi-select
  half?: boolean;
};

export type Step = { title: string; intro?: string; fields: Field[] };

export type FormDef = {
  id: "upload" | "pitching";
  title: string;
  kind: FormKind;
  subject: string;
  /** Shown once it's sent; defaults to a generic thank-you. */
  thanks?: string;
  steps: Step[];
};

// The two forms below are the ones Nightfall sends artists by link. Their
// pages (/uploadform and /pitching, same paths as the old site) are unlisted:
// not in the nav or sitemap, and marked noindex.

export const uploadForm: FormDef = {
  id: "upload",
  title: "Upload a release",
  kind: "upload",
  subject: "Release upload",
  thanks: `Thanks — the Nightfall team has your release details. Don’t forget to send your master and artwork to ${site.email.distribution}.`,
  steps: [
    {
      title: "Account",
      intro:
        "Not registered as a Nightfall artist yet? Fill out your details to create your distribution account. Already signed up? You can skip straight to the release.",
      fields: [
        { name: "first_name", label: "First name", type: "text", half: true },
        { name: "last_name", label: "Last name", type: "text", half: true },
        { name: "email", label: "Email", type: "email", half: true },
        { name: "phone", label: "Contact phone number", type: "tel", half: true },
      ],
    },
    {
      title: "Release",
      fields: [
        { name: "release_title", label: "Release title", type: "text", required: true, hint: "Spell it exactly — capital letters and symbols included." },
        { name: "main_artist", label: "Main artist", type: "text", required: true, half: true },
        { name: "spotify_link", label: "Spotify link", type: "url", required: true, half: true, placeholder: "https://open.spotify.com/artist/…" },
        { name: "additional_artists", label: "Additional artists", type: "textarea", hint: "Please include links to their Spotify pages as well." },
        {
          name: "release_date",
          label: "Release date",
          type: "date",
          required: true,
          half: true,
          hint: "Want it pitched to playlists? Allow at least 6 weeks between your upload and the release date.",
        },
        { name: "itunes_preorder", label: "Add an iTunes pre-order date?", type: "choice", options: ["Yes please", "No thank you"], half: true },
        { name: "genre", label: "Genre (up to 2)", type: "text", required: true, half: true },
        { name: "language", label: "Track language", type: "text", required: true, half: true, hint: "Multiple languages? Please specify." },
      ],
    },
    {
      title: "Credits",
      intro: "Use first and last names — not single artist names.",
      fields: [
        { name: "songwriters", label: "Songwriter credits", type: "textarea", required: true },
        { name: "composers", label: "Composer credits", type: "textarea", required: true },
        { name: "producers", label: "Producer credits", type: "textarea", required: true },
        { name: "performers", label: "Performer credits", type: "textarea", required: true },
        { name: "other_credits", label: "All other credits", type: "textarea", hint: "Mixing, mastering and any other roles — include each person’s role on the track." },
      ],
    },
    {
      title: "Splits",
      fields: [
        {
          name: "tiktok_start",
          label: "TikTok start time",
          type: "text",
          placeholder: "e.g. 0:42",
          hint: "The point in the track used when it’s selected for content. Unsure? Leave it and the algorithm decides.",
        },
        {
          name: "splits",
          label: "Splits",
          type: "textarea",
          hint: "We pay all royalties via Wise, accessible from the distribution portal. List each person’s name, percentage and email — if they already have Wise, use the same email.",
        },
      ],
    },
  ],
};

/** Playlist pitching — the brief Nightfall sends to Spotify and the other DSP editors. Fields follow the old site's form. */
export const pitchingForm: FormDef = {
  id: "pitching",
  title: "Playlist pitching",
  kind: "pitching",
  subject: "Playlist pitch",
  thanks: `Thanks — the Nightfall team has your pitch. Make sure your master and artwork are with ${site.email.distribution} at least six weeks before release.`,
  steps: [
    {
      title: "Artist",
      intro: "The streaming platforms want to know who you are and where you’re from — it shapes which editorial playlists we can pitch to.",
      fields: [
        { name: "artist_name", label: "Artist name", type: "text", required: true, half: true, hint: "Exactly as it appears on Spotify — case sensitive." },
        { name: "email", label: "Distribution account email", type: "email", required: true, half: true },
        { name: "pronouns", label: "Artist pronouns", type: "text", half: true, hint: "If applicable." },
        { name: "country", label: "Country the artist is located in", type: "text", required: true, half: true },
        { name: "lives", label: "Where the artist currently lives", type: "text", required: true, half: true },
        { name: "hometown", label: "The artist’s hometown", type: "text", required: true, half: true },
        { name: "bio", label: "Short artist biography", type: "textarea", required: true, hint: "Roughly 200 words, written about yourself as an artist." },
      ],
    },
    {
      title: "Release",
      fields: [
        { name: "track_name", label: "Track name", type: "text", required: true, half: true },
        { name: "release_date", label: "Release date", type: "date", required: true, half: true },
        { name: "genres", label: "Genres (up to 3)", type: "text", required: true, half: true },
        { name: "playlists", label: "Spotify playlists it would best fit (up to 3)", type: "text", required: true, half: true },
        { name: "moods", label: "Mood", type: "multi", required: true, max: 2, options: ["Chill", "Energetic", "Happy", "Fierce", "Meditative", "Romantic", "Sad", "Sexy"] },
        { name: "bigger_work", label: "Is this track part of a bigger body of work?", type: "choice", required: true, options: ["Yes", "No"], half: true },
        { name: "collective_date", label: "Release date of the full body of work", type: "date", half: true, hint: "Only if it’s part of an EP or album." },
        {
          name: "cultures",
          label: "Does the artist identify with any of these cultures?",
          type: "multi",
          options: ["African", "Arabic", "Asian", "Buddhist", "Caribbean", "Celtic", "Christian", "Hindu", "Indigenous", "Islamic", "Judaic", "Latin", "Sikh", "Other"],
          hint: "Optional — the platforms use it for culture-specific editorial playlists.",
        },
      ],
    },
    {
      title: "Pitch",
      intro: "This is what the editors read. Be specific — it decides which playlists we point the release at.",
      fields: [
        {
          name: "about",
          label: "About the release and its marketing plan",
          type: "textarea",
          required: true,
          hint: "How the track came about, and how you’ll push it before and after release. It gives editors context against your existing work and shows which playlists suit it beyond the usual genre and location metrics.",
        },
        {
          name: "markets",
          label: "The three global markets you most want to reach, and why",
          type: "textarea",
          required: true,
          hint: "Does the artist’s existing data back this up? Editors want to know whether your current audience still applies or you’re shifting your target market.",
        },
        { name: "achievements", label: "The artist’s three biggest achievements to date", type: "textarea", required: true, hint: "Significant playlisting, radio, touring, recording or awards." },
      ],
    },
    {
      title: "Links",
      fields: [
        { name: "spotify", label: "Spotify artist page", type: "url", required: true, half: true, placeholder: "https://open.spotify.com/artist/…" },
        { name: "instagram", label: "Instagram", type: "url", required: true, half: true },
        { name: "facebook", label: "Facebook", type: "url", required: true, half: true },
        { name: "tiktok", label: "TikTok", type: "url", required: true, half: true },
        { name: "youtube", label: "YouTube", type: "url", half: true },
        { name: "other", label: "Anything else we should know", type: "textarea" },
      ],
    },
  ],
};

export const enquiryTopics = [
  "Studio session",
  "Mix & master",
  "Distribution",
  "Artist development",
  "Advertising & film",
  "WhiteWall",
  "Something else",
];

/** Topics for briefs coming in from the Advertising & Film page. */
export const filmTopics = ["Film / TV scoring", "Advertising", "Sonic identity", "Sync licensing", "Something else"];
