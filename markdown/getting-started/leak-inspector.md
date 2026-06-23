---
title: Leak Inspector
route: /Documentation/LeakInspector
navLabel: Leak Inspector
section: Getting Started
group: Diagnostics
order: 43
description: Dev-only panel that surfaces components left registered but detached from the DOM.
component: LeakInspectorDocumentation
tags: [diagnostics, leaks, cleanup, lifecycle, devtools]
---

# Leak Inspector

## Overview
The most common Slice leak is silent: a component builds children with `slice.build(...)`
and later clears them with `innerHTML = ''`, `replaceChildren`, or `remove()` **without**
`destroyComponent`. The DOM is gone, but the instances stay registered in
`slice.controller.activeComponents` forever — and their `beforeDestroy()` never runs, so
their listeners, timers, and observers leak too.

The framework can't see this for you at build time, so the **Leak Inspector** is a dev-only
panel that watches `activeComponents` and flags the orphans: components that are **registered
but detached from the live DOM and not intentionally cached**.

## Enable
The Leak Inspector lives under the `debugger` config and is **always off in production**,
regardless of this flag:

```json title="sliceConfig.json"
{
  "debugger": {
    "enabled": false,
    "click": "right",
    "leakInspector": { "enabled": true, "shortcut": "alt+shift+k" }
  }
}
```

Open it with the shortcut (`alt+shift+k` by default). The panel computes only while open —
zero overhead otherwise.

## What it flags (and what it ignores)
A component is a **candidate leak** when all of the following hold:

- it is registered in `slice.controller.activeComponents`, and
- it is an `HTMLElement` **detached** from the live DOM (`isConnected === false`), and
- it is **not intentionally cached**.

The criteria are deliberately conservative so caching patterns are **not** false-flagged:

| Excluded | Why |
| --- | --- |
| `Route` / `MultiRoute` cached views | Marked `__sliceCached` while parked off-DOM between navigations |
| Router-managed instances (`route-*` ids) | Reused across navigation by the Router |
| Descendants of a detached cached/orphan root | Only the root is reported, not every child |

The panel also tracks `activeComponents.size` over time and shows a **trend** marker — a
count that only ever grows across navigations is the signal of an accumulation leak even when
individual orphans look ambiguous.

## The panel
- **orphans** — each candidate with its component name, `sliceId`, why it was flagged, and the
  `parentComponent` retain chain. A per-row **destroy** action calls `destroyComponent` so you
  can confirm a suspect frees cleanly.
- **active** — current `activeComponents.size`.
- **trend** — `stable` or `growing ▲`.

## Programmatic API
| Method | Signature | Notes |
| --- | --- | --- |
| `findOrphans` | `()` | Returns the current candidate leaks (read-only) |
| `registerLeakExclusion` | `(predicate)` | Mark your own cached-but-detached instances as intentional |

```javascript title="Exclude an app-specific cache from leak detection"
// Your own pool/cache keeps instances off-DOM on purpose.
slice.controller.registerLeakExclusion((component) => myPool.has(component.sliceId));
```

## Fixing a leak
When the inspector flags a component, the fix is almost always to destroy before you detach:

```javascript title="Destroy slice.build'd children before clearing"
async update() {
  /* ❌ leaks: instances stay in activeComponents, beforeDestroy never runs */
  this.$list.innerHTML = '';

  /* ✅ destroy first, then the DOM is safe to clear */
  slice.controller.destroyByContainer(this.$list);
  this.$list.replaceChildren();

  for (const order of this.orders) {
    this.$list.appendChild(await slice.build('OrderRow', { order }));
  }
}
```

And release anything that outlives the subtree in `beforeDestroy()`:

```javascript title="Free globals/timers/observers on destroy"
beforeDestroy() {
  window.removeEventListener('resize', this._onResize);
  clearInterval(this._timer);
  this._observer.disconnect();
}
```

See [beforeDestroy()](/Documentation/LifeCycle-Methods/beforeDestroy) for the full cleanup
contract, and [DevTools](/Documentation/DevTools) for the other runtime panels.

## Best Practices
:::tip
Keep the Leak Inspector enabled in development and exercise your navigation/list flows with it
open — accumulation leaks show up as a `growing ▲` trend across route changes.
:::

:::tip
For your own off-DOM caches, register a `registerLeakExclusion` predicate (or set
`component.__sliceCached = true`) so the inspector doesn't flag intentional retention.
:::

## Gotchas
:::warning
The Leak Inspector diagnoses; it does not fix. A per-row destroy is a manual probe — the real
fix is calling `destroyComponent` / `destroyByContainer` before clearing the DOM.
:::

:::warning
It is dev-only. Don't rely on it in production; rely on correct cleanup. The panel never
initializes when the app runs in production mode.
:::

## FAQ
:::details title="Why is my cached Route view not flagged?"
`Route` and `MultiRoute` mark their cached instances `__sliceCached` while they sit off-DOM
between navigations, so the inspector treats them as intentional, not leaks.
:::

:::details title="It flagged a component I destroy later — is that a real leak?"
If it is detached now and still registered, yes — it is leaking until you destroy it. Destroy at
the moment you remove it from the DOM, not "later".
:::
