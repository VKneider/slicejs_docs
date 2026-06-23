---
title: LifeCycle Methods
route: /Documentation/LifeCycle-Methods
navLabel: LifeCycle Methods
section: Getting Started
group: Components
order: 40
description: Overview of init, update, and beforeDestroy in Slice.js.
component: LifeCycleMethods
tags: [lifecycle, init, update, destroy]
---

# LifeCycle Methods

## Overview
Slice.js components expose three lifecycle methods for predictable behavior:

- `init()` for one-time setup
- `update()` for refreshes when data or routes change
- `beforeDestroy()` for cleanup and memory safety

These methods are called by the framework and are the recommended places to manage state,
subscriptions, and DOM updates.

## Which method do I use?
| I want to… | Use | Why |
| --- | --- | --- |
| Cache DOM refs / bind listeners | constructor (after `attachTemplate`) or `init()` | constructor is synchronous; use `init()` if the setup is async |
| Fetch initial data / build children | `init()` | it is `async` and awaited before first use |
| Refresh after the data or route changed | `update()` | runs on cached-route revisits; safe to call manually |
| Clean up timers / listeners / subscriptions | `beforeDestroy()` | runs right before destroy (not awaited) |

For *how* to refresh (prop setter vs `update()` vs context vs events), see
[Refreshing Component Data](/Documentation/Architecture/Refreshing-Component-Data).

## The constructor (before init)
Before any lifecycle method runs, the constructor builds the component. Every Visual component's
constructor does three things, in order:

```javascript title="Canonical constructor"
constructor(props) {
  super();
  slice.attachTemplate(this);                       // 1. inject the .html as children
  // 2. (optional) cache DOM references and bind listeners — they work now
  slice.controller.setComponentProps(this, props);  // 3. apply props — call LAST
}
```

- The DOM is **only** available after `slice.attachTemplate(this)`. Before that call,
  `querySelector` returns `null`; after it, queries work inside the constructor.
- `slice.controller.setComponentProps(this, props)` assigns each prop (and each `static props`
  default) through its **setter**, so side effects belong in setters. Call it last.

There are two valid ways to cache DOM references:
- **In the constructor**, after `attachTemplate` (what the official components do). Setters can
  then update the DOM directly.
- **In `init()`**, which is also where async work goes (fetching, building children).

See Component Anatomy for the full authoring guide.

## Lifecycle Summary
| Method | Called when | Async awaited | Typical responsibilities |
| --- | --- | --- | --- |
| `init()` | After construction, before first use | yes | Cache DOM, fetch initial data, build static children. |
| `update()` | Cached route revisit, or called by a parent / self / watcher | yes | Refresh **in place** (reuse children by `sliceId`); re-fetch data; apply props. The framework **serializes** repeated calls. |
| `beforeDestroy()` | Right before destruction | no | Cleanup timers, listeners, subscriptions, aborts. |

## Call Order and Timing
```javascript title="Lifecycle timing"
class Example extends HTMLElement {
  async init() {
    // Runs once after template is attached and props are set
  }

  async update() {
    // Runs when the component is reused or refreshed
  }

  beforeDestroy() {
    // Runs right before the component is destroyed
  }
}
```

## Navigation and Reuse
`update()` is called when a cached component is reused by routing (`Route` / `MultiRoute`
containers), so static structure is never rebuilt. The framework **serializes** your `update()` —
rapid or concurrent calls coalesce (last wins) — so streaming and fast revisits are safe without
manual guards.

## Recommended Structure
Refresh **in place**: reuse children by a stable `sliceId`, build only the new ones, and prune the
gone. Survivors keep their scroll, focus, and internal state.

```javascript title="init + in-place update + cleanup"
export default class UserList extends HTMLElement {
  async init() {
    this.$container = this.querySelector('.users');
    await this.refresh();
  }

  async update() {        // cached revisit or data changed → refresh in place
    await this.refresh();
  }

  async refresh() {
    const users = await this.loadUsers();
    const alive = new Set();

    for (const u of users) {
      const sliceId = `user-${u.id}`;
      alive.add(sliceId);
      const card = slice.getComponent(sliceId);
      if (card) slice.setComponentProps(card, { name: u.name });   // reuse, no flicker
      else this.$container.appendChild(await slice.build('UserCard', { sliceId, ...u }));
    }

    for (const el of Array.from(this.$container.children)) {        // prune the gone
      const id = el.getAttribute('slice-id');
      if (id && !alive.has(id)) slice.controller.destroyComponent(id);
    }
  }

  beforeDestroy() {
    clearInterval(this._pollingId);
    this.abortController?.abort();
  }
}
```

## Best Practices
:::tip
Keep `init()` focused on one-time setup and cache DOM references there.
:::

:::tip
Refresh lists **in place**: reuse children by a stable `sliceId` (build new, update existing,
prune gone). Destroy + rebuild only when the content is wholly different.
:::

## Gotchas
:::warning
`beforeDestroy()` is not awaited. Keep it synchronous or fire-and-forget.
:::

:::warning
Clearing `innerHTML` does not destroy Slice components. Use `destroyByContainer` first.
:::

## Guides
- `init()`: /Documentation/LifeCycle-Methods/init
- `update()`: /Documentation/LifeCycle-Methods/update
- `beforeDestroy()`: /Documentation/LifeCycle-Methods/beforeDestroy
