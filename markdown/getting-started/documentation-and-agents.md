---
title: Documentation & AGENTS.md
route: /Documentation/Documentation-System
navLabel: Documentation & AGENTS
section: Getting Started
group: Tooling
order: 16
description: How Slice projects document components, categories, events and decisions, and how coding agents read that documentation.
component: DocumentationAndAgentsDocumentation
tags: [documentation, agents, agents-md, claude, events, cli, categories]
---

# Documentation & AGENTS.md

Slice projects ship documentation as part of the project, not as a follow-up. The goal is simple:
an agent or a new teammate should know what a category is for, which component owns a behavior, which
events cross a boundary, and what changed — without guessing.

## What `slice init` creates

A fresh project gets the documentation scaffold next to the code:

```text title="Project documentation layout"
my-app/
├── AGENTS.md                         # root guide: commands, categories, read order
├── CLAUDE.md                         # one line: @AGENTS.md (Claude compatibility)
├── src/
│   └── Components/
│       ├── Visual/
│       │   └── AGENTS.md             # registry category guide + inventory
│       ├── Service/
│       │   └── AGENTS.md
│       └── AppComponents/
│           ├── AGENTS.md
│           └── Dashboard/
│               ├── Dashboard.js/html/css
│               └── README.md         # app-owned component docs
└── docs/
    └── events/
        ├── index.md
        ├── <namespace>.md
        ├── diagram.mmd
        └── diagram.html
```

`src/markdown/` is **not** part of an app project. That folder belongs to the Slice.js Components
and Slice.js Docs sites, which generate pages from Markdown. Apps document the module next to the
module.

## Read order for agents

Every coding agent should read, in this order:

1. `AGENTS.md` at the project root.
2. The nearest `src/Components/<Category>/AGENTS.md`.
3. The component's `README.md` when changing its API, behavior or events.
4. `docs/events/` when changing an event contract.
5. The relevant design/decision note, if the project keeps one.

`AGENTS.md` is an open Markdown format used by Codex, OpenCode, Cursor, Gemini CLI, Aider, Jules,
Factory, Devin, VS Code/Copilot, Windsurf, Amp and others. Claude Code reads it directly on current
versions; `CLAUDE.md` imports it for older versions. A direct user instruction wins over all of
them.

## Root `AGENTS.md`

The root file is a router. It answers:

- what this project is;
- which commands to run;
- which categories exist and where their guides live;
- where component docs, event docs and changelogs live;
- what “done” includes.

Its category table is generated between markers:

```md
<!-- slice:generated:categories:start -->
| Category | Type | Path | Components | Guide |
| --- | --- | --- | --- | --- |
| Visual | Visual | `src/Components/Visual` | 14 | [AGENTS.md](src/Components/Visual/AGENTS.md) |
| Domain | Service | `src/Components/Domain` | 5 | [AGENTS.md](src/Components/Domain/AGENTS.md) |
<!-- slice:generated:categories:end -->
```

Write freely around the markers. `slice docs generate agents` rewrites only the marked block.

## Category `AGENTS.md`

Every category in `sliceConfig.paths.components` has a guide. It explains the category, not just the
files.

### Visual and Service

These are the registry categories. `slice get` installs components there. Their guide states the
rule:

- a registry component is not edited by hand;
- its authoritative docs are `slice docs` / MCP;
- a local component added to the same category is app-owned and documents its own `README.md`.

### App categories

Custom categories such as `Domain`, `Core`, `Providers` or `AppComponents` are app-owned. Their guide
should cover:

- what belongs here and what does not;
- the local conventions and invariants;
- the component inventory;
- which events cross the boundary;
- gotchas learned during implementation.

The generated inventory is only the table:

```md
<!-- slice:generated:components:start -->
| Component | Type | Files | Docs |
| --- | --- | --- | --- |
| CartService | Service | 1 | [README](./CartService/README.md) |
| PricingService | Service | 1 | [README](./PricingService/README.md) |
<!-- slice:generated:components:end -->
```

A good guide is documentation, not boilerplate. “Components go here” is not enough.

## Component `README.md`

An app-owned component documents itself next to its code:

- purpose and when not to use it;
- public props/API;
- events emitted or listened to, with namespaces;
- a minimal usage example;
- lifecycle or singleton constraints;
- gotchas;
- a link to the category changelog if the project uses one.

Registry components do not get a local copy of their docs. That would go stale; link to
`slice docs get <component>` instead.

## Generated documentation

`slice docs generate` writes the generated half:

```bash
slice docs generate            # agents + types + events
slice docs generate agents     # components.js + AGENTS generated blocks
slice docs generate types      # .d.ts + event manifest
slice docs generate events     # docs/events/*
```

`slice docs check` is the read-only counterpart. It exits non-zero when a generated file is stale:

```bash
slice docs check
slice docs check agents
slice docs check types
slice docs check events
```

`slice types generate` remains an alias of `slice docs generate types`.

| Command | What it does |
| --- | --- |
| `slice init` | Seeds `AGENTS.md`, `CLAUDE.md`, category guides, types and event docs |
| `slice dev` | Regenerates the documentation before starting the watch server |
| `slice build` | Checks documentation drift for projects that already have the scaffold |
| `slice doctor` | Reports missing guides, placeholders and generated-doc drift |
| `slice component create/delete` | Keeps `components.js` and the category inventory in sync |
| `slice get` / `slice sync` | Updates the installed category inventory |

Never hand-edit `components.js`, `docs/events/*`, `src/slice-events.generated.js` or
`*.generated.d.ts`.

## Event documentation

The event catalog is generated from `slice.events.register(...)` and the static `emit` /
`subscribe` call sites:

```text
docs/events/
├── index.md          # summary by namespace + drift
├── cart.md           # one page per namespace
├── router.md
├── diagram.mmd       # Mermaid source
└── diagram.html      # self-contained HTML + inline SVG
```

Rules:

- Event names are `namespace:action`.
- Each namespace page lists payload, emitters, listeners, category and `file:line`.
- `index.md` lists declared-but-unused events, used-but-undeclared events, names without a
  namespace, and dynamic sites.
- The scanner excludes `*.spec.js`, `*.test.js`, `*.generated.js`, `src/public/` and
  `src/bundles/`.
- `diagram.html` opens offline; it has no CDN or JavaScript dependency.

Example namespace page:

```md
# cart events

## `cart:add`

Payload: `{ sku: string, qty: number }`

| Role | Component | Category | Source |
| --- | --- | --- | --- |
| emitter | CartService | Domain | `src/Components/Domain/CartService/CartService.js:42` |
| listener | CartBadge | Visual | `src/Components/Visual/CartBadge/CartBadge.js:18` |
```

## Changelog is optional

The scaffold does not force a changelog. If the project uses one:

- `CHANGELOG.md` root for release-level changes;
- `src/Components/<Category>/CHANGELOG.md` for category-level changes;
- per-component changelogs only for components with their own release history.

A feature does not create a folder. It adds an entry to the changelog that already exists. If the
project has no changelog, do not invent one unless the user asks.

## What to update for each change

| Change | Update |
| --- | --- |
| Feature | Component README, category guide if the category changed, changelog if used |
| Bug | Regression test, component README/gotcha, changelog if user-facing |
| New component | Component README, category inventory, tests |
| Removed component | Category inventory, references, changelog if used |
| Public props/API | Component README and examples |
| Event contract | `slice.events.register`, `slice docs generate`, namespace page, tests |
| Config/CLI | Root `AGENTS.md`, framework/CLI docs, changelog |
| Architecture | Design/ADR doc, category guide, changelog |

If none apply, say “No docs impact” and why. A test-only change or an internal refactor with no
public behavior is a valid reason.

## Library docs are different

`slicejs-components` and `slicejs_docs` are documentation sites. Their Markdown source lives in
`src/markdown/` or `markdown/` and their parsers generate the pages. That pipeline does not apply to
apps.

When working in those repositories:

- edit the Markdown source, never the generated pages;
- run the repo's docs generator;
- regenerate the component agent manifest and OG/SEO artifacts when the page is public;
- update the framework docs and the shared skill when guidance changes.

## Why this helps agents

- The root guide is small and points to the nearest category.
- The category guide explains the boundary and links the component docs.
- The component README explains the contract and gotchas.
- The event catalog is generated from the actual call sites, so it cannot silently drift.
- `slice docs check` catches stale generated docs before a build or PR.

The result is documentation that is local, discoverable and current — not a second README nobody
reads.
