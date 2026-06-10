---
title: Refreshing Component Data
route: /Documentation/Architecture/Refreshing-Component-Data
navLabel: Refreshing Data
section: Project Architecture
group: Styles and Patterns
order: 7
description: How to update what a component shows after it's built — prop setters, update(), context, events, or destroy+recreate — and which to reach for.
component: RefreshingComponentDataDocumentation
tags: [architecture, state, update, context, events]
---

# Refreshing Component Data

The data behind a component changed — how do you update what's on screen? Slice gives you several
mechanisms, from the cheapest (set a prop) to the heaviest (destroy + recreate). **Reach for the
lightest one that fits** — the heavier the mechanism, the more you throw away (instance state, focus,
scroll, async cost).

## Which one?

| Situation | Reach for |
| --- | --- |
| You hold the instance and the data/props changed | **a prop setter** or an update method (§1) |
| A **cached route** is revisited | **`update()`** (§2) |
| State that **several components** share and react to | **Context** — `watch` / `setState` (§3) |
| "Something happened, refresh" **across the app** | **Events** — `emit` / `subscribe` (§4) |
| The component's **structure** fundamentally changed | **Destroy + recreate** — last resort (§5) |

## 1. Set a prop or call a method (the default)
In Slice, props go through **setters** — so updating data is usually just *assigning a prop*. The setter
re-renders; the instance (and its focus/scroll/internal state) is preserved.

```javascript title="Same instance, new data"
const table = await slice.build('Table', { columns, rows });

// later — the rows changed:
table.rows = await fetchRows();   // the setter re-renders; no rebuild
```

Components also expose **methods** for finer updates — same idea, just a call:

```javascript
select.options = await fetchOptions();   // a setter
form.setValue('email', user.email);      // a method
table.loading = true;                    // toggle a busy state, then set rows
```

> Design your own components so that **assigning a prop or calling a method drives the re-render** — that
> is what makes this the default refresh path.

## 2. `update()` — cached route revisits
`MultiRoute` / `Route` **cache** instances. When you navigate away and back, Slice calls
**`update()`**, not `init()` — so refresh route-level data there (and you can call it manually too).

```javascript title="Refresh on revisit"
export default class OrdersPage extends HTMLElement {
  async init()   { await this.load(); }   // first visit
  async update() { await this.load(); }   // cached revisit → refresh

  async load() {
    this.orders = await slice.getComponent('api').request('GET', null, '/orders');
    this.render();
  }
}
```

See [`update()`](/Documentation/LifeCycle-Methods/update). Keep it idempotent.

## 3. Context — shared state many components react to
When several components depend on the **same** state, put it in [`slice.context`](/Documentation/Structural/ContextManager).
Each component `watch`es it and refreshes when it changes; anyone calls `setState` to change it.

```javascript title="Watch shared state"
async init() {
  this.$count = this.querySelector('.cart-count');
  slice.context.watch(
    'cart',
    this,
    (count) => { this.$count.textContent = count; },
    (state) => state.items.length        // selector: only refresh when the count changes
  );
}

// anywhere a change happens:
slice.context.setState('cart', (prev) => ({ ...prev, items: [...prev.items, item] }));
```

Watchers registered with `this` are **auto-cleaned** on destroy — don't unwatch them by hand.

## 4. Events — react to "something happened"
For cross-cutting "X happened, refresh" signals, use [`slice.events`](/Documentation/Structural/EventManager).
A component subscribes; some other part of the app emits.

```javascript title="Refresh on an event"
async init() {
  this.events = slice.events.bind(this);
  this.events.subscribe('orders:updated', () => this.refresh());
}

async refresh() {
  this.rows = await fetchRows();   // note: re-uses the setter from §1
}

// elsewhere, after a mutation:
slice.events.emit('orders:updated');
```

Subscriptions made via `slice.events.bind(this)` are **auto-cleaned** on destroy.

**Context vs Events:** ask *"what is the current state?"* → Context. Ask *"did something happen?"* →
Events. Prefer Context for state, and add an Event when cross-domain side effects must react.

## 5. Destroy + recreate (last resort)
Only when the component's **structure** changed so fundamentally that reconfiguring it would be more code
than rebuilding. It is the heaviest option: you lose instance state, pay an async rebuild, and **must
clean up** the old instance and its children first.

```javascript title="Rebuild a region"
slice.controller.destroyByContainer(this.$slot);   // runs beforeDestroy on everything inside
this.$slot.innerHTML = '';
const fresh = await slice.build('BigWidget', { ...newConfig });
this.$slot.appendChild(fresh);
```

Before reaching for this, check whether a setter/method (§1) can express the change instead — e.g. the
`Table` reconfigures its pager by **setting props**, it never destroys and rebuilds it. And remember the
cleanup rules: components built with `slice.build` are **not** auto-destroyed by a parent, and Services
have no DOM so they are never cascaded — see [Service Patterns](/Documentation/Architecture/Service-Patterns).

## Rule of thumb
Lightest first: **a prop/method** for the same instance, **`update()`** for cached routes,
**Context/Events** for shared or cross-cutting state, and **destroy + recreate** only when the structure
itself changes.
