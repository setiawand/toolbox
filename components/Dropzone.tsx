"use client";

import { useId, useRef, useState } from "react";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/site";

interface Props {
  lang: Lang;
  accept: string[];
  /** Human-readable list for messages, e.g. "JPG, PNG, WebP". */
  acceptLabel: string;
  maxMb: number;
  onFile: (file: File) => void;
  disabled?: boolean;
}

export default function Dropzone({ lang, accept, acceptLabel, maxMb, onFile, disabled }: Props) {
  const d = t(lang).dropzone;
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle = (file: File | undefined) => {
    if (!file) return;
    if (!accept.includes(file.type)) return setError(d.unsupported(acceptLabel));
    if (file.size > maxMb * 1024 * 1024) return setError(d.tooLarge(maxMb));
    setError(null);
    onFile(file);
  };

  return (
    <div>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          if (!disabled) handle(e.dataTransfer.files[0]);
        }}
        className={`flex min-h-44 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors focus-within:ring-2 focus-within:ring-indigo-500 ${
          over
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40"
            : "border-slate-300 bg-white hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-900"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        <span aria-hidden className="text-3xl">
          📷
        </span>
        <span className="text-base font-semibold">{d.prompt}</span>
        <span className="text-sm text-slate-500 dark:text-slate-400">{d.orDrop}</span>
        <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">{d.hint(acceptLabel, maxMb)}</span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept.join(",")}
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            handle(e.target.files?.[0]);
            e.target.value = ""; // allow re-selecting the same file
          }}
        />
      </label>
      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
