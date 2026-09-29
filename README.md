# Toolbox

Free, private, in-browser file and image tools (planned home: `tools.denisetiawan.me`).
Files are processed on the user's device: no upload, no accounts. See the PRD for goals and scope.

**Stack:** Next.js (App Router, static export) · TypeScript · Tailwind CSS 4.

## Status

| Tool | Route | State |
|---|---|---|
| Compress image (target KB) | `/compress-image` | Done (reference implementation) |
| Resize, Convert, Remove background, Merge PDF, QR code | | Registered as "coming soon" |

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm test
npm run build      # static site in ./out
```

Optional env vars (set at build time): `NEXT_PUBLIC_SITE_URL` (default `https://tools.denisetiawan.me`),
`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` or `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (+ `NEXT_PUBLIC_UMAMI_SRC`) for analytics.

## Structure

- `lib/tools.ts`: tool registry, the single source of truth for the home grid, sitemap, and pages.
- `lib/i18n.ts`: UI strings. Indonesian is the default (root routes), English lives under `/en`.
- `components/`: `ToolLayout` (H1, how-to, FAQ, JSON-LD), `Dropzone`, `ResultPanel`, `PageShell`.
- `components/tools/`: one component per tool, registered lazily in `components/tools/index.tsx`.
- `lib/image/`: compression. `compress-core.ts` is the pure target-size search, `encoder.ts` does the canvas work,
  `compress.worker.ts` runs it off the main thread (with a main-thread fallback).

## Adding a tool

1. Add an entry to `lib/tools.ts` with `ready: true` and its how-to/FAQ text (id + en).
2. Create `components/tools/<Name>.tsx` (default export, prop `lang`) using `Dropzone` and `ResultPanel`.
3. Register it in `components/tools/index.tsx`. Pages, sitemap, and the home grid pick it up automatically.

## Notes

- Compression uses the browser's own canvas JPEG/WebP encoders (no third-party codecs, so no license concerns).
  Target size is found by binary search on quality, then by shrinking dimensions if quality alone can't reach it.
- Only claim "processed on your device" for tools that truly do it (`clientSide` flag in the registry).
- Background removal must use a commercially licensed model (not BRIA RMBG); verify before shipping.
