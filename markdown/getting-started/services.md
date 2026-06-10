---
title: Services
route: /Documentation/Service
navLabel: Services
section: Getting Started
group: Components
order: 34
description: Service components for shared logic and data.
component: ServiceDocumentation
tags: [services, fetch, state]
---

# Services

## Overview
Services centralize logic and data access. They can cache results, encapsulate API calls,
and integrate with EventManager or ContextManager.

Services are created with `slice.build()` like other components, but they do not render UI.

## Built-in Services
| Service | Purpose | Notes |
| --- | --- | --- |
| `FetchManager` | HTTP requests with loading, timeout, and optional caching | Uses `Loading` component automatically. |
| `IndexedDbManager` | IndexedDB CRUD helpers | Creates store with `keyPath: 'id'`. |
| `LocalStorageManager` | LocalStorage JSON wrapper | Returns parsed JSON or null. |
| `Link` | SPA navigation anchor | Calls `slice.router.navigate`. |

## Using a Service
```javascript title="Access via slice shortcut"
const dataService = await slice.build('FetchManager', {
  baseUrl: 'https://api.myapp.com/v1',
  sliceId: 'data-service'
});

export default class ProductList extends HTMLElement {
  async init() {
    this.dataService = slice.getComponent('data-service');
    await this.loadProducts();
  }
}
```

## Service Singleton Pattern (sliceId)
Use a stable `sliceId` to create a shared service instance and retrieve it from any component.

```javascript title="Singleton service setup"
const audioService = await slice.build('AudioService', {
  sliceId: 'imposter-audio-service'
});

export default class GameScreen extends HTMLElement {
  async init() {
    this.audioService = slice.getComponent('imposter-audio-service');
  }
}
```

:::tip
Use `sliceId` when you need a single instance across routes or screens.
:::

:::warning
Do not store service instances or functions in `slice.context`. Persist only serializable state.
:::

## App services (composition root)
For singletons your app needs app-wide (auth, an API client, a store, config), the cleanest pattern
is a single **composition root**: one `AppServices` Service whose `init()` builds all the others and
seeds any initial context. Because `init()` is awaited, one bootstrap call sets up the whole graph,
in order. This keeps `build` calls in **one place** — everywhere else you just `getComponent`.

```javascript title="Service/AppServices/AppServices.js"
export default class AppServices {
  async init() {
    // Build each app-wide singleton once, with a stable sliceId = its identity.
    this.auth = await slice.build('AuthService', { sliceId: 'AuthService' });
    this.api  = await slice.build('FetchManager', { sliceId: 'api', baseUrl: API_URL });

    // Seed contexts / register global handlers here too.
    slice.context.set('theme', 'dark');
  }

  // Optional: explicit teardown (e.g. on logout). Children built via slice.build
  // are NOT auto-destroyed, so dispose them by hand if you ever tear down.
  dispose() {
    slice.controller.destroyComponent([this.auth, this.api]);
  }
}
```

```javascript title="App entry — one bootstrap call"
await slice.build('AppServices', { sliceId: 'AppServices' });
```

```javascript title="Consume anywhere — pure lookup, no creation"
async init() {
  this.api  = slice.getComponent('api');                    // directly by sliceId
  this.auth = slice.getComponent('AppServices').auth;       // or via the facade
}
```

`AppServices` and the services it builds are **app-lifetime** — you never destroy them, so there is
no cleanup to manage. The facade (`getComponent('AppServices').auth`) doubles as a discoverable index
of which services exist.

## Singleton shortcut: `build({ singleton: true })`
The composition root above is the recommended pattern for app-wide singletons known at startup. When
a service is **lazy or decentralized** instead — a feature self-bootstraps a shared service on first
use, with no central place to register it — `singleton: true` is the get-or-create shortcut.

Writing `getComponent('X') || await slice.build('X', { sliceId: 'X' })` by hand is verbose, easy to
get wrong (forgetting `sliceId`, or `sliceId !== name`), and races when two components build the same
service at once. Pass `singleton: true` to `build` instead — it get-or-creates one shared instance
and deduplicates concurrent builds.

```javascript title="Get-or-create a singleton service"
// First caller builds it; every later caller (from anywhere) gets the SAME instance.
const grid = await slice.build('DataGridService', { singleton: true });
```

- `sliceId` defaults to the component name. Pass an explicit `sliceId` to keep **named** singletons
  of the same class (e.g. two `FetchManager`s for different APIs):

```javascript title="Named singletons"
const authApi   = await slice.build('FetchManager', { singleton: true, sliceId: 'authApi',   baseUrl: AUTH_URL });
const publicApi = await slice.build('FetchManager', { singleton: true, sliceId: 'publicApi', baseUrl: PUBLIC_URL });
```

- Both **create and access** flow through `build` — there is no separate accessor. Later calls
  return the existing instance (a pure synchronous lookup still works via `slice.getComponent(sliceId)`).
- Concurrent `build({ singleton: true })` calls for the same `sliceId` share a single in-flight
  build, so they can never collide on a duplicate id.

:::warning
`props` only apply on the **first** (creating) call. Later calls return the existing instance and
ignore any props you pass — reconfigure through the service's own API instead.
:::

:::warning
`singleton: true` is only supported for **Service** components. A DOM node can live in one place at a
time, so a shared Visual would teleport between mount points. For app-wide UI, build a **Provider
Service** that owns and manages the Visual (see `ToastProvider` / `ToolTipProvider`) — the provider is
the singleton; the Visuals it creates are ephemeral.
:::

:::warning
`singleton` is a **reserved build directive** (like `id` and `sliceId`). Do not declare it in a
component's `static props` or pass it as a real prop — `build` consumes it and it never reaches your
setters. See [Reserved build keys](/Documentation/The-build-method).
:::

### Which one?
| | App services (composition root) | `build({ singleton: true })` |
| --- | --- | --- |
| Creation | once, in one place (`AppServices.init`) | get-or-create at the call site |
| Consumption | `slice.getComponent('X')` (pure lookup) | the same `build` call |
| Best for | app-wide singletons known at startup (auth, api, store, config) | lazy / decentralized singletons; race-safe get-or-create |
| Trade-off | needs a bootstrap step | `build` that may return an existing instance |

Default to the composition root; reach for `singleton: true` when there is no central place to
register the service.

## FetchManager API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `request` | `(method, data, endpoint, onSuccess, onError, refetchOnError=false, requestOptions={})` | `Promise<any>` | Returns JSON response. Caches last response if enabled. |
| `enableCache` | `()` | `void` | Enables in-memory cache. |
| `disableCache` | `()` | `void` | Disables cache. |
| `setDefaultHeaders` | `(headers)` | `void` | Merges default headers into requests. |

## IndexedDbManager API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `openDatabase` | `()` | `Promise<IDBDatabase>` | Opens or creates database. |
| `closeDatabase` | `()` | `void` | Closes the connection. |
| `addItem` | `(item)` | `Promise<number>` | Returns new key. |
| `updateItem` | `(item)` | `Promise<number>` | Returns key. |
| `getItem` | `(id)` | `Promise<any>` | Gets item by id. |
| `deleteItem` | `(id)` | `Promise<void>` | Deletes item by id. |
| `getAllItems` | `()` | `Promise<any[]>` | Returns all items. |
| `clearItems` | `()` | `Promise<void>` | Clears store. |

## LocalStorageManager API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `getItem` | `(key)` | `any | null` | Returns parsed JSON or null. |
| `setItem` | `(key, value)` | `boolean` | Returns success boolean. |
| `removeItem` | `(key)` | `boolean` | Returns success boolean. |
| `clear` | `()` | `boolean` | Clears localStorage. |

## Link API
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `path` | `string` | `'#'` | Route path to navigate. |
| `classes` | `string` | `''` | CSS classes for the anchor. |
| `text` | `string` | `''` | Anchor text. |

```javascript title="Link usage"
const link = await slice.build('Link', {
  path: '/account',
  classes: 'nav-link',
  text: 'Account'
});

nav.appendChild(link);
```

## Best Practices
:::tip
Use `sliceId` when you need global access to a service instance.
:::

:::tip
Pair services with EventManager for notifications or ContextManager for shared state.
:::

## Gotchas
