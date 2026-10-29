---
title: Slice Routing
route: /Documentation/Routing
navLabel: Routing
section: Getting Started
group: Routing
order: 50
description: Router setup, navigation, and guards.
component: RoutingDocumentation
tags: [routing, router, guards]
generate: false
---

# Slice Routing

## Overview
Slice Router handles client-side navigation, route parameters, nested routes, and route containers.
It auto-starts shortly after initialization, but you should call `start()` manually when you use
guards to ensure your guard logic runs before the first navigation.

Routing is driven by a `routes.js` file and a runtime router available at `slice.router`.

Path matching is **case-insensitive**: `/About` resolves to a route declared as `/about`. This
applies to both static and `${param}` routes, and to `MultiRoute` containers. Captured parameter
values keep their original case (for example `${id}` in `/User/AB12` is `AB12`).

## Router API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `start` | `() => Promise<void>` | `Promise<void>` | Starts routing immediately. Recommended when using guards. |
| `navigate` | `(path, options?)` | `Promise<void>` | Programmatic navigation. Pass `{ replace: true }` to replace history instead of pushing, and `{ locale }` to switch language when the translator puts the locale in the URL. |
| `href` | `(path, { locale? }?) => string` | `string` | The URL to render in an `<a>`. With `translator.routing` it carries the locale (`/pricing` → `/en/pricing`); without it, the path is returned unchanged. |
| `path` | getter | `string` | The app path the router is showing, without locale or query. Use it instead of `window.location.pathname`. |
| `beforeEach` | `(guard)` | `void` | Registers a guard `(to, from, next)`. |
| `afterEach` | `(guard)` | `void` | Registers a guard `(to, from)` after navigation. |

`slice.path` and `slice.href(path)` are the shortcuts at the `slice` level: components use those
instead of `window.location.pathname` and of a per-component helper.

## Route Configuration
```javascript title="routes.js"
const routes = [
  { path: '/', component: 'HomePage' },
  { path: '/about', component: 'AboutPage' },
  { path: '/user/${id}', component: 'UserProfile', metadata: { private: true } },
  { path: '/docs', component: 'Docs', children: [
    { path: '/intro', component: 'DocsIntro' }
  ]},
  { path: '/404', component: 'NotFound' }
];

export default routes;
```

### Route Definition Fields
| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `path` | `string` | yes | Supports dynamic params using `${param}`. |
| `component` | `string` | yes | Component name from `components.js`. |
| `children` | `Array<Route>` | no | Nested routes inherit parent path. |
| `metadata` | `object` | no | Arbitrary data for guards and UI. `title`/`titleKey` and `description`/`descriptionKey` are read by the router (see below). |

### Route metadata and the document title
`metadata` is free-form. The router reads these fields on every navigation, including the first one:

| Field | Effect |
| --- | --- |
| `title` | `document.title`, literal |
| `titleKey` | a dictionary key; with the translator on it wins over `title` |
| `titlePrefix` / `titleSuffix` | per-route affixes; default to `router.titlePrefix` / `router.titleSuffix`, `false` disables them |
| `titleTemplate` | legacy: the full title with `%s` replaced; when present, the affixes are ignored |
| `description` / `descriptionKey` | the `meta[name="description"]` content, same rules |

The product name belongs in the config, not in every route:

```json title="src/sliceConfig.json"
"router": {
  "titleSuffix": " · Acme"
}
```

A route with `metadata: { titleKey: 'pricing.title' }` renders `Precios · Acme` in Spanish and
`Pricing · Acme` in English. `titlePrefix` is the mirror (`"Acme · "`), and both compose as
`prefix + title + suffix`; only one, both or neither are valid. The separator is part of the string.

`titleKey` wins over `title` when the translator is enabled. With it disabled the key is shown as the
title and the router logs one warning per key, so an untranslated page is visible instead of silently
wrong. The server reads the same `router.titlePrefix/titleSuffix` when it prerenders, so the tab title
does not change after hydration.

It only writes what the route declares: a route without a title keeps whatever the server sent, so a
prerendered page is never downgraded. `canonical` and `robots` are never written from the client —
crawlers do not run JavaScript. A `router:change` listener still wins, because the metadata is applied
before the event. Opt out with `router.updateTitles: false` in `sliceConfig.json`.

See [SEO and Share Cards](/Documentation/Architecture/SEO) for the server half of the same metadata.

## Route Info Object
Guards and route events receive `to` and `from` objects created by the router.

| Field | Type | Notes |
| --- | --- | --- |
| `path` | `string` | The app path, without a locale prefix: `/pricing`. |
| `component` | `string` | Component for the route (parent if nested). |
| `params` | `object` | Dynamic params from `${param}` patterns. |
| `query` | `object` | Parsed query string values. |
| `metadata` | `object` | Route metadata from config. |
| `locale` | `string \| null` | The locale of this navigation, when `translator.routing` is on. |
| `url` | `string` | What the address bar shows (`/en/pricing` with routing). |

See [Translating an app](/Documentation/Translator) for locale-in-URL routing.

## Basic Navigation
```javascript title="Navigate programmatically"
await slice.router.navigate('/about');

// Replace the current history entry instead of pushing a new one:
await slice.router.navigate('/login', { replace: true });
```

## Route Containers
Slice provides two route container components:

- `slice-route` for a single path
- `slice-multi-route` for a list of routes

They cache components and call `update()` when a cached component is reused.

:::warning
`routes.js` is the **single source of truth** for the Router. Containers do **not** register their
paths with the Router — they only choose which component to show for the current URL. So every path
a `Route`/`MultiRoute` can show must also exist in `routes.js` (in the App Shell pattern it maps to
the shell). Otherwise a direct load, refresh, or deep-link to that URL resolves before the container
mounts and falls through to `/404`.
:::

```javascript title="Route container"
const route = await slice.build('Route', {
  path: '/settings',
  component: 'SettingsPage'
});

someContainer.appendChild(route);
```

```javascript title="MultiRoute container"
const multi = await slice.build('MultiRoute', {
  routes: [
    { path: '/account', component: 'AccountPage' },
    { path: '/billing', component: 'BillingPage' }
  ]
});

someContainer.appendChild(multi);
```

## Guards
```javascript title="beforeEach and afterEach"
slice.router.beforeEach(async (to, from, next) => {
  if (to.metadata?.private && !isAuthenticated()) {
    return next({ path: '/login' });
  }
  return next();
});

slice.router.afterEach((to) => {
  document.title = to.metadata?.title || 'My App';
});

await slice.router.start();
```

## Route Change Events
The router emits `router:change` **once per navigation**, after the new route has been rendered.
How you listen depends on whether EventManager is enabled — it's one or the other, **never both**:

- **`events.enabled: true`** → it goes through EventManager (`slice.events`).
- **`events.enabled: false`** → it dispatches a `CustomEvent` of the same name on `window` instead.

Either way the payload is `{ to, from }`, where each is a route object shaped
`{ path, component, params, query, metadata }`:

```javascript title="Events enabled — EventManager"
slice.events.subscribe('router:change', ({ to, from }) => {
  console.log('Route changed:', from?.path, '->', to.path);
});
```

```javascript title="Events disabled — window CustomEvent"
window.addEventListener('router:change', (e) => {
  const { to, from } = e.detail; // same { to, from } payload, under event.detail
  console.log('Route changed:', from?.path, '->', to.path);
});
```

When events are enabled, `router:change` is **auto-declared** in the
[Event Registry](/Documentation/Structural/EventRegistry), so you can subscribe without
`register()`-ing it first.

:::warning
Prefer the event's `to` payload over reading `slice.router.activeRoute` inside the handler.
`activeRoute` does reflect the new route by the time `router:change` fires, but the payload is the
guaranteed source and keeps your listener decoupled from router internals. If you only need the
current URL, `window.location.pathname` is always trustworthy the instant the event fires.
:::

## Best Practices
:::tip
Call `start()` after registering guards to avoid missing the first navigation.
:::

:::tip
Use metadata flags to keep guard logic declarative and centralized.
:::

## Gotchas
:::warning
`navigate()` is async. Await it when you depend on the next route being ready.
:::

:::warning
Dynamic params use `${param}` syntax, not `:param`.
:::
