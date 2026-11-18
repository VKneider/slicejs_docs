# AGENTS.md — slicejs_docs

This repo is the **Slice.js documentation site** — itself a Slice app (`src/`, `api/`) whose pages are
**generated from Markdown**. (It is separate from the visual library's component docs, which live in
`slicejs-components/src/markdown/`.)

## ⚠️ Edit the Markdown source, not the generated pages
- **Source of truth:** `markdown/**/*.md` (folders: `getting-started/`, `project-architecture/`,
  `components/`).
- **Markdown contract:** [`parser/MARKDOWN-CONTRACT.md`](parser/MARKDOWN-CONTRACT.md) defines the
  shared syntax and registry components. `parser/tests/markdown-contract.test.js` guards it.
- The parser (`node parser/index.js`, script **`docs:generate`**) reads `markdown/` and **generates**
  the page components, `docsIndex.js`, `documentationRoutes.js`, `seo.json` and `sitemap.xml`.
  `documentationRoutes.js` is generated from the front matter (`section`, `group`, `order`); edit the
  page's front matter, not the tree. `src/routes.js` remains **hand-maintained**.
- When you add a page, add it to `src/routes.js`; `parser/tests/routes.test.js` fails if a
  `docsIndex` route is missing from either the client route table or the generated tree.

## Workflow for a doc change
1. Edit / add the `.md` under `markdown/`. Set `section`, `group` and `order` to place it in the
   navigation; the section order lives in `parser/lib/navConfig.js`.
2. Run `docs:generate` (regenerates pages, `docsIndex.js`, `documentationRoutes.js`, `seo.json`,
   `sitemap.xml` and `DocumentationBase.css` from `parser/templates/`).
3. Run `docs:llm` (rebuilds `llm.txt`) if the change should appear in the LLM context dump.
4. `dev` to preview.
5. `pnpm test` for the SEO drift guard (sitemap ↔ manifest) and route/navigation guards.
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
section: Guides
group: ''
order: 50
description: One-line summary.
component: ServicePatternsDocumentation                # UNIQUE generated class name
tags: [architecture, services]
---
```
- `component` must be unique (it becomes a generated class). `generate: false` skips generation for a
  hand-authored page (e.g. `themes.md`).
- Cross-link other docs with their `route` value (e.g. `[Services](/Documentation/Service)`).

## Notes
- Like every Slice app, this serves the framework runtime from `node_modules/slicejs-web-framework` —
  framework source edits in the `slice.js` repo are not reflected here until published.
- `section`, `group` and `order` drive the generated navigation. The section order and group order
  live in `parser/lib/navConfig.js`; do not edit `documentationRoutes.js` by hand.
- The markdown contract (links, callouts, compare, related, status, tables) lives in
  [`parser/MARKDOWN-CONTRACT.md`](parser/MARKDOWN-CONTRACT.md).

## Component categories

<!-- slice:generated:categories:start -->
| Category | Type | Path | Components | Guide |
| --- | --- | --- | --- | --- |
| AppComponents | Visual | `src/Components/AppComponents` | 74 | [AGENTS.md](src/Components/AppComponents/AGENTS.md) |
| Service | Service | `src/Components/Service` | 3 | [AGENTS.md](src/Components/Service/AGENTS.md) |
| Visual | Visual | `src/Components/Visual` | 27 | [AGENTS.md](src/Components/Visual/AGENTS.md) |
<!-- slice:generated:categories:end -->
