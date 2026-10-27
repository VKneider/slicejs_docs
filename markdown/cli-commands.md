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
and maintain your toolchain. For project workflows, prefer `package.json` scripts (`pnpm run ...`
or `npm run ...`) so execution is pinned to your local dependency tree.

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
| `slice docs` | - | Search and retrieve framework or Slice.js Components Markdown. |
| `slice list` | - | Shortcut for `slice component list`. |
| `slice version` | `slice v` | Show CLI version. |
| `slice doctor` | `slice diagnose` | Run project diagnostics. |
| `slice types generate` | - | Generate TypeScript typings for `slice.build`. |
| `slice help` | `slice --help` | Show CLI help. |

## `slice build` options
| Flag | Purpose |
| --- | --- |
| `--strict-external` | Fail the build if a `node_modules` dependency cannot be resolved. See [External Dependencies](/Documentation/External-Dependencies). |
| `--no-validate` | Skip the component prop validation described below. |
| `--no-minify` | Disable minification (on by default). |
| `--no-obfuscate` | Disable obfuscation (on by default). |
| `--sourcemap` | Emit a `.map` next to each minified bundle (off by default so source isn't shipped unless asked). |
| `--hash-filenames` | Add a content hash to bundle filenames (`slice-bundle.home.a1b2c3d4.js`) for immutable CDN caching. Off by default (stable names). |
| `--compress` | Precompress `dist/` assets to `.gz` and max-quality `.br` (brotli). Off by default (brotli max is slow — use it for release builds). |
| `--preview` | Start a preview server after building. |

### Source maps, hashed filenames & precompression
- **`--sourcemap`** maps each minified bundle back to its readable pre-minified form, so production stack traces are debuggable. Off by default (source isn't shipped unless you opt in).
- **`--hash-filenames`** names bundles by content hash for `Cache-Control: immutable` CDN caching. The runtime loads every bundle by the filename recorded in the bundle config, so hashing "just works" with no other change.
- **`--compress`** writes a `.gz` and a brotli `.br` beside every text asset in `dist/`. `slice start` serves the precompressed variant per the client's `Accept-Encoding` (brotli preferred), instead of compressing on every request — a ~900&nbsp;KB bundle ships as ~100&nbsp;KB over the wire.

### Reproducible builds
Set `SOURCE_DATE_EPOCH` (integer seconds since the Unix epoch) so the timestamps embedded in the bundle metadata/config are deterministic and a clean rebuild is byte-identical:

```bash title="Reproducible build"
SOURCE_DATE_EPOCH=$(git log -1 --format=%ct) slice build
```

Unset, the current time is used.

### Validation on build
Before bundling, `slice build` runs one validation pass over the project and **blocks** on anything that would ship a broken bundle:

- `sliceConfig` combinations that build but misbehave (for example `context.enabled` with `events.enabled` off: ContextManager reactivity runs through EventManager, which is not bundled).
- Component files that cannot be bundled: a syntax error, no `default export` while registered as a component, or an unresolved relative import.
- A component registered in `components.js` whose file does not exist. The runtime resolves `<Category>/<Name>/<Name>.js`, so the name can never load.
- `src/routes.js` with a syntax error or an unresolved relative import. That file is served as-is and loaded by the browser (it is not bundled), so a broken import stops the router from loading even though the bundle builds.
- Static props with an unknown `type`, a `schema` on a non-`object` prop, an `items` on a non-`array` prop, or `allowedValues` that don't match the declared `type`.

Advisories are printed but do not block: a `type: "any"`, a `required` prop without a default, a `slice.build()` of a name that is not registered, a component folder without its `<Name>.js`, or a route whose `component` is not in `components.js` (it throws only when that route is visited).

`slice doctor` reports the exact same classification in its **Configuration** and **Components & Routes** rows, because both commands run the same pass and the same helper decides what is blocking. Skip the component checks with `--no-validate` (not recommended); the `sliceConfig` and `routes.js` rules always run. See [Static Props](/Documentation/Static-Props) for the prop schema.

Doctor does not compile and does not boot the app: it cannot prove that esbuild resolves the whole graph, that `dist/` is complete, or that the server starts. Use it as a fast first gate, then `slice build`, then run the app.

### Exit codes
`slice build` exits 1 on a blocked build. `slice doctor` exits 1 when any row is a failure (it exits 0 when there are only warnings), so it can be used as a pre-deploy check: `slice doctor && slice build`.

## Recommended package scripts

Use these scripts inside initialized projects:

```bash
pnpm run dev
pnpm run build
pnpm run start
pnpm run browse
pnpm run get -- Button
pnpm run sync
pnpm run component:create -- UserCard --category AppComponents
pnpm run component:list
pnpm run component:delete -- UserCard --category AppComponents --yes
pnpm run slice:types
```

Equivalent npm forms are the same with `npm run ...`.

If you prefer direct execution through local devDependencies, use `pnpm exec`:

```bash
pnpm exec slice dev
pnpm exec slice get Button
```

If the CLI is installed globally, you can run `slice ...` directly from PATH.

## docs

`slice docs` provides a read-only documentation interface for both documentation catalogs:

- `framework` — framework, CLI, lifecycle, routing, and architecture documentation from `slicejs_docs`.
- `components` — Visual and Service APIs and examples from Slice.js Components.

```bash title="Search either catalog"
slice docs search "service lifecycle" --source framework
slice docs search "modal confirmation" --source components
slice docs search "pagination" --source all
```

```bash title="Retrieve authored Markdown"
slice docs get getting-started/services --source framework --stdout
slice docs get Button --source components --stdout
```

Use `--json` for scripts and agents:

```bash
slice --no-version-check docs search "table pagination" --source components --json
slice --no-version-check docs get Button --source components --json
```

`slice docs get` reads documentation only. It does not install component source files; use
`slice get <Name>` when the component itself should be added to the project.

### pnpm build-approval note
With pnpm v10+, lifecycle scripts are gated by `allowBuilds` in `pnpm-workspace.yaml`.
`slice init --pm pnpm` automatically configures:

```yaml
allowBuilds:
  slicejs-cli: true
```

For existing projects that do not have that setting yet, use:

```bash
pnpm approve-builds slicejs-cli
```

Use direct CLI commands (`slice ...` or `npx slicejs-cli ...`) mainly for bootstrapping (`init`) or
when scripts are not yet configured.

## init
Creates a new project folder and initializes it with the framework structure and the starter
components from the official registry. Everything — `package.json`, `node_modules`, lockfile,
`src/`, `api/` — is created **inside** the new folder.

```bash title="Initialize a project"
npx slicejs-cli init
```

```bash title="Non-interactive"
npx slicejs-cli init my-app -y --pm pnpm
```

### Options
| Flag | Type | Default | Notes |
| --- | --- | --- | --- |
| `[name]` | `string` | `my-slice-app` | Project name (positional). |
| `-y, --yes` | `boolean` | `false` | Skip interactive prompts. |
| `--pm <pm>` | `pnpm \| npm` | auto-detected | Package manager to use. When omitted, init detects it (user agent → available binaries) and only asks when ambiguous. |

What it does:
- Creates the project folder and a `package.json` inside it (before any install, so
  dependencies always anchor to the project folder).
- Pins the chosen package manager in the `packageManager` field; later commands
  (`slice doctor`) detects it from there or from the lockfile.
- Installs `slicejs-web-framework` (dependency) and `slicejs-cli` (devDependency)
  with the chosen package manager. Versions are not hard-pinned, so pnpm
  release-age policies (`minimumReleaseAge`) resolve cleanly.
- Creates `api/` and `src/` structure from the framework base.
- Installs the starter Visual and Service components from the registry.
- Configures package scripts (dev, build, start, get, browse, sync, etc.).

## dev
Starts the development server and serves from `/src`.

```bash title="Start dev server"
npm run dev
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
- Supported: relative imports, bare npm packages (`import 'pkg'`), and absolute imports whose file exists under `src/public/`.
- `slice dev` and `slice build` keep the same rule for preserved absolute (`public/`) imports.
- See [External Dependencies](/Documentation/External-Dependencies) for npm packages.

## start
Starts the production server and serves from `/dist`.

```bash title="Start production server"
npm run start
```

### Options
| Flag | Type | Default | Notes |
| --- | --- | --- | --- |
| `-p, --port` | `number` | `3000` | Defaults to 3000 unless `-p` is passed. Falls back to port+1 if the requested port is busy. |

:::tip
Production serves static assets from `src/public/` (copied into `dist/`) at the root URL — e.g. `/Themes`, `/Styles`, `/images`.
:::

## build
Builds production output by analyzing dependencies, generating bundles, and writing files to `/dist`.

:::tip
Production builds include **Structural framework components** in bundles to avoid runtime fetches.
These entries are stored as `Framework/Structural/<ComponentName>` in bundle config.
:::

```bash title="Build production output"
npm run build
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
- Supported: relative imports, bare npm packages (`import 'pkg'`), and absolute imports whose file exists under `src/public/`.
- `slice dev` and `slice build` keep the same rule for preserved absolute (`public/`) imports.
- See [External Dependencies](/Documentation/External-Dependencies) for npm packages.

## component create
Creates a new local component and registers it in `components.js`. Runs interactively, or
non-interactively when you pass the name and category on the command line.

```bash title="Interactive (prompts for name + category)"
npm run component:create
```

```bash title="Non-interactive (pass name + --category)"
npm run component:create -- UserCard --category AppComponents
npm run component:create -- AuthService -c Service
```

```bash title="Through the npm script (note the -- separator)"
npm run component:create -- UserCard --category Visual
```

| Argument / option | Notes |
| --- | --- |
| `[name]` | Component name (positional). If omitted, you are prompted. |
| `-c, --category <category>` | A category from `paths.components` in `sliceConfig.json` (e.g. `Visual`, `Service`, `AppComponents`). If omitted, you are prompted. |

Only the missing pieces are prompted, so `npm run component:create -- UserCard` asks just for the
category. Passing both runs with no prompts — useful for scripts and AI agents.

Rules:
- Name must start with a letter and be alphanumeric.
- Visual components get `.js`, `.html`, `.css`; Service components get `.js` only.
- An invalid `--category` fails with a message listing the valid categories.

## component list
Lists all local components by scanning category paths from `sliceConfig.json` and rewrites
`src/Components/components.js`.

```bash title="List components"
npm run component:list
```

## component delete
Deletes a local component and updates `components.js`. Interactive by default; pass the name,
`--category`, and `--yes` to delete non-interactively.

```bash title="Interactive (select + confirm)"
npm run component:delete
```

```bash title="Non-interactive"
npm run component:delete -- UserCard --category AppComponents --yes
```

| Argument / option | Notes |
| --- | --- |
| `[name]` | Component to delete. If omitted, you pick from a list. |
| `-c, --category <category>` | Category to look in. If omitted, you are prompted. |
| `-y, --yes` | Skip the confirmation prompt (required for a fully non-interactive run). |

## get / registry get
Downloads components from the official registry (Visual or Service) into your project.

```bash title="Get components"
npm run get -- Button Card Input
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
npm run browse
```

## sync / registry sync
Updates local Visual components to latest registry versions. Service components are detected but
not updated automatically.

```bash title="Sync components"
npm run sync
```

### Options
| Flag | Type | Default | Notes |
| --- | --- | --- | --- |
| `-f, --force` | `boolean` | `false` | Skip confirmation and force update. |

## doctor
Runs project diagnostics (structure, config, SEO, dependencies, components, external imports, port
availability) and exits 1 when any row is a failure, so it works as a gate. Rows marked as warnings are
advisory and exit 0.

The **Configuration** and **Components** rows use the same rules as `slice build`: if the build would
be blocked, doctor fails too, with the same message.

```bash title="Run diagnostics"
npm run slice:doctor
```

## seo

### seo sitemap
Writes `src/public/sitemap.xml` from `seo.json`, and `robots.txt` when the manifest has a `robotsTxt`
block. Only indexable routes are listed; a `${param}` route cannot be enumerated and never appears.

```bash title="Generate the sitemap"
npm exec slice seo sitemap
```

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `--dry-run` | `boolean` | `false` | Reports what would change, writes nothing. |
| `--yes` | `boolean` | `false` | Overwrites an existing file without asking. |

An existing file that would change asks first (default answer: no). A non-interactive run (CI) fails
with a message naming `--yes` instead of waiting for input, and a file whose content is unchanged is
never rewritten.

### seo images
Renders the 1200×630 card each indexable route advertises, from the real page. It boots the app's
`api/index.js` in development on a free port unless you pass `--base-url`.

```bash title="Generate the cards"
npm exec slice seo images
npm exec slice seo images --only=/pricing
npm exec slice seo images --check
```

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `--only <routes>` | `string` | every indexable route | Comma-separated paths. |
| `--base-url <url>` | `string` | boots the app | Use a running server instead. |
| `--selector <css>` | `string` | the viewport | The element to capture (a component demo, a card…). |
| `--out <dir>` | `string` | `src/public/og` | Where the images and the manifest go. |
| `--check` | `boolean` | `false` | Validate dimensions and weight, no browser. |
| `--dry-run` | `boolean` | `false` | Capture and compose, write nothing. |
| `--runner <file>` | `string` | — | Module exporting `prepare(page, route)` / `capture`, for pages behind auth. |
| `--storage-state <file>` | `string` | — | Playwright storage state for a logged-in capture. |

It needs Playwright in the project (`npm i -D playwright && npx playwright install chromium`). The
command writes `<outDir>/manifest.json`, which you pass as `seo.images` so the server merges the cards;
`seo.json` itself is never edited (it is generated). Defaults for the card — `theme`, `selector`,
`template`, `outDir`, `budgetKB` — live in the `images` block of `seo.json`.

### seo check
Validates `seo.json`, cross-checks it against `routes.js`, and compares the committed sitemap with
what the manifest would produce. Exits non-zero on any problem, so it belongs in CI.

```bash title="Validate before deploying"
npm exec slice seo check
```

See [SEO and Share Cards](/Documentation/Architecture/SEO) for the manifest fields and the origin
rules.

## version
Shows CLI version info and checks for updates.

```bash title="Version"
npm run slice:version
```

## help
Shows CLI help output.

```bash title="Help"
npm run slice:help
```

## types generate
Generates a TypeScript declaration file from your components' `static props`, so editors can
autocomplete and type-check `slice.build('Name', { ... })` calls.

```bash title="Generate typings"
npm run slice:types
```

```bash title="Custom output path"
npm run slice:types -- --output types/slice-build.d.ts
```

| Option | Default | Notes |
| --- | --- | --- |
| `-o, --output <path>` | `src/slice-build.generated.d.ts` | Where to write the generated `.d.ts`. |

Re-run it whenever you add or change component props. The output is generated — don't edit it by
hand, and re-generate (or wire it into your build) to keep autocomplete in sync.

## Best Practices
:::tip
Prefer package scripts (`pnpm run ...` / `npm run ...`) for project commands.
:::

:::tip
Use `npx slicejs-cli <command>` for bootstrapping and recovery (for example before scripts exist).
:::

:::tip
Run `npm run dev` in one terminal and use another for component commands.
:::

## Gotchas
:::warning
`npm run sync` only updates Visual components. Use `npm run get -- <Service> --service --force` for Service updates.
:::

:::warning
`npm run component:list` rewrites `src/Components/components.js` based on detected folders.
:::
