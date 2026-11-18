---
title: beforeDestroy()
route: /Documentation/LifeCycle-Methods/beforeDestroy
navLabel: beforeDestroy()
section: Components
group: Lifecycle
order: 40
description: Cleanup hooks for timers, listeners, requests and Services that outlive the component.
component: BeforeDestroyDocumentation
tags: [lifecycle, destroy, cleanup]
---

# beforeDestroy()

## Overview
`beforeDestroy()` runs right before a component is destroyed by the controller. Use it for cleanup:
timers, listeners, subscriptions, pending async work, and Services you built by hand.

The controller does not await this method, so keep it synchronous or fire-and-forget.

A method named `destroy()`, `dispose()` or `teardown()` looks like cleanup but never runs — the
controller only calls `beforeDestroy()`. `slice doctor` reports that, and it reports a
`window`/`document` listener added without a matching `removeEventListener` in the same file unless
it uses `{ once: true }` or `{ signal }`.

## What is already cleaned up?

:::compare left="Slice cleans up for you" right="Your job in beforeDestroy"
Component-bound events (`slice.events.bind(this)`), Context watchers registered with `this`, child Visual components built inside this one, and listeners on the component's own DOM node.
---
Intervals and timeouts; an `AbortController` for fetches; `window`/`document` listeners; third-party instances (charts, maps); and every Service built with `slice.build`.
:::

The split matters: the parent destroy cascade reaches Visual children, but a Service has no DOM, so
nothing discovers it.

## API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `beforeDestroy` | `beforeDestroy()` | `void` | Called right before the component is removed. |

## Ideal use cases
- Clear intervals and timeouts.
- Abort pending fetch requests.
- Remove global event listeners.
- Dispose third-party instances (charts, maps, etc.).
- **Destroy child Services you built with `slice.build`**.

## Example

```javascript title="Cleanup in beforeDestroy()"
export default class LiveChart extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.abortController = new AbortController();
  }

  async init() {
    this._pollingId = setInterval(() => this.fetchData(), 5000);
    window.addEventListener('resize', this.onResize);
    await fetch('/api/chart', { signal: this.abortController.signal });
  }

  beforeDestroy() {
    clearInterval(this._pollingId);
    this.abortController.abort();
    window.removeEventListener('resize', this.onResize);
    this.chartInstance?.destroy();
  }
}
```

```javascript title="Destroy a Service you built (it is not auto-cleaned)"
async init() {
  this._store = await slice.build('CartService', { sliceId: `cart-${this.sliceId}` });
}

beforeDestroy() {
  // A Service has no DOM, so the parent's destroy never reaches it — do it here.
  slice.controller.destroyComponent(this._store);
}
```

:::warning
A Service built with `slice.build` is **not** destroyed when its owner is. Call
`slice.controller.destroyComponent(...)` on it in `beforeDestroy()`, or it stays registered and its
own `beforeDestroy` never runs. See [Service Patterns](/Documentation/Architecture/Service-Patterns).
:::

Keep `beforeDestroy()` idempotent: it can be called more than once in a teardown sequence, and every
cleanup inside it must tolerate that.

:::related
- [Refreshing Component Data](/Documentation/Architecture/Refreshing-Component-Data) - Reconcile lists instead of rebuilding them.
- [Service Patterns](/Documentation/Architecture/Service-Patterns) - Why Services never cascade.
- [update()](/Documentation/LifeCycle-Methods/update) - Refresh on cached route revisits.
- [Events](/Documentation/Structural/EventManager) - Component-bound subscriptions that auto-clean.
:::
