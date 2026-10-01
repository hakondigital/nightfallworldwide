# Nightfall Worldwide — website

Next.js 16 (App Router, React 19, TypeScript), Tailwind v4, GSAP 3 + ScrollTrigger/SplitText, Lenis. Deployed to Cloudflare Workers with OpenNext.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (all pages prerender statically)
npm run preview      # build + run the Cloudflare worker locally
npm run deploy       # build + deploy to Cloudflare (needs `npx wrangler login` once)
```

## Structure

Nightfall runs three separate businesses, and the site is organised around them — the same way the original site was:

| Business | Pages | Main action (header + hero, same spot on every page) |
| --- | --- | --- |
| **Music** | `/music` hub, then Mixing & Mastering, Studio, Distribution, Artists, Team, Rates (music sub-nav under the header) | Book a session / Book a mix |
| **Advertising & Film** | `/advertising-film` | Enquire now |
| **WhiteWall** | `/whitewall` | Book now |

The landing page (`/`) is only the globe, the wordmark and the three doors into those businesses.

## Concept

**Day → night.** Pages open in daylight (paper `#f3f3f0` / ink `#0a0a0a`) and flip to night as the showreels and the footer scroll into view — ending on _Nightfall will always come again_. The footer clock counts down to the real nightfall (end of civil twilight) over Burleigh Heads.

- **Type:** every title, button and price is Helvetica Bold, matching the logo. It's self-hosted (`src/app/_fonts/`, a TeX Gyre Heros subset under the GUST Font License) so Windows shows Helvetica rather than substituting Arial. Body copy is Archivo; small data labels are Fragment Mono.
- **Signal colour:** `#ff3b14` — the REC light. Used sparingly for live/active states.
- **The globe:** `src/components/ui/Globe.tsx` redraws the logo in 3D on canvas (orbits, Australia, arcs from the Gold Coast to collaborators' cities).
- **Logo:** the real Nightfall lockup and badge, exported to `public/brand/` by `npm run brand`.

## Where things live

| What | Where |
| --- | --- |
| Navigation, businesses, emails, links | `src/lib/content/site.ts` |
| Prices, bookable packages, engineers, gear, T&Cs | `src/lib/content/services.ts` |
| Form topics and multi-step form fields | `src/lib/content/forms.ts` |
| Tracks (Spotify ids, covers, credits) | `src/lib/content/tracks.ts` |
| Artists & roster | `src/lib/content/artists.ts` |
| Team bios | `src/lib/content/team.ts` |
| Pages | `src/app/**/page.tsx` |
| Landing | `src/components/home/Landing.tsx` |
| Booking drawer, package cards | `src/components/booking/*` |
| Shared UI (PageHero, Media, Globe, Rail, Accordion…) | `src/components/ui/*` |
| Legacy Squarespace URL redirects | `next.config.ts` |

### Common edits

- **Change a price or package** — `studioPackages` / `whitewallPackages` in `services.ts`. Each `id` is the Acuity appointment type, so its **Book** button opens that package's calendar directly.
- **Add or edit a mix engineer** — `engineers` in `services.ts`. `perTrack` drives the estimate in the order form; leave it out for "price on request". DON!'s photo, credits and rate are still placeholders (marked `TODO(client)`).
- **Artists** — `artists.ts`. `page: true` gives an artist a profile at `/music/<slug>`; everyone else links to Spotify.

## Images & video

Originals live in `media-src/`. After adding or replacing a file there, run:

```bash
npm run media     # responsive WebP sizes + typed manifest, release covers, and web video
npm run brand     # logo exports, favicon, apple icon, social share image
```

Reference images by file name (without extension), e.g. `<Media name="studio-control-room" alt="…" />`. The manifest (`src/lib/media.generated.ts`) is generated — don't edit it by hand. Release covers are downloaded once and served from `/media/covers/`, so they don't depend on Spotify's image CDN.

## Integrations

- **Bookings** — Acuity. Studio and WhiteWall packages open their own calendar inside the booking drawer (`schedule.php?owner=28156026&appointmentType=<id>`).
- **Mix orders** — the Mix & master tab and `/mixing-mastering#order` collect engineer, package, stems, tracks and contact details with a live estimate. No payment is taken; the studio confirms and sends a payment link.
- **Forms** — enquiry, mix order, release upload and playlist pitching. Set Formspree endpoints in `.env` (see `.env.example`) to receive them by email; without them, each form opens a pre-filled email to the right inbox.
- **Music previews** — Spotify iFrame API. Clicking any sleeve or tracklist row plays in the dock (30-second previews logged out, full tracks for signed-in Spotify users).
- **Distribution portal** — links out to distro.direct (it can't be embedded on other domains).
- **Payments** — add Stripe Payment Links (or similar) per deal variant in `checkoutLinks` in `services.ts`; until then, "Order" opens the mix order form.

## Going live on nightfallworldwide.com

1. `npx wrangler login`, then `npm run deploy`.
2. In `wrangler.jsonc`, uncomment the `routes` block once the domain's DNS is on Cloudflare.
3. Old URLs (`/theteam`, `/studiobookings`, `/feesandlicences`, `/mezmure`, product pages…) permanently redirect to their new homes.
