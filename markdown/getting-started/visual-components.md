---
title: Visual
route: /Documentation/Visual
navLabel: Visual
section: Getting Started
group: Components
order: 32
description: Visual components and usage patterns in Slice.js.
component: VisualDocumentation
tags: [visual, components]
---

# Visual Components

## Overview
Visual components are UI elements like Button, Card, Input, and Layout. They rely on Static
Props, load templates and CSS automatically, and follow the same lifecycle patterns as any
Slice component.

## Building Visual Components
```javascript title="Build a visual component"
const myButton = await slice.build('Button', {
  value: 'Click me!',
  onClickCallback: () => console.log('Clicked')
});

document.querySelector('#container').appendChild(myButton);
```

## Visual Component Catalog
| Component | Purpose |
| --- | --- |
| `Button` | Clickable button UI. |
| `Card` | Structured content card. |
| `Checkbox` | Checkbox input. |
| `CodeVisualizer` | Code rendering blocks. |
| `Details` | Expandable details/summary. |
| `DropDown` | Dropdown menu. |
| `Grid` | Grid layout container. |
| `Icon` | Icon rendering. |
| `Input` | Text input field. |
| `Layout` | Page layout structure. |
| `Loading` | Loading indicator. |
| `MultiRoute` | Route container for multiple routes. |
| `Navbar` | Navigation bar. |
| `NotFound` | 404 UI component. |
| `Route` | Route container for a single path. |
| `Select` | Select input. |
| `Switch` | Toggle switch. |
| `TreeItem` | Tree view item. |
| `TreeView` | Tree view container. |

## Custom Props and Defaults
```javascript title="Defaults applied automatically"
const simpleButton = await slice.build('Button', {
  // value defaults to "Button"
  // onClickCallback defaults to null
  // customColor defaults to null
  // icon defaults to null
});
```

## How `setComponentProps` Affects Visual Components
Visual components rely on `controller.setComponentProps()` to apply props. This is the behavior
you should design your component setters around.

### What happens when props are applied
`setComponentProps(component, props)` runs in this exact order:

1) **Defaults first**
If your component defines `static props`, any missing prop with a `default` is applied
*as if it were passed in*. Defaults go through the setter too.

2) **Dev-time validation**
In development mode only, Slice warns about unknown props and errors on missing required props.
(No validation runs in production.)

3) **Setter-based assignment**
For every provided prop, Slice does:
- `component._<prop> = null`
- `component[prop] = value`

That second line triggers your setter, so any side effects (DOM updates, derived state,
re-renders) should live in the setter.

### Why the `_prop = null` step matters
Slice clears the backing field before assigning so the setter always recalculates from the
incoming value. If you use `this._prop` internally, expect it to be overwritten by your setter.

### How to write a prop-aware visual component
Use getters/setters and keep UI updates in the setter. Example:

```javascript title="Setter called by setComponentProps"
static props = {
  count: { type: 'number', default: 0 },
  label: { type: 'string', default: 'Clicks' }
};

set count(value) {
  this._count = Number(value) || 0;
  this.updateLabel?.();
}

set label(value) {
  this._label = value || 'Clicks';
  this.updateLabel?.();
}

updateLabel() {
  if (!this.$label) return;
  this.$label.textContent = `${this._label}: ${this._count}`;
}
```

### Practical takeaways
- Put side effects in setters, not in constructors.
- Defaults are applied through setters, so setters must handle default values safely.
- `setComponentProps` can be called again later (manual update), and your setters will run again.

## Authoring a Visual Component
```javascript title="Visual component structure"
export default class CustomVisualComponent extends HTMLElement {
  static props = {
    value: { type: 'string', default: 'Default Text' },
    color: { type: 'string', default: '#000000' },
    disabled: { type: 'boolean', default: false },
    items: { type: 'array', default: [] },
    config: { type: 'object', default: null },
    onClickCallback: { type: 'function', default: null }
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);
    this.$button = this.querySelector('.my-button');
    slice.controller.setComponentProps(this, props);
  }

  async init() {
    // One-time setup
  }

  async update() {
    // Refresh UI
  }
}
```

## Best Practices
:::tip
Use Static Props for all public inputs.
:::

:::tip
Avoid DOM queries in the constructor unless the template is attached.
:::

## Gotchas
:::warning
Visual components must be registered in `components.js` to be built.
:::
