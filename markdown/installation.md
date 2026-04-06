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

If the `slice` launcher command is unavailable in your shell, run CLI commands with:

```bash
npx slicejs-cli <command>
```

You can optionally install globally to expose the launcher command:

```bash
npm install -g slicejs-cli
```

## Initialize a Project
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

## Next Steps
- Explore CLI commands: /Documentation/Commands
- Configure `sliceConfig.json`: /Documentation/Configuration/sliceConfig
- Build your first component: /Documentation/The-build-method
