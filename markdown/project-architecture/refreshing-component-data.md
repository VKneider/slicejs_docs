---
title: Refreshing Component Data
route: /Documentation/Architecture/Refreshing-Component-Data
navLabel: Refreshing Data
section: Guides
group: ''
order: 70
description: How to update what a component shows after it's built — prop setters, update(), list reconciliation, context, events, or destroy+recreate — and which to reach for.
component: RefreshingComponentDataDocumentation
tags: [architecture, state, update, context, events, lists, reconcile, domservice]
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
| A **list of child components** changed (add, remove, reorder, filter) | **`DomService.reconcile`** (§3) |
| State that **several components** share and react to | **Context** — `watch` / `setState` (§4) |
| "Something happened, refresh" **across the app** | **Events** — `emit` / `subscribe` (§5) |
| The component's **structure** fundamentally changed | **Destroy + recreate** — last resort (§6) |

## 1. Set a prop or call a method (the default)
In Slice, props go through **setters** — so updating data is usually just *assigning a prop*. The setter
updates the DOM; the instance (and its focus/scroll/internal state) is preserved.

```javascript title="Same instance, new data"
const table = await slice.build('Table', { columns, rows });

// later — the rows changed:
table.rows = await fetchRows();   // the setter updates the DOM; no rebuild
```

Components also expose **methods** for finer updates — same idea, just a call:

```javascript
select.options = await fetchOptions();   // a setter
form.setValue('email', user.email);      // a method
table.loading = true;                    // toggle a busy state, then set rows
```

> Design your own components so that **assigning a prop or calling a method drives the DOM update** — that
> is what makes this the default refresh path.

## 2. `update()` — cached route revisits
`MultiRoute` / `Route` **cache** instances. When you navigate away and back, Slice calls
**`update()`**, not `init()` — so refresh route-level data there (and you can call it manually too).

```javascript title="Refresh on revisit"
export default class OrdersPage extends HTMLElement {
  async init()   { this.$list = this.querySelector('.orders'); await this.load(); }
  async update() { await this.load(); }   // cached revisit → refresh

  async load() {
    const orders = await slice.getComponent('api').request('GET', null, '/orders');
    await this.renderOrders(orders);      // §3: reconcile, never replaceChildren()
  }
}
```

The framework **serializes** your `update()` — concurrent or rapid calls coalesce (last wins) — so
it is safe under streaming or fast revisits without writing manual guards. For lists, refresh **in
place**; §3 shows the canonical way. See [`update()`](/Documentation/LifeCycle-Methods/update). Keep it
idempotent.

## 3. Lists — reconcile instead of rebuild
When the data is a **variable-length list**, the change is not "set one prop": items are added,
removed, filtered or reordered. The tempting code is:

```javascript
this.$list.replaceChildren();   // ✗ removes nodes without running beforeDestroy()
for (const order of orders) {
  this.$list.appendChild(await slice.build('OrderRow', { title: order.title }));
}
```

That leaks every row's listeners, timers and registry entry, and throws away the state and focus of
rows that did not change. Use the registry [`DomService`](https://components.slicejs.com/docs/services/dom-service)
instead:

```javascript
const dom = await slice.build('DomService', { singleton: true });

await dom.reconcile(this.$list, orders, {
  keyOf: (order) => `order-${order.id}`,   // stable, page-wide unique
  component: 'OrderRow',
  props: (order) => ({ title: order.title }),
  equals: Object.is,                       // immutable data: refresh only changed rows
});
```

`reconcile` does the three things the manual loop gets wrong:

1. **Refresh in place.** A survivor is found by its stable key and updated through
   `slice.setComponentProps` (or your `refresh` callback). Its state, focus and children survive.
2. **Prune.** A row whose data is gone is destroyed with `slice.controller.destroyComponent`, which
   runs `beforeDestroy()`.
3. **Reorder with the fewest moves.** `insertBefore` moves a node instead of cloning it, so the
   constructor does not run again and focus/animations are not restarted.

It also queues renders per container and coalesces rapid calls, so a filter box that re-renders on
every keystroke applies the last query, not every intermediate one. `await reconcile()` means the DOM
is at least as fresh as that call.

**Compose it with the other sections:** call `reconcile` from a prop setter (§1), from `update()`
(§2), from a Context watcher (§4) or from an Event handler (§5). It is the list-level refresh
primitive, not a replacement for the trigger.

:::warning
Keys are page-wide `sliceId`s, not per-container. Two unrelated lists using `row-1` will adopt and
fight over the same node. Prefix them (`orders-row-1`, `cart-row-1`).
:::

**When to skip `equals`:** use `equals: Object.is` only with immutable data. If you mutate item
objects in place, the mutated row will look unchanged and will not refresh.

`dom.destroyChildren(container)` tears down every registered child at once when the whole list goes
away.

## 4. Context — shared state many components react to
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

## 5. Events — react to "something happened"
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

## 6. Destroy + recreate (last resort)
Only when the component's **structure** changed so fundamentally that reconfiguring it would be more code
than rebuilding. It is the heaviest option: you lose instance state, pay an async rebuild, and **must
clean up** the old instance and its children first.

```javascript title="Rebuild a region"
slice.controller.destroyByContainer(this.$slot);   // runs beforeDestroy on everything inside
this.$slot.innerHTML = '';
const fresh = await slice.build('BigWidget', { ...newConfig });
this.$slot.appendChild(fresh);
```

Before reaching for this, check whether a setter/method (§1) or `DomService.reconcile` (§3) can
express the change instead — e.g. the `Table` reconfigures its pager by **setting props**, it never
destroys and rebuilds it. And remember the cleanup rules: components built with `slice.build` are
**not** auto-destroyed by a parent, and Services have no DOM so they are never cascaded — see
[Service Patterns](/Documentation/Architecture/Service-Patterns).

## Choose the lightest refresh
:::compare left="Update in place" right="Rebuild the region"
Assign a prop, call a method, reconcile a list, or let Context/Events notify watchers. The instance, its state and its children survive.
---
Destroy the old component and build a new one. Only when the structure itself changed so much that reconfiguring it would cost more than rebuilding.
:::

:::related
- [DomService](https://components.slicejs.com/docs/services/dom-service) - Full reconcile API: keys, equals, refresh, destroyChildren.
- [Service Patterns](/Documentation/Architecture/Service-Patterns) - Where a service lives and how it is cleaned up.
- [update()](/Documentation/LifeCycle-Methods/update) - Cached route revisits.
- [beforeDestroy()](/Documentation/LifeCycle-Methods/beforeDestroy) - What cleanup actually runs.
:::
