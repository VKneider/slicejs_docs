---
title: DevTools
route: /Documentation/DevTools
navLabel: DevTools
section: Getting Started
group: Diagnostics
order: 42
description: The component inspector and the events and context panels, and how live editing works.
component: DevToolsDocumentation
tags: [devtools, debugger, events, context, diagnostics]
---

# DevTools

## Overview
Slice ships three runtime panels for inspecting a live app — a **component inspector**, an
**events** panel, and a **context** panel. They are built with Slice's own primitives (custom
elements, the lifecycle, and setters), so they double as a reference for what the framework can do.

## The component inspector
Enable it in `sliceConfig.json`, then click a component (right-click by default) to open the panel:

```json title="sliceConfig.json"
"debugger": { "enabled": true, "click": "right" }
```

- **Props tab** — every `static props` entry with its current value. Values are **editable**: change
  one and the UI updates instantly.
- **Info tab** — `sliceId`, class name, category, and connection status.

### How live editing works
The inspector reads the component's `static props`, and when you edit a field it simply assigns the
new value back to the component:

```javascript
component[propName] = newValue;
```

Because Slice applies every prop through its **setter** (see Static Props), that single assignment
fires the setter — which updates the DOM. There is no special data-binding layer: editing in the
inspector is the exact same code path as a prop changing anywhere else in your app. This is why a
component with well-written setters is instantly inspectable and tweakable.

## Events and context panels
Enable them (and their keyboard shortcuts) in `sliceConfig.json`:

```json title="sliceConfig.json"
"events":  { "enabled": true, "ui": { "enabled": true, "shortcut": "alt+shift+e" } },
"context": { "enabled": true, "ui": { "enabled": true, "shortcut": "alt+shift+c" } }
```

- **Events** (`alt+shift+e`) — every event with its live subscribers (component name + `sliceId`)
  and an `once` badge. Use it for "my listener isn't firing" or "it fires twice".
- **Context** (`alt+shift+c`) — every context, its key count, and a live JSON preview of its state.
  Use it for "my watcher isn't firing" or "persisted state didn't survive a refresh".

:::tip
Keep these panels enabled in development and turn off the `ui` blocks for production.
:::

## Built with Slice — try it yourself
The inspector's "edit a prop, see it update" trick is small enough to build yourself. The
`MiniInspector` component (in the visual library) does exactly that in ~80 lines:

```javascript title="Live-edit a component's props"
const card = await slice.build('Card', { sliceId: 'demo-card', title: 'Hello' });
container.appendChild(card);

const inspector = await slice.build('MiniInspector', { target: card, title: 'Card props' });
container.appendChild(inspector);
// Edit a field in the inspector -> the card updates instantly via its setter.
```

`MiniInspector` reads `target.constructor.props`, builds an input per prop, and writes
`target[prop] = value` on change. Read its source to see the pattern, then read the built-in
DevTools (`Slice/Components/Structural/Debugger`, `.../EventManager/EventManagerDebugger`,
`.../ContextManager/ContextManagerDebugger`) to see the full version.

## Gotchas
:::warning
A prop only updates the UI if its **setter** does the DOM work. If editing a value in the inspector
changes nothing, the bug is in that prop's setter, not the inspector.
:::
