---
title: Route Guards
route: /Documentation/Routing/Guards
navLabel: Route Guards
section: Getting Started
group: Routing
order: 51
description: Guard patterns for secure navigation.
component: RouterGuardsDocumentation
tags: [routing, guards]
---

# Route Guards

## Overview
Route guards let you intercept navigation before and after a route change. Use them for auth,
feature flags, redirects, analytics, and scroll or title updates.

Guards run on every navigation, including the initial page load. Call `slice.router.start()`
after registering guards to ensure they are active before the first navigation.

## Guard API
| Method | Signature | Can block | Notes |
| --- | --- | --- | --- |
| `beforeEach` | `(to, from, next) => void` | yes | Call `next()` to continue or redirect. |
| `afterEach` | `(to, from) => void` | no | Runs after navigation completes. |

### `next()` behavior
| Call | Result | Notes |
| --- | --- | --- |
| `next()` | continue | Normal navigation. |
| `next(false)` | cancel | Navigation is cancelled. |
| `next('/login')` | redirect | Redirect to path (pushState). |
| `next({ path: '/login', replace: true })` | redirect | Redirect with history replace. |

## Guard Context
`to` and `from` include path, component, params, query, and metadata.

| Field | Type | Notes |
| --- | --- | --- |
| `path` | `string` | Requested path or resolved full path. |
| `component` | `string` | Component for the route (parent if nested). |
| `params` | `object` | Params parsed from `${param}` in routes. |
| `query` | `object` | URL query parameters. |
| `metadata` | `object` | Route metadata from config. |

## beforeEach
```javascript title="Block or redirect"
slice.router.beforeEach(async (to, from, next) => {
  if (to.metadata?.private && !isAuthenticated()) {
    return next({ path: '/login' });
  }
  return next();
});
```

## afterEach
```javascript title="Post-navigation logic"
slice.router.afterEach((to, from) => {
  document.title = to.metadata?.title || 'My App';
  window.scrollTo(0, 0);
});
```

## Patterns
```javascript title="Feature flag guard"
slice.router.beforeEach((to, from, next) => {
  if (to.metadata?.flag && !featureEnabled(to.metadata.flag)) {
    return next('/404');
  }
  return next();
});
```

```javascript title="Guard with replace"
slice.router.beforeEach((to, from, next) => {
  if (to.path === '/old-path') {
    return next({ path: '/new-path', replace: true });
  }
  return next();
});
```

## Best Practices
:::tip
Always call `next()` in `beforeEach`. Missing it logs a warning and navigation continues.
:::

:::tip
Keep guard logic fast. Long async work slows down navigation.
:::

## Gotchas
:::warning
Guards can create redirect loops. The router detects loops and stops after 10 redirects.
:::

:::warning
`afterEach` cannot block navigation. Use `beforeEach` if you need to cancel or redirect.
:::
