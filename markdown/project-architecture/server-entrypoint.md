---
title: Server Entrypoint
route: /Documentation/Architecture/Server-Entrypoint
navLabel: Server Entrypoint
section: Project Architecture
group: Runtime and Deployment
order: 1
description: What api/index.js is, why the framework returns the app instead of listening, where your middleware goes, and the one rule that decides whether it runs at all.
component: ServerEntrypointDocumentation
tags: [server, api, middleware, express, deployment, fallback]
---

# Server Entrypoint

`api/index.js` is your server. It is a normal ES module that the CLI runs for both `slice dev` and
`slice start`:

```js
import { createSliceServer } from 'slicejs-web-framework/api/framework/server.js';

const { app, start } = createSliceServer();

await start();

export default app;
```

`createSliceServer()` builds an Express app with everything the framework needs — security,
compression, the environment endpoint, static assets, bundles, the PWA endpoints — and hands it back
**without listening and without a catch-all**. Nothing is final until you call `start()`.

## Adding your own middleware

Anything you add between the factory and `start()` runs **before** the SPA fallback, which is the
only thing that must be last:

```js
import { createSliceServer } from 'slicejs-web-framework/api/framework/server.js';

const { app, start } = createSliceServer();

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/hooks', hooks);
app.use(sessionMiddleware);
app.use((req, res, next) => {
  res.setHeader('X-App', 'acme');
  next();
});

await start();

export default app;
```

:::warning
Middleware added **after** `start()` never runs. `start()` mounts the terminal fallback and then
listens, so anything registered later is past the piece that answers every page request. Keep
`await start()` as the last line.
:::

## `start()` and the terminal fallback

`start({ port, host, signals })`:

- resolves the port as `options.port` → `PORT` → `sliceConfig.server.port` → `3001`,
- mounts `sliceFallback()` (and the error handler) unless you already mounted one,
- installs `SIGINT`/`SIGTERM` once and closes the server gracefully (`signals: false` opts out),
- throws if called twice,
- returns the `http.Server` (it is async because the SEO context is prepared before listening).

The fallback is where "nobody answered" is decided:

| Request | What it answers |
|---|---|
| a known page | the prerendered HTML for that route (or the plain shell without SEO) |
| a path that is not a page | the same shell with a real `404` |
| an unknown `/api/*` path | `404` JSON, never the shell |
| a non-`GET` request | falls through, so Express answers it |
| a component file in development (`.html`, `.css`) | the shell, or an empty stylesheet for JS-only components |

## Running without `start()`

For a serverless adapter or a test harness, close the chain by hand:

```js
import express from 'express';
import {
  sliceFallback,
  sliceErrorHandler
} from 'slicejs-web-framework/api/framework/server.js';

const app = express();
app.get('/health', (req, res) => res.json({ ok: true }));
app.use(sliceFallback({ projectRoot: process.cwd() }));
app.use(sliceErrorHandler({ projectRoot: process.cwd() }));

export default app;
```

Both take the same options as the factory (`projectRoot`, `mode`, `seo`). The error handler has to be
mounted after the fallback because Express only routes an error to middleware registered later in
the stack.

## SEO is an option, not a second server

Per-route `<title>`, canonical, Open Graph and real 404s are wired by passing `seo` to the factory:

```js
const { app, start } = createSliceServer({
  seo: { manifest: './seo.json' }
});
```

The manifest, the origin rules and the sitemap command live in
[SEO and Share Cards](/Documentation/Architecture/SEO). Without that option the fallback keeps the
behaviour of a plain SPA: every path answers the shell with `200`.

## Where the pieces live

```
api/index.js                 your server (this page)
api/seo.js                   only if you generate the manifest yourself
node_modules/slicejs-web-framework/api/framework/server.js   the factory + fallback
node_modules/slicejs-web-framework/api/framework/seo.js      the SEO mechanics
```

Do not copy the framework server into your project: the factory already exposes every seam you
need, and a copy stops receiving fixes.
