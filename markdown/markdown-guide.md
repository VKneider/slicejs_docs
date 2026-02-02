---
title: Markdown Guide
route: /Documentation/Markdown-Guide
navLabel: Markdown Guide
section: Internal
group: Docs
order: 1
description: Standard guide for writing docs markdown files.
component: MarkdownGuide
generate: false
tags: [docs, markdown]
---

# Markdown Guide for Docs Components

This guide documents the exact markdown format supported by the Slice.js docs parser.
It matches the current parser behavior and existing docs files.

## File Location
Store docs in `slicejs_docs/markdown/`.
Use folders like `getting-started/` or `components/` to organize pages.

## Front Matter (Required)
Front matter uses simple YAML-style lines with `key: value`.
Only plain strings and simple arrays are parsed.

```yaml
---
title: Page Title
route: /Documentation/Some-Path
navLabel: Nav Title
section: Getting Started
group: Components
order: 10
description: One-line summary.
component: SomeDocumentation
generate: false
tags: [routing, components]
---
```

### Front Matter Fields
| Field | Required | Description |
| --- | --- | --- |
| `title` | yes | H1 title shown in the page. |
| `route` | yes | Router path for the docs page. |
| `navLabel` | no | Overrides the nav label if different from title. |
| `section` | no | Top-level menu section. |
| `group` | no | Subgroup in navigation. |
| `order` | no | Sort order within a group. |
| `description` | no | Short summary for lists or previews. |
| `component` | no | Component class name override. |
| `generate` | no | `false` skips generation (JS component remains). |
| `tags` | no | Array of keywords. |

### Parser Limitations
- Only `key: value` lines are supported.
- No nested objects in front matter.
- Arrays must use `[a, b, c]` syntax.
- Values are parsed as strings (booleans are not typed).

## Content Structure (Recommended)
Use a consistent layout:

1) Overview
2) API
3) Usage Patterns
4) Best Practices
5) Gotchas
6) FAQ (optional)

## Supported Blocks
The parser recognizes the following constructs.

### Headings
Markdown headings (`#`, `##`, `###`) are supported and used for anchors.

### Paragraphs
Plain text becomes paragraphs with inline formatting:
- `**bold**`
- `` `inline code` ``

### Lists
- Unordered lists with `- ` or `* `
- Ordered lists with `1. `

### Code Blocks
Fenced code blocks become `CodeVisualizer` components.
Attributes are parsed from the info string.

```javascript title="Example"
const card = await slice.build('Card', { title: 'Hello' });
```

Supported attributes:
- `title="..."`
- `highlight="..."` (parsed, UI may ignore)

### Tables
Tables are detected by a header row followed by a `---` separator.
They render using the `Table` component.

```
| Field | Type | Notes |
| --- | --- | --- |
| path | string | Route path |
```

### Callouts
Use `:::tip` and `:::warning` for callouts.

```
:::tip
Use this for recommendations.
:::

:::warning
Use this for pitfalls.
:::
```

### Details
`:::details` renders an expandable Details component.

```
:::details title="Why use bind()?"
Bind creates a component-scoped API for auto-cleanup.
:::
```

### Steps
Use `:::steps` for a numbered recipe.

```
:::steps
1. Destroy old components.
2. Clear DOM.
3. Fetch data.
4. Rebuild.
:::
```

### Inline HTML and Script
These blocks are injected as-is (use sparingly):

```
:::html
<div class="custom-grid"></div>
:::

:::script
const grid = component.querySelector('.custom-grid');
:::
```

## Copy Markdown Behavior
- Generated docs embed markdown content and copy without fetch.
- JS-only docs should omit the copy menu to avoid fetch.

## Style Rules
- English, developer-focused, concise.
- Prefer real API names and behavior from the codebase.
- Use only `init`, `update`, `beforeDestroy` as lifecycle methods.
- Avoid `render` terminology.
