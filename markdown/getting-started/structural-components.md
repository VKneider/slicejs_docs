---
title: Structural
route: /Documentation/Structural
navLabel: Structural
section: Getting Started
group: Components
order: 33
description: Structural components that power Slice.js.
component: StructuralDocumentation
tags: [structural, controller, router, styles]
---

# Structural Components

## Overview
Structural components power the framework runtime. They are created by Slice.js and exposed
under `slice.*`. You do not build them directly.

## Key Components
- `slice.controller` for component lifecycle and lookup
- `slice.router` for navigation and route rendering
- `slice.stylesManager` for styles and themes
- `slice.events` for pub/sub (optional)
- `slice.context` for shared state (optional)

## Controller API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `getComponent` | `(sliceId)` | `HTMLElement | undefined` | Lookup by sliceId. |
| `destroyByContainer` | `(container)` | `number` | Destroys Slice components inside container. |
| `destroyByPattern` | `(pattern)` | `number` | Destroys components whose sliceId matches pattern. |

```javascript title="Destroy components safely"
const container = this.querySelector('.items');
slice.controller.destroyByContainer(container);
container.innerHTML = '';
```

## Router API
| Method | Signature | Notes |
| --- | --- | --- |
| `navigate` | `(path, _redirectChain?, _options?)` | Programmatic navigation. |
| `beforeEach` | `(to, from, next)` | Register a guard before navigation. |
| `afterEach` | `(to, from)` | Run logic after navigation. |
| `start` | `()` | Start routing immediately. |

## Styles and Themes
`slice.setTheme(themeName)` applies a theme through the StylesManager.

```javascript title="Switch themes"
await slice.setTheme('Dark');
```

## EventManager (Optional)
Provides pub/sub via `slice.events`. When disabled, the API is a no-op.

| Method | Signature | Notes |
| --- | --- | --- |
| `subscribe` | `(eventName, callback, options?)` | Returns subscription id. |
| `subscribeOnce` | `(eventName, callback, options?)` | Auto-unsubscribe after first emit. |
| `unsubscribe` | `(eventName, id)` | Returns boolean. |
| `emit` | `(eventName, data?)` | Emits to all subscribers. |
| `bind` | `(component)` | Returns component-bound API. |

## ContextManager (Optional)
Shared state system available at `slice.context`.

| Method | Signature | Notes |
| --- | --- | --- |
| `create` | `(name, initialState, options?)` | Options include `persist`. |
| `getState` | `(name)` | Returns current state or null. |
| `setState` | `(name, updater)` | Accepts object or updater function. |
| `watch` | `(name, component, callback, selector?)` | Auto-cleanup via component. |
| `destroy` | `(name)` | Removes a context. |
| `list` | `()` | Returns context names. |

## Best Practices
:::tip
Use `destroyByContainer` before recreating dynamic lists to avoid leaks.
:::

:::tip
Register guards before calling `slice.router.start()`.
:::
