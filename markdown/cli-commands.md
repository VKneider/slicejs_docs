---
title: Slice CLI
route: /Documentation/CLI
navLabel: CLI
section: Getting Started
group: Tooling
order: 15
description: Command reference for the Slice.js CLI.
component: CommandsDocumentation
tags: [cli, tooling]
---

# Slice.js CLI

## Overview
The Slice.js CLI (`slice`) helps you initialize projects, manage components, run the dev server,
and maintain your toolchain. It is distributed as `slicejs-cli` and can be used via `npx` or a local
npm script.

## Installation
```bash title="Global (recommended)"
npm install -g slicejs-cli
```

```bash title="Local"
npm install slicejs-cli --save-dev
```

## Command Summary
| Command | Alias | Purpose |
| --- | --- | --- |
| `slice init` | - | Initialize project structure and install Visual components. |
| `slice dev` | `slice start` | Start development server. |
| `slice bundle` | - | Generate production bundles. |
| `slice bundle clean` | - | Remove generated bundles. |
| `slice bundle info` | - | Show bundle configuration summary. |
| `slice component create` | `slice comp new` | Create a local component. |
| `slice component list` | `slice comp ls` | List local components. |
| `slice component delete` | `slice comp remove` | Delete a local component. |
| `slice get` | `slice registry get` | Install components from registry. |
| `slice browse` | `slice registry list` | List official registry components. |
| `slice sync` | `slice registry sync` | Sync local Visual components from registry. |
| `slice list` | - | Shortcut for `slice component list`. |
| `slice version` | `slice -v` | Show CLI version. |
| `slice update` | `slice upgrade` | Update CLI/framework. |
| `slice doctor` | `slice diagnose` | Run project diagnostics. |
| `slice help` | `slice --help` | Show CLI help. |

## init
Initializes a new project with the framework structure and installs Visual components from the
official registry.

```bash title="Initialize a project"
slice init
```

What it does:
- Ensures latest `slicejs-web-framework` is installed.
- Creates `api/` and `src/` structure from framework base.
- Installs all Visual components from the registry.
- Configures `package.json` scripts (dev, start, get, browse, sync, etc.).

## dev / start
Starts the development server. Optionally generates bundles before startup and watches files.

```bash title="Start dev server"
slice dev
```

### Options
| Flag | Type | Default | Notes |
| --- | --- | --- | --- |
| `-p, --port` | `number` | `3000` | Uses config `server.port` if defined. Falls back to next port if busy. |
| `-w, --watch` | `boolean` | `false` | Restart server on file changes. |
| `-b, --bundled` | `boolean` | `false` | Generate bundles before start; runs in bundled mode. |

### Behavior
- Ensures `src/` and `api/` exist (otherwise suggests `slice init`).
- Falls back to port+1 if the requested port is busy.
- Uses `api/index.js` with `--development` or `--bundled`.

## bundle
Generates production bundles by analyzing dependencies and writing bundle files to `src/`.

```bash title="Generate bundles"
slice bundle
```

### Options
| Flag | Type | Default | Notes |
| --- | --- | --- | --- |
| `-a, --analyze` | `boolean` | `false` | Analyze only, do not generate bundles. |
| `-v, --verbose` | `boolean` | `false` | Output analysis metrics. |

### Subcommands
| Command | Purpose |
| --- | --- |
| `slice bundle clean` | Remove generated bundle files and config. |
| `slice bundle info` | Show bundle configuration summary. |

## component create
Creates a new local component. Prompts for name and category from `sliceConfig.json`.

```bash title="Create component"
slice component create
```

Rules:
- Name must start with a letter and be alphanumeric.
- Visual components get `.js`, `.html`, `.css`.
- Service components get `.js` only.

## component list
Lists all local components by scanning category paths from `sliceConfig.json` and rewrites
`src/Components/components.js`.

```bash title="List components"
slice component list
```

## component delete
Deletes a local component after interactive selection and confirmation.

```bash title="Delete component"
slice component delete
```

## get / registry get
Downloads components from the official registry (Visual or Service) into your project.

```bash title="Get components"
slice get Button Card Input
```

### Options
| Flag | Type | Default | Notes |
| --- | --- | --- | --- |
| `-f, --force` | `boolean` | `false` | Overwrite existing components. |
| `-s, --service` | `boolean` | `false` | Install as Service instead of Visual. |

Notes:
- If no names are provided, the CLI opens an interactive selector.
- Registry is fetched from the Slice docs repo.

## browse / registry list
Lists available registry components.

```bash title="Browse registry"
slice browse
```

## sync / registry sync
Updates local Visual components to latest registry versions. Service components are detected but
not updated automatically.

```bash title="Sync components"
slice sync
```

### Options
| Flag | Type | Default | Notes |
| --- | --- | --- | --- |
| `-f, --force` | `boolean` | `false` | Skip confirmation and force update. |

## update
Checks for CLI and framework updates and optionally installs them.

```bash title="Update packages"
slice update
```

### Options
| Flag | Type | Default | Notes |
| --- | --- | --- | --- |
| `-y, --yes` | `boolean` | `false` | Auto-confirm updates. |
| `--cli` | `boolean` | `false` | Update CLI only. |
| `-f, --framework` | `boolean` | `false` | Update framework only. |

## doctor
Runs project diagnostics (structure, config, dependencies, components, port availability).

```bash title="Run diagnostics"
slice doctor
```

## version
Shows CLI version info and checks for updates.

```bash title="Version"
slice version
```

## help
Shows CLI help output.

```bash title="Help"
slice --help
```

## Best Practices
:::tip
Use the global CLI to run commands from any project.
:::

:::tip
Run `slice dev` in one terminal and use another for component commands.
:::

## Gotchas
:::warning
`slice sync` only updates Visual components. Use `slice get <Service> --service --force` for Service updates.
:::

:::warning
`slice component list` rewrites `src/Components/components.js` based on detected folders.
:::
