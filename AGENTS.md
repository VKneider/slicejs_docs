# AGENTS.md — slicejs_docs

This repo is the **Slice.js documentation site** — itself a Slice app (`src/`, `api/`) whose pages are
**generated from Markdown**. (It is separate from the visual library's component docs, which live in
`slice.js_visual_library/src/markdown/`.)

## ⚠️ Edit the Markdown source, not the generated pages
- **Source of truth:** `markdown/**/*.md` (folders: `getting-started/`, `project-architecture/`,
  `components/`).
- The parser (`node parser/index.js`, script **`docs:generate`**) reads `markdown/` and **generates**
  the page components into **`src/Components/AppComponents/`** + their route entries. Those generated
  files are overwritten on every run — **never hand-edit them.**

## Workflow for a doc change
1. Edit / add the `.md` under `markdown/`.
2. Run `docs:generate` (regenerates the AppComponents + routes).
3. Run `docs:llm` (rebuilds `llm.txt`) if the change should appear in the LLM context dump.
4. `dev` to preview.

## Frontmatter (required on every page)
```yaml
---
title: Service Patterns
route: /Documentation/Architecture/Service-Patterns   # also the cross-link target
navLabel: Service Patterns
section: Project Architecture
group: Styles and Patterns
order: 6
description: One-line summary.
component: ServicePatternsDocumentation                # UNIQUE generated class name
tags: [architecture, services]
---
```
- `component` must be unique (it becomes a generated class). `generate: false` skips generation for a
  hand-authored page (e.g. `routing.md`).
- Cross-link other docs with their `route` value (e.g. `[Services](/Documentation/Service)`).

## Notes
- Like every Slice app, this serves the framework runtime from `node_modules/slicejs-web-framework` —
  framework source edits in the `slice.js` repo are not reflected here until published.
- Recently added docs that still need a `docs:generate` pass to wire up:
  `project-architecture/service-patterns.md` (new). Editing existing pages
  (`getting-started/services.md`, `before-destroy.md`, `the-build-method`, `static-props.md`,
  `visual-components.md`) also requires regeneration.
