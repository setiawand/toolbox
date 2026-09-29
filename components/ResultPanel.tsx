"use client";

import type { ReactNode } from "react";
import { formatBytes } from "@/lib/format";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/site";

interface Side {
  url: string;
  bytes: number;
  width?: number;
  height?: number;
}

interface Props {
  lang: Lang;
  original: Side;
  result: Side;
  filename: string;
  /** Status notes (target reached, downscaled, ...) shown above the download button. */
  children?: ReactNode;
}

function Preview({ label, side, lang }: { label: string; side: Side; lang: Lang }) {
  const r = t(lang).result;
  return (
    <figure className="min-w-0 flex-1">
      <div className="flex h-52 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[repeating-conic-gradient(#e2e8f0_0_25%,#f8fafc_0_50%)] bg-[length:16px_16px] dark:border-slate-700 dark:bg-[repeating-conic-gradient(#1e293b_0_25%,#0f172a_0_50%)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={side.url} alt={label} className="max-h-full max-w-full object-contain" />
      </div>
      <figcaption className="mt-2 text-sm">
        <span className="font-semibold">{label}</span>
        <span className="text-slate-500 dark:text-slate-400">
          {" · "}
          {formatBytes(side.bytes, lang)}
          {side.width && side.height ? ` · ${r.dimensions(side.width, side.height)}` : ""}
        </span>
      </figcaption>
    </figure>
  );
}

export default function ResultPanel({ lang, original, result, filename, children }: Props) {
  const r = t(lang).result;
  const savedPct = Math.round((1 - result.bytes / original.bytes) * 100);
  return (
    <section aria-live="polite" className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Preview label={r.original} side={original} lang={lang} />
        <Preview label={r.result} side={result} lang={lang} />
      </div>
      <div className="mt-4 space-y-2">
        {savedPct > 0 && <p className="text-base font-semibold text-emerald-700 dark:text-emerald-400">{r.saved(savedPct)}</p>}
        {children}
      </div>
      <a
        href={result.url}
        download={filename}
        className="mt-4 flex min-h-12 items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-base font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {r.download}
      </a>
    </section>
  );
}
