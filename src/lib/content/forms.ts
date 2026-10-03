// Field definitions migrated from the Squarespace /uploadform block,
// grouped into steps for the stepper UI. (Playlist pitching is handled
// by the label directly — Kinch sends artists the form himself.)

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
  id: "upload" | "enquiry";
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
