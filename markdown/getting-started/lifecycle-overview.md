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
| `update()` | When a cached route/component is reused | yes | Re-fetch data, rebuild dynamic lists, update state. |
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
`update()` is called when a cached component is reused by routing (for example, `Route` and
`MultiRoute` containers). This keeps UI responsive without rebuilding static structure.

## Recommended Structure
```javascript title="Recommended separation"
export default class UserList extends HTMLElement {
  async init() {
    this.$container = this.querySelector('.users');
    await this.loadUsers();
    await this.buildUserCards();
  }

  async update() {
    slice.controller.destroyByContainer(this.$container);
    this.$container.innerHTML = '';
    await this.loadUsers();
    await this.buildUserCards();
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
Use `destroyByContainer` before rebuilding dynamic lists in `update()`.
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
