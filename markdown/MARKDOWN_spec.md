# Slice.js Markdown Documentation Spec

This spec defines a markdown-first format used to generate Slice.js documentation pages. The goal is
an LLM-friendly source of truth that compiles to the existing component-based docs (CodeVisualizer,
Details, etc) while staying concise and developer oriented.

## 1) File location
Each doc page is a single markdown file under `slicejs_docs/markdown`.
Suggested convention:

- `slicejs_docs/markdown/<section>/<slug>.md`

Example:
- `slicejs_docs/markdown/getting-started/events.md`
- `slicejs_docs/markdown/getting-started/contexts.md`

## 2) Front matter (required)
Front matter uses YAML and is required at the top of every file.

Required fields:
- `title`: Page title shown in H1 and nav.
- `route`: Full route path (must match router layout).

Optional fields:
- `navLabel`: Overrides nav label if different from title.
- `section`: Top-level menu section (e.g. Introduction, Getting Started, Components Library).
- `group`: Nested group inside section (e.g. Components, Routing, Lifecycle).
- `order`: Numeric sort order within a group.
- `description`: Short summary for meta/preview.
- `component`: Custom component name if needed (default generated).
- `tags`: Array of keywords for MCP indexing.

Example:

---
title: EventManager
route: /Documentation/Structural/EventManager
navLabel: Events
section: Getting Started
group: Lifecycle
order: 30
description: Lightweight pub/sub for component and app events.
tags: [events, pubsub, lifecycle]
---

## 3) Content structure (recommended)
Keep docs concise and developer oriented. Recommended section order:

1) Overview
2) Enable/Setup (if applicable)
3) API Reference
4) Usage Patterns
5) Best Practices
6) Gotchas
7) FAQ (optional)

## 4) Markdown blocks and directives
Standard markdown is supported. Specialized blocks below map to Slice components.

### 4.1 Code blocks -> CodeVisualizer
Use fenced code blocks. Language required.

```javascript
// Example
slice.events.subscribe("app:ready", () => {});
```

Optional attributes can be added with a code fence info string:

```javascript title="Component-bound subscription" highlight="2-4"
this.events = slice.events.bind(this);
this.events.subscribe("user:logout", () => this.reset());
```

Parser rules:
- Any fenced block becomes a CodeVisualizer.
- `title` becomes a label above the code block.
- `highlight` is optional (if supported by UI).

### 4.2 Details blocks -> Details component

:::details title="Why use bind()?"
Bind creates a component-scoped API so cleanup is automatic on destroy.
:::

### 4.3 Callouts -> Card/Alert

:::tip
Use `bind()` or `options.component` to avoid memory leaks.
:::

:::warning
Clearing innerHTML is not enough. Always destroy components first.
:::

### 4.4 API reference tables
Use a table for method references. This converts to a structured API list.

| Method | Signature | Notes |
| --- | --- | --- |
| `subscribe` | `(eventName, callback, options?)` | Auto-cleanup if `options.component` set |
| `emit` | `(eventName, data?)` | Emits to all subscribers |

### 4.5 Steps / recipes

:::steps
1. Destroy old components with `destroyByContainer`.
2. Clear DOM.
3. Fetch latest data.
4. Rebuild components with stable sliceIds.
:::

## 5) Required metadata for routing and layout
The generator must output:
- `documentationRoutes` entries derived from `section`, `group`, `order`, `title`/`navLabel`.
- `routes.js` entries from `route` and `component`.
- Component files with a standard structure (HTML + JS + CSS) unless a shared renderer is used.

## 6) Output mapping
Each markdown file produces component files in the existing folder structure.

- `ComponentName.html` (generated markup)
- `ComponentName.js` (builds CodeVisualizer and Details components)
- `ComponentName.css` (default styling or inherited base)

Component naming:
- Default: `Title` -> `TitleDocumentation` (or use `component` front matter override)

Folder structure rules:
- Keep the current component folder layout under `src/Components/AppComponents`.
- Example output: `src/Components/AppComponents/EventManagerDocumentation/*`.
- Generator should not flatten or reorganize existing folders.

Generic documentation CSS:
- Provide a shared base stylesheet for documentation pages.
- Per-page CSS remains optional for overrides only.
- Example: `src/Components/AppComponents/DocumentationBase/DocumentationBase.css`.
 - Base styles should be registered globally on the Documentation page.

## 7) LLM indexing guidance
To make MCP indexing reliable:

- Keep code blocks small and focused.
- Provide explicit headings (Overview, API, Patterns, Gotchas).
- Include example patterns with clear names.
- Keep API references in tables.

## 8) Example page

---
title: ContextManager
route: /Documentation/Structural/ContextManager
navLabel: Contexts
section: Getting Started
group: State
order: 40
description: Shared state with watchers and persistence.
tags: [context, state, watch, persistence]
---

# ContextManager

## Overview
ContextManager provides shared state with watchers and optional persistence. It emits
`context:<name>` updates via EventManager.

## Enable
```json
{
  "context": { "enabled": true }
}
```

## API Reference
| Method | Signature | Notes |
| --- | --- | --- |
| `create` | `(name, initialState?, options?)` | Supports persistence |
| `watch` | `(name, component, callback, selector?)` | Auto-cleanup |

## Usage Patterns
```javascript title="Component watcher with selector"
slice.context.watch(
  "auth",
  this,
  (isLoggedIn) => this.toggle(isLoggedIn),
  (state) => state.isLoggedIn
);
```

:::tip
Selectors should be fast and side-effect free.
:::

## Gotchas
:::warning
Watchers require a Slice component for auto-cleanup.
:::
