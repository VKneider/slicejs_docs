# AGENTS.md — slicejs_docs

This repo is the **Slice.js documentation site** — itself a Slice app (`src/`, `api/`) whose pages are
**generated from Markdown**. (It is separate from the visual library's component docs, which live in
`slicejs-components/src/markdown/`.)

## ⚠️ Edit the Markdown source, not the generated pages
- **Source of truth:** `markdown/**/*.md` (folders: `getting-started/`, `project-architecture/`,
  `components/`).
- The parser (`node parser/index.js`, script **`docs:generate`**) reads `markdown/` and **generates**
  the page components, `docsIndex.js`, `seo.json` and `sitemap.xml`. The two client route tables —
  `src/routes.js` and `src/Components/AppComponents/DocumentationPage/documentationRoutes.js` — are
  **hand-maintained** and are not rewritten by the parser. When you add a page, update both tables in
  the same change; `parser/tests/routes.test.js` fails if a `docsIndex` route is missing from either.

## Workflow for a doc change
1. Edit / add the `.md` under `markdown/`.
2. Run `docs:generate` (regenerates pages, `docsIndex.js`, `seo.json`, `sitemap.xml`; it does not edit
   `routes.js` or `documentationRoutes.js`).
3. Run `docs:llm` (rebuilds `llm.txt`) if the change should appear in the LLM context dump.
4. `dev` to preview.
5. `pnpm test` for the SEO drift guard (sitemap ↔ manifest).
6. `pnpm og:generate` when pages were added/renamed; `pnpm og:check` is the gate.

## SEO artifacts (generated — never hand-edit)
`docs:generate` derives the crawler-facing files from the same front matter as the pages:

- `src/public/seo.json` — per-route title, description, canonical, robots, JSON-LD.
  The server (`api/index.js` → `createSliceServer({ seo: { manifest: 'seo.json', images: 'og/manifest.json' } })`)
  injects it into the SPA shell and uses it for the real 404.
- `src/public/sitemap.xml` — only indexable routes, with `<lastmod>` from the
  markdown file's last commit (not its mtime).
- `src/public/og/manifest.json` + `src/public/og/*.jpg` — one 1200×630 social
  card per indexable route. `pnpm og:generate` captures the real page and
  composes the card; `pnpm og:check` validates size, budget and orphans.

The old hand-written sitemap rotted (it missed Deployment, SEO and
Server-Entrypoint). Add a page, run `docs:generate`, regenerate its OG card and
commit the generated files; `pnpm test` fails if they disagree. Do not edit
`seo.json`, `sitemap.xml` or `og/` by hand.

`scripts/og/generate.mjs` reuses the Playwright installed by the sibling
`slicejs-components` repo, so docs does not add its own Playwright dependency.
Override the location with `SLICE_PLAYWRIGHT=/path/to/@playwright/test/index.mjs`
if the repos are not siblings.

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
