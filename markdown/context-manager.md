---
title: ContextManager
route: /Documentation/Structural/ContextManager
navLabel: ContextManager
section: Getting Started
group: State
order: 30
description: Shared state with watchers, selectors, and persistence.
component: ContextManagerDocumentation
tags: [context, state, persistence]
---

# ContextManager

## Overview
ContextManager provides shared state across components with watchers and optional persistence.
It uses EventManager internally to notify watchers and supports selectors for efficient updates.

Enable it in `sliceConfig.json` to use `slice.context`.

## Enable ContextManager
```json title="sliceConfig.json"
{
  "context": { "enabled": true }
}
```

## Context UI (Optional)
You can enable the ContextManager debug panel with a keyboard shortcut.

```json title="sliceConfig.json"
{
  "context": {
    "enabled": true,
    "ui": {
      "enabled": true,
      "shortcut": "alt+shift+c"
    }
  }
}
```

The panel updates **in real time** — whenever any context changes via `setState()` or `patch()`,
the list refreshes immediately. It also detects newly created contexts (via `create()`) and
subscribes to them automatically. The refresh button is available for manual updates, but the
panel is designed to stay in sync without it.

## Core API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `create` | `(name, initialState = {}, options = {})` | `boolean` | Options include `persist`, `storageKey`. |
| `getState` | `(name)` | `any | null` | Returns current state or `null` if missing. |
| `setState` | `(name, updater)` | `void` | **Replaces** the whole state. Pass the full next state, or `(prev) => newState`. |
| `patch` | `(name, partial)` | `void` | First-level **merge** — keeps the other fields (the "update one field" case). |
| `watch` | `(name, component, callback, selector?)` | `string | null` | Auto-cleanup via component sliceId. |
| `has` | `(name)` | `boolean` | Check if a context exists. |
| `destroy` | `(name)` | `boolean` | Removes a context and persisted storage. |
| `list` | `()` | `string[]` | Returns all context names. |
| `use` | `(name)` | `handle` | Handle bound to one context: `get/set/patch/watch/bind/has/destroy` without repeating the name. |

## Context Options
| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `persist` | `boolean` | `false` | Saves state to `localStorage`. |
| `storageKey` | `string` | `slice_context_<name>` | Override persistence key. |

## Create and Read
```javascript title="Create a context"
slice.context.create('auth', {
  isLoggedIn: false,
  user: null
});

const authState = slice.context.getState('auth');
console.log(authState.isLoggedIn);
```

## Watchers
Watchers are bound to components for auto-cleanup. Pass the component as the second argument.

```javascript title="Watch with selector"
export default class AccountMenu extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
  }

  async init() {
    slice.context.watch(
      'auth',
      this,
      (isLoggedIn) => {
        this.classList.toggle('signed-in', isLoggedIn);
      },
      (state) => state.isLoggedIn
    );
  }
}
```

## Selectors and Derived Data
Selectors run on every update and should be fast and side-effect free. ContextManager performs
a shallow comparison of the selected value to decide when to notify.

```javascript title="Derived value selector"
slice.context.watch(
  'cart',
  this,
  (count) => {
    this.$badge.textContent = count;
  },
  (state) => state.items.length
);
```

## Persistence
Persist a context to `localStorage` for session survival.

```javascript title="Persistent context"
slice.context.create(
  'preferences',
  { theme: 'light', locale: 'en' },
  { persist: true, storageKey: 'app:preferences' }
);
```

## Functional Updates
`setState` **replaces** the whole state. Use the functional form when the next state depends on the previous one.

```javascript title="Functional update"
slice.context.setState('cart', (prev) => ({
  ...prev,
  items: [...prev.items, newItem],
  total: prev.total + newItem.price
}));
```

## Patch (partial merge)
Because `setState` replaces, a partial object **drops the other fields**. Use `patch` to merge one or more fields and keep the rest — the common "update one field" case.

```javascript title="patch vs setState"
slice.context.setState('cart', { discount: 0.1 }); // ❌ replaces → items/total are gone
slice.context.patch('cart', { discount: 0.1 });    // ✅ merges → keeps the rest
```

:::tip
The classic bug is updating one field with a plain object and silently wiping the rest of the context. Reach for `patch` (or the functional `setState`) whenever you update part of a multi-field context.
:::

## Context Handles (`use`)
`slice.context.use(name)` returns a handle bound to a single context, so you stop repeating the name. It exposes `get`, `set`, `patch`, `watch`, `bind`, `has`, and `destroy`.

```javascript title="A bound handle"
const settings = slice.context.use('settings');
settings.get();                          // current state
settings.patch({ selectedModel: 'pro' }); // merge
settings.watch(this, (s) => { this.$model.textContent = s.selectedModel; });
```

`bind` is `watch` **plus an immediate call** with the current value — the "run now and on every change" pattern in one line (no separate initial run):

```javascript title="bind = watch + initial run"
async init() {
  slice.context.use('cart').bind(
    this,
    (count) => { this.$badge.textContent = count; },
    (state) => state.items.length
  );
}
```

## Service Singleton Example
```javascript title="Context access via singleton service"
const contextService = await slice.build('ImposterGameContextService', {
  sliceId: 'imposter-context-service'
});

export default class GameScreen extends HTMLElement {
  async init() {
    this.contextService = slice.getComponent('imposter-context-service');
    const config = this.contextService.getGameConfig();
    this.contextService.updateGameConfig({ step: 'reveal' });
  }
}
```

## Best Practices
:::tip
Keep contexts small and focused by domain.
:::

:::tip
Use selectors to reduce unnecessary updates.
:::

:::tip
Prefer serializable state only. Avoid storing class instances or functions.
:::

:::tip
Use a service singleton to encapsulate context reads/writes when multiple components share the same domain state.
:::

## Gotchas
:::warning
`watch()` requires a component with a `sliceId`. Otherwise it returns `null`.
:::

:::warning
Persist only small, serializable state.
:::
