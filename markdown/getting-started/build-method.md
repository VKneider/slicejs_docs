---
title: The build method
route: /Documentation/The-build-method
navLabel: The build method
section: Getting Started
group: Components
order: 31
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

## Best Practices
:::tip
Always await `slice.build()` to ensure templates, CSS, and `init()` are finished.
:::

:::tip
Use `sliceId` only when you need to retrieve a component later.
:::

## Gotchas
:::warning
Building a component can return `null` if the component is missing or fails to load.
:::

:::warning
Structural components are created by the framework and cannot be built directly.
:::
