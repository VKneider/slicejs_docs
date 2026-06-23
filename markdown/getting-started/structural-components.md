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

## Which one?
| Need | Use | One-liner |
| --- | --- | --- |
| Build / look up / destroy components | `slice.controller` | Lifecycle and the component registry. |
| Navigate, guards, route params | `slice.router` | Client-side routing. |
| Shared state many components read | `slice.context` | Holds state; watchers + selectors. |
| Announce "something happened" | `slice.events` | Fire-and-forget pub/sub. |
| Themes and styles | `slice.stylesManager` | `slice.setTheme(name)`. |

For state vs signals see [Context vs Events](/Documentation/Structural/Context-vs-Events); for full
signatures, the [API Reference](/Documentation/API-Reference).

## Controller API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `getComponent` | `(sliceId)` | instance or undefined | Lookup by sliceId. |
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
| `navigate` | `(path, options?)` | Programmatic navigation. `{ replace: true }` replaces history. |
| `beforeEach` | `(to, from, next)` | Register a guard before navigation. |
| `afterEach` | `(to, from)` | Run logic after navigation. |
| `start` | `()` | Start routing immediately. |

## Styles and Themes
`slice.setTheme(themeName)` applies a theme through the StylesManager.

```javascript title="Switch themes"
await slice.setTheme('Dark');
```

## EventManager & ContextManager (Optional)
- **`slice.events`** — pub/sub (`subscribe` / `emit` / `bind`). Full guide:
  [EventManager](/Documentation/Structural/EventManager).
- **`slice.context`** — shared state (`create` / `setState` / `watch`, with selectors and optional
  persistence). Full guide: [ContextManager](/Documentation/Structural/ContextManager).

When to use which: [Context vs Events](/Documentation/Structural/Context-vs-Events). All signatures:
[API Reference](/Documentation/API-Reference).

The Events debug panel (`alt+shift+e`) shows live subscribers + an emit history; the Context panel
shows live state. See [DevTools](/Documentation/DevTools).

## Best Practices
:::tip
Use `destroyByContainer` before recreating dynamic lists to avoid leaks.
:::

:::tip
Register guards before calling `slice.router.start()`.
:::
