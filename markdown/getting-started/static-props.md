---
title: Static Props
route: /Documentation/Static-Props
navLabel: Static Props
section: Getting Started
group: Components
order: 30
description: Define and validate component props in Slice.js.
component: StaticPropsDocumentation
tags: [props, static, validation]
---

# Static Props

## Overview
Static Props define a component's public API. They provide defaults, development-only validation,
and consistent prop behavior across Slice.js. They also power the debugger by describing which
props are available and used.

## Static Props Schema
| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `type` | `string` | no | Informational only (debugger). |
| `default` | `any` | no | Applied when prop is not provided. |
| `required` | `boolean` | no | Logs error when missing in development. |

## How Props Are Applied
When a component is built:

- Defaults are applied for missing props.
- Unknown props produce warnings in development.
- Missing required props produce errors in development.
- Props are assigned to the instance (`component[prop]`) and tracked internally.

```javascript title="Props are processed by the Controller"
export default class Button extends HTMLElement {
  static props = {
    value: { type: 'string', default: 'Button' },
    onClickCallback: { type: 'function', default: null }
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);

    // Props are now available
    console.log(this.value);
    console.log(this.onClickCallback);
  }
}
```

## Defaults and Required Fields
```javascript title="Defaults and required props"
static props = {
  title: { type: 'string', default: 'Untitled', required: false },
  id: { type: 'string', required: true }
};
```

## Validation (Development Only)
Slice warns about unknown props and errors on missing required props in development mode.
In production, validation is skipped for performance.

## Usage Patterns
```javascript title="Building with props"
const card = await slice.build('Card', {
  title: 'My Card',
  text: 'Card content',
  icon: { name: 'star', iconStyle: 'filled' }
});
```

```javascript title="Props with arrays and objects"
const grid = await slice.build('Grid', {
  columns: 3,
  rows: 2,
  gap: '16px',
  style: { border: '1px solid #ccc' }
});
```

```javascript title="Function props"
const button = await slice.build('Button', {
  value: 'Save',
  onClickCallback: () => this.save()
});
```

## Best Practices
:::tip
Define only public props in `static props` and use internal fields for private state.
:::

:::tip
Use defaults to keep components predictable and reduce boilerplate.
:::

## Gotchas
:::warning
Static Props validation runs only in development; validate critical data yourself.
:::
