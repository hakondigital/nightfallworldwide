import type { MediaName } from "@/lib/media.generated";
import type { TrackOwner } from "./tracks";

export type Release = {
  title: string;
  note: string; // original release note, e.g. "22nd November"
  cover: MediaName;
  spotifyTrack?: string;
  body?: string[];
};

export type Artist = {
  slug: string;
  name: string;
  /** Display variant for the lineup (keeps stylised names). */
  lineup?: string;
  image: MediaName;
  gallery?: MediaName[];
  spotify?: string; // artist profile
  tier: "global" | "collective";
  origin?: string;
  tags?: string[];
  owner?: TrackOwner; // key into the catalogue
  page?: boolean; // has a /music/[slug] page
  lede?: string;
  bio?: string[];
  releases?: Release[];
};

const sp = (id: string) => `https://open.spotify.com/artist/${id}`;

export const artists: Artist[] = [
  // ── Global collaborators ─────────────────────────────────────
  { slug: "lil-pump", name: "Lil Pump", image: "artist-lil-pump", spotify: sp("3wyVrVrFCkukjdVIdirGVY"), tier: "global", origin: "Miami, US" },
  { slug: "nle-choppa", name: "NLE Choppa", image: "artist-nle-choppa", spotify: sp("0ErzCpIMyLcjPiwT4elrtZ"), tier: "global", origin: "Memphis, US" },
  { slug: "ziezie", name: "ZieZie", image: "artist-ziezie", spotify: sp("26XzvosH2cl8Re6KSo9m8Z"), tier: "global", origin: "London, UK" },

  // ── The collective ───────────────────────────────────────────
  {
    slug: "mezmure",
    name: "MEZMURE",
    image: "team-mezmure",
    gallery: ["mezmure-silhouette"],
    spotify: sp("661IDpZbes60JtwHMGOOju"),
    tier: "collective",
    origin: "Ethiopia → NZ → Gold Coast → NYC",
    tags: ["Songwriter", "Producer", "A&R"],
    owner: "mezmure",
    page: true,
    lede: "Who would’ve thought that an Ethiopian refugee from Sudan, who grew up in NZ and relocated from Australia’s sunny Gold Coast to New York City, would create his own lane in the world of country music.",
    bio: [
      "Growing up on gospel and blues, this country-inspired pop artist is anticipated to set the tone and compete with the greats. Introducing Mezmure, the multi-talented gunslinger. A cohesive six-track project is led by his debut single, Hoedown — a song about addiction, women, and the everyday struggle of bills and missed car payments that illustrates the relatable lifestyle of a black cowboy navigating the perils of the wild western world.",
      "MEZMURE (F.K.A. Pharaoh SWAMi) arrived in New Zealand with his family as a refugee from Ethiopia. An outrageously charismatic artist whose real first name means ‘music’ in ancient Amharic, his synaesthesia coupled with a love for nature birthed his beautiful, raw and ethnic sound. Combined with an ear for melody and modern song structure, A&R was the natural progression from his artistry into the world of artist development.",
    ],
    releases: [
      {
        title: "Hoedown",
        note: "Debut single",
        cover: "cover-hoedown",
        body: [
          "Co-produced and co-written with Gold Coast local Rob Rivers, Mezmure and Rob have created a masterpiece that balances the fine line between artist integrity and commercial digestibility.",
          "Written, produced, recorded and completed in one week, this debut smash was mixed and mastered by multi-platinum producer/engineer Chazz Jackson, who has executive produced for greats such as Tory Lanez and many more.",
          "Pour a drink. Press play and we will see you at the Hoedown.",
        ],
      },
    ],
  },
  {
    slug: "kily-safari",
    name: "KILY SAFARI",
    image: "artist-kily-safari",
    gallery: ["cover-paperweight"],
    spotify: sp("67iwxQsW9XSe5FPSq5VJra"),
    tier: "collective",
    tags: ["Artist"],
    owner: "kily-safari",
    page: true,
    lede: "Melodic hustle anthems about securing the bag and staying grounded.",
    bio: [
      "From the struggles of the grind to the gratitude for success, Kily Safari’s lyricism and energy shine through. His records — NYASH, GANJA, and WOZA with MEZMURE — run right through the Nightfall catalogue.",
    ],
    releases: [
      {
        title: "Paperweight",
        note: "18.12.2024 — with Lowkey & Yxng Ciiber",
        cover: "cover-paperweight",
        spotifyTrack: "6EgdS5hDoklBcbJZl2TRIp",
        body: [
          "“Paperweight” is a melodic hustle anthem by Kily Safari. He delivers a dynamic track about securing the bag and staying grounded. From the struggles of the grind to the gratitude for success, Kily’s lyricism and energy shine through.",
          "It’s a powerful reminder to stay consistent and trust the process.",
        ],
      },
    ],
  },
  {
    slug: "chantel",
    name: "Chantel",
    image: "artist-chantel-red",
    gallery: ["chantel-polaroid", "cover-not-fair"],
    spotify: sp("3qZ9DxnCiqZ0WPrypZFhkx"),
    tier: "collective",
    origin: "Sydney, AU",
    tags: ["Singer", "Songwriter", "Actress"],
    owner: "chantel",
    page: true,
    lede: "Chantel Cofie is a truly multifaceted talent — singer, songwriter, musician, actress and screenwriter.",
    bio: [
      "Born to an Egyptian mother and a Ghanaian father, Chantel started in the arts at just six months old. Her audition on Season 10 of The Voice Australia startled the nation: the coaches gave her a four-chair turn and a standing ovation after she sang her original, ‘2020’ — a song inspired by the Black Lives Matter movement.",
      "With 1.72 million viewers watching that night, the audition has generated plenty of repeat views across every platform. She later released her debut EP, PRESSURE, closing out 2023 with 4.4 million Spotify streams and counting.",
    ],
    releases: [
      {
        title: "Not Fair",
        note: "Single",
        cover: "cover-not-fair",
        body: [
          "After a year exploring new territory and travelling to the UK, the evolution of Chantel’s sound is clear — and Not Fair paves a new creative path for the Sydney-based artist.",
          "The song delves into forbidden love: separated by cities, drawn together by lust, caught up in an affair. It tells what it feels like to be on the receiving end of a complicated love story, fighting the urge between seduction and doing the right thing.",
        ],
      },
    ],
  },
  {
    slug: "jarryd-james",
    name: "Jarryd James",
    image: "team-jarryd-james",
    gallery: ["artist-jarryd-james"],
    spotify: sp("23IZADrJHPStZ6aMxJVq3s"),
    tier: "collective",
    origin: "Brisbane, AU",
    tags: ["Songwriter", "Producer"],
    owner: "jarryd-james",
    page: true,
    lede: "ARIA-charting, platinum-certified songwriter and producer.",
    bio: [
      "Brisbane-born Jarryd James has featured in the ARIA charts numerous times and worked with international producers such as Joel Little, Clams Casino, FrancisGotHeat and M-Phazes.",
      "With millions of streams and certified platinum records, his songwriting and production style is gaining momentum at Nightfall.",
    ],
  },
  {
    slug: "mikey-dam",
    name: "Mikey Dam",
    image: "team-mikey-dam",
    gallery: ["artist-mikey-dam"],
    spotify: sp("6U5CUX0APXFzqcfpoXxEyb"),
    tier: "collective",
    origin: "Hāwera, NZ",
    tags: ["Singer", "Songwriter", "Producer"],
    owner: "mikey-dam",
    page: true,
    lede: "A firm believer in fated flukes.",
    bio: [
      "The Hāwera, New Zealand-born singer-songwriter grew up with rapper aspirations before accidentally finding his singing voice during a chance studio session.",
      "Now Mikey crafts rich R&B while still carrying a hip-hop cadence in his magnetic delivery. He’s spent years carefully carving out his niche — and he’s ready to share it with the world.",
    ],
  },
  {
    slug: "ashley-gall",
    name: "Ashley Gall",
    image: "artist-ashley-gall",
    gallery: ["cover-my-hometown"],
    spotify: sp("51gTvgdSsIN2WSkvm5t2Dm"),
    tier: "collective",
    origin: "Canada → Australia",
    tags: ["Country", "Songwriter"],
    owner: "ashley-gall",
    page: true,
    lede: "A rising star in the country music scene.",
    bio: [
      "Raised in a small town in Canada, Ashley made the life-changing decision to move to Australia on her own at just 19. Her love for music began early — she wrote and recorded her first album at nine years old in her dad’s studio.",
      "A prolific songwriter with over 100 songs written, Ashley aims to inspire and connect with young women through her own ups and downs. Her live performances are a testament to heartfelt lyrics and soulful melodies, captivating audiences wherever she goes.",
    ],
    releases: [{ title: "My Hometown", note: "Single", cover: "cover-my-hometown" }],
  },
  { slug: "chiggz", name: "Chiggz", image: "artist-chiggz", spotify: sp("4rxcNC4Af5eSLoUb4XIK5J"), tier: "collective" },
  { slug: "ribby247", name: "Ribby247", image: "artist-ribby247", spotify: sp("6LZdwXjVBOMwkPgglULJKh"), tier: "collective" },
  { slug: "yxng-ciiber", name: "Yxng Ciiber", image: "artist-yxng-ciiber", spotify: sp("66z6IthsTdKYvhCXC5w5Lt"), tier: "collective" },
  { slug: "ecosystem", name: "Eco$ystem", image: "artist-ecosystem", spotify: sp("42dkfArTdrcxq0NYRmo9rk"), tier: "collective" },
  { slug: "legend", name: "Legend", image: "artist-legend", spotify: sp("0QPs4yr2Za9ekUQqcbPYJW"), tier: "collective" },
  { slug: "lowkey", name: "Lowkey", image: "artist-lowkey", spotify: sp("1QFlILbai7c5GQMibs7jhl"), tier: "collective" },
  { slug: "mikesn3l", name: "MIKESN3L", image: "artist-mike-snell", spotify: sp("4aZ9yHdWk9I8b1lkFJxy4k"), tier: "collective", tags: ["Mike Snell’s artist project"] },
];

export const artist = (slug: string) => artists.find((a) => a.slug === slug);
export const globalArtists = artists.filter((a) => a.tier === "global");
export const collective = artists.filter((a) => a.tier === "collective");
export const artistPages = artists.filter((a) => a.page);

/** Credits via Mike Snell — shown as team credits, never as label signings. */
export const teamCredits = [
  "Kanye West",
  "Rick Ross",
  "Teyana Taylor",
  "Chris Brown",
  "Pusha T",
  "Kodak Black",
  "Ty Dolla $ign",
  "Lil Mosey",
  "Russ",
  "DaniLeigh",
  "DaBaby",
  "G-Eazy",
];
