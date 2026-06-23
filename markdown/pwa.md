---
title: Make Your App a PWA
route: /Documentation/Configuration/PWA
navLabel: PWA
section: Getting Started
group: Configuration
order: 22
description: Manually turn a Slice app into an installable PWA with a manifest and a service worker.
component: PwaDocumentation
tags: [pwa, manifest, service-worker, offline, configuration]
---

# Make Your App a PWA

## Overview
A Progressive Web App is **installable** (add to home screen) and can work
**offline**. A Slice app becomes one by adding three things — a web app manifest,
some icons, and a service worker — and registering the worker from your page.

You don't need any extra server setup: the Slice dev/prod server already serves
`/manifest.json` and `/service-worker.js` with the correct MIME types (and the
service worker with `Cache-Control: no-cache` and `Service-Worker-Allowed: /` so
its scope is the whole app). Drop the files in `src/` and they're served at the
site root; `slice build` copies them into `dist/` for production.

## Steps
:::steps
1. Add `src/manifest.json`.
2. Add icons and expose their folder in `sliceConfig.json`.
3. Add `src/service-worker.js`.
4. Link the manifest and theme color in `App/index.html`.
5. Register the service worker — in production only.
:::

## 1. The manifest
Create `src/manifest.json` (served at `/manifest.json`):

```json title="src/manifest.json"
{
  "name": "Orders Dashboard",
  "short_name": "Orders",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "theme_color": "#11131c",
  "background_color": "#11131c",
  "icons": [
    { "src": "/images/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/images/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/images/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

## 2. Icons
Put your icons in a folder that is in `publicFolders` so they are served and
copied to `dist/`. The starter already exposes `images/`, so `src/images/icon-192.png`
is served at `/images/icon-192.png`. Provide at least 192×192 and 512×512, plus a
512×512 `maskable` for Android.

```json title="sliceConfig.json — already includes images by default"
{ "publicFolders": ["/Themes", "/Styles", "/assets", "/images"] }
```

## 3. The service worker
Create `src/service-worker.js` (served at `/service-worker.js`). A minimal
app-shell worker: precache a few core assets, serve navigations network-first with
an offline fallback, and serve other GETs cache-first.

```javascript title="src/service-worker.js"
const CACHE = 'app-v1'; // bump this string when you ship new assets
const PRECACHE = ['/', '/manifest.json', '/images/icon-192.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/')));
    return;
  }
  event.respondWith(caches.match(request).then((hit) => hit || fetch(request)));
});
```

List in `PRECACHE` the assets you want available offline. In production your code
ships as hashed bundles under `/bundles/`, so add the ones your first screen needs
and bump `CACHE` whenever you deploy new assets.

## 4. Link it in the page
Add the manifest and theme color to `App/index.html`:

```html title="App/index.html (inside <head>)"
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#11131c" />
<link rel="apple-touch-icon" href="/images/icon-192.png" />
```

## 5. Register the worker — production only
A caching service worker would serve stale files during development and break the
live-edit loop. Register it **only in production**, and unregister any leftover
worker in development. Add this once, e.g. at the end of `App/index.html`:

```html title="App/index.html (before </body>)"
<script type="module">
  if ('serviceWorker' in navigator) {
    const isProduction = await fetch('/slice-env.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((env) => env?.mode === 'production')
      .catch(() => true);

    if (isProduction) {
      navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
    } else {
      const registrations = await navigator.serviceWorker.getRegistrations();
      registrations.forEach((registration) => registration.unregister());
    }
  }
</script>
```

## Best Practices
:::tip
Bump the `CACHE` string on every deploy. The `activate` handler deletes old caches,
so users get the new assets instead of a stale shell.
:::

:::tip
Keep `PRECACHE` small — just the shell and what the first screen needs. Everything
else is cached on demand by the cache-first `fetch` handler.
:::

## Gotchas
:::warning
Never register a caching service worker in development. It serves old assets and
hides your edits. The snippet above registers only when `slice-env.json` reports
`production` and unregisters otherwise.
:::

:::warning
Keep `service-worker.js` at the site root (`/service-worker.js`) so its scope is the
whole app. A worker served from a subfolder only controls that subfolder.
:::

## FAQ
:::details title="Do I need to configure the server to serve these files?"
No. The Slice server already serves `/manifest.json` and `/service-worker.js` (with
the right MIME types and no-cache headers for the worker). Just place the files in
`src/` — they are served in dev and copied to `dist/` by `slice build`.
:::

:::details title="Why isn't my app updating after I deploy?"
A service worker keeps serving its cached assets until a new worker activates. Bump
the `CACHE` string so `activate` clears the old cache, and reload twice (once to
install the new worker, once for it to take control).
:::
