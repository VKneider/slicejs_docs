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
