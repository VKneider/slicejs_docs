---
title: SEO and Share Cards
route: /Documentation/Architecture/SEO
navLabel: SEO and Share Cards
section: Project Architecture
group: Runtime and Deployment
order: 2
description: Per-route title, description, canonical, Open Graph and JSON-LD, real 404s, a committed sitemap, and titles that survive client-side navigation.
component: SeoDocumentation
tags: [seo, meta, canonical, open-graph, sitemap, 404, router]
---

# SEO and Share Cards

A Slice app is a SPA: the browser gets one `App/index.html` and the router swaps the view. Left alone
that means one `<title>` for every route, no canonical, a `200` for URLs that do not exist, and a link
preview that looks the same everywhere. The framework fixes the mechanics; you provide the content.

## The manifest: `seo.json`

One file, with one entry per page. It can live at the project root (hand-written) or inside
`public/` — `src/public/seo.json`, which is what a generated pipeline writes. The server and the
`slice seo` commands check the root first, then `public/`:

```json
{
  "version": 1,
  "origin": "https://acme.dev",
  "defaults": {
    "titleSuffix": " | Acme",
    "description": "Acme helps teams ship.",
    "siteName": "Acme",
    "locale": "en_US",
    "image": "/images/banner.png"
  },
  "routes": {
    "/": { "title": "Home", "titleSuffix": false },
    "/pricing": {
      "title": "Pricing",
      "description": "Plans and limits.",
      "image": "/og/pricing.png",
      "robots": true
    },
    "/private": { "title": "Private", "robots": false }
  },
  "sitemap": true
}
```

`defaults` are inherited by every route, so a title suffix or a site-wide card is written once.

| Field | What it does |
|---|---|
| `origin` | absolute URL used for canonical, `og:url`, `og:image` and the sitemap. Required in production |
| `title` / `titlePrefix` / `titleSuffix` | `<title>`, `og:title`, `twitter:title`. The affixes add text around the title (the separator is part of the string); `false` disables one for a route |
| `description` | the meta description plus both social descriptions |
| `canonical` | defaults to `origin + path` |
| `image` / `imageAlt` | the social card; `og:image:width/height/type` are derived when the file is local |
| `robots` | `false` for `noindex, nofollow`, or `{ index, follow, noarchive, nosnippet }` |
| `sitemap` | `false` keeps an indexable page out of `sitemap.xml`; otherwise `{ lastmod, priority, changefreq }` |
| `jsonLd` | one object or an array; `@context` is added if you omit it |
| `openGraph` / `twitter` | the full objects, if you need more than the short fields |

### Routes with parameters

Use the router's syntax. A pattern provides the metadata for every instance, and the canonical is
always the real path:

```json
{
  "routes": {
    "/producto/${id}": { "title": "Producto", "image": "/og/producto.png" }
  }
}
```

`/producto/42` gets that title and `origin + /producto/42` as its canonical. A pattern cannot be
enumerated, so it never enters the sitemap. A title built from the parameter needs the route's own
metadata in `routes.js` and is not part of this version.

## Enabling it

```js
const { app, start } = createSliceServer({
  seo: { manifest: './seo.json' }
});

await start();
```

At startup the server reads the manifest, imports `routes.js` to know which paths are pages, renders
each one once (head injected into the shell, gzip + brotli + ETag precomputed) and keeps them in
memory. A request is a lookup and a write.

| Request | Answer |
|---|---|
| a known route | `200`, its own head, self canonical |
| a path that is not a route | **`404`** with the shell (the client router paints its own NotFound) and `noindex` |
| `robots: false` | `200` + `noindex, nofollow`, no canonical change |
| a `${param}` route | `200`, rendered once per path and cached |

### The origin, and why it is not read from the request

The head is prerendered once, so the origin has to be known at startup. It is resolved in this order:

1. `SLICE_ORIGIN` (environment),
2. `createSliceServer({ seo: { origin } })`,
3. `origin` in `seo.json`,
4. in development only: `http://localhost:<port>`,
5. otherwise the server **fails at startup**.

Reading it from `req.headers.host` would produce one cached page per host and the wrong scheme behind
a TLS proxy. In development the `localhost` fallback keeps the metadata inspectable; set
`SLICE_ORIGIN` on a preview deploy so its canonical and its card point at the preview.

## The sitemap is a committed file

```bash
slice seo sitemap            # writes public/sitemap.xml from seo.json
slice seo sitemap --dry-run  # reports, writes nothing
slice seo check              # CI: validates the manifest and the committed sitemap
```

`slice seo sitemap` writes `src/public/sitemap.xml` (and `robots.txt` only when the manifest has a
`robotsTxt` block), from the indexable routes only. It never overwrites silently: an existing file
that would change asks first, `--yes` skips the question, and a non-interactive run fails instead of
waiting for input. An unchanged file is not rewritten.

Commit the result. `slice seo check` compares the committed file against the manifest and exits
non-zero when they drifted, so the sitemap cannot rot between deploys.

## Titles survive client-side navigation

Route entries accept `metadata`, and the router applies it on every navigation — including the first
one — so the tab title does not stay on the landing page:

```js
// src/routes.js
{ path: '/pricing', component: 'Pricing', metadata: { title: 'Pricing', description: 'Plans.' } }
```

```json
// src/sliceConfig.json — only to opt out
{ "router": { "updateTitles": false } }
```

What it does and does not do:

- only the fields the route declares; a route without `metadata.title` keeps the server's title,
- `canonical` and `robots` are **never** written from the client: crawlers do not run your JavaScript,
  so changing them there would only desync the SPA from the HTML that was served,
- a `router:change` listener still wins, because the metadata is applied before the event fires,
- `slice doctor` and `slice seo check` warn when `routes.js` and `seo.json` disagree on a title for the
  same path — that disagreement is what would make the tab title change after hydration.

:::tip
Put the canonical title in one place. If a route declares `metadata.title`, keep it identical to the
manifest's (including the `| Acme` suffix), or let the manifest own the title and leave
`metadata.title` out.
:::

## What this does not solve

- **The page body is still rendered in the browser.** A crawler that does not execute JavaScript sees
  the correct head and an empty `#app`. Pre-rendering the article content is a separate problem.
- **Generating the social image** is not part of the runtime. The manifest accepts `image`, and
  `slice seo images` produces the files from the real pages (it writes `public/og/manifest.json`,
  which you pass as `seo.images`). See [CLI commands](/Documentation/CLI#seo-images).

## Several languages

With `slice.translator` configured, the same manifest drives **one page per route and locale**. The
text fields accept `{ "t": "key", "params": { … } }`, and the server resolves them with the app's
dictionaries:

```json title="seo.json"
{
  "defaults": { "titleSuffix": { "t": "seo.titleSuffix" } },
  "routes": {
    "/pricing": { "title": { "t": "pricing.title" }, "description": { "t": "pricing.description" } }
  },
  "locales": { "en": { "ogLocale": "en_US" } }
}
```

- Every literal route is prerendered once per locale (`/pricing`, `/en/pricing`), each with its own
  `<html lang>`, canonical, translated `<head>` and `og:locale`.
- Each page carries `<link rel="alternate" hreflang="…">` for its locales plus `x-default`.
- Under `"prefix"`, `/` answers `302` to the default locale; under `"except-default"`, a
  default-locale prefix (`/es/pricing`) answers `301` to `/pricing`.
- A prefix that is not a configured locale is not a locale: it falls through to a real `404`.
- `slice seo sitemap` writes one `<url>` per route and locale with the same alternates; a `{ t }` key
  missing in one locale fails `slice seo check`, because that page would advertise the key as title.
- `${param}` routes are rendered per request, per locale.

See [Translating an app](/Documentation/Translator) for the client half.
