# Documentation and AGENTS.md

Documentation is part of the change. A feature, bug fix, component, event contract or CLI change is
not done until its documentation layer is current.

This reference is the project-level rulebook. It complements the framework/component catalogs; it
does not replace them.

## 1. Read before writing

On every Slice task, read the project's own documentation before touching code:

1. `AGENTS.md` at the project root.
2. The nearest `src/Components/<Category>/AGENTS.md`.
3. The component's `README.md` when changing its API, behavior or events.
4. `docs/events/` when changing an event contract.
5. The relevant feature/design/decision doc, if the project uses one.

The nearest `AGENTS.md` wins over the root one. A direct user instruction wins over both.

`AGENTS.md` is the open format used by Codex, OpenCode, Cursor, Gemini CLI, Aider, Jules, Factory,
Devin, VS Code/Copilot, Windsurf, Amp and others. It is just Markdown; keep it specific, imperative
and linked to the files that matter. Claude Code also reads `AGENTS.md` directly on current
versions; the scaffold writes a one-line `CLAUDE.md` with `@AGENTS.md` for older versions.

## 2. Project layout is module-first

An app keeps docs next to the module that owns them. Do not create a `src/markdown/` folder in an
app project; that folder belongs to the library/docs-site parser, not to apps.

```text
proyecto/
  AGENTS.md
  CLAUDE.md
  CHANGELOG.md                      # optional, user-owned

  src/Components/
    Visual/                         # registry category
      AGENTS.md
      Button/
        Button.js/html/css
        Button.spec.js
    Service/                        # registry category
      AGENTS.md
      FetchManager/
        FetchManager.js
    Domain/                         # app category
      AGENTS.md
      CHANGELOG.md                  # optional
      CartService/
        CartService.js
        README.md
        CartService.spec.js
    AppComponents/
      AGENTS.md
      Dashboard/
        Dashboard.js/html/css
        README.md
        Dashboard.spec.js

  docs/
    events/
      index.md
      cart.md
      router.md
      diagram.mmd
      diagram.html
```

`slicejs-components` and `slicejs_docs` keep `src/markdown/` / `markdown/` because they are
documentation sites with a parser. That does not apply to apps.

## 3. AGENTS.md contract

### Root

The root `AGENTS.md` is the router. It should cover:

- project purpose and stack;
- read order (root → nearest category guide → component README);
- commands (`dev`, `build`, `slice docs generate`, `slice docs check`);
- generated category table;
- documentation map;
- done checklist.

Generated blocks are wrapped in markers:

```md
<!-- slice:generated:categories:start -->
| Category | Type | Path | Components | Guide |
...
<!-- slice:generated:categories:end -->
```

Write freely around them; `slice docs generate agents` only rewrites the marked block.

### Category

Every category in `sliceConfig.paths.components` has an `AGENTS.md`:

- `Visual` and `Service` are registry categories. `slice get` installs there. Their guide explains
  that registry components are not edited by hand and their docs are remote (`slice docs` / MCP).
- Custom categories (`Domain`, `Core`, `Providers`, `AppComponents`, …) are app-owned. Their guide
  explains what belongs there, what does not, local rules, component inventory and gotchas.

A useful category guide is documentation, not boilerplate. It answers:

- What is this category for?
- When should a new thing go here?
- What must not go here?
- Which components exist and where are their READMEs?
- Which events cross the boundary?
- Which local rules or gotchas did we learn?

Generated inventory:

```md
<!-- slice:generated:components:start -->
| Component | Type | Files | Docs |
| --- | --- | --- | --- |
| CartService | Service | 1 | [README](./CartService/README.md) |
<!-- slice:generated:components:end -->
```

### `CLAUDE.md`

Keep the compatibility shim:

```md
@AGENTS.md
```

Do not duplicate the content. Do not maintain two instruction files.

## 4. Component README

Only app-owned components need a local `README.md`. Registry components keep their docs remote.

An app component README should cover:

- purpose and when not to use it;
- public props/API;
- events emitted/listened (namespaced);
- a minimal usage example;
- lifecycle/singleton constraints;
- gotchas learned during implementation;
- link to the category changelog if one exists.

Do not copy the whole source into the README. Document contracts, decisions and surprises.

## 5. Changelog is optional

The scaffold does not impose a changelog. If a project uses one:

- `CHANGELOG.md` root for release-level, user-facing changes;
- `src/Components/<Category>/CHANGELOG.md` for category-level changes;
- per-component changelogs only for components with their own release history.

A feature does not create a folder. Add an entry to the changelog that already exists. If the project
does not use a changelog, do not invent one unless the user asks.

## 6. Event documentation

Run:

```bash
slice docs generate events
```

Generated output:

```text
docs/events/
  index.md
  <namespace>.md
  diagram.mmd
  diagram.html
```

Rules:

- Event names are `namespace:action`.
- `index.md` groups by namespace and lists drift: declared without emitter, used without
  declaration, invalid namespace, dynamic sites.
- Each namespace page lists payload, emitters, listeners, component category and `file:line`.
- `diagram.mmd` is Mermaid and groups by namespace.
- `diagram.html` is self-contained with inline SVG; no CDN, no JavaScript.
- Never hand-edit generated event docs. Change the registry or the call sites and regenerate.

## 7. Generated vs authored

| Artifact | Authored? | How to update |
| --- | --- | --- |
| `AGENTS.md` prose | Yes | Edit directly |
| AGENTS generated blocks | No | `slice docs generate agents` |
| `components.js` | No | `slice docs generate agents` or component commands |
| `docs/events/*` | No | `slice docs generate events` |
| `src/slice-events.generated.js` | No | `slice docs generate types` |
| `src/*.generated.d.ts` | No | `slice docs generate types` |
| `<Component>/README.md` | Yes | Edit directly |
| `CHANGELOG.md` | Yes | Edit directly |

## 8. Commands

```bash
slice docs generate            # all: agents + types + events
slice docs generate agents     # components.js + AGENTS generated blocks
slice docs generate types      # .d.ts + event manifest
slice docs generate events     # docs/events/*
slice docs check               # drift check for everything
slice docs check agents|types|events
```

`slice types generate` remains as an alias of `slice docs generate types`.

`slice dev` regenerates the documentation before starting the watch server. `slice build` checks
projects that already have the scaffold (`AGENTS.md` + `docs/events/index.md`); stale docs fail the
build. `slice doctor` reports missing guides, placeholders and drift.

`slice docs list|search|get` is the remote framework/components catalog. It is not the project's
local documentation.

## 9. What to update for each change

| Change | Update |
| --- | --- |
| Feature | component README, category guide if the category changed, changelog if used |
| Bug | regression test, component README/gotcha, changelog if user-facing |
| New component | component README, category inventory, tests |
| Removed component | category inventory, references in docs, changelog if used |
| Public props/API | component README and examples |
| Event contract | `slice.events.register`, `slice docs generate`, namespace page, tests |
| Config/CLI | root `AGENTS.md`, framework/CLI docs, changelog |
| Architecture | design/ADR doc, category guide, changelog |
| New category | `sliceConfig.paths.components`, category `AGENTS.md`, root table |
| New getter/gotcha | nearest category `AGENTS.md` or component README |

If none apply, state the reason: “No docs impact: test-only change” or “No docs impact: internal
refactor with no public behavior”.

## 10. Library docs are different

When working in `slicejs-components` or `slicejs_docs`:

- Markdown source lives in `src/markdown/` or `markdown/`.
- Run the parser/generator for that repo; never edit generated pages.
- Component docs use the front matter contract and `:::component` / `:::script` examples.
- Regenerate the agent manifest (`docs:agent` in components) and OG/SEO artifacts when the page is
  public.
- The framework docs page and the skill are documentation too: update them when guidance changes.

Do not copy the library's `src/markdown/` layout into an app.

## 11. Anti-patterns

- `AGENTS.md` that only says “write clean code” with no project facts.
- Duplicating a component's full API in `AGENTS.md` instead of linking its README.
- Hand-editing `components.js`, `docs/events/*` or generated declarations.
- Event names without a namespace.
- Registry components documented locally as if they were app-owned.
- A category guide that lists components but never explains the category.
- A changelog entry that says “misc fixes”.
- A doc that repeats the code instead of explaining a contract, decision or gotcha.
- Leaving generated docs stale because “the tests pass”.

## 12. Closing template

In the task summary or commit body:

```text
Docs:
- updated src/Components/Domain/AGENTS.md
- added src/Components/Domain/CartService/README.md
- regenerated docs/events (cart:add, cart:cleared)
```

or:

```text
Docs: no impact — test-only change; public behavior and events unchanged.
```
