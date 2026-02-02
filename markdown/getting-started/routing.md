---
title: Slice Routing
route: /Documentation/Routing
navLabel: Routing
section: Getting Started
group: Routing
order: 50
description: Router setup, navigation, and guards.
component: RoutingDocumentation
tags: [routing, router, guards]
generate: false
---

# Slice Routing

## Overview
Slice Router handles client-side navigation, route parameters, nested routes, and route containers.
It auto-starts shortly after initialization, but you should call `start()` manually when you use
guards to ensure your guard logic runs before the first navigation.

Routing is driven by a `routes.js` file and a runtime router available at `slice.router`.

## Router API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `start` | `() => Promise<void>` | `Promise<void>` | Starts routing immediately. Recommended when using guards. |
| `navigate` | `(path, _redirectChain?, _options?)` | `Promise<void>` | Programmatic navigation. `_options.replace` uses history replace. |
| `beforeEach` | `(guard)` | `void` | Registers a guard `(to, from, next)`. |
| `afterEach` | `(guard)` | `void` | Registers a guard `(to, from)` after navigation. |

## Route Configuration
```javascript title="routes.js"
const routes = [
  { path: '/', component: 'HomePage' },
  { path: '/about', component: 'AboutPage' },
  { path: '/user/${id}', component: 'UserProfile', metadata: { private: true } },
  { path: '/docs', component: 'Docs', children: [
    { path: '/intro', component: 'DocsIntro' }
  ]},
  { path: '/404', component: 'NotFound' }
];

export default routes;
```

### Route Definition Fields
| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `path` | `string` | yes | Supports dynamic params using `${param}`. |
| `component` | `string` | yes | Component name from `components.js`. |
| `children` | `Array<Route>` | no | Nested routes inherit parent path. |
| `metadata` | `object` | no | Arbitrary data for guards and UI. |

## Route Info Object
Guards and route events receive `to` and `from` objects created by the router.

| Field | Type | Notes |
| --- | --- | --- |
| `path` | `string` | Requested path or resolved full path. |
| `component` | `string` | Component for the route (parent if nested). |
| `params` | `object` | Dynamic params from `${param}` patterns. |
| `query` | `object` | Parsed query string values. |
| `metadata` | `object` | Route metadata from config. |

## Basic Navigation
```javascript title="Navigate programmatically"
await slice.router.navigate('/about');
```

## Route Containers
Slice provides two route container components:

- `slice-route` for a single path
- `slice-multi-route` for a list of routes

They cache components and call `update()` when a cached component is reused.

```javascript title="Route container"
const route = await slice.build('Route', {
  path: '/settings',
  component: 'SettingsPage'
});

someContainer.appendChild(route);
```

```javascript title="MultiRoute container"
const multi = await slice.build('MultiRoute', {
  routes: [
    { path: '/account', component: 'AccountPage' },
    { path: '/billing', component: 'BillingPage' }
  ]
});

someContainer.appendChild(multi);
```

## Guards
```javascript title="beforeEach and afterEach"
slice.router.beforeEach(async (to, from, next) => {
  if (to.metadata?.private && !isAuthenticated()) {
    return next({ path: '/login' });
  }
  return next();
});

slice.router.afterEach((to) => {
  document.title = to.metadata?.title || 'My App';
});

await slice.router.start();
```

## Route Change Events
The router emits `router:change` using EventManager when enabled. Otherwise it dispatches a
`CustomEvent` on `window`.

```javascript title="router:change via EventManager"
slice.events.subscribe('router:change', ({ to, from }) => {
  console.log('Route changed:', from.path, '->', to.path);
});
```

## Best Practices
:::tip
Call `start()` after registering guards to avoid missing the first navigation.
:::

:::tip
Use metadata flags to keep guard logic declarative and centralized.
:::

## Gotchas
:::warning
`navigate()` is async. Await it when you depend on the next route being ready.
:::

:::warning
Dynamic params use `${param}` syntax, not `:param`.
:::
