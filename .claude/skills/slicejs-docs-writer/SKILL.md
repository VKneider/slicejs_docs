---
name: slicejs-docs-writer
description: >-
  Author and edit the official Slice.js documentation in THIS repo (slicejs_docs).
  Use whenever writing, editing, or restructuring docs here: adding a new page under
  markdown/, updating an existing guide/API/lifecycle page, deciding a page's
  frontmatter/section/order, wiring a page into the sidebar/routes, or matching the
  house dev-oriented voice. Triggers on requests like "document this in the docs",
  "add a docs page for X", "update the update()/lifecycle/context docs", "write the
  guide for <feature>", or any change to markdown/**/*.md in this repo.
---

# Writing Slice.js docs (dev-oriented)

This repo is a **Slice.js app whose pages are generated from Markdown**. You write
Markdown; the parser generates the page components. Two existing files are
authoritative — read them, don't duplicate them:

- `AGENTS.md` — the edit workflow + the required frontmatter template.
- `markdown/markdown-guide.md` — every supported block (`:::tip`, `:::warning`,
  `:::details`, `:::steps`, `:::component`, code `title="..."`, tables) and parser
  limits (no nested objects; arrays as `[a, b, c]`; values are strings).

## Golden rule

**Edit the Markdown source in `markdown/`, never the generated files in
`src/Components/AppComponents/`** — they are overwritten on every parser run.

## ⚠️ `generate: false` pages — two sources that can diverge

Some `.md` files set `generate: false`: the parser **skips** them, so they do NOT
render the web page — a **hand-authored component** in
`src/Components/AppComponents/<Component>/` does (e.g. `WhatIsSlice` is the Manifesto
page; also `RoutingDocumentation`, `ThemesDocumentation`, `VisualDocumentation`,
`MultiRouteDocumentation`).

But these `.md` are **NOT dead** — they feed the **MCP / LLM docs** (`npm run docs:llm`
reads `markdown/` directly). So a `generate: false` topic has **two sources**:
- the **web page** → the hand-authored component;
- the **MCP / LLM docs** → the `.md`.

Editing one does not change the other, and they can drift. To keep a topic consistent,
update **both**. **Never delete these `.md` as "orphans" — they are the MCP source.**

The index page (`Documentation.js`) keeps a hand-maintained link list — keep it in sync
with `src/routes.js`. `markdown-guide.md` is the parser-syntax reference.

## Workflow (one page change)

1. Edit/add the `.md` under `markdown/{getting-started,project-architecture,components}/`.
2. `npm run docs:generate` — regenerates the AppComponents + route entries.
3. New pages only: wire navigation by hand (see "Navigation" below).
4. `npm run docs:llm` if it should appear in the LLM context dump.
5. `npm run dev` to preview.

> Do NOT run `docs:generate` / commit unless asked — editing the `.md` is the unit
> of work; generation is a separate, regenerable step.

## Frontmatter

Copy the template from `AGENTS.md`. The fields that drive navigation are
`section` → `group` → `order` (sort within group). `component` must be **unique**
(it becomes a generated class). `generate: false` skips generation for a
hand-authored page. Cross-link other docs by their `route`, e.g.
`[update()](/Documentation/LifeCycle-Methods/update)`.

## Page shape

Lead with the problem, not the API. Standard skeleton:

1. `# Title` then `## Overview` — what it is and **why it exists** (1–3 sentences).
2. `## API` — a signature table (`Method | Signature | Returns | Notes`) when relevant.
3. `## Usage` / pattern sections — 2–4 real examples.
4. `## Best Practices` — `:::tip` blocks; `:::steps` for ordered recipes.
5. `## Gotchas` — `:::warning` blocks.

For "which mechanism do I use?" topics, open with a **decision table**
(`Situation | Reach for`) before diving into each option — see
`project-architecture/refreshing-component-data.md` as the model.

## Voice (match the existing pages)

- **English, developer-focused, concise.** Second person, imperative ("Reach for
  the lightest one that fits", "Always set `display` on the tag").
- **Why before how.** State the problem and its consequence, then the fix.
- **~40% prose / ~60% code.** Don't explain what the code already shows.
- **Real API names, domain examples.** `slice.build()`, `slice.controller.destroyByContainer()`,
  `slice.context.setState()`; components named `OrdersPage`, `ProductList`, `UserCard`
  (never `Example`/`Test`). Always `await slice.build(...)`.
- **Do/Don't inline in code** with `/* ❌ ... */` and `/* ✅ ... */`.
- Code fences carry a title: ` ```javascript title="Same instance, new data" `.

## Navigation (new pages only)

`docsIndex.js` is auto-generated from frontmatter, but the sidebar tree and routes
are wired by hand:

- `src/Components/AppComponents/DocumentationPage/documentationRoutes.js` — the
  nested sidebar tree (add your `{ title, path }` under the right group).
- `src/routes.js` — the `/Documentation/...` → component mapping.
- `src/Components/components.js` — auto-synced by the CLI (verify the entry exists).

## Before finishing

- Cross-links resolve to real `route` values.
- Frontmatter `component` is unique; `order` slots the page correctly.
- Examples are copy-pasteable and use the real current API (verify against the
  framework source / the page being documented — don't invent signatures).
