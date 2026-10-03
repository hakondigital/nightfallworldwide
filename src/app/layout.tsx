import type { Metadata, Viewport } from "next";
import BookingProvider from "@/components/booking/Booking";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PlayerProvider from "@/components/player/Player";
import SmoothScroll from "@/components/providers/SmoothScroll";
import TransitionProvider from "@/components/providers/Transition";
import { site } from "@/lib/content/site";
import { archivo, display, fragment } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Nightfall Worldwide — Gold Coast recording studio, label services & artist collective",
    template: "%s — Nightfall Worldwide",
  },
  description: site.seoDescription,
  applicationName: site.name,
  keywords: [
    "Gold Coast recording studio",
    "Burleigh Heads studio",
    "mixing and mastering",
    "Mike Snell",
    "music distribution Australia",
    "playlist pitching",
    "sonic identity",
    "whitewall studio hire Gold Coast",
    "Nightfall Worldwide",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_AU",
    url: site.url,
    title: "Nightfall Worldwide",
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Nightfall Worldwide" }],
  },
  twitter: { card: "summary_large_image", title: "Nightfall Worldwide", description: site.description, images: ["/og.jpg"] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f3f0" },
    { media: "(prefers-color-scheme: dark)", color: "#070707" },
  ],
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#org`,
      name: site.name,
      url: site.url,
      email: site.email.admin,
      foundingDate: String(site.established),
      sameAs: [site.links.instagram, site.links.whitewallInstagram, site.links.beats],
      description: site.description,
    },
    {
      "@type": "LocalBusiness",
      "@id": `${site.url}/#studio`,
      name: "Nightfall Studios",
      parentOrganization: { "@id": `${site.url}/#org` },
      url: `${site.url}/studio`,
      email: site.email.studio,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        addressLocality: site.address.suburb,
        addressRegion: site.address.state,
        postalCode: site.address.postcode,
        addressCountry: "AU",
      },
      geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lon },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${site.url}/#whitewall`,
      name: "WhiteWall by Nightfall",
      parentOrganization: { "@id": `${site.url}/#org` },
      url: `${site.url}/whitewall`,
      email: site.email.studio,
      sameAs: [site.links.whitewallInstagram],
      address: {
        "@type": "PostalAddress",
        streetAddress: site.whitewallAddress.street,
        addressLocality: site.whitewallAddress.suburb,
        addressRegion: site.whitewallAddress.state,
        postalCode: site.whitewallAddress.postcode,
        addressCountry: "AU",
      },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" data-theme="day" className={`${archivo.variable} ${display.variable} ${fragment.variable}`}>
      <body>
        <a href="#main" className="t-label sr-only z-400 bg-rec px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
          Skip to content
        </a>
        <SmoothScroll>
          <TransitionProvider>
            <PlayerProvider>
              <BookingProvider>
                <Header />
                <main id="main">{children}</main>
                <Footer />
              </BookingProvider>
            </PlayerProvider>
          </TransitionProvider>
        </SmoothScroll>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
