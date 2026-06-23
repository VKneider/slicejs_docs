---
title: Event Registry
route: /Documentation/Structural/EventRegistry
navLabel: Event Registry
section: Getting Started
group: Events
order: 21
description: Declare a typed, namespaced catalog of events for dev validation, autocompletion, and pub/sub tracing.
component: EventRegistryDocumentation
tags: [events, registry, pubsub, types, tracing]
---

# Event Registry

## Overview
Pub/sub decouples senders from receivers — which is exactly why it is hard to trace:
event names are bare strings, payloads are untyped, and a typo silently creates a new
event nobody listens to. The **Event Registry** is an opt-in catalog that turns your
events into a **declared, typed, namespaced contract**.

Declaring events buys you three things:
- **Dev-time validation** — emitting or subscribing to an event you never declared warns once.
- **Typed `emit`/`subscribe`** — `slice types generate` reads the catalog so payloads autocomplete and wrong shapes fail `tsc`.
- **A documented graph** — who emits and who listens to each event, both statically (from code) and live (this session).

The registry is **opt-in and safe by default**: if you never call `register()`, the
EventManager behaves exactly as before (no warnings, no overhead).

## Declaring events

Declare events at your composition root (e.g. a `Providers` service built from
`AppShell.init()`). `register()` is **mergeable** — call it as many times as you like,
from as many modules as you like.

```javascript title="Flat keys (namespace:event)"
slice.events.register({
  'cart:add':     { description: 'Item added to cart', payload: { sku: 'string', qty: 'number' } },
  'cart:cleared': { description: 'Cart emptied', payload: null },   // null => no payload
});
```

```javascript title="Grouped by namespace — register(namespace, catalog)"
slice.events.register('user', {
  login:  { payload: { id: 'number', name: 'string' } },
  logout: { payload: null },
}); // => declares 'user:login' and 'user:logout'
```

The `payload` mini-schema uses the same vocabulary as `static props` types: a field map
like `{ id: 'number', name: 'string' }`, or `null` for events that carry no data.

### Modularize by domain
Keep one catalog per domain in its own module and register them where you wire singletons:

```javascript title="src/events/cart.events.js"
export const cartEvents = {
  'cart:add':     { payload: { sku: 'string', qty: 'number' } },
  'cart:cleared': { payload: null },
};
```

```javascript title="Providers.init() — the composition root"
import { cartEvents } from '../events/cart.events.js';
import { userEvents } from '../events/user.events.js';

slice.events.register(cartEvents).register(userEvents);
```

## Validation (dev only)
Once any catalog is registered, the EventManager validates usage in development. It
**never throws and never blocks delivery** — it logs a one-time warning and records the
drift for the debugger:

- **Undeclared event** — `emit`/`subscribe` for an event not in the catalog.
- **No namespace** — an event name without a `namespace:` prefix (prefer `cart:add` over `add`).

In production all of this is silent and zero-overhead.

## Typed events
Run the CLI to generate TypeScript declarations from the catalog:

```bash title="Generate types + the event graph manifest"
slice types generate
```

This emits a `SliceEventRegistry` interface and types `slice.events.emit`/`subscribe`
by event name. Known events enforce their payload; unknown or dynamic events stay
permissive.

```typescript title="Typed at compile time"
slice.events.emit('cart:add', { sku: 'A1', qty: 2 });   // ✅ ok
slice.events.emit('cart:add', { sku: 'A1' });            // ❌ tsc error: qty is required
slice.events.subscribe('user:login', (u) => u.name);     // u is { id: number; name: string }
```

## API Reference
| Method | Signature | Notes |
| --- | --- | --- |
| `register` | `(catalog)` or `(namespace, catalog)` | Mergeable; turns on dev validation |
| `isDeclared` | `(eventName)` | Whether the event is in the catalog |
| `namespaceOf` | `(eventName)` | Segment before the first colon, or null |
| `loadGraph` | `(manifest)` | Loads the generated static graph (documentation) |
| `staticEmittersOf` | `(eventName)` | Code sites that emit this event |
| `staticListenersOf` | `(eventName)` | Code sites that subscribe to this event |

## Tracing: two complementary layers
Knowing the graph "who emits, who listens" comes from two sources that cover each
other's blind spots:

| Question | Layer | Source |
| --- | --- | --- |
| Who can emit this event? (documentation) | Static | `slice types generate` scans `emit`/`subscribe` call sites |
| Who actually emitted it this session? | Runtime | Live attribution recorded while the debugger is open |

**Static graph (documentation).** `slice types generate` writes
`src/slice-events.generated.js`: per event, the emitter and listener call sites
(`file:line` plus the enclosing component). It is complete because it reads code, not
execution — an emit on a branch that never ran is still documented. Events emitted with
a computed name (`emit(\`cart:${x}\`)`) cannot be resolved statically and are listed as
dynamic.

**Runtime tracing (observational).** While the Events panel is open, every `emit()` is
attributed to its source: the component when emitted through `slice.events.bind(this)`,
or a best-effort `file:line` from the call stack for global emits. This is what *actually*
fired, with counts — and anything that fires but is missing from the static graph is a
dynamic emit worth a look.

## Debugger panel
Enable the Events UI and open it with the shortcut to inspect all of the above:

```json title="sliceConfig.json"
{
  "events": { "enabled": true, "ui": { "enabled": true, "shortcut": "alt+shift+e" } }
}
```

- **Registry** — the declared catalog grouped by namespace: payload shape, live listener
  count, and the static emitters/listeners from the manifest. Drift badges flag
  declared-but-idle and used-but-undeclared events.
- **Subscribers** — live listeners per event plus the runtime emitters that fired.
- **History** — reverse-chronological feed of every `emit()` with its origin and a
  relative timestamp.

## Best Practices
:::tip
Always namespace events (`cart:add`, not `add`). The namespace groups the catalog, the
debugger, and the generated types.
:::

:::tip
Declare catalogs as plain object literals (or imported literals) and pass them to
`register()`. The type generator resolves literals statically — a computed object won't
be typed.
:::

:::tip
Register all catalogs from one place (your `Providers`/composition root). One file is
standardization; many `register()` calls is modularization — both work with the same API.
:::

:::tip
Re-run `slice types generate` after adding events or emit/subscribe sites so the types
and the static graph stay in sync.
:::

## Gotchas
:::warning
Validation only activates after the first `register()`. Until then the EventManager runs
in loose mode with no warnings — declaring the catalog is what opts you in.
:::

:::warning
Events emitted with a computed name (`emit(\`user:${id}\`)`) cannot be typed or documented
statically. Use literal names where you want the contract; the runtime tracer still shows
them under dynamic sites.
:::

## FAQ
:::details title="Is the registry required?"
No. It is fully opt-in. Without `register()` the EventManager works exactly as before.
:::

:::details title="Why warn instead of throw on an undeclared event?"
Safe by default: a missing declaration should never break a running app. Validation is a
dev aid (a one-time warning plus a debugger badge), not a runtime gate.
:::

:::details title="Where do the static emitters/listeners come from?"
From `slice types generate`, which scans your `emit`/`subscribe` call sites and writes
`src/slice-events.generated.js`. The Events panel loads it to show the documented graph
alongside live runtime activity. See [EventManager](/Documentation/Structural/EventManager).
:::
