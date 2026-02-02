---
title: MultiRoute
route: /Documentation/Components/Visual/MultiRoute
navLabel: MultiRoute
section: Components Library
group: Visual
order: 60
description: Route container with caching and dynamic navigation.
tags: [routing, multiroute, caching]
generate: false
---

# MultiRoute

## Overview
MultiRoute renders multiple routes inside a container and caches component instances for
performance. When a cached route is revisited, its `update()` method is called.

## API Reference
| Method | Signature | Notes |
| --- | --- | --- |
| `renderRoute()` | `()` | Renders the active route and caches the component |
| `renderIfCurrentRoute()` | `()` | Render only if current path matches |
| `removeComponent()` | `()` | Remove cached component for current route |

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `routes` | `array` | `[]` | Route objects with `path` and `component` |

## Usage Patterns
```javascript title="Basic configuration"
const multiRoute = await slice.build("MultiRoute", {
  routes: [
    { path: "/docs/button", component: "ButtonDocumentation" },
    { path: "/docs/select", component: "SelectDocumentation" }
  ]
});
```

## Interactive Demo
:::html
<div class="multiRoute-demo" data-demo="basic"></div>
::: 

:::script
const root = component.querySelector('[data-demo="basic"]');
if (!root) return;

const navContainer = document.createElement('div');
navContainer.style.cssText = 'display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;';

const demoRoutes = [
  { path: '/demo/button', component: 'ButtonDocumentation', label: 'Button Docs' },
  { path: '/demo/input', component: 'InputDocumentation', label: 'Input Docs' }
];

for (const route of demoRoutes) {
  const button = await slice.build('Button', {
    value: route.label,
    onClickCallback: async () => {
      await slice.router.navigate(route.path);
      if (multiRoute) {
        await multiRoute.render();
      }
    }
  });
  navContainer.appendChild(button);
}

const multiRoute = await slice.build('MultiRoute', {
  routes: demoRoutes.map(({ path, component }) => ({ path, component }))
});

await multiRoute.renderIfCurrentRoute();
root.appendChild(navContainer);
root.appendChild(multiRoute);
:::

## Caching Behavior
```javascript title="Same component across multiple routes"
const multiRoute = await slice.build("MultiRoute", {
  routes: [
    { path: "/cache/doc1", component: "ButtonDocumentation" },
    { path: "/cache/doc2", component: "ButtonDocumentation" },
    { path: "/cache/doc3", component: "ButtonDocumentation" }
  ]
});
```

## Best Practices
:::tip
Use stable component names and consistent routes to maximize cache reuse.
:::

:::tip
Implement `update()` in your routed components to refresh data when revisited.
:::

## Gotchas
:::warning
MultiRoute caches by component name, not by path. Different paths using the same component share state.
:::
