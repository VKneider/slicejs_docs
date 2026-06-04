---
title: Project Anatomy
route: /Documentation/Project-Anatomy
navLabel: Project Anatomy
section: Getting Started
group: First Steps
order: 11
description: What slice init creates and which files you actually edit.
component: ProjectAnatomy
tags: [getting-started, project, structure]
---

# Project Anatomy

## Overview
After `slice init` you get a working **App Shell + MultiRoute** starter: a persistent navbar
wrapping a content area that swaps sections by URL. This page explains every file the starter
creates, which ones you edit first, and which ones to leave alone.

If you have not initialized a project yet, see Installation, then come back here.

## The generated tree
```text title="Fresh project after slice init"
my-app/
├── api/                         # Express dev/prod server + security middleware (don't edit)
├── src/
│   ├── App/
│   │   ├── index.html           # SPA entry: the #app mount + loads /App/index.js
│   │   ├── index.js             # Boots Slice; optional router guards live here
│   │   └── style.css            # App-level base styles
│   ├── Components/
│   │   ├── AppComponents/       # YOUR app-specific components
│   │   │   ├── AppShell/        #   persistent shell: navbar + MultiRoute content area
│   │   │   ├── HomeSection/     #   the "/" section
│   │   │   └── AboutSection/    #   the "/about" section
│   │   ├── Visual/              # Registry UI components installed for the starter
│   │   ├── Service/             # Built-in services (FetchManager, storage helpers)
│   │   └── components.js        # Registry of local components (auto-generated)
│   ├── Themes/                  # Slice.css, Light.css, Dark.css (CSS variables)
│   ├── Styles/                  # Shared stylesheets
│   ├── routes.js                # Route table (path -> component)
│   └── sliceConfig.json         # Framework configuration
├── node_modules/                # Dependencies (framework + local CLI) — inside the project
├── package.json                 # Scripts, packageManager field, dependencies
└── pnpm-lock.yaml               # Lockfile of your package manager (or package-lock.json)
```

`slice init` creates the `my-app/` folder itself — you don't `mkdir` or `npm init`
beforehand. The `package.json` pins your package manager in the `packageManager`
field, lists `slicejs-web-framework` as a dependency and `slicejs-cli` as a
devDependency, and ships the scripts (`dev`, `start`, `get`, `browse`,
`component:create`...).

:::tip
The starter installs only the Visual components it uses. Add more on demand with
`slice get <Name>` (run `slice browse` to see the catalog).
:::

## File-by-file
| File | What it is | Do you edit it? |
| --- | --- | --- |
| `src/routes.js` | Maps each URL path to a component name. Start here. | Yes — first |
| `src/Components/AppComponents/AppShell/` | The shell: builds the navbar and the `MultiRoute` content area in `init()`. | Yes |
| `src/Components/AppComponents/HomeSection/` | The `/` page. Edit this to change the landing content. | Yes |
| `src/Components/AppComponents/AboutSection/` | The `/about` page. | Yes |
| `src/App/index.js` | Boots Slice. Add router guards here, then start the router. | Sometimes |
| `src/App/index.html` | SPA shell: the `#app` mount and the module script tag. | Rarely |
| `src/sliceConfig.json` | Managers (events, context, theme, logger, debugger), paths, server port. | Yes |
| `src/Components/components.js` | Name → category map used to load components. | No — auto-generated |
| `src/Components/Visual/*` | Installed registry components. | No — managed by `slice get` / `slice sync` |
| `src/Components/Service/*` | Built-in services you can use or extend. | Optional |
| `src/Themes/*` | Theme files defining CSS variables. | Optional |
| `api/` | The server. Zero-config; serves `/src` in dev and `/dist` in production. | No |

## How a page reaches the screen
1. `index.html` loads `/App/index.js`, which imports Slice and exposes the global `slice`.
2. The router reads `src/routes.js` and matches the current URL.
3. For `/` and `/about` the match is `AppShell`. The shell builds a persistent `Navbar` and a
   `MultiRoute` whose own routes pick `HomeSection` or `AboutSection` for the content area.
4. Navigating between `/` and `/about` keeps the shell mounted and only swaps the section.

## What is safe to delete
- `HomeSection` and `AboutSection` are examples — rename or replace them with your own sections.
- Keep `AppShell`, `routes.js`, `sliceConfig.json`, `components.js`, and `api/`.

## Next
Continue with **Your First Page** to add and edit a section, then **The Development Loop**.
