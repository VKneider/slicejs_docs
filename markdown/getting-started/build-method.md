---
title: The build method
route: /Documentation/The-build-method
navLabel: The build method
section: Components
group: Component Model
order: 20
description: Use slice.build to create components.
component: TheBuildMethod
tags: [build, components]
---

# The build method

## Overview
`slice.build(componentName, props)` creates a component instance, applies Static Props, runs
`init()`, and registers the component with the controller. It returns a ready-to-append component
instance.

This is the standard way to create Visual, App, and Service components in Slice.js.

## API
| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `componentName` | `string` | yes | Must exist in `components.js`. |
| `props` | `object` | no | Public props for the component. |

| Returns | Type | Notes |
| --- | --- | --- |
| component instance | `HTMLElement`, `Object`, or `null` | A Visual returns the element, a Service its instance; `null` on error. |

## Lifecycle Steps
1. Validate component name.
2. Load template, class, and CSS (visual components only).
3. Instantiate component and apply props.
4. Call `init()` if present.
5. Register component in the controller and component tree.

## Basic Usage
```javascript title="Basic build"
const myButton = await slice.build('Button', {
  value: 'Click me'
});

document.querySelector('#container').appendChild(myButton);
```

## Props and Defaults
```javascript title="Props are applied immediately"
const card = await slice.build('Card', {
  title: 'My Card',
  text: 'Card content',
  icon: { name: 'star', iconStyle: 'filled' }
});

// Card now has this.title, this.text, this.icon
```

## Reserved build keys: id, sliceId, singleton
`id`, `sliceId`, and `singleton` are **build directives**, not component props. They are read by
`build` to control how the instance is created/registered and are removed from the props object
before Static Props are applied — so they never reach your setters.

```javascript title="Use sliceId for lookup"
const navbar = await slice.build('Navbar', {
  sliceId: 'main-navbar',
  logo: { src: '/logo.png', path: '/' },
  items: [{ text: 'Home', path: '/' }]
});

const sameNavbar = slice.controller.getComponent('main-navbar');
```

- `id` — sets the host element's HTML `id` (Visual components only).
- `sliceId` — the registry key used by `getComponent` and as the singleton identity.
- `singleton` — `true` get-or-creates one shared instance (Service components only). See
  [Services](/Documentation/Service).

:::warning
`id`, `sliceId`, and `singleton` are **reserved names**. Do not declare them in `static props` and
do not use them as real props — they will be consumed by `build` and never set on your component.
A `static props` entry named `singleton`, `sliceId`, or `id` is effectively dead.
:::

## Nested Components
```javascript title="Build children and compose"
const grid = await slice.build('Grid', { columns: 3, rows: 1 });
const card1 = await slice.build('Card', { title: 'Card 1' });
const card2 = await slice.build('Card', { title: 'Card 2' });
const card3 = await slice.build('Card', { title: 'Card 3' });

await grid.setItem(card1);
await grid.setItem(card2);
await grid.setItem(card3);

this.appendChild(grid);
```

## Error Cases
- Missing or non-string component name
- Component not listed in `components.js`
- Structural components cannot be built

## Build vs refresh

:::compare left="Build once" right="Refresh in place"
`await slice.build()` applies defaults, runs `init()`, registers the instance and returns it. Use it when the component does not exist yet.
---
Assign a prop, call a method, `slice.setComponentProps` or `update()`. Defaults are not re-applied and omitted props are kept. Use it when the instance already exists.
:::

Both paths preserve what matters: build creates identity, refresh keeps state, focus and children.
For a variable-length list, [`DomService.reconcile`](https://components.slicejs.com/docs/services/dom-service)
decides per item which of the two to do.

:::details title="What can go wrong"
- A missing entry in `components.js` (or a wrong `paths.components` path/type) makes `build` resolve
  to `null` instead of throwing. Guard the result.
- Structural components (Router, EventManager, ContextManager, Logger, Debugger) are created by the
  framework; you cannot `slice.build` them.
- Without `await`, you get a Promise instead of a node, and `init()` has not run yet.
:::

:::related
- [Component Anatomy](/Documentation/Component-Anatomy) - How the three files fit together.
- [Static Props](/Documentation/Static-Props) - Typed props, defaults and validation.
- [LifeCycle Methods](/Documentation/LifeCycle-Methods) - What runs after `slice.build()`.
- [Refreshing Component Data](/Documentation/Architecture/Refreshing-Component-Data) - Setter, update, reconcile or rebuild.
:::
