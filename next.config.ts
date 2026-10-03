import type { NextConfig } from "next";

// Old Squarespace URLs → new routes, so existing links and search rankings survive the move.
const legacy: [string, string][] = [
  ["/theteam", "/team"],
  ["/robrivers", "/team#rob-rivers"],
  ["/studiobookings", "/studio#packages"],
  ["/feesandlicences", "/rates"],
  ["/advertisingandfilm", "/advertising-film"],
  ["/thearchive", "/distribution"],
  ["/uploadform", "/distribution/upload"],
  ["/pitching", "/distribution"],
  ["/prerelease", "/music/kily-safari"],
  ["/mezmure", "/music/mezmure"],
  ["/mezmure-1", "/music/mezmure"],
  ["/ashleygall", "/artists"],
  ["/chantel", "/music/chantel"],
  ["/whatwedo", "/"],
  ["/home-1", "/"],
  ["/new-page", "/"],
  ["/member-site-homepage-1", "/"],
  ["/mixing-mastering/p/2for1", "/mixing-mastering#2-for-1"],
  ["/mixing-mastering/p/mix-master-by-grammy-nominated-engineer", "/mixing-mastering#mike-snell"],
  ["/mixing-mastering/p/mix-master-by-grammy-nominated-engineer-hjzhe-tlh6d", "/mixing-mastering#nightfall-collective"],
  ["/mixing-mastering/p/mix-master-by-grammy-nominated-engineer-hjzhe-tlh6d-8nf4r", "/mixing-mastering#artist-spotlight"],
];

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Acuity (payments) and Spotify (playback) run in iframes, so only lock down hardware APIs.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), usb=()" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  async redirects() {
    return [
      ...legacy.map(([source, destination]) => ({ source, destination, permanent: true })),
      { source: "/mixing-mastering/p/:slug*", destination: "/mixing-mastering", permanent: true },
      { source: "/cart", destination: "/mixing-mastering", permanent: false },
    ];
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
