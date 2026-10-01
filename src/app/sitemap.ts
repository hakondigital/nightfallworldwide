import type { MetadataRoute } from "next";
import { artistPages } from "@/lib/content/artists";
import { site } from "@/lib/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: [string, number][] = [
    ["/", 1],
    ["/music", 0.9],
    ["/studio", 0.9],
    ["/mixing-mastering", 0.9],
    ["/distribution", 0.8],
    ["/distribution/upload", 0.6],
    ["/distribution/pitching", 0.6],
    ["/advertising-film", 0.8],
    ["/whitewall", 0.8],
    ["/team", 0.7],
    ["/rates", 0.7],
    ["/contact", 0.6],
  ];
  return [
    ...routes.map(([path, priority]) => ({ url: `${site.url}${path}`, lastModified: now, priority })),
    ...artistPages.map((a) => ({ url: `${site.url}/music/${a.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
