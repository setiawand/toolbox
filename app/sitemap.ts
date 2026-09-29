import type { MetadataRoute } from "next";
import { LANGS, SITE_URL, pathFor } from "@/lib/site";
import { readyTools } from "@/lib/tools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs: (string | undefined)[] = [undefined, ...readyTools.map((t) => t.slug)];
  return slugs.flatMap((slug) =>
    LANGS.map((lang) => ({
      url: SITE_URL + pathFor(lang, slug),
      changeFrequency: "monthly" as const,
      priority: slug ? 0.8 : 1,
      alternates: { languages: Object.fromEntries(LANGS.map((l) => [l, SITE_URL + pathFor(l, slug)])) },
    })),
  );
}
