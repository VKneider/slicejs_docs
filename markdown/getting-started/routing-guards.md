---
title: Route Guards
route: /Documentation/Routing/Guards
navLabel: Route Guards
section: State & Routing
group: ''
order: 20
description: Block, redirect or observe navigation with beforeEach and afterEach.
component: RouterGuardsDocumentation
tags: [routing, guards, auth, redirects]
---

# Route Guards

## Overview
Route guards let you intercept navigation before and after a route change. Use them for auth,
feature flags, redirects, analytics, and scroll or title updates.

Guards run on every navigation, including the initial page load. Call `slice.router.start()` after
registering guards to ensure they are active before the first navigation.

## Guard API
| Method | Signature | Can block | Notes |
| --- | --- | --- | --- |
| `beforeEach` | `(to, from, next) => void` | yes | Call `next()` to continue or redirect. |
| `afterEach` | `(to, from) => void` | no | Runs after navigation completes. |

:::compare left="beforeEach — gate" right="afterEach — observer" leftTone="accent" rightTone="info"
Can cancel, redirect or continue. Use it for auth, feature flags and canonical paths. Every path through the guard must call `next()`.
---
Cannot block; the navigation already happened. Use it for titles, scroll position, analytics and other post-navigation effects.
:::

### `next()` behavior
| Call | Result | Notes |
| --- | --- | --- |
| `next()` | continue | Normal navigation. |
| `next(false)` | cancel | Navigation is cancelled. |
| `next('/login')` | redirect | Redirect to path (pushState). |
| `next({ path: '/login', replace: true })` | redirect | Redirect with history replace. |

## Guard context
`to` and `from` are **Route Info** objects (`path`, `component`, `params`, `query`, `metadata`).
See [Routing → Route Info Object](/Documentation/Routing) for the field reference.

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

:::details title="Can a guard be async?"
Yes: `beforeEach` may be `async`, but it must still call `next()` (or return a redirect). Keep the
guard fast — it runs on every navigation. Put a one-time session check in a Service and reuse the
result instead of fetching it again on each route change.
:::

:::warning
Guards can create redirect loops. The router detects them and stops after 10 redirects, but the real
fix is to make the redirect target reachable without running the same guard again (for example,
exclude `/login` from the auth redirect).
:::

:::related
- [Routing](/Documentation/Routing) - Route Info, `router:change` and navigation.
- [App Shell + MultiRoute](/Documentation/Architecture/App-Shell-MultiRoute) - Where guards live in an app shell.
- [SEO and Share Cards](/Documentation/Architecture/SEO) - Per-route titles and metadata.
- [Events](/Documentation/Structural/EventManager) - `router:change` for post-navigation effects.
:::
