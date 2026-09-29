import type { Metadata } from "next";
import { t } from "./i18n";
import { LANGS, SITE_NAME, SITE_URL, pathFor, type Lang } from "./site";
import type { Tool } from "./tools";

const alternates = (lang: Lang, slug?: string): Metadata["alternates"] => ({
  canonical: pathFor(lang, slug),
  languages: { ...Object.fromEntries(LANGS.map((l) => [l, pathFor(l, slug)])), "x-default": pathFor("id", slug) },
});

export function homeMetadata(lang: Lang): Metadata {
  const d = t(lang);
  const title = `${SITE_NAME}: ${d.heroTitle}`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: d.tagline,
    alternates: alternates(lang),
    openGraph: { title, description: d.tagline, url: pathFor(lang), siteName: SITE_NAME, locale: lang === "id" ? "id_ID" : "en_US", type: "website" },
  };
}

export function toolMetadata(tool: Tool, lang: Lang): Metadata {
  const title = `${tool.title[lang]} | ${SITE_NAME}`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: tool.description[lang],
    keywords: tool.keywords[lang],
    alternates: alternates(lang, tool.slug),
    openGraph: { title, description: tool.description[lang], url: pathFor(lang, tool.slug), siteName: SITE_NAME, locale: lang === "id" ? "id_ID" : "en_US", type: "website" },
  };
}
