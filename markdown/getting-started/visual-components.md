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
