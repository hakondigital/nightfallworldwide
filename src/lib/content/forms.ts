// Field definitions migrated 1:1 from the Squarespace form blocks on
// /uploadform and /pitching, grouped into steps for the new stepper UI.

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
  id: "upload" | "pitching" | "enquiry";
  title: string;
  to: string; // fallback email recipient
  subject: string;
  endpointEnv: string; // NEXT_PUBLIC_* var holding a Formspree endpoint
  steps: Step[];
};

export const uploadForm: FormDef = {
  id: "upload",
  title: "Upload a release",
  to: "distribution@nightfallworldwide.com",
  subject: "Release upload",
  endpointEnv: "NEXT_PUBLIC_FORMSPREE_UPLOAD",
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
          hint: "Want it pitched through our playlisting portal? Allow at least 6 weeks from your upload and pitching submission.",
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

export const pitchingForm: FormDef = {
  id: "pitching",
  title: "Playlist pitching",
  to: "studio@nightfallworldwide.com",
  subject: "Playlist pitch",
  endpointEnv: "NEXT_PUBLIC_FORMSPREE_PITCHING",
  steps: [
    {
      title: "Artist",
      fields: [
        { name: "artist_name", label: "Artist name (case sensitive)", type: "text", required: true, half: true },
        { name: "account_email", label: "Distribution account email", type: "email", required: true, half: true },
        { name: "pronouns", label: "Artist pronouns (if applicable)", type: "text", half: true },
        { name: "country", label: "Country the artist is located in", type: "text", required: true, half: true },
        { name: "current_city", label: "Where the artist currently lives", type: "text", required: true, half: true },
        { name: "hometown", label: "Artist’s hometown", type: "text", required: true, half: true },
        { name: "bio", label: "Short artist biography", type: "textarea", required: true, hint: "Roughly 200 words about you as an artist." },
      ],
    },
    {
      title: "Release",
      fields: [
        { name: "track_name", label: "Track name of release", type: "text", required: true, half: true },
        { name: "release_date", label: "Release date", type: "date", required: true, half: true },
        {
          name: "story",
          label: "The release & its marketing plan",
          type: "textarea",
          required: true,
          hint: "How the track was made, and how you’ll push it before and after release — context that helps us target playlists beyond genre and location.",
        },
        { name: "bigger_body", label: "Is this track part of a bigger body of work?", type: "choice", options: ["Yes", "No"], required: true, half: true },
        { name: "collective_date", label: "If so, release date of the full project", type: "date", half: true },
      ],
    },
    {
      title: "Markets",
      fields: [
        {
          name: "markets",
          label: "Top three global markets for this project — and does your data back it up?",
          type: "textarea",
          required: true,
          hint: "Are your current analytics and audience still relevant, or are you shifting target markets? This decides which playlists we direct the track towards.",
        },
        {
          name: "achievements",
          label: "Three biggest achievements to date",
          type: "textarea",
          required: true,
          hint: "Significant playlisting, radio, touring, recording or awards.",
        },
      ],
    },
    {
      title: "Links",
      fields: [
        { name: "instagram", label: "Instagram", type: "url", required: true, half: true },
        { name: "facebook", label: "Facebook", type: "url", required: true, half: true },
        { name: "tiktok", label: "TikTok", type: "url", required: true, half: true },
        { name: "youtube", label: "YouTube", type: "url", half: true },
        { name: "spotify", label: "Spotify artist page", type: "url", required: true },
      ],
    },
    {
      title: "Sound",
      fields: [
        { name: "genres", label: "Genres (up to 3)", type: "text", required: true, half: true },
        { name: "playlists", label: "Best-fit Spotify playlists (max 3)", type: "text", required: true, half: true },
        { name: "moods", label: "Choose up to two moods", type: "multi", max: 2, required: true, options: ["Chill", "Energetic", "Happy", "Fierce", "Meditative", "Romantic", "Sad", "Sexy"] },
        {
          name: "cultures",
          label: "Does the artist identify with any of these cultures?",
          type: "multi",
          options: ["African", "Arabic", "Asian", "Buddhist", "Caribbean", "Celtic", "Christian", "Hindu", "Indigenous", "Islamic", "Judaic", "Latin", "Sikh", "Other"],
        },
        { name: "other", label: "Other info", type: "textarea" },
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
