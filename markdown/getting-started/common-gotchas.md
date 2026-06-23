---
title: Common Gotchas
route: /Documentation/Common-Gotchas
navLabel: Common Gotchas
section: Getting Started
group: First Steps
order: 28
description: The traps Slice.js developers hit first — DOM timing, cleanup, routing, props — and how to avoid each one.
component: CommonGotchasDocumentation
tags: [gotchas, troubleshooting, errors, cleanup]
---

# Common Gotchas

The handful of surprises that trip up most newcomers. Each one is the symptom, the cause, and the
fix — skim it once and save yourself the debugging.

## The DOM is empty until `attachTemplate`
`querySelector` returns `null` if you call it before `slice.attachTemplate(this)`. The template is
injected by that call.

```javascript title="✅ cache refs after attachTemplate"
constructor(props) {
  super();
  slice.attachTemplate(this);                 // template is now in the DOM
  this.$title = this.querySelector('.title'); // works
  slice.controller.setComponentProps(this, props);
}
```

## `slice.build()` returns `null` when the component isn't registered
A missing entry in `components.js` (or a wrong `paths.components` path/type) makes `build` resolve
to `null` — not throw. Always guard, and resync the registry.

```javascript title="Guard the result"
const node = await slice.build('UserCard', props);
if (node) container.appendChild(node);   // null = not registered → run `npm run component:list`
```

## Clearing `innerHTML` does NOT destroy components
`container.innerHTML = ''` removes the DOM but leaves the Slice instances registered — a leak, and
their `beforeDestroy` never runs.

:::warning
Destroy through the framework so `beforeDestroy` runs and the registry is cleaned:
`slice.controller.destroyComponent(sliceId)` for one, or
`slice.controller.destroyByContainer(node)` for a subtree.
:::

## Components built with `slice.build` are NOT auto-destroyed
A parent does not automatically destroy children you built with `slice.build`. Destroy them
explicitly (or via `destroyByContainer`) when you tear down or refresh a region.

## Services have no DOM — clean them up yourself
A Service is never cascaded by a parent's destroy (it has no DOM). Release its timers, listeners,
and subscriptions in `beforeDestroy()`. See
[Service Patterns](/Documentation/Architecture/Service-Patterns).

## `beforeDestroy()` is not awaited
It runs synchronously right before destruction. Keep it synchronous or fire-and-forget — do not
rely on an `await` inside it completing.

## Setters can run before `init()`
`setComponentProps` runs in the **constructor**, before `init()`. If you cache DOM refs in
`init()`, a setter may fire before they exist — guard with `?.`.

```javascript title="Guard refs cached in init()"
set name(v) { this._name = v; this.applyName?.(); }   // setter may run before init()
async init() { this.$name = this.querySelector('.name'); this.applyName(); }
applyName() { if (this.$name) this.$name.textContent = this._name; }
```

## `update()` is not called on first build
The framework calls `update()` only for **refreshes** (cached-route revisits, or when you call it).
`init()` does the first paint. See [LifeCycle Methods](/Documentation/LifeCycle-Methods).

## Route params are strings, one per segment
A `${param}` captures a **single** URL segment and arrives as a **string**. For multiple values use
several segments or query params, and parse types yourself.

```javascript title="Params are strings"
// route: /user/${id}
const id = Number(params.id);   // it's a string — convert if you need a number
```

## A refresh keeps the props you don't pass
Refreshing a built component with `slice.setComponentProps(comp, { a })` updates `a` and **leaves
the rest as-is** — omitted props are not reset to their defaults. To reset one, pass its value
explicitly. (Defaults only apply at build.)
