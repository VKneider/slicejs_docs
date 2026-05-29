---
title: Component Anatomy
route: /Documentation/Component-Anatomy
navLabel: Component Anatomy
section: Getting Started
group: Components
order: 29
description: How to author a Slice component, generate it with the CLI, and register it.
component: ComponentAnatomy
tags: [components, cli, anatomy, props]
---

# Component Anatomy

## Overview
A Slice component is a small folder. A **Visual** component (with UI) has three files; a
**Service** component (logic only) has one. This page shows how to generate a component with the
CLI, what each file is for, and how the constructor, props, and registration work.

## Generate components with the CLI
Do not create component files by hand — let the CLI scaffold them and register them for you.
Pass the **name** and **`--category`** to run with no prompts:

```bash title="Non-interactive (recommended for scripts and agents)"
slice component create UserCard --category AppComponents
slice component create AuthService -c Service
```

Omit them to be prompted instead (only the missing pieces are asked):

```bash title="Interactive"
slice component create            # prompts for name + category
slice component create UserCard   # prompts only for category
```

Either way, the CLI:
- creates `src/Components/<Category>/<Name>/` with the right files, and
- adds the component to `src/Components/components.js` so it is loadable immediately.

The category must exist in `paths.components` (see below). Through the npm script, separate the
args with `--`: `npm run component:create -- UserCard --category Visual`.

```javascript title="Generated Visual component (skeleton)"
export default class MyButton extends HTMLElement {
  static props = {
    // Define your public props here, e.g.
    // value: { type: 'string', default: 'Button', required: false }
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
  }

  init() {
    // One-time async setup (optional)
  }

  update() {
    // Refresh when reused by routing (optional)
  }
}

customElements.define('slice-mybutton', MyButton);
```

:::tip
If you ever add or move component folders by hand, run `slice component list` to regenerate
`components.js`.
:::

## The three files of a Visual component
```text title="src/Components/AppComponents/UserCard/"
UserCard.js     # the class: props, constructor, lifecycle, setters
UserCard.html   # the template (inner markup only)
UserCard.css    # the styles
```

- **`.html`** contains only the **inner** markup — no `<template>` wrapper and no root element
  matching the tag. Slice injects it as **light-DOM children** of the custom element. Slice does
  not use Shadow DOM; do not call `attachShadow()`.
- **`.css`** should reference theme variables (`var(--...)`) instead of hardcoded colors, so theme
  switching keeps working. Use BEM-style class names (`block__element--modifier`) to avoid clashes.

## The constructor
Every Visual component's constructor does three things, in order:

```javascript title="UserCard.js"
export default class UserCard extends HTMLElement {
  static props = {
    name:     { type: 'string',   default: '' },
    onSelect: { type: 'function', default: null }
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);                        // 1. inject the .html
    this.$name = this.querySelector('.user-card__name'); // 2. cache refs (works now)
    this.$root = this.querySelector('.user-card');
    this.$root.addEventListener('click', () => this._onSelect?.());
    slice.controller.setComponentProps(this, props);   // 3. apply props (fires setters) — LAST
  }

  async init() {
    // async-only work: fetch, build children with await slice.build(...)
  }

  set name(value) { this._name = value || ''; this.$name.textContent = this._name; }
  set onSelect(fn) { this._onSelect = typeof fn === 'function' ? fn : null; }
}

customElements.define('slice-user-card', UserCard);
```

Key rules:
- The DOM exists **only after** `slice.attachTemplate(this)`. Before it, `querySelector` returns
  `null`; after it, queries work in the constructor.
- Call `slice.controller.setComponentProps(this, props)` **last**.

### Where to cache DOM references
Two valid patterns:
- **In the constructor**, after `attachTemplate` (shown above, as the official components do).
  Setters can update the DOM directly with no extra guards.
- **In `init()`** instead. Because `setComponentProps` runs in the constructor (before `init()`),
  setters fire before those references exist — so guard their DOM access with `?.`:

```javascript title="Caching refs in init()"
constructor(props) {
  super();
  slice.attachTemplate(this);
  slice.controller.setComponentProps(this, props);
}
async init() {
  this.$name = this.querySelector('.user-card__name');
  this.applyName();
}
set name(v) { this._name = v || ''; this.applyName?.(); }   // ?. — setter may run before init
applyName() { if (this.$name) this.$name.textContent = this._name; }
```

## static props and setters
`static props` is the component's public contract. Each entry has a `type` and an optional
`default` or `required: true`.

```javascript title="static props"
static props = {
  value:    { type: 'string',   default: 'Click me' },
  disabled: { type: 'boolean',  default: false },
  items:    { type: 'array',    default: [] },
  onClick:  { type: 'function', default: null },
  userId:   { type: 'string',   required: true }   // no default → required
};
```

Types: `string`, `number`, `boolean`, `array`, `object`, `function`. When `setComponentProps`
runs, it applies defaults, validates in development, and assigns each prop **through its setter**
(`this[prop] = value`). Defaults pass through setters too. Because of this, **side effects belong
in setters** — assigning a prop is all the rest of your code needs to do, and the Debugger can
change props live through the same path. Keep internal state (cached data, timers) on `this`, not
in `static props`.

## customElements.define
Register the custom element once at the bottom of the file:

```javascript
customElements.define('slice-user-card', UserCard);
```

The tag must contain a hyphen. You rarely write the tag in HTML — `await slice.build('UserCard',
props)` instantiates it for you.

## Component categories and registration
Two things make a component loadable:

1. **`components.js`** maps each component name to a **category**:
   ```javascript title="src/Components/components.js (auto-generated)"
   const components = {
     "UserCard": "AppComponents",
     "Button":   "Visual",
     "AuthService": "Service"
   };
   export default components;
   ```
2. **`sliceConfig.json` → `paths.components`** defines each category's folder (`path`) and how to
   load it (`type`: `Visual` loads `.js`+`.html`+`.css`; `Service` loads only `.js`). See
   sliceConfig.json for the full explanation.

When you call `slice.build('UserCard')`, Slice reads the category from `components.js`, finds the
matching `paths.components` entry, and loads the files from `<path>/UserCard/`. `slice component
create` keeps both in sync; if a component is missing from `components.js`, `slice.build()` returns
`null`.

## Service components
A Service is a plain class — no `HTMLElement`, no `static props`, no lifecycle, no
`customElements.define`. Put it in a `Service`-type category and build it the same way:

```javascript title="AuthService.js"
export default class AuthService {
  constructor(props = {}) { this.token = null; }
  async login(email, password) {
    const res = await fetch('/api/login', { method: 'POST', /* ... */ });
    if (!res.ok) { slice.logger.logError('AuthService', 'Login failed'); return false; }
    this.token = (await res.json()).token;
    return true;
  }
}
```

```javascript title="Build and reuse a service"
const auth = await slice.build('AuthService', { sliceId: 'AuthService' });
// later, anywhere:
const same = slice.controller.getComponent('AuthService');
```

## Best Practices
:::tip
Generate components with `slice component create` so files and `components.js` stay correct.
:::

:::tip
Put DOM side effects in setters; reserve `init()` for async setup and `update()` for refreshes.
:::

## Gotchas
:::warning
The DOM is empty until `slice.attachTemplate(this)` runs. Querying before it returns `null`.
:::

:::warning
A component missing from `components.js`, or a wrong `paths.components` `path`/`type`, makes
`slice.build()` return `null`. Run `slice component list` to resync.
:::
