import type { MediaName } from "@/lib/media.generated";
import type { TrackOwner } from "./tracks";

export type Member = {
  slug: TrackOwner;
  name: string;
  role: string;
  portrait: MediaName;
  alt?: MediaName;
  headline: string;
  bio: string[];
  /** as written for the Advertising & Film page */
  filmBio?: string;
  accolades?: string[];
  clients?: string[];
  link?: { label: string; href: string };
};

export const brandClients = [
  "Casio / G-Shock",
  "Jaguar",
  "Shell",
  "Princess Polly",
  "Sesion Tequila",
  "XXXX Brewery",
  "Coopers Brewery",
  "Maritimo",
  "Super Boost",
  "NRL",
  "Chevron",
  "Spendi",
  "Valley Eyewear",
  "Lark Whisky",
  "Balter Brewery",
  "Nutrition Warehouse",
  "Arksen",
  "HomeCorp",
  "Pappa Flock",
  "Bush Tucker",
  "Hyde Dynasty",
  "WWE",
];

export const team: Member[] = [
  {
    slug: "rob-rivers",
    name: "Rob Rivers",
    role: "Founder — Producer / Engineer / Songwriter",
    portrait: "team-rob-rivers",
    alt: "rob-rivers-studio",
    headline: "Putting the Gold Coast on the map as a global force of creativity.",
    bio: [
      "Rob Rivers has been producing music for over 15 years, starting Nightfall Worldwide as a place for local and international artists to come and create on the Gold Coast — with the aim of putting the city on the map as a global force of creativity.",
      "He has worked with huge artists such as NLE Choppa (US), ZieZie (UK), Lil Pump (US), Jarryd James (AUS) and MEZMURE (NZ/AUS), alongside a large number of local artists. His main strength: challenging artists to explore sounds and genres outside their current scope of creativity.",
      "Despite working with bigger international acts, his main passion is artist development and giving back to the community — giving growing artists access to the studio and producing them in his own time so they can compete on a global playing field.",
      "A multi-award winning producer and sonic identity strategist, Rob has worked with some of the world’s biggest and most influential brands, scored feature films and internationally recognised short films, and brings that diversity of talent to every Nightfall commercial project.",
    ],
    filmBio:
      "Rob Rivers is a multi-award winning producer and sonic identity strategist, having worked with some of the world’s biggest and most influential brands, as well as scoring feature films and various internationally recognised short films. Rob brings his diversity of talent to all our commercial projects.",
    accolades: ["8 × BADC Awards", "4 × Muse Creative Awards, New York"],
    clients: brandClients.filter((c) => c !== "WWE"),
  },
  {
    slug: "mezmure",
    name: "MEZMURE",
    role: "Songwriter / Producer / A&R",
    portrait: "team-mezmure",
    alt: "mezmure-hat",
    headline: "His real first name means ‘music’ in ancient Amharic.",
    bio: [
      "MEZMURE (F.K.A. Pharaoh SWAMi) arrived in New Zealand with his family as a refugee from Ethiopia — an outrageously charismatic artist whose real first name means ‘music’ in ancient Amharic.",
      "Synaesthesia coupled with a love for nature birthed his beautiful, raw and ethnic sound. Coupled with his ability to hear melodies and understand modern song structures, A&R was the natural progression from his artistry into the world of artist development.",
    ],
  },
  {
    slug: "mike-snell",
    name: "Mike Snell",
    role: "Producer / Engineer",
    portrait: "team-mike-snell",
    alt: "mike-snell-jersey",
    headline: "3 × Grammy-nominated. Multi-platinum. Over 1.8 billion streams.",
    bio: [
      "Mike Snell is a Grammy-nominated, multi-platinum and gold certified engineer, producer and songwriter. He was part of the #1 album for Teyana Taylor, and two #1 rap albums for Kanye West and Rick Ross as an engineer — as well as producing for Kodak Black, Ty Dolla $ign, Lil Mosey, Russ and more, amassing over 1.8 billion streams.",
      "He’s worked with artists such as Kanye West, Teyana Taylor, Rick Ross, NLE Choppa and Chris Brown. With the bold vision to score some of the leading films and commercial projects of the future, he’s bringing world-class experience into new domains.",
    ],
    filmBio:
      "Mike Snell is a 3× Grammy-nominated engineer and producer. He’s worked with artists such as Kanye West, Teyana Taylor, Rick Ross, NLE Choppa, Chris Brown and more. With the bold vision to score some of the leading films and commercial projects of the future, he’s bringing world-class experience into new domains.",
    accolades: ["3 × Grammy-nominated engineer", "Multi-platinum engineer & producer"],
    clients: ["WWE"],
    link: { label: "Full credits on Muso.ai", href: "https://credits.muso.ai/profile/d0806c6a-9d09-498b-b2cc-e3b687ab0a5d" },
  },
  {
    slug: "jarryd-james",
    name: "Jarryd James",
    role: "Songwriter / Producer",
    portrait: "team-jarryd-james",
    alt: "artist-jarryd-james",
    headline: "ARIA charts. Platinum records. Millions of streams.",
    bio: [
      "Jarryd James, born in Brisbane, has featured in the ARIA charts numerous times and worked with international producers such as Joel Little, Clams Casino, FrancisGotHeat, M-Phazes and more.",
      "With millions of streams and certified platinum records, his songwriting and production style is gaining momentum at Nightfall.",
    ],
  },
];

export const member = (slug: string) => team.find((m) => m.slug === slug);

export const awards = [
  { count: 8, name: "BADC Awards", detail: "Coopers Brewery, XXXX, Labart short film", logo: "award-badc" as MediaName },
  { count: 4, name: "Muse Creative Awards, New York", detail: "Coopers Brewery", logo: "award-muse" as MediaName },
];
