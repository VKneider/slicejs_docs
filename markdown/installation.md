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

## Install CLI (Local Recommended)
```bash
npm install --save-dev slicejs-cli
```

Local installation is recommended to keep your CLI version pinned per project.
Direct `slice` commands require the launcher binary to be available in your PATH
(commonly via a global install).

If the `slice` launcher command is unavailable in your shell, run CLI commands with:

```bash
npx slicejs-cli <command>
```

You can optionally install globally to expose the launcher command:

```bash
npm install -g slicejs-cli
```

## Initialize a Project

First-run example when `slice` is not yet available:

```bash
npx slicejs-cli init
```

If `slice` is available in your PATH:

```bash
slice init
```

This creates `src/` and `api/`, installs Visual components, and adds scripts and framework dependency to `package.json`.

## Start Dev Server
```bash
slice dev
```

Fallback when launcher is unavailable:

```bash
npx slicejs-cli dev
```

To bypass local delegation for one command:

```bash
SLICE_NO_LOCAL_DELEGATION=1 slice version
```

## Next Steps
- Explore CLI commands: /Documentation/CLI
- Configure `sliceConfig.json`: /Documentation/Configuration/sliceConfig
- Build your first component: /Documentation/The-build-method
