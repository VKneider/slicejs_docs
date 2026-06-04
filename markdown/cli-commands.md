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
```bash title="Local (recommended)"
npm install slicejs-cli --save-dev
```

```bash title="Global (optional launcher install)"
npm install -g slicejs-cli
```

When the `slice` launcher command is available (commonly after a global install
that places `slice` in your PATH), it delegates to the nearest
project-local `node_modules/slicejs-cli` from your current directory (including
subdirectories). This keeps command execution aligned with the version pinned
in each project.

If the launcher command is unavailable, use:

```bash
npx slicejs-cli <command>
```

You can bypass delegation for a specific invocation:

```bash
SLICE_NO_LOCAL_DELEGATION=1 slice version
```

## Command Summary
| Command | Alias | Purpose |
| --- | --- | --- |
| `slice init` | - | Initialize project structure and install Visual components. |
| `slice dev` | - | Start development server. |
| `slice build` | - | Build production output (bundles + dist). |
| `slice build clean` | - | Remove generated bundles. |
| `slice build info` | - | Show bundle configuration summary. |
| `slice start` | - | Start production server. |
| `slice component create` | `slice comp new` | Create a local component. |
| `slice component list` | `slice comp ls` | List local components. |
| `slice component delete` | `slice comp remove` | Delete a local component. |
| `slice get` | `slice registry get` | Install components from registry. |
| `slice browse` | `slice registry list` | List official registry components. |
| `slice sync` | `slice registry sync` | Sync local Visual components from registry. |
| `slice list` | - | Shortcut for `slice component list`. |
| `slice version` | `slice v` | Show CLI version. |
| `slice update` | `slice upgrade` | Update CLI/framework. |
| `slice doctor` | `slice diagnose` | Run project diagnostics. |
| `slice types generate` | - | Generate TypeScript typings for `slice.build`. |
| `slice help` | `slice --help` | Show CLI help. |

## init
Creates a new project folder and initializes it with the framework structure and the starter
components from the official registry. Everything — `package.json`, `node_modules`, lockfile,
`src/`, `api/` — is created **inside** the new folder.

```bash title="Initialize a project"
slice init
```

```bash title="Non-interactive"
slice init -y my-app --pm pnpm
```

### Options
| Flag | Type | Default | Notes |
| --- | --- | --- | --- |
| `-y, --yes [name]` | `string` | `my-slice-app` | Skip prompts; optional project name. |
| `--pm <pm>` | `npm \| pnpm \| yarn` | auto-detected | Package manager to use. When omitted, init detects it (user agent → available binaries) and only asks when ambiguous. |

What it does:
- Creates the project folder and a `package.json` inside it (before any install, so
  dependencies always anchor to the project folder).
- Pins the chosen package manager in the `packageManager` field; later commands
  (`slice update`, `slice doctor`) detect it from there or from the lockfile.
- Installs `slicejs-web-framework` (dependency) and `slicejs-cli` (devDependency)
  with the chosen package manager. Versions are not hard-pinned, so pnpm
  release-age policies (`minimumReleaseAge`) resolve cleanly.
- Creates `api/` and `src/` structure from the framework base.
- Installs the starter Visual and Service components from the registry.
- Configures package scripts (dev, build, start, get, browse, sync, etc.).

## dev
Starts the development server and serves from `/src`.

```bash title="Start dev server"
slice dev
```

### Options
| Flag | Type | Default | Notes |
| --- | --- | --- | --- |
| `-p, --port` | `number` | `3000` | Defaults to 3000 unless `-p` is passed. Falls back to port+1 if the requested port is busy. |
| `--no-hmr` | `boolean` | `false` | Disable hot module reload (HMR is enabled by default). |

### Behavior
- Ensures `src/` and `api/` exist (otherwise suggests `slice init`).
- Falls back to port+1 if the requested port is busy.
- Uses `api/index.js` with `--development`.

### Import support scope
- Supported: relative imports and absolute imports that resolve into folders listed in `publicFolders`.
- Unsupported: bare package imports such as `import 'pkg'`.
- `slice dev` and `slice build` keep the same rule for preserved absolute imports that target configured public folders.

## start
Starts the production server and serves from `/dist`.

```bash title="Start production server"
slice start
```

### Options
| Flag | Type | Default | Notes |
| --- | --- | --- | --- |
| `-p, --port` | `number` | `3000` | Defaults to 3000 unless `-p` is passed. Falls back to port+1 if the requested port is busy. |

:::tip
Production uses `publicFolders` from `sliceConfig.json` to expose public asset folders
like `/Themes`, `/Styles`, and `/assets`.
:::

## build
Builds production output by analyzing dependencies, generating bundles, and writing files to `/dist`.

:::tip
Production builds include **Structural framework components** in bundles to avoid runtime fetches.
These entries are stored as `Framework/Structural/<ComponentName>` in bundle config.
:::

```bash title="Build production output"
slice build
```

### Options
| Flag | Type | Default | Notes |
| --- | --- | --- | --- |
| `-a, --analyze` | `boolean` | `false` | Analyze only, do not generate bundles. |
| `-v, --verbose` | `boolean` | `false` | Output analysis metrics. |
| `--no-minify` | `boolean` | `false` | Disable minification (enabled by default). |
| `--no-obfuscate` | `boolean` | `false` | Disable obfuscation (enabled by default). |
| `--preview` | `boolean` | `false` | Start preview server after build. |
| `--serve` | `boolean` | `false` | Start preview server without building. |
| `--skip-clean` | `boolean` | `false` | Skip cleaning dist before build. |

### Subcommands
| Command | Purpose |
| --- | --- |
| `slice build clean` | Remove generated bundle files and config. |
| `slice build info` | Show bundle configuration summary. |

### Import support scope
- Supported: relative imports and absolute imports that resolve into folders listed in `publicFolders`.
- Unsupported: bare package imports such as `import 'pkg'`.
- Production preserves supported absolute public-folder imports with the same behavior as development.

## component create
Creates a new local component and registers it in `components.js`. Runs interactively, or
non-interactively when you pass the name and category on the command line.

```bash title="Interactive (prompts for name + category)"
slice component create
```

```bash title="Non-interactive (pass name + --category)"
slice component create UserCard --category AppComponents
slice component create AuthService -c Service
```

```bash title="Through the npm script (note the -- separator)"
npm run component:create -- UserCard --category Visual
```

| Argument / option | Notes |
| --- | --- |
| `[name]` | Component name (positional). If omitted, you are prompted. |
| `-c, --category <category>` | A category from `paths.components` in `sliceConfig.json` (e.g. `Visual`, `Service`, `AppComponents`). If omitted, you are prompted. |

Only the missing pieces are prompted, so `slice component create UserCard` asks just for the
category. Passing both runs with no prompts — useful for scripts and AI agents.

Rules:
- Name must start with a letter and be alphanumeric.
- Visual components get `.js`, `.html`, `.css`; Service components get `.js` only.
- An invalid `--category` fails with a message listing the valid categories.

## component list
Lists all local components by scanning category paths from `sliceConfig.json` and rewrites
`src/Components/components.js`.

```bash title="List components"
slice component list
```

## component delete
Deletes a local component and updates `components.js`. Interactive by default; pass the name,
`--category`, and `--yes` to delete non-interactively.

```bash title="Interactive (select + confirm)"
slice component delete
```

```bash title="Non-interactive"
slice component delete UserCard --category AppComponents --yes
```

| Argument / option | Notes |
| --- | --- |
| `[name]` | Component to delete. If omitted, you pick from a list. |
| `-c, --category <category>` | Category to look in. If omitted, you are prompted. |
| `-y, --yes` | Skip the confirmation prompt (required for a fully non-interactive run). |

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
| `-y, --yes` | `boolean` | `false` | Auto-confirm package updates. Does **not** touch `api/index.js`. |
| `--cli` | `boolean` | `false` | Update CLI only. |
| `-f, --framework` | `boolean` | `false` | Update framework only. |
| `--update-api` | `boolean` | `false` | Overwrite your project `api/index.js` with the framework version (a `.bak` backup is created). Never done by default — the file may carry local changes. |

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

## types generate
Generates a TypeScript declaration file from your components' `static props`, so editors can
autocomplete and type-check `slice.build('Name', { ... })` calls.

```bash title="Generate typings"
slice types generate
```

```bash title="Custom output path"
slice types generate --output types/slice-build.d.ts
```

| Option | Default | Notes |
| --- | --- | --- |
| `-o, --output <path>` | `src/slice-build.generated.d.ts` | Where to write the generated `.d.ts`. |

Re-run it whenever you add or change component props. The output is generated — don't edit it by
hand, and re-generate (or wire it into your build) to keep autocomplete in sync.

## Best Practices
:::tip
Install `slicejs-cli` locally per project and use the `slice` launcher so commands resolve to the nearest project-local runtime.
:::

:::tip
If `slice` is not available in your shell, use `npx slicejs-cli <command>` as a fallback.
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
