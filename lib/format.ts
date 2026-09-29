export function formatBytes(bytes: number, lang: "id" | "en" = "id"): string {
  const nf = (n: number, digits: number) =>
    new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US", { maximumFractionDigits: digits }).format(n);
  if (bytes < 1024) return `${nf(bytes, 0)} B`;
  if (bytes < 1024 * 1024) return `${nf(bytes / 1024, 1)} KB`;
  return `${nf(bytes / 1024 / 1024, 2)} MB`;
}

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/webp": "webp", "image/png": "png" };

export function extForMime(mime: string): string {
  return EXT[mime] ?? "bin";
}

/** "photo.final.png" + "compressed" + "image/jpeg" -> "photo.final-compressed.jpg" */
export function outputFilename(original: string, suffix: string, mime: string): string {
  const dot = original.lastIndexOf(".");
  const stem = dot > 0 ? original.slice(0, dot) : original;
  return `${stem}-${suffix}.${extForMime(mime)}`;
}
