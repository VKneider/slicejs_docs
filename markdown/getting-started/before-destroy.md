---
title: beforeDestroy()
route: /Documentation/LifeCycle-Methods/beforeDestroy
navLabel: beforeDestroy()
section: Getting Started
group: Components
order: 43
description: Cleanup hooks to avoid memory leaks in Slice.js.
component: BeforeDestroyDocumentation
tags: [lifecycle, destroy, cleanup]
---

# beforeDestroy()

## Overview
`beforeDestroy()` runs right before a component is destroyed by the controller. Use it for
cleanup: timers, listeners, subscriptions, and pending async work.

The controller does not await this method, so keep it synchronous or fire-and-forget.

## API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `beforeDestroy` | `beforeDestroy()` | `void` | Called right before the component is removed. |

## Ideal Use Cases
- Clear intervals and timeouts
- Abort pending fetch requests
- Remove global event listeners
- Dispose third-party instances (charts, maps, etc.)
- **Destroy child Services you built with `slice.build`** — a Service has no DOM, so it is never
  auto-cleaned by the parent's destroy cascade or by `destroyByContainer`. Destroy it here.

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

## Best Practices
:::tip
Keep `beforeDestroy()` idempotent so it can be called safely.
:::

:::tip
Use `AbortController` for fetch cleanup.
:::

## Gotchas
:::warning
If you add global listeners in `init()`, remove them in `beforeDestroy()`.
:::

:::warning
Do not rely on `await` inside `beforeDestroy()`.
:::

:::warning
A Service built with `slice.build` is **not** destroyed when its owner is — it has no DOM, so neither
the destroy cascade nor `destroyByContainer` finds it. Call `slice.controller.destroyComponent(...)` on
it here, or it leaks (it stays registered and its own `beforeDestroy` never runs). See
[Service Patterns](/Documentation/Architecture/Service-Patterns).
:::
