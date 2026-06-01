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
| `allowedValues` | `array` | no | Strict dev-time whitelist for accepted values. |
| `schema` | `object` | no | Nested object contract when `type: 'object'`. |
| `items` | `object` | no | Nested item contract when `type: 'array'`. |

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
    onClick: { type: 'function', default: null }
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);

    // Props are now available
    console.log(this.value);
    console.log(this.onClick);
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

When `allowedValues` is defined, Slice validates values using strict equality (`===`) in development.

```javascript title="allowedValues example"
static props = {
  variant: {
    type: 'string',
    default: 'primary',
    allowedValues: ['primary', 'secondary', 'danger']
  }
};
```

## Nested Props Contract
For nested shapes, use this contract:

- `schema` for object props (`type: 'object'`)
- `items` for array props (`type: 'array'`)

```javascript title="Nested object and array contract"
static props = {
  options: {
    type: 'object',
    schema: {
      theme: {
        type: 'object',
        schema: {
          mode: { type: 'string', allowedValues: ['light', 'dark'] }
        }
      }
    }
  },
  steps: {
    type: 'array',
    items: {
      type: 'object',
      schema: {
        id: { type: 'string', required: true }
      }
    }
  }
};
```

## Type Generation (`slice types generate`)
You can generate declaration files from `static props` so editor IntelliSense and checks follow
the same contract.

```bash title="Generate declarations"
slice types generate
```

Then validate in JS projects with:

```bash title="Validate generated types"
npx -p typescript tsc --noEmit -p jsconfig.json
```

The generated types include:

- union types from homogeneous `allowedValues` (`'a' | 'b'`, `1 | 2`)
- nested object/array types from `schema/items`
- component prop map support for `slice.build(...)`

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
  onClick: () => this.save()
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
