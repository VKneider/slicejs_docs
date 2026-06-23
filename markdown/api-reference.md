---
title: Quick API Reference
route: /Documentation/API-Reference
navLabel: API Reference
section: Introduction
group: Reference
order: 4
description: Every public slice.* method at a glance — build, props, cleanup, router, context, events, logger, env.
component: ApiReferenceDocumentation
tags: [api, reference]
---

# Quick API Reference

The public `slice.*` surface in one page. Each section links to its full guide. Method names use
`arg?` for optional arguments and `→` for the return.

## Components & props
| Method | Signature | Purpose |
| --- | --- | --- |
| `slice.build` | `build(name, props?) → Promise<instance>` | Build and register a component; resolves to `null` if the name isn't registered. `props.singleton: true` get-or-creates a Service. |
| `slice.getComponent` | `getComponent(sliceId) → instance` | Get a registered instance by `sliceId` (`undefined` if none). |
| `slice.setComponentProps` | `setComponentProps(component, props) → void` | Apply props. Auto-detects **build** (applies defaults + validates) vs **refresh** (patch in place, no defaults). |
| `slice.isComponentAlive` | `isComponentAlive(component) → boolean` | `true` while it's the live registered instance; `false` once destroyed or replaced. |
| `slice.attachTemplate` | `attachTemplate(component) → void` | Inject the component's `.html`. The DOM is only queryable after this. |

See [Component Anatomy](/Documentation/Component-Anatomy) and
[The build method](/Documentation/The-build-method).

**Reserved props** (stripped before your setters run): `id` (HTML id), `sliceId` (registry id,
auto-generated if omitted), `singleton` (Service-only get-or-create).

## Cleanup
| Method | Signature | Purpose |
| --- | --- | --- |
| `slice.controller.destroyComponent` | `destroyComponent(target) → number` | Destroy one or many and their children; `target` is a `sliceId`, an element, or an array. Returns the count. |
| `slice.controller.destroyByContainer` | `destroyByContainer(container) → number` | Destroy every Slice component nested in a DOM node. |
| `slice.controller.destroyByPattern` | `destroyByPattern(pattern) → number` | Destroy components whose `sliceId` matches a string/RegExp. |

Destroying runs `beforeDestroy()` and cleans the registry — see [Common Gotchas](/Documentation/Common-Gotchas).

## Router
| Method | Signature | Purpose |
| --- | --- | --- |
| `slice.router.navigate` | `navigate(path, options?) → Promise<void>` | Navigate; `options.replace: true` uses history replace. |
| `slice.router.start` | `start() → Promise<void>` | Start the router and load the first route (auto-starts otherwise). |
| `slice.router.beforeEach` | `beforeEach((to, from, next) => …) → void` | Guard before each navigation; `next()` continues, `next(false)` cancels, `next('/path')` redirects. |
| `slice.router.afterEach` | `afterEach((to, from) => …) → void` | Runs after navigation (cannot block). |

Route params use `${param}` (not `:param`); each captures **one** segment and arrives as a string.
See [Routing](/Documentation/Routing) and [Route Guards](/Documentation/Routing/Guards).

## Context (shared state)
| Method | Signature | Purpose |
| --- | --- | --- |
| `slice.context.create` | `create(name, initialState?, options?) → boolean` | Create a context; `options.persist: true` saves to localStorage. |
| `slice.context.getState` | `getState(name) → state` | Read the whole state. |
| `slice.context.setState` | `setState(name, updater) → void` | Replace state, or pass `(prev) => next`. |
| `slice.context.patch` | `patch(name, partial) → void` | Shallow-merge a partial (keeps the rest). |
| `slice.context.watch` | `watch(name, component, cb, selector?) → id` | React to changes; auto-cleaned on destroy. `selector` narrows what re-runs the callback. |
| `slice.context.use` | `use(name) → { get, set, patch, watch, bind, has, destroy }` | Bound API for one context. `.bind()` watches **and** fires once with the current value. |

See [ContextManager](/Documentation/Structural/ContextManager) and
[Context vs Events](/Documentation/Structural/Context-vs-Events).

## Events (pub/sub)
| Method | Signature | Purpose |
| --- | --- | --- |
| `slice.events.subscribe` | `subscribe(event, cb, options?) → id` | Run `cb` on every emit. Pass `options.component` for auto-cleanup. |
| `slice.events.subscribeOnce` | `subscribeOnce(event, cb, options?) → id` | Fire once, then auto-unsubscribe. |
| `slice.events.unsubscribe` | `unsubscribe(event, id) → boolean` | Remove a subscription by id. |
| `slice.events.emit` | `emit(event, ...args) → void` | Fire an event to all subscribers. |
| `slice.events.bind` | `bind(component) → { subscribe, subscribeOnce, emit }` | Component-bound API; subscriptions auto-clean on destroy. |

See [EventManager](/Documentation/Structural/EventManager).

## Logger
| Method | Signature | Purpose |
| --- | --- | --- |
| `slice.logger.error` | `error(sliceId, message, error?) → void` | Log an error. |
| `slice.logger.warn` | `warn(sliceId, message, error?) → void` | Log a warning. |
| `slice.logger.info` | `info(sliceId, message, error?) → void` | Log info. |
| `slice.logger.debug` | `debug(sliceId, message, error?) → void` | Log debug detail. |

The old `logError` / `logWarning` / `logInfo` names still work but are **deprecated** — prefer
`error` / `warn` / `info`. See [Logger](/Documentation/Structural/Logger).

## Environment & theme
| Method | Signature | Purpose |
| --- | --- | --- |
| `slice.getEnv` | `getEnv(name, fallback?) → string` | Read one `SLICE_PUBLIC_*` variable. |
| `slice.env.bool` | `env.bool(name, fallback?) → boolean` | Parse `1/true/yes/on` as `true`. |
| `slice.env.int` | `env.int(name, fallback?) → number` | Parse an integer (fallback on `NaN`). |
| `slice.env.list` | `env.list(name, fallback?) → string[]` | Split a CSV, trimmed. |
| `slice.env.has` | `env.has(name) → boolean` | Whether the variable is set. |
| `slice.setTheme` | `setTheme(name) → Promise<void>` | Apply a theme. |
| `slice.theme` | `theme → string` | Current theme name. |
| `slice.isProduction` | `isProduction() → boolean` | Runtime mode (reliable after `init()`). |

See [Environment Variables](/Documentation/Configuration/environment-variables) and
[Themes](/Documentation/Themes).
