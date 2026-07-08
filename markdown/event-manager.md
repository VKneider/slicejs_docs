---
title: EventManager
route: /Documentation/Structural/EventManager
navLabel: Events
section: Getting Started
group: Events
order: 20
description: Lightweight pub/sub for component and app events.
component: EventManagerDocumentation
tags: [events, pubsub, lifecycle, cleanup]
---

# EventManager

## Overview
EventManager provides a lightweight pub/sub system for Slice.js. It supports global subscriptions,
component-bound subscriptions with auto-cleanup, and one-time listeners. It is designed for
cross-cutting signals and decoupled communication between components and services.

## When to Use
- App-level signals (app:ready, user:login, notification:show)
- Decoupled UI updates (service emits, UI listens)
- One-time bootstrap actions

## When Not to Use
- Shared, persistent state: use ContextManager instead
- High-frequency real-time data: use dedicated data streams

## Enable
```json
{
  "events": { "enabled": true }
}
```

## Events UI (Optional)
You can enable the EventManager debug panel with a keyboard shortcut.

```json title="sliceConfig.json"
{
  "events": {
    "enabled": true,
    "ui": {
      "enabled": true,
      "shortcut": "alt+shift+e"
    }
  }
}
```

## Concepts
- Event names are strings, typically namespaced (`domain:action`).
- Subscriptions can be global or component-bound.
- Component-bound subscriptions are auto-removed when the component is destroyed.

:::tip
Declare your events in the [Event Registry](/Documentation/Structural/EventRegistry) to get
dev-time validation, typed `emit`/`subscribe`, and a documented graph of who emits and listens.
:::

## Framework-emitted events
Slice emits a few events itself; subscribe to them like any other:

| Event | Fired by | Payload |
| --- | --- | --- |
| `router:change` | Router — once per navigation, after the new route renders | `{ to, from }` route objects — see [Routing](/Documentation/Routing) |
| `context:<name>` | ContextManager — on every `setState` for that context | the context's new state — see [ContextManager](/Documentation/Structural/ContextManager) |

Both are **auto-declared** in the [Event Registry](/Documentation/Structural/EventRegistry) — you
don't `register()` them, and subscribing works out of the box.

:::warning
This table assumes events are enabled. With `events.enabled: false`, `slice.events` is a no-op, so:
- `router:change` instead dispatches a `CustomEvent` on `window`
  (`window.addEventListener('router:change', e => e.detail)`) — see
  [Routing → Route Change Events](/Documentation/Routing).
- the `context:<name>` signals aren't emitted at all, which means
  [`slice.context.watch()`/`bind()`](/Documentation/Structural/ContextManager) stop reacting to
  `setState` — context reactivity depends on EventManager being enabled.
:::

## API Reference
| Method | Signature | Notes |
| --- | --- | --- |
| `subscribe` | `(eventName, callback, options?)` | Auto-cleanup if `options.component` set |
| `subscribeOnce` | `(eventName, callback, options?)` | Auto-unsubscribe after first emit |
| `unsubscribe` | `(eventName, subscriptionId)` | Returns boolean |
| `emit` | `(eventName, data?)` | Emits to all subscribers |
| `bind` | `(component)` | Returns component-bound API |
| `register` | `(catalog)` or `(namespace, catalog)` | Declare events — see [Event Registry](/Documentation/Structural/EventRegistry) |
| `hasSubscribers` | `(eventName)` | Diagnostics only |
| `subscriberCount` | `(eventName)` | Diagnostics only |
| `clear` | `()` | Clears all subscriptions |
| `startRecording` | `()` | Activate emit history + counters (called by debugger on open) |
| `stopRecording` | `()` | Deactivate emit recording (called by debugger on close) |

## Usage Patterns
```javascript title="Component-bound subscription in init() (recommended)"
export default class Navbar extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
  }

  async init() {
    this.events = slice.events.bind(this);
    this.events.subscribe("user:logout", () => this.resetUI());
  }

  resetUI() {
    // ...
  }
}
```

```javascript title="Component-bound without bind() in init()"
export default class Navbar extends HTMLElement {
  async init() {
    slice.events.subscribe(
      "user:logout",
      () => this.resetUI(),
      { component: this }
    );
  }
}
```

```javascript title="One-time initialization in init()"
export default class AppShell extends HTMLElement {
  async init() {
    slice.events.subscribeOnce("app:ready", () => {
      console.log("App ready");
    });
  }
}
```

```javascript title="Global notification from a service"
export default class NotificationService {
  notify(message, type = "success") {
    slice.events.emit("notification:show", { type, message });
  }
}
```

## Component Integration
```javascript title="Service emits, UI listens"
export default class NotificationService {
  notify(message, type = "info") {
    slice.events.emit("notification:show", { message, type });
  }
}

export default class Toasts extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
  }

  async init() {
    this.events = slice.events.bind(this);
    this.events.subscribe("notification:show", ({ message, type }) => {
      this.showToast(message, type);
    });
  }
}
```

## Implementation Recipe
:::steps
1. Choose a namespaced event name (e.g., `cart:updated`).
2. Emit the event where the change happens.
3. Subscribe in the UI or other consumers using `bind()`.
4. Use `subscribeOnce` for bootstrapping or single-run tasks.
:::

## Best Practices
:::tip
Use namespaced event names. Avoid generic names like `update` or `change`.
:::

:::tip
Keep payloads small and serializable when possible.
:::

:::tip
Prefer `bind()` for components. It prevents leaks by default.
:::

:::tip
Use EventManager for signals, not for shared state. Pair with ContextManager when state must persist.
:::

## Gotchas
:::warning
Clearing a container does not remove subscriptions. Use component-bound subscriptions or manual
`unsubscribe` calls.
:::

:::warning
Avoid using EventManager as a data store. It does not retain state.
:::

## Diagnostics
```javascript title="Check if anyone is listening"
if (slice.events.hasSubscribers("cart:updated")) {
  slice.events.emit("cart:updated", { items: 3 });
}
```

## Debugger panel
Enable the EventManager UI to inspect subscriptions and recent emits in real time:

```json title="sliceConfig.json"
{
  "events": {
    "enabled": true,
    "ui": {
      "enabled": true,
      "shortcut": "alt+shift+e"
    }
  }
}
```

The panel has three tabs:

- **Subscribers** — every event with its subscriber count, an **emit counter** (⚡), the
  **emitters** that fired it this session, and expandable subscriber details (component name,
  `sliceId`, and a `once` badge for one-time listeners).
- **Registry** — the declared catalog grouped by namespace, with payload shapes and the static
  emitter/listener graph. See [Event Registry](/Documentation/Structural/EventRegistry).
- **History** — reverse-chronological feed of every `emit()` call with its origin and relative
  timestamps ("2s ago", "1m ago"). Use it to trace "who emitted what and when".

Recording is **zero-overhead in production**: the emit log, counters, and emitter attribution
are only active while the panel is open (`startRecording`/`stopRecording`).

## FAQ
:::details title="Should I use EventManager for shared state?"
No. Use ContextManager for shared state. EventManager is for ephemeral signals.
:::

:::details title="What happens if events are disabled?"
Slice.js provides a no-op implementation so calls to `slice.events` are safe.
:::

:::details title="Do I need to unsubscribe manually?"
Only if you are not using `bind()` or `options.component`. Component-bound subscriptions auto-clean.
:::

:::details title="Can I debug event usage?"
Open the EventManager debug panel (`alt+shift+e`). The **Subscribers** tab shows every event's
listeners and emit count; the **History** tab shows a live feed of every `emit()` call. Recording
is zero-overhead — it only activates while the panel is open.
:::
