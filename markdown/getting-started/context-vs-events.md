---
title: Context vs Events
route: /Documentation/Structural/Context-vs-Events
navLabel: Context vs Events
section: Getting Started
group: Components
order: 56
description: When to reach for ContextManager and when for EventManager — the one decision that keeps shared state clean.
component: ContextVsEventsDocumentation
tags: [context, events, state, architecture]
---

# Context vs Events

Both let components react to things happening elsewhere — but they answer different questions. Pick
by the question you're asking:

- **Context** → *"What is the current state?"* Shared, retained, readable at any time.
- **Events** → *"Did something just happen?"* A one-shot signal, with no retained value.

## Which one?
| You need… | Reach for | Why |
| --- | --- | --- |
| A value many components read and react to | **Context** | It holds state; watchers re-run on change, and selectors narrow what triggers them. |
| To persist state across reloads | **Context** | Contexts can persist; events are ephemeral. |
| To announce "X happened" without holding a value | **Events** | Fire-and-forget; subscribers decide what to do. |
| To decouple a producer from unknown consumers | **Events** | The emitter doesn't know who listens. |
| A side effect in another domain when something changes | **Events** | Emit after the state change so the other domain reacts. |

## Context — the current state
A value several components depend on. Each `watch`es it (auto-cleaned on destroy); anyone calls
`setState`. See [ContextManager](/Documentation/Structural/ContextManager).

```javascript title="Shared state with a selector"
async init() {
  this.$count = this.querySelector('.cart-count');
  slice.context.watch(
    'cart',
    this,
    (count) => { this.$count.textContent = count; },
    (state) => state.items.length            // selector: only re-run when the count changes
  );
}

// anywhere a change happens:
slice.context.setState('cart', (prev) => ({ ...prev, items: [...prev.items, item] }));
```

## Events — something happened
A signal with no retained value. A component subscribes; another part of the app emits. See
[EventManager](/Documentation/Structural/EventManager).

```javascript title="React to a signal"
async init() {
  this.events = slice.events.bind(this);     // bound API → auto-cleaned on destroy
  this.events.subscribe('orders:updated', () => this.refresh());
}

// elsewhere, after a mutation:
slice.events.emit('orders:updated');
```

## They compose
Use Context for the state, and add an Event when a **different domain** must react to a change.

```javascript title="State in Context, cross-domain signal via Events"
slice.context.setState('orders', (prev) => ({ ...prev, list: fresh }));
slice.events.emit('orders:updated');   // let unrelated features react too
```

:::tip
Default to **Context** for shared state. Add an **Event** only when a producer must notify
consumers it doesn't know about. For refreshing one component you hold, you often need neither — see
[Refreshing Component Data](/Documentation/Architecture/Refreshing-Component-Data).
:::

:::warning
Don't model state as a stream of events you replay to rebuild it — that's what Context is for. Use
events for *moments*, not for *state*.
:::
