import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// The site is fully prerendered (no ISR), so prerendered pages — including the
// /music/[slug] artist pages — are served straight from Workers static assets.
//
// Cache interception stays OFF: it answers Next 16's segment-prefetch requests
// (Next-Router-Segment-Prefetch: /_tree) with the whole page's RSC payload,
// which the client router rejects and re-requests in a tight loop — ~100
// worker requests a second from every open tab. Letting the Next server in
// the worker handle those requests is a hair slower and completely safe.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: false,
});
