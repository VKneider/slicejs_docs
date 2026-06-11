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

Where state and shared logic live decides whether your app leaks. One rule, a decision table, and the cleanup contract.

## The one rule

> **Anything built with `slice.build(...)` is registered and must be cleaned up. Plain instance fields and plain objects are not — the GC frees them with their owner.**

`slice.build` keeps a strong reference in `slice.controller.activeComponents` until you `destroyComponent` it. A value on `this` (`new MyClass()`, an array) is freed automatically. So ask: *does this need to be registered (shared / discoverable), or not?*

## Where should it live?

| What you have | Where it goes | Cleanup |
| --- | --- | --- |
| Per-instance view state (page, sort, open/closed) | **instance fields** (`this._page`) | automatic (GC) |
| Per-instance stateful helper (an engine, a calculator) | **`new Helper()`** on `this` — not `slice.build` | automatic (GC) |
| Reusable **stateless** logic | a **singleton Service** or a pure module | none — app-lifetime |
| App-wide singletons (auth, api, store) | one **composition-root** Service | none — app-lifetime |
| App-wide **UI** (toasts, tooltips, modals) | a **Provider Service** owning the Visuals | the provider is the singleton |
| ❌ Per-instance Service built with `slice.build` | avoid — needs manual `destroyComponent` | manual + fragile |

## Instance state → plain fields

```javascript
set page(value) { this._page = value; this.render(); }   // GC'd with the component
```

Big state logic → wrap in a **plain class** and `new` it (still no registration, still GC'd):

```javascript
async init() {
  this._engine = new DataGridEngine({ data: this._rows, pageSize: 10 }); // plain new, not slice.build
}
```

## App-wide singletons → a composition root

Build app-wide singletons in **one place** — a Service (e.g. `AppServices` / `Providers`) whose `init()` builds the rest and seeds context. Everywhere else, **recover** with `slice.getComponent(name)`.

```javascript title="Components/AppServices/AppServices.js"
export default class AppServices {
  async init() {
    await slice.build('AuthService',  { sliceId: 'AuthService' });
    await slice.build('FetchManager', { sliceId: 'api', baseUrl: API_URL });
    slice.context.create('settings', { theme: 'dark' });
  }
}
```

```javascript
await slice.build('AppServices', { singleton: true });  // one bootstrap call from the App Shell's init()
const auth = slice.getComponent('AuthService');          // recover anywhere
```

:::tip
**Default: build once + `getComponent`** — one owner creates, consumers only read. Use **`slice.build('X', { singleton: true })`** (Service only — get-or-create) when a service can be built from **more than one entry point** (e.g. an `AuthService` needed by both the composition root and a standalone `/login` route): it returns the shared instance with no `getComponent(x) || build(x)` guard and no duplicate-`sliceId` race. `props` apply only on the first (creating) call.
:::

:::warning
`slice.build` **awaits the component's `init()`** — building a service already ran it. Calling `init()` again runs it twice (and re-building a child with the same `sliceId` throws "already registered"). Make `init()` idempotent: `if (this._ready) return this;`.
:::

App-lifetime singletons are never destroyed, so there is nothing to clean up.

## Global UI → a Provider Service

`singleton: true` works only for Services, because a DOM node lives in **one place at a time** — a shared Visual would teleport between mount points. So "one global widget" means "a **Provider Service** that owns the Visual." That is how `ToastProvider` / `ToolTipProvider` work: the provider is the singleton; the toasts/tooltips it creates are ephemeral.

## Cleanup

> **`destroyComponent(parent)` cascades to nested Visual children, but NOT to Services. Destroy any Service you built by hand, in `beforeDestroy()`.**

A Service has no DOM node, so nothing can discover it — not the parent cascade, not `destroyByContainer`. Same for a Visual child appended *after* `init()` (too late to be linked).

```javascript
async init() {
  this._engine = await slice.build('DataGridEngine', { sliceId: `grid-${++Table._seq}` }); // Service
}
beforeDestroy() {
  slice.controller.destroyComponent(this._engine);   // Services never cascade — destroy by hand
}
```

To tear down a region: **`slice.controller.destroyByContainer(node)`** (destroys every Visual inside a DOM subtree) **then** clear. `innerHTML = ''` alone skips `beforeDestroy` and leaks.

:::warning
Tearing a subtree down with `innerHTML = ''` does **not** run `beforeDestroy` and does **not** unregister anything — listeners stay bound and registry entries leak. Always `destroyByContainer(node)` **then** clear.
:::

## Anti-patterns

- ❌ A stateful per-instance Service via `slice.build` relied on to auto-clean — it won't. Destroy it explicitly, or (if it is pure per-instance state) use a plain `new`.
- ❌ Scattering `build({ singleton: true })` across call sites for an app-wide service — centralize it in the composition root and `getComponent` it.
- ❌ Storing service instances or functions in `slice.context` — keep only serializable state (and note `setState` **replaces** the value, it does not merge).
- ❌ Declaring `id`, `sliceId`, or `singleton` in `static props` — reserved build directives, consumed by `build` before your setters run. See [Reserved build keys](/Documentation/The-build-method).
