---
title: update()
route: /Documentation/LifeCycle-Methods/update
navLabel: update()
section: Getting Started
group: Components
order: 42
description: Refresh dynamic UI in Slice.js components.
component: UpdateMethodDocumentation
tags: [lifecycle, update]
---

# update()

## Overview
`update()` refreshes a component **in place** after `init()` — same instance, no destroy, no
flicker. The router calls it when a cached `Route` / `MultiRoute` is revisited; a parent, the
component itself, or a `slice.context` watcher can call it too. Define it only when a refresh
needs logic beyond a prop setter — rebuilding child components, an async fetch, or applying
several props at once.

The framework **wraps your `update()`**: calls are **serialized and coalesced** (last wins). An
`async update()` driven rapidly — streaming tokens, fast state changes — never overlaps itself
or tears the DOM. You write a plain `update()`; no manual tokens, queues, or guards.

## API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `update` | `async update(props?)` | `Promise<void>` | Wrapped by the framework (serialized + coalesced). The router calls it with no args — read `this.props` (route params); a parent passes props as the argument. |

## Refresh in place — reuse, don't rebuild
When the data changed but the entities persist, **reuse instances by a stable `sliceId`** and let
each one refresh itself. Survivors are never recreated, so scroll, focus, and internal state are
preserved.

```javascript title="Reuse surviving rows, build new ones, prune the gone"
async update(state = {}) {
  const items = state.items || [];
  const alive = new Set();

  for (const item of items) {
    const sliceId = `row-${item.id}`;
    alive.add(sliceId);

    const row = slice.getComponent(sliceId);
    if (row) {
      slice.setComponentProps(row, { title: item.title });   // refresh in place
    } else {
      const node = await slice.build('Row', { sliceId, ...item });
      if (node) this.$list.appendChild(node);
    }
  }

  // prune: destroy rows whose data is gone
  for (const el of Array.from(this.$list.children)) {
    const id = el.getAttribute('slice-id');
    if (id && !alive.has(id)) slice.controller.destroyComponent(id);
  }
}
```

`slice.setComponentProps(comp, props)` applies a bag of props to a component. On a built
component it **refreshes**: re-runs the setters, does **not** re-apply defaults, and won't clobber
the props you omit. (At construction time the same call applies defaults — it detects the mode.)

## Total replacement — build-then-swap
When the new data shares nothing with the old (e.g. a different conversation), build the
replacement **off-DOM first**, then swap in one operation — no empty frame.

```javascript title="Build off-DOM, then swap atomically"
async update(state = {}) {
  const old = Array.from(this.$slot.children)
    .map((el) => el.getAttribute('slice-id')).filter(Boolean);

  const frag = document.createDocumentFragment();
  for (const item of state.items) {
    const node = await slice.build('Card', { sliceId: `card-${item.id}`, ...item });
    if (node) frag.appendChild(node);
  }

  this.$slot.replaceChildren(frag);                       // atomic swap
  if (old.length) slice.controller.destroyComponent(old); // clean up the old instances
}
```

## Best Practices
:::tip
Prefer a **prop setter** for single-value changes — see
[Refreshing Component Data](/Documentation/Architecture/Refreshing-Component-Data). Reach for
`update()` when the refresh needs logic: rebuilding children, an async fetch, or several props.
:::

:::tip
Reuse by `sliceId` for lists. The framework serializes your `update()`, so streaming and rapid
calls are safe without writing any guards yourself.
:::

## Gotchas
:::warning
Clearing `innerHTML` alone does not destroy Slice components — use `destroyComponent` /
`destroyByContainer` so `beforeDestroy` runs and the registry is cleaned.
:::

:::warning
`update()` is for refreshes **after** `init()`. The framework does not call it on first build —
`init()` does the first paint.
:::
