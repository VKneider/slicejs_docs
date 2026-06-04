---
title: Installation
route: /Documentation/Installation
navLabel: Installation
section: Introduction
group: Overview
order: 3
description: Install the CLI, initialize a project, and start the dev server.
component: Installation
tags: [installation, cli, setup]
generate: false
---

# Installation

## Requirements
- Node.js 20+
- npm or pnpm

## Initialize a Project

`slice init` creates the project folder for you — no `mkdir`, no `npm init` needed.
Everything (package.json, node_modules, lockfile, `src/`, `api/`) lives **inside**
the new folder.

With npm:

```bash
npx slicejs-cli init
```

With pnpm:

```bash
pnpm dlx slicejs-cli init
```

If the `slice` launcher is already available in your PATH:

```bash
slice init
```

The prompt asks for a project name (and for a package manager when more than one
is available — pass `--pm npm` or `--pm pnpm` to skip the question). Then init:

- Creates the project folder and its `package.json` (with the chosen package
  manager pinned in the `packageManager` field).
- Installs `slicejs-web-framework` as a dependency and `slicejs-cli` as a
  devDependency — both inside the project folder.
- Creates the `src/` and `api/` structure and installs the starter Visual and
  Service components from the registry.
- Configures package scripts (`dev`, `build`, `start`, `get`, `browse`, `sync`, ...).

Non-interactive form:

```bash
npx slicejs-cli init -y my-app --pm pnpm
```

:::note pnpm
init is pnpm-friendly: it never pins a just-published version, so hardened pnpm
setups (e.g. `minimumReleaseAge` quarantine) resolve the newest version allowed
by your policy. With `ignore-scripts` enabled, no postinstall step is required —
init configures the scripts itself.
:::

## Start Dev Server
```bash
cd my-app
npm run dev     # or: pnpm run dev
```

The `slice` commands also work directly inside the project (`slice dev`), since
init installs the CLI locally and the launcher delegates to it. Fallback when no
launcher is available:

```bash
npx slicejs-cli dev
```

## Install the Launcher (Optional)

You can install the CLI globally to expose the `slice` command everywhere:

```bash
npm install -g slicejs-cli      # or: pnpm add -g slicejs-cli
```

The launcher always delegates to the project-local `node_modules/slicejs-cli`
when one exists, so each project keeps its pinned CLI version.

To bypass local delegation for one command:

```bash
SLICE_NO_LOCAL_DELEGATION=1 slice version
```

## Next Steps
- Explore CLI commands: /Documentation/CLI
- Configure `sliceConfig.json`: /Documentation/Configuration/sliceConfig
- Build your first component: /Documentation/The-build-method
