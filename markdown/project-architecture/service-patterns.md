---
title: Service Patterns
route: /Documentation/Architecture/Service-Patterns
navLabel: Service Patterns
section: Project Architecture
group: Styles and Patterns
order: 6
description: Where state and logic should live in a Slice app — instance fields, plain helpers, singleton services, providers — and how cleanup actually works.
component: ServicePatternsDocumentation
tags: [architecture, services, singleton, state, cleanup]
---

# Service Patterns

How you place state and shared logic decides whether your app leaks, needs manual cleanup, or stays
simple. This guide distils the rules that follow from how Slice builds and destroys components.

## The one rule everything follows

> **Registering a thing in the component registry (any `slice.build(...)`) creates a cleanup
> obligation. Plain instance fields and plain objects do not — the garbage collector handles them.**

`slice.build` stores the instance in `slice.controller.activeComponents` (a strong reference). It
stays alive until you explicitly `destroyComponent` it. A value you keep on `this` (a number, an
array, a `new MyClass()`) is freed automatically when its owner is destroyed. So the question for any
piece of state or logic is: *does this need to be registered (shared/discoverable), or not?*

## Where should it live?

| What you have | Where it goes | Cleanup |
| --- | --- | --- |
| Per-instance UI state (current page, sort, open/closed) | **instance fields** on the component (`this._page`) | automatic (GC) |
| Per-instance stateful helper (a little engine, a calculator) | **`new Helper()`** stored on `this` — NOT `slice.build` | automatic (GC) |
| Reusable **stateless** logic shared across components | a **singleton Service** (built once) or a pure module | none — lives for the app |
| Several **app-wide singletons** (auth, api, store) | an **`AppServices` composition root** | none — app-lifetime |
| App-wide **UI** (toasts, tooltips, a modal portal) | a **Provider Service** that owns the Visuals | the provider is the singleton |
| ❌ A per-instance Service built with `slice.build` | avoid — needs manual `destroyComponent` | manual + fragile |

The rest of this page expands each row.

## Instance state lives on the instance

A component's own view state is intrinsic to that instance. Keep it in plain fields — never split it
into a separate registered object.

```javascript
set page(value) { this._page = value; this.render(); }   // GC'd with the component, zero ceremony
```

If the state logic gets big, wrap it in a **plain class** and `new` it — still no registration, still
GC'd with the owner:

```javascript
async init() {
  this._engine = new DataGridEngine({ data: this._rows, pageSize: 10 });  // plain new, not slice.build
}
```

## Reusable logic → a singleton (or a pure module)

For logic shared across components, you have two leak-free options:

- **Pure module** — relative `import` of plain functions (`import { paginate } from './engine.js'`).
  Simplest; the trade-off is relative-path coupling when imported from far away in the tree.
- **Singleton Service** — built once, retrieved by name from anywhere (no path coupling, discoverable).

Bare imports are not supported in Slice, so a Service is the idiomatic way to share logic without
relative paths. See the [Services](/Documentation/Service) guide for the singleton patterns
(`AppServices` and the `build({ singleton: true })` shortcut).

## App-wide singletons → a composition root

Build app-wide singletons (auth, an API client, a store, config) in **one place** — an `AppServices`
Service whose `init()` builds the rest and seeds context. Everywhere else, just `getComponent`.

```javascript title="Service/AppServices/AppServices.js"
export default class AppServices {
  async init() {
    this.auth = await slice.build('AuthService',  { sliceId: 'AuthService' });
    this.api  = await slice.build('FetchManager', { sliceId: 'api', baseUrl: API_URL });
    slice.context.set('theme', 'dark');
  }
}
```

```javascript
await slice.build('AppServices', { sliceId: 'AppServices' });   // one bootstrap call at app start
```

`AppServices` and its services are **app-lifetime** — you never destroy them, so there is nothing to
clean up. Reach for `build({ singleton: true })` only for the lazy/decentralized case. Full detail and
the "which one?" table live in [Services](/Documentation/Service).

## Global UI → a Provider Service

A `singleton: true` works only for Services, because a DOM node can live in **one place at a time** —
a shared Visual would teleport between mount points. So "I need one global widget" is really "I need a
**Provider Service** that owns and manages the Visual." That is exactly how `ToastProvider` and
`ToolTipProvider` work: the provider is the singleton; the toasts/tooltips it creates are ephemeral.

## How cleanup actually works (important)

> **`destroyComponent(parent)` cascades to nested Visual children, but NOT to Services — destroy any
> Service you built by hand.**

`destroyComponent(parent)` walks the parent→child index and destroys the subtree (running each
`beforeDestroy`, deepest-first). Visual children that were built and placed in the parent's DOM by the
time the parent finished `init()` are linked automatically, so they cascade.

A **Service has no DOM element**, so it can never be discovered — not by the parent's cascade and not
by `destroyByContainer`. **Every Service you build with `slice.build` must be destroyed explicitly** in
the owner's `beforeDestroy()`. The same applies to any Visual child you append *after* `init()` (too
late to be linked).

```javascript
async init() {
  this._engine = await slice.build('DataGridEngine', { sliceId: `grid-${++Table._seq}` }); // a Service
  this._pager  = await slice.build('Pagination', { /* ... */ });                            // a Visual child
}

beforeDestroy() {
  // The Service is NEVER auto-cascaded — destroy it by hand.
  slice.controller.destroyComponent(this._engine);
  // The Visual child IS cascaded once it is in the DOM; destroying it here too is
  // harmless (destroyComponent is idempotent) and safe across framework versions.
  slice.controller.destroyComponent(this._pager);
}
```

For tearing down a whole region, **`slice.controller.destroyByContainer(domNode)`** discovers every
Visual component inside a DOM subtree and destroys them — the "destroy-before-clear" workhorse. (It
still won't find Services, since they have no DOM node.)

App-lifetime singletons (an `AppServices` graph) are the happy exception: they are never destroyed, so
there is nothing to clean up.

:::warning
A Service built with `slice.build` is registered in the component registry but has no DOM. If you drop
its owner without destroying the Service, it **leaks** — it stays in `activeComponents` and its
`beforeDestroy` never runs. Always destroy built Services explicitly.
:::

:::warning
Tearing a subtree down with `innerHTML = ''` does **not** run `beforeDestroy` and does **not** unregister
anything — listeners stay bound and registry entries leak. Always `destroyByContainer(node)` **then**
clear.
:::

## Worked example: the Table's data engine

The built-in `Table` shows the rules together:

- **State** (page, sort) lives in a `DataGridEngine` — a per-instance object. The engine is built with
  `slice.build` (so it is discoverable and could be inspected), with a unique `sliceId` per table.
- The Table destroys **both** the engine and the `Pagination` child in `beforeDestroy()`. The engine
  (a Service) is never auto-cascaded, so it **must** be destroyed by hand; destroying the pager too is
  redundant-but-safe (a Visual child does cascade, and `destroyComponent` is idempotent).
- The pure sort/paginate math also exists as **static helpers** on the engine, so callers that only need
  a one-off computation can skip the instance entirely.

## Anti-patterns

- ❌ A **stateful per-instance Service** built with `slice.build` and relied on to be auto-cleaned — it
  will not be. Either destroy it explicitly, or (better, if it is pure per-instance state) use a plain
  `new`.
- ❌ Scattering `build({ singleton: true })` across many call sites for an app-wide service — centralize
  it in `AppServices` and `getComponent` it instead.
- ❌ Storing service instances or functions in `slice.context` — keep only serializable state there.
- ❌ Declaring `id`, `sliceId`, or `singleton` in `static props` — they are reserved build directives,
  consumed by `build` before your setters run. See [Reserved build keys](/Documentation/The-build-method).
