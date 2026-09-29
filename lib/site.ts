export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolbox.denisetiawan.me").replace(/\/$/, "");
export const SITE_NAME = "Toolbox";

export type Lang = "id" | "en";
export const LANGS: Lang[] = ["id", "en"];
export const DEFAULT_LANG: Lang = "id";

/** Indonesian is the default language and lives at the root; English lives under /en. */
export function pathFor(lang: Lang, slug?: string): string {
  const base = lang === DEFAULT_LANG ? "" : `/${lang}`;
  return slug ? `${base}/${slug}` : base || "/";
}

export function otherLang(lang: Lang): Lang {
  return lang === "id" ? "en" : "id";
}
