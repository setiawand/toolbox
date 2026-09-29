import Link from "next/link";
import { t } from "@/lib/i18n";
import { pathFor, type Lang } from "@/lib/site";
import type { Tool } from "@/lib/tools";

export default function ToolCard({ tool, lang }: { tool: Tool; lang: Lang }) {
  const d = t(lang);
  const body = (
    <>
      <span aria-hidden className="text-2xl">
        {tool.icon}
      </span>
      <span className="mt-2 block text-base font-semibold">{tool.name[lang]}</span>
      <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">{tool.description[lang]}</span>
      {!tool.ready && (
        <span className="mt-3 inline-block rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {d.soon}
        </span>
      )}
    </>
  );
  const base = "block rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900";
  return tool.ready ? (
    <Link href={pathFor(lang, tool.slug)} className={`${base} transition-colors hover:border-indigo-400 focus-visible:outline-2 focus-visible:outline-indigo-600`}>
      {body}
    </Link>
  ) : (
    <div className={`${base} opacity-70`} aria-disabled="true">
      {body}
    </div>
  );
}
