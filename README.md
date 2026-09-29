# Toolbox

Free, private, in-browser file and image tools (planned home: `toolbox.denisetiawan.me`).
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

Optional env vars (set at build time): `NEXT_PUBLIC_SITE_URL` (default `https://toolbox.denisetiawan.me`),
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

## Deployment (GitHub Actions → your server)

`.github/workflows/deploy.yml` runs typecheck, tests, and build on every PR and push. A push to `master`
(or a manual **Run workflow**) then uploads `out/` over SSH/rsync to `$DEPLOY_PATH/releases/<commit>` and atomically
switches the `$DEPLOY_PATH/current` symlink. The 5 newest releases are kept, so rollback is
`ln -sfn releases/<older-sha> current` on the server.

**One-time server setup**

1. DNS: add an `A` (and `AAAA`) record for `toolbox` pointing at the server.
2. Create the deploy folder and a dedicated deploy user (no sudo needed): `mkdir -p /var/www/toolbox/releases`,
   owned by that user, with nginx able to read it.
3. Install `rsync` on the server and add the public key to the deploy user's `~/.ssh/authorized_keys`.
   Generate a key just for this: `ssh-keygen -t ed25519 -f deploy_key -N "" -C github-deploy`.
4. Nginx: use `deploy/nginx.toolbox.conf` (adjust `root`), then `certbot --nginx -d toolbox.denisetiawan.me` for HTTPS.
   The nginx worker user (usually `www-data`) must be able to read the files: every parent folder of `$DEPLOY_PATH`
   needs the `o+x` bit and the release files `o+r` (e.g. `chmod 755 /var/www/toolbox`). A `403 Forbidden` after the first
   deploy almost always means this. Check with `sudo -u www-data ls /var/www/toolbox/current`.
   Then `sudo nginx -t && sudo systemctl reload nginx`.

**GitHub repo → Settings → Secrets and variables → Actions → Secrets**

| Secret | Value |
|---|---|
| `SSH_HOST` | server hostname or IP |
| `SSH_USER` | deploy user |
| `SSH_PORT` | optional, defaults to 22 |
| `SSH_PRIVATE_KEY` | contents of `deploy_key` (the private half) |
| `SSH_KNOWN_HOSTS` | output of `ssh-keyscan -p <port> <host>`, checked against the real host key |
| `DEPLOY_PATH` | e.g. `/var/www/toolbox` |

Optional **Variables** (same page): `PLAUSIBLE_DOMAIN` or `UMAMI_WEBSITE_ID` (+ `UMAMI_SRC`) enable analytics at build time.
