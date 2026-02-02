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

## Install CLI (Global)
```bash
npm install -g slicejs-cli
```

## Initialize a Project
```bash
slice init
```

This creates `src/` and `api/`, installs visual components, and adds scripts.

## Start Dev Server
```bash
slice dev
```

## Next Steps
- Explore CLI commands: /Documentation/Commands
- Configure `sliceConfig.json`: /Documentation/Configuration/sliceConfig
- Build your first component: /Documentation/The-build-method
