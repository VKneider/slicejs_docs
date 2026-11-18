---
title: The Development Loop
route: /Documentation/Development-Workflow
navLabel: The Development Loop
section: Getting Started
group: ''
order: 60
description: The day-to-day loop: start the dev server, edit, create components, run the fast checks, document, build and serve.
component: DevelopmentWorkflow
tags: [getting-started, cli, workflow, dev, build, doctor]
---

# The Development Loop

Day-to-day Slice work is a short loop: start the dev server, change a component, see it reload, and
run the fast checks before you build. The same loop applies to a new project and to one that has
been running for months.

## The loop at a glance

| Step | Command | What happens |
| --- | --- | --- |
| Start the loop | `slice dev` | Serves `/src` with HMR and regenerates project docs before watching. |
| Create or edit | `slice component create <Name> --category <Category>` | Writes `.js` / `.html` / `.css` and updates `components.js`. |
| Reuse a component | `slice get <Name>` | Installs a registry component into the project. |
| Check | `slice doctor && slice lint && slice typecheck` | Fast gates before a build. |
| Document | `slice docs generate` / `slice docs check` | AGENTS inventory, declarations and the event catalog. |
| Ship | `slice build` then `slice start` | Bundles `/dist`; `start` serves it. |

:::steps
1. Start the dev server with `slice dev`.
2. Create or edit the component and let the dev server reload it.
3. Assign a prop, call a method, or use `update()` — do not rebuild for a prop change.
4. Run `slice doctor`, `slice lint` and `slice typecheck`.
5. Run `slice build`, then `slice start` to verify the production output.
:::

## 1. Start: `slice dev`

```bash
slice dev
```

`slice dev` serves the app from `src/` with hot reload. Changes to `.js`, `.html` and `.css` reload
the page; changes to `sliceConfig.json` may need a restart. Before watching, it regenerates the
project documentation (AGENTS inventory, declarations and `docs/events/`).

- **Port:** `server.port` in `sliceConfig.json`, or `slice dev -p 4000`. The default is `3000`;
  if it is taken, the CLI falls back to the next free port.
- **Debug panels:** `alt+shift+e` (events) and `alt+shift+c` (context) when
  `events.ui.enabled` / `context.ui.enabled` are on.
- **Inspect props:** right-click a component when `debugger.enabled` is on.

If you use `package.json` scripts, `pnpm run dev` / `npm run dev` are the same command pinned to the
project's local CLI.

## 2. Create or reuse a component

```bash
# Non-interactive: writes the three files and registers the component
slice component create UserCard --category AppComponents

# Interactive: prompts for whatever you omit
slice component create
```

Components must be listed in `src/Components/components.js` to be loadable. `component create` and
`component list` update it for you:

```bash
slice component list        # resync components.js with the folders on disk
```

To reuse something from the official registry:

```bash
slice browse                         # list official components
slice get Card Input Select          # Visual components
slice get FetchManager --service     # a Service
```

:::warning
A component that is on disk but missing from `components.js` makes `slice.build()` return `null`.
Run `slice component list` (or `slice doctor`) before debugging the component itself.
:::

The full flag list is in [CLI Commands](/Documentation/CLI).

## 3. Check before you build

```bash
slice doctor && slice lint && slice typecheck
```

- **`slice doctor`** is the fast static check: config, component files, routes, prop definitions,
  imports, SEO and common lifecycle mistakes. It exits 0 with warnings and 1 on failures.
- **`slice lint`** runs ESLint with the shared Slice config.
- **`slice typecheck`** runs the project's own TypeScript against the generated declarations.

Doctor does not compile or bundle. It can prove the project is structurally sound; it cannot prove
that esbuild resolves the whole graph. That is what `slice build` is for.

:::details title="Typecheck needs TypeScript in the project"
`slice typecheck` uses the TypeScript installed by the project. If it is missing, add the optional
tooling once with `slice setup lint --with-types`.
:::

## 4. Documentation is part of the loop

```bash
slice docs generate          # AGENTS inventory + declarations + docs/events/
slice docs generate types    # declarations + src/slice-events.generated.js
slice docs generate events   # docs/events/* (Markdown, Mermaid, HTML)
slice docs check             # CI drift gate
```

`slice dev` regenerates before it starts watching, and `slice build` runs the drift check for a
scaffolded project. Update the Markdown and the component `README.md` when behavior changes; see
[Documentation & AGENTS.md](/Documentation/Documentation-System).

## 5. Build and serve

```bash
slice build     # bundles + dist/
slice start     # serves dist/
```

`slice build` analyzes what the routes use, bundles and minifies into `dist/`, copies `src/public/`
to `dist/public/`, checks the generated docs, and never writes into `src/`. `slice start` serves
`dist/`; if the build is missing, it runs `slice build` first.

:::compare left="Dev server" right="Production build"
Serves `src/`, hot-reloads edits, keeps debug panels and dev-only runtime features.
---
Writes and serves `dist/`, bundles and minifies, runs the docs check, and turns off dev-only panels.
:::

For a static host, `slice export` packages the build for `dist-static/` (experimental); see
[CLI Commands](/Documentation/CLI).

## Where your code lives

| You want to… | Put it in |
| --- | --- |
| Add an app screen or section | `src/Components/AppComponents/<Name>/` |
| Reuse a UI element across screens | a Visual component (`slice get <Name>` or create one) |
| Hold logic/data with no UI (API client, storage) | `src/Components/Service/<Name>/` |
| Change navigation | `src/routes.js` (and the shell's `MultiRoute`) |
| Toggle managers, theme, port | `src/sliceConfig.json` |

## Next steps

:::related
- [CLI Commands](/Documentation/CLI) - Every command, flag and exit code.
- [Project Anatomy](/Documentation/Project-Anatomy) - What `slice init` creates.
- [Your First Page](/Documentation/First-Page) - The first route and component.
- [Documentation & AGENTS.md](/Documentation/Documentation-System) - What `docs generate` writes.
:::
