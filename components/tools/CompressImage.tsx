"use client";

import { useEffect, useRef, useState } from "react";
import Dropzone from "@/components/Dropzone";
import ResultPanel from "@/components/ResultPanel";
import { compressImage, CompressError, type CompressResult } from "@/lib/image/compress";
import type { OutputMime } from "@/lib/image/encoder";
import { outputFilename } from "@/lib/format";
import { t } from "@/lib/i18n";
import { getTool } from "@/lib/tools";
import type { Lang } from "@/lib/site";

const PRESETS_KB = [100, 200, 500];
const tool = getTool("compress-image")!;

type Mode = "target" | "quality";

interface Done {
  result: CompressResult;
  resultUrl: string;
  targetKb: number | null;
  mime: OutputMime;
}

const chip = (active: boolean) =>
  `min-h-11 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
    active
      ? "border-indigo-600 bg-indigo-600 text-white"
      : "border-slate-300 bg-white hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900"
  }`;

export default function CompressImage({ lang }: { lang: Lang }) {
  const c = t(lang).compress;
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("target");
  const [preset, setPreset] = useState<number | "custom">(200);
  const [customKb, setCustomKb] = useState("300");
  const [quality, setQuality] = useState(75);
  const [mime, setMime] = useState<OutputMime>("image/jpeg");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState<Done | null>(null);
  const [error, setError] = useState<string | null>(null);
  const runId = useRef(0);

  // Object URLs hold the file in memory until revoked.
  useEffect(() => () => void (originalUrl && URL.revokeObjectURL(originalUrl)), [originalUrl]);
  useEffect(() => () => void (done && URL.revokeObjectURL(done.resultUrl)), [done]);

  const targetKb = preset === "custom" ? Math.round(Number(customKb)) : preset;
  const targetValid = mode === "quality" || (Number.isFinite(targetKb) && targetKb >= 10 && targetKb <= 20000);

  const pick = (f: File) => {
    runId.current++; // discard any in-flight run
    setFile(f);
    setOriginalUrl(URL.createObjectURL(f));
    setDone(null);
    setError(null);
    setBusy(false);
  };

  const run = async () => {
    if (!file || !targetValid) return;
    const id = ++runId.current;
    setBusy(true);
    setError(null);
    setDone(null);
    setProgress(0);
    try {
      // Always compresses from the untouched original, never from a previous result.
      const result = await compressImage(
        {
          file,
          mime,
          mode: mode === "target" ? { kind: "target", targetBytes: targetKb * 1024 } : { kind: "quality", quality: quality / 100 },
        },
        (f) => id === runId.current && setProgress(f),
      );
      if (id !== runId.current) return;
      setDone({ result, resultUrl: URL.createObjectURL(result.blob), targetKb: mode === "target" ? targetKb : null, mime });
    } catch (e) {
      if (id !== runId.current) return;
      setError(c.errors[e instanceof CompressError ? e.code : "generic"]);
    } finally {
      if (id === runId.current) setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <Dropzone lang={lang} accept={tool.accept} acceptLabel="JPG, PNG, WebP" maxMb={tool.maxMb} onFile={pick} disabled={busy} />

      {file && (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <p className="truncate text-sm text-slate-600 dark:text-slate-400" title={file.name}>
            {file.name}
          </p>

          <div role="group" aria-label="Mode" className="flex gap-2">
            <button type="button" className={chip(mode === "target")} aria-pressed={mode === "target"} onClick={() => setMode("target")}>
              {c.modeTarget}
            </button>
            <button type="button" className={chip(mode === "quality")} aria-pressed={mode === "quality"} onClick={() => setMode("quality")}>
              {c.modeQuality}
            </button>
          </div>

          {mode === "target" ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold">{c.targetLabel}</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS_KB.map((kb) => (
                  <button key={kb} type="button" className={chip(preset === kb)} aria-pressed={preset === kb} onClick={() => setPreset(kb)}>
                    {kb} KB
                  </button>
                ))}
                <button type="button" className={chip(preset === "custom")} aria-pressed={preset === "custom"} onClick={() => setPreset("custom")}>
                  {c.custom}
                </button>
              </div>
              {preset === "custom" && (
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold">{c.customLabel}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={10}
                    max={20000}
                    value={customKb}
                    onChange={(e) => setCustomKb(e.target.value)}
                    className="min-h-11 w-40 rounded-xl border border-slate-300 bg-white px-3 dark:border-slate-700 dark:bg-slate-950"
                  />
                </label>
              )}
            </div>
          ) : (
            <label className="block space-y-2">
              <span className="flex justify-between text-sm font-semibold">
                <span>{c.qualityLabel}</span>
                <span>{quality}%</span>
              </span>
              <input
                type="range"
                min={30}
                max={95}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="h-11 w-full accent-indigo-600"
              />
              <span className="block text-xs text-slate-500 dark:text-slate-400">{c.qualityHint}</span>
            </label>
          )}

          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold">{c.formatLabel}</legend>
            <div className="flex gap-2">
              <button type="button" className={chip(mime === "image/jpeg")} aria-pressed={mime === "image/jpeg"} onClick={() => setMime("image/jpeg")}>
                JPG
              </button>
              <button type="button" className={chip(mime === "image/webp")} aria-pressed={mime === "image/webp"} onClick={() => setMime("image/webp")}>
                WebP
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{mime === "image/jpeg" ? c.formatJpgNote : c.formatWebpNote}</p>
          </fieldset>

          <p className="text-xs text-slate-500 dark:text-slate-400">🔒 {c.stripNote}</p>

          <button
            type="button"
            onClick={run}
            disabled={busy || !targetValid}
            className="relative flex min-h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-indigo-600 px-5 py-3 text-base font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy && (
              <span aria-hidden className="absolute inset-y-0 left-0 bg-indigo-800/50 transition-[width]" style={{ width: `${Math.round(progress * 100)}%` }} />
            )}
            <span className="relative">{busy ? c.working : c.button}</span>
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {file && originalUrl && done && (
        <ResultPanel
          lang={lang}
          original={{ url: originalUrl, bytes: file.size }}
          result={{ url: done.resultUrl, bytes: done.result.blob.size, width: done.result.width, height: done.result.height }}
          filename={outputFilename(file.name, "compressed", done.mime)}
        >
          {done.targetKb !== null &&
            (done.result.reachedTarget ? (
              <p className="text-sm text-slate-700 dark:text-slate-300">{c.reached(done.targetKb)}</p>
            ) : (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">{c.notReached(done.targetKb)}</p>
            ))}
          {done.result.scale < 1 && <p className="text-sm text-slate-700 dark:text-slate-300">{c.downscaled(Math.round(done.result.scale * 100))}</p>}
          {done.result.blob.size >= file.size && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">{c.biggerThanOriginal}</p>
          )}
        </ResultPanel>
      )}
    </div>
  );
}
