---
title: Routing and Data Passing
route: /Documentation/Architecture/Routing-Data
navLabel: Routing and Data Passing
section: Project Architecture
group: Styles and Patterns
order: 4
description: Understand current Slice routing behavior, slug support, query usage, and route-to-route data strategies.
component: RoutingDataDocumentation
tags: [routing, params, query, context, events]
---

# Routing and Data Passing

This page documents current runtime behavior so architecture decisions match real Slice capabilities.

## Router Behavior (Current)
| Capability | Supported | Notes |
| --- | --- | --- |
| `pathname` route matching | Yes | Uses History API and `window.location.pathname` |
| Dynamic params (`${param}`) | Yes | One segment per param |
| Query parsing (`?a=1`) | Yes | Exposed in route info (`to.query`, `from.query`) |
| Hash-based route matching (`#state`) | No | Hash is not used for route matching |
| Arbitrary props in `navigate()` | No | No native payload channel in `navigate(path, options)` |

## Dynamic Params (Slugs)
```javascript title="routes.js"
const routes = [
  { path: '/post/${slug}', component: 'PostPage' },
  { path: '/404', component: 'NotFound' }
];
```

Use slugs when the URL should represent identity (post, product, user).

## Query Params
```javascript title="Read query in guard"
slice.router.beforeEach((to, from, next) => {
  if (to.query.preview === 'true') {
    // preview mode behavior
  }
  next();
});
```

## Route-to-Route Data Strategies
1. URL params for identity
2. Query params for URL-visible flags
3. `slice.context` for shared app state
4. `slice.events` for event-driven coordination

```javascript title="Shared state with ContextManager"
slice.context.create('session', { userId: null, role: 'guest' });

slice.context.setState('session', { userId: 'u-42', role: 'member' });
```

```javascript title="Event-driven handoff"
slice.events.emit('checkout:started', { cartId: 'c-1001' });
```

## Important Constraint
:::warning
Do not assume `slice.router.navigate('/path', { data })` passes arbitrary props to destination components. Use context/events/URL state instead.
:::
