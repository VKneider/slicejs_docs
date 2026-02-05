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
      "shortcut": "ctrl+7"
    }
  }
}
```

## Core API
| Method | Signature | Returns | Notes |
| --- | --- | --- | --- |
| `create` | `(name, initialState = {}, options = {})` | `boolean` | Options include `persist`, `storageKey`. |
| `getState` | `(name)` | `any | null` | Returns current state or `null` if missing. |
| `setState` | `(name, updater)` | `void` | `updater` can be object or `(prev) => newState`. |
| `watch` | `(name, component, callback, selector?)` | `string | null` | Auto-cleanup via component sliceId. |
| `has` | `(name)` | `boolean` | Check if a context exists. |
| `destroy` | `(name)` | `boolean` | Removes a context and persisted storage. |
| `list` | `()` | `string[]` | Returns all context names. |

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
Use functional updates when new state depends on previous state.

```javascript title="Functional update"
slice.context.setState('cart', (prev) => ({
  ...prev,
  items: [...prev.items, newItem],
  total: prev.total + newItem.price
}));
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
