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

## Automatic Page Chrome
The parser adds these from front matter, so authors do not write them:

- **Breadcrumb** — built from `section` and `group`, rendered with the registry `Breadcrumbs`
  component.
- **Reading time** — estimated from the body text.
- **Title bar and lede** — the first `#` heading plus the front matter `description`.
- **Copy markdown** — the button in the title bar.
- **Status badge** — from an optional `status` field.

## Supported Blocks
The parser recognizes the following constructs.

### Headings
Markdown headings (`#`, `##`, `###`) are supported and used for anchors.

### Paragraphs
Plain text becomes paragraphs with inline formatting:
- `**bold**`
- `*italic*`
- `` `inline code` ``
- `[label](/Documentation/Service)` — internal links use the Slice router
- `[label](https://example.com)` — external links open in a new tab
- `![alt](/images/diagram.png)` — images are lazy-loaded

Links and inline code also work inside table cells.

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
They render using the `Table` component. Cells support bold, inline code and links.

```
| Field | Type | Notes |
| --- | --- | --- |
| path | string | Route path |
```

### Blockquotes
Lines starting with `>` render as a styled blockquote. Use them for a single emphasized aside, not as
a second callout system.

```
> Design your components so that assigning a prop drives the DOM update.
```

### Callouts
Use `:::tip`, `:::warning` and `:::note` for callouts. They render with the registry `Callout`
component, so the tone and icon stay consistent with the component library. `:::info`, `:::success`
and `:::danger` are aliases for the matching tone.

```
:::tip
Use this for recommendations.
:::

:::warning
Use this for pitfalls.
:::

:::note
Use this for a short aside that is not advice or risk.
:::
```

A custom tone and title are available when the three defaults are not the right fit:

```
:::callout tone="accent" variant="ghost" title="Why this matters"
The body is still markdown.
:::
```

**Callout budget:** a callout is for something the reader would miss if it were a normal paragraph.
Keep 1–3 per page. If a section needs five tips in a row, it is probably a table, a `Details` block,
or plain prose. Use `:::warning` only for a real risk (data loss, a destructive step, a security
mistake); using it for preferences trains readers to skip warnings.

### Details
`:::details` renders an expandable `Details` component. The body is parsed as markdown (paragraphs,
lists, code, links), not as plain text.

```
:::details title="Why use bind()?"
Bind creates a component-scoped API for auto-cleanup.
:::
```

### Compare (Do / Don't)
`:::compare` renders two `Callout`s side by side in a `Grid`. Use it when the point is a contrast
rather than a single warning; it absorbs pairs of tip/warning callouts.

```
:::compare left="Do" right="Don't"
Assign a prop and let the setter update the DOM.
---
Destroy the component and rebuild the whole subtree for one changed field.
:::
```

`left`/`right` are the titles; `leftTone`/`rightTone` change the tones if success/danger is not the
right pair.

### Related pages
`:::related` renders a `Grid` of `Card`s at the end of a page. Each line is a link plus an optional
description after ` - `.

```
:::related
- [Component Anatomy](/Documentation/Component-Anatomy) - How the three files fit together.
- [Static Props](/Documentation/Static-Props) - Typed props, defaults and validation.
:::
```

### Status badge
Add `status` to the front matter to put a `Badge` next to the page title. Supported values:
`new`, `updated`, `deprecated`, `beta`, `experimental`. Any other value renders as a neutral badge
with that label.

```yaml
status: new
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

## New Page Checklist (Required)
When adding a new docs page, complete all steps below.

1. Create markdown file in `slicejs_docs/markdown/` (or subfolder).
2. Add valid front matter with at least:
   - `title`
   - `route`
   - `section`
   - `group`
   - `order`
   - `component`
3. Run the parser from workspace root:

```bash
node slicejs_docs/parser/index.js
```

4. Confirm generated component exists in:
   - `slicejs_docs/src/Components/AppComponents/<ComponentName>/`
5. Wire navigation + routing manually (parser does not do this):
   - TreeView/navigation config:
     - `slicejs_docs/src/Components/AppComponents/DocumentationPage/documentationRoutes.js`
   - Router path mapping:
     - `slicejs_docs/src/routes.js`
   - Component registry:
     - `slicejs_docs/src/Components/components.js`
6. Validate route and tree item in dev server:
   - new item appears in documentation tree
   - opening item does not return 404

:::warning
The parser updates docs index metadata (`docsIndex.js`) and generated components, but it does not automatically register route/treeview/component mappings used by the docs app.
:::

## Style Rules
- English, developer-focused, concise.
- Prefer real API names and behavior from the codebase.
- Use only `init`, `update`, `beforeDestroy` as lifecycle methods.
- Avoid `render` terminology.
