---
title: The Development Loop
route: /Documentation/Development-Workflow
navLabel: The Development Loop
section: Getting Started
group: First Steps
order: 13
description: The dev to build to start cycle and where your components live.
component: DevelopmentWorkflow
tags: [getting-started, cli, workflow]
---

# The Development Loop

## Overview
Day-to-day Slice development is a short loop: run the dev server, create and edit components,
register them, and iterate. When you are ready, build for production and serve the output.

## The three commands
| Command | What it does | Serves from |
| --- | --- | --- |
| `npm run dev` | Dev server with hot reload. Edits to `.js` / `.html` / `.css` reload the page. | `/src` |
| `npm run build` | Generates an optimized, bundled production build. | writes `/dist` |
| `npm run start` | Serves the production build (run `build` first). | `/dist` |

```bash title="Typical session"
npm run dev      # work here all day at http://localhost:3001
# ...edit components...
npm run build    # when ready to ship
npm run start    # verify the production build locally
```

The dev port comes from `sliceConfig.json` (`server.port`, default `3001`) and falls back to the
next free port if it is taken.

## Where your code lives
| You want to… | Put it in |
| --- | --- |
| Add an app screen or section | `src/Components/AppComponents/<Name>/` |
| Reuse a UI element across screens | a Visual component (`slice get <Name>` or create one) |
| Hold logic/data with no UI (API client, storage) | `src/Components/Service/<Name>/` |
| Change navigation | `src/routes.js` (and the shell's `MultiRoute`) |
| Toggle managers, theme, port | `src/sliceConfig.json` |

## Creating and registering components
```bash title="Scaffold a component"
# Non-interactive: pass the name and category (writes files + updates components.js)
slice component create UserCard --category AppComponents

# Interactive: prompts for whatever you omit
slice component create
```

Components must be listed in `src/Components/components.js` (name → category) to be loadable.
`component:create` updates it for you. If you ever add or move component folders by hand, resync:

```bash title="Regenerate the registry"
slice component list
```

:::warning
A common cause of "component not found" / a `null` from `slice.build()` is a component missing
from `components.js`. Run `slice component list` to fix it.
:::

## Adding registry components
```bash title="Browse and install"
slice browse                 # list official components
slice get Card Input Select  # install the ones you need into src/Components/Visual/
slice get FetchManager --service   # install a registry Service
```

The starter ships only a small set of Visual components. Install the rest on demand so your
project stays lean.

## Diagnostics while developing
- Enable the debug panels in `sliceConfig.json` and toggle them at runtime: `alt+shift+e`
  (events) and `alt+shift+c` (context).
- Right-click a component (when `debugger.enabled`) to inspect and live-edit its props.
- Use `slice doctor` when the project structure or config seems off.
- Prefer `slice.logger.logInfo / logWarning / logError` over `console.log` — it respects the
  configured levels and stays quiet in production.

## Production build, briefly
`npm run build` analyzes what your routes use, bundles and minifies into `/dist`, and copies your
`publicFolders`. `npm run start` then serves `/dist`. Production mode disables dev-only features
(prop validation, debug panels) for performance.

:::tip
Add a folder you import from (for example `/libs`) to `publicFolders` in `sliceConfig.json`, or it
will work in dev but break in the production build.
:::
