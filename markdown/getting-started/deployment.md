---
title: Deployment
route: /Documentation/Deployment
navLabel: Deployment
section: Getting Started
group: Deployment
order: 12
description: Host a Slice app with Express (slice start) or as a static site (slice export), including GitHub Pages, Vercel, nginx and S3.
component: DeploymentDocumentation
tags: [deployment, hosting, static, express, github-pages]
---

# Deployment

## Overview

A Slice app can be served in two ways:

| Mode | Command | Runtime | Output |
|---|---|---|---|
| Express | `slice start` | Node + Express | `dist/` |
| Static | `slice export` | Any static file host | `dist-static/` |

Both start from the same production build. `slice build` compiles the app into
`dist/`; `slice export` reads that build and writes a flattened, host-ready copy
to `dist-static/`.

Use **Express** when you need server middleware, `/api/*` routes, server-side
headers, or a long-running Node process. Use **static** when the app is entirely
client-side and you want Cloudflare Pages, Netlify, Vercel, nginx, GitHub Pages
or S3 + CloudFront.

:::tip
The export is **root-only**. Serve it at the root of a domain
(`https://example.com/`) or a subdomain (`https://app.example.com/`). Subpath
hosting (`https://user.github.io/repo/`) is not supported.
:::

## Build once, deploy twice

```bash
slice build
```

`dist/` is the Express/serverless layout:

```text
dist/
  App/                 # shell: index.html, index.js, style.css
  bundles/             # runtime bundles + bundle.config.json
  Slice/Slice.js       # self-contained runtime
  public/              # Themes, Styles, images, PWA, SEO
  locales/             # translator dictionaries (when enabled)
  routes.js
  sliceConfig.json
  slice-env.json
  slice-env.generated.js
```

`slice export` flattens `dist/public/*` to the root, creates `index.html` and
`404.html`, prerenders routes when SEO is configured, copies the env pair, and
writes host rules. `dist-static/` is the folder you upload.

Why not a single `dist`? `dist/` must keep the shape Express serves
(`App/` at `/App`, `public/` at `/`, explicit root files). A static host needs a
different shape (`public/*` at `/`, root `index.html`, `404.html`). Keeping the
artifacts separate makes the upload boundary explicit and avoids breaking
`slice start`. See [Static export](#static-export) below.

New projects get `dist-static/` in `.gitignore`. If your project predates the
export command, add it yourself.

## Express hosting

```bash
slice build
slice start
```

`slice start`:

- requires `src/` and `api/` (the server entrypoint lives in `api/index.js`),
- serves `dist/` in production,
- runs `slice build` automatically if `dist/` or
  `dist/bundles/bundle.config.json` is missing,
- resolves the port as `--port` → `sliceConfig.server.port` → `3000`; if that
  port is busy it tries `port + 1`,
- keeps `slice dev` for development (`src/`, HMR).

Production exposes only:

- `dist/public/*` at `/` (Themes, Styles, images, PWA),
- `/App/*`,
- `/routes.js` and `/sliceConfig.json`,
- `/bundles/*` and the legacy `/dist/bundles/*` mirror,
- `/Slice/Slice.js`,
- `/slice-env.json` and `/slice-env.generated.js`,
- `/service-worker.js` and `/manifest.json`,
- translator dictionaries under their configured folder.

It does **not** expose `/Components`, the rest of the `/dist` tree, `.map`,
`.d.ts`, `.env`, `package.json` or `node_modules`. A real `404` requires SEO; see
[SEO and Share Cards](/Documentation/Architecture/SEO). Without SEO the fallback
returns the shell with `200` (a soft 404).

:::note
The framework persists `server.port` and `server.host` in `sliceConfig.json`.
They are configuration, not secrets. Do not put tokens, passwords or private
keys in `sliceConfig.json`, `routes.js`, `bundle.config.json` or
`slice-env.json`: every one of them is public in both hosting modes.
:::

## Static export

```bash
slice build
slice export --from-dist --host cloudflare
```

Or let the exporter build first:

```bash
slice export --host cloudflare
```

`--from-dist` is useful in CI when the build already ran and was cached.

### Output

```text
dist-static/
  index.html                 # shell, or the prerendered "/" page
  App/
  bundles/
  Slice/Slice.js
  images/ Styles/ Themes/ ...  # flattened from dist/public
  locales/
  routes.js
  sliceConfig.json
  sitemap.xml robots.txt manifest.json service-worker.js
  slice-env.json
  slice-env.generated.js
  <route>/index.html         # prerendered literal routes
  404.html
  _redirects | vercel.json | nginx.conf | .nojekyll
```

`Components/` is pruned by default: every component used at runtime is in a
bundle, and Express production also 404s `/Components`. `--keep-components` is a
debugging escape and the CLI warns that component source becomes fetchable.

The export is an allowlist. It never publishes `utils/`, `AppConfig.js`,
`slice-events.generated.js`, generated `.d.ts`, `.map`, `.map.br`, `.map.gz`,
`.env*`, `package.json`, lockfiles, `node_modules` or `.git`. If a file is not in
the allowlist, it is not uploaded.

### Options

| Flag | Default | Notes |
|---|---|---|
| `-o, --out <dir>` | `dist-static` | Validated before writing. `src`, `dist`, `api`, `.`, ancestors, paths outside the project and existing folders that are not a previous export are rejected. |
| `--from-dist` | off | Reuse `dist/` instead of running `slice build`. |
| `--host <name>` | `cloudflare` | `cloudflare`, `netlify`, `vercel`, `nginx`, `github`, `s3`, `none`. |
| `--seo <file>` | auto | `seo.json` / `public/seo.json`. |
| `--origin <url>` | manifest | Canonical/OG origin override. |
| `--images <file>` | auto | Social card manifest (`public/og/manifest.json`). |
| `--no-prerender` | off | Shell + SPA fallback only. |
| `--spa` | off | Unknown routes go to `index.html` (soft 404). |
| `--keep-components` | off | Ship `Components/` (debug; source is fetchable). |
| `--check` | off | Validate an existing export; write nothing. |
| `--dry-run` | off | Report what would be written. |
| `--sourcemap` | off | Delegated to build; maps are filtered from the export. |
| `--hash-filenames` | off | Delegated to build. |
| `--compress` | off | Delegated to build. `.br`/`.gz` siblings are copied; the host must be configured to serve them (`brotli_static`/`gzip_static`, etc.). |
| `--no-minify` | off | Debug only; readable bundles are still source. |
| `--no-obfuscate` | off | Delegated to build. |

### 404 and redirects

With SEO:

- every literal route is prerendered to `<route>/index.html`,
- `404.html` is a real not-found page with `noindex`,
- there is no catch-all, so unknown routes get a real 404,
- locale redirects are written as host rules (`_redirects`, `vercel.json`,
  nginx `location`) or as portable HTML `meta refresh` pages for hosts without
  server rules (GitHub Pages, S3, `--host none`).

`--spa` restores the client-router fallback, but the mechanics depend on the host:

| Host | `--spa` behavior |
|---|---|
| Cloudflare Pages | Omits `404.html`; Pages auto-SPA serves the root with `200`. Never write a `_redirects` catch-all. |
| Netlify | Adds `/*  /index.html  200`; existing files still win. |
| Vercel | Adds a `/(.*)` rewrite; the filesystem wins first. |
| nginx | `try_files $uri $uri/ /index.html;`. |
| GitHub Pages | Writes the shell as `404.html`; unknown routes render the app with status `404`. |
| S3 / CloudFront | Writes the shell as `404.html`; use a CloudFront function for a true `200`. |
| `none` | Writes the shell as `404.html`; your server decides the status. |

Use `--spa` only when the router must handle deep links that were not prerendered.

Without SEO the shell is the only page and the SPA fallback is on by default.

### Dynamic routes

`${param}` routes cannot be enumerated. Two options:

1. List concrete values in `seo.json`:

   ```json
   {
     "routes": {
       "/projects/${slug}": {
         "sitemap": { "paths": ["alpha", "beta"] }
       }
     }
   }
   ```

2. Pass `--spa` and let the client router resolve the route.

## Backend routes (`/api`)

A static export is just files: **there is no Express and no `/api/*`**. Do not
point `/api` at the SPA fallback; it returns HTML, not JSON.

If the app needs backend routes, use the Express server that ships with Slice:

```bash
slice build
slice start
```

Add your routes in `api/index.js`, before `start()` mounts the terminal fallback:

```js title="api/index.js"
import { createSliceServer } from 'slicejs-web-framework/api/framework/server.js';

const { app, start } = createSliceServer();

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

await start();
```

Deploy it on a Node host (Render, Fly, Railway, a VPS, Docker, or a serverless
adapter). A serverless adapter that imports the app instead of running it should
mount `sliceFallback()` and `sliceErrorHandler()` by hand, as Conclave does.

The static and Express modes are not mutually exclusive: you can keep the
frontend static and call a separate API origin with `SLICE_PUBLIC_API_URL`.

## Service worker

`service-worker.js` is app-owned: Slice serves it and copies it into the build,
but it does not generate the caching policy. For a static export:

- every `PRECACHE` path must exist in `dist-static/`;
- do not precache `/Components/...` (the exporter prunes it by default);
- bump the cache name on every deploy, or use `--hash-filenames`;
- if you want a new worker to take over immediately, call `skipWaiting()` in
  `install` and `clients.claim()` in `activate` (the PWA guide shows the
  pattern);
- do not cache `/api/*` responses in a static export, because there is no API.

See [Make Your App a PWA](/Documentation/Configuration/PWA) for the full worker
example.

## Preview locally

```bash
npx serve dist-static
```

This respects `404.html` and the prerendered route files. Do **not** use
`npx serve -s` to validate the 404: the `-s` flag forces an SPA fallback and
hides the real `404.html`. Use `npx serve -s` only when you intentionally want
to test `--spa` behavior.

`slice start` serves `dist/`, not `dist-static/`; there is no built-in static
preview command.

## Host matrix

### Cloudflare Pages / Netlify

```bash
slice export --host cloudflare   # or --host netlify
```

Upload `dist-static/`. The exporter writes `_redirects` and `_headers`:

- locale redirects,
- security headers,
- `Cache-Control: no-store` for `/bundles/*` and the env pair.

Cloudflare Pages has no SPA catch-all in `_redirects`: it rejects
`/* /index.html 200` as an infinite loop, and `/* / 200` intercepts assets.
`--spa` therefore **omits `404.html`**, which enables Cloudflare's automatic
SPA mode. If you need a real 404, do not use `--spa`.

Netlify uses the same files plus `/*  /index.html  200` when `--spa` is used.

### Vercel

```bash
slice export --host vercel
```

Upload `dist-static/` and let Vercel read `vercel.json` (redirects, optional
rewrite, cache headers). Set the project output directory to `dist-static` if
you deploy from a Git repository.

Locale redirects use `statusCode: 301|302`; Vercel's `permanent` boolean maps to
**308/307**, not 301/302. The `/(.*)` rewrite only applies when there is no file
at the requested path, so bundles and assets are served normally.

### nginx

```bash
slice export --host nginx
```

Copy `dist-static/` to the server and include `nginx.conf` (or merge it into
your site config). It maps `404` to `/404.html` and sets `no-store` on bundles
and env files.

### GitHub Pages

Root-only. Two supported shapes:

| Shape | URL | Works |
|---|---|---|
| User site | `https://user.github.io/` | Yes |
| Project site + custom domain | `https://example.com/` | Yes |
| Project site by default | `https://user.github.io/repo/` | No (needs a base path) |

```bash
slice export --host github
```

Publish `dist-static/` to the `gh-pages` branch (or `/docs`) and configure the
custom domain in **Settings → Pages**. `.nojekyll` is written automatically.

GitHub Pages has no server redirects and no custom headers. Locale redirects
become HTML `meta refresh` pages; there is no CSP/HSTS control. If the app
depends on `/api/*`, GitHub Pages is not enough: use a separate backend or a
host with functions.

`--spa` on GitHub writes the shell as `404.html`, so unknown routes render the
app but GitHub still returns `404`. A `200` fallback is not possible on Pages.

### S3 + CloudFront

```bash
slice export --host s3
```

Upload `dist-static/` with `index.html` as the default root document and
`404.html` as the error document. Locale redirects become HTML redirect pages.
`--spa` writes the shell as `404.html` (soft 404, status 404). For a true `200`
fallback, use a CloudFront function to rewrite navigation requests to
`/index.html`; `CustomErrorResponses` alone keeps the 404 status.

### `--host none`

No host rules. The folder is portable: `index.html`, prerendered routes,
`404.html`, env files and client redirect pages. Use it for a custom server or a
host the exporter does not model.

## Validate before upload

```bash
slice export --from-dist --host cloudflare --check
```

`--check` writes nothing and fails when:

- a required runtime file is missing (`index.html`, `404.html`, `routes.js`,
  `sliceConfig.json`, the env pair, `bundles/bundle.config.json`,
  `Slice/Slice.js`),
- `Components/` is present without `--keep-components`,
- `public/` was not flattened,
- `utils/`, `src/`, `api/`, `node_modules/`, `.git/`, `AppConfig.js`,
  `slice-events.generated.js` or a generated `.d.ts` is present,
- any `.map`, `.map.br`, `.map.gz`, `.d.ts`, `.env*`, `package.json`, lockfile,
  `node_modules` or `.git` is present,
- an exported `.js` contains `sourceMappingURL=`,
- host rules are incoherent (`_redirects` without `_headers`, invalid
  `vercel.json`, nginx without `error_page 404 /404.html`, explicit GitHub host
  without `.nojekyll`),
- a literal route has no prerendered page and the export has no SPA fallback.

`--check` does **not** enumerate `${param}` routes or verify every referenced
asset.

Run it in CI before uploading:

```yaml title="GitHub Actions (excerpt)"
- run: npm ci
- run: npx slice build
- run: npx slice export --from-dist --host github
- run: npx slice export --from-dist --host github --check
- uses: actions/upload-pages-artifact@v3
  with:
    path: dist-static
```

## Environment variables

`slice build` writes `dist/slice-env.json` and `dist/slice-env.generated.js`.
The runtime imports the shim, so there is no production env endpoint. Values are
frozen at build time: rebuild after changing `.env` or `SLICE_PUBLIC_*`.

Only `SLICE_PUBLIC_*` keys reach the browser. See
[Environment Variables](/Documentation/Configuration/environment-variables).

## What is public

These files are served by design and must not contain secrets:

| File | Contents |
|---|---|
| `sliceConfig.json` | Framework configuration, including `server.port`/`host`. |
| `routes.js` | Route table. |
| `bundle.config.json` | Bundle manifest. |
| `slice-env.json` / `.generated.js` | `SLICE_PUBLIC_*` values only. |
| `manifest.json` | PWA manifest. |
| `seo.json`, `sitemap.xml`, `robots.txt` | Public SEO data. |
| `service-worker.js` | Public worker. |

Everything else is either in a bundle or pruned.

## Troubleshooting

| Symptom | Check |
|---|---|
| `/Themes`, `/images` 404 | `dist/public` was not flattened; rerun `slice export` and `--check`. |
| Unknown route returns the shell with 200 | SEO was not configured, or `--spa` is on. Add `seo.json` or remove `--spa`. |
| Unknown route returns 404 but the client route exists | The route is dynamic (`${param}`). Add `sitemap.paths` or use `--spa`. |
| Styles or bundles load from the wrong URL | The export must be served at the domain root, not a subpath. |
| `--check` reports `Components/` | Rerun without `--keep-components`. |
| Env values are stale | Rebuild; production env is frozen at build time. |
| GitHub Pages serves the README | Publish `dist-static/` itself as the Pages artifact, not the repository root. |

## Related docs

- [CLI Commands](/Documentation/CLI) — `build`, `start`, `export`.
- [Environment Variables](/Documentation/Configuration/environment-variables).
- [Project Anatomy](/Documentation/Project-Anatomy).
- [Server Entrypoint](/Documentation/Architecture/Server-Entrypoint).
