import Link from "next/link";
import type { ReactNode } from "react";
import { t } from "@/lib/i18n";
import { otherLang, pathFor, type Lang } from "@/lib/site";

/** Header + footer around every page. `slug` lets the language switch land on the same tool. */
export default function PageShell({ lang, slug, children }: { lang: Lang; slug?: string; children: ReactNode }) {
  const d = t(lang);
  const other = otherLang(lang);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-10 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-slate-900">
        {d.skip}
      </a>
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href={pathFor(lang)} className="text-lg font-bold tracking-tight">
            🧰 {d.brand}
          </Link>
          <Link
            href={pathFor(other, slug)}
            hrefLang={other}
            lang={other}
            aria-label={d.switchLabel}
            className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-slate-800"
          >
            {d.switchTo}
          </Link>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-4xl px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p>{d.privacyNote}</p>
        <p className="mt-1">{d.footer}</p>
      </footer>
    </>
  );
}
