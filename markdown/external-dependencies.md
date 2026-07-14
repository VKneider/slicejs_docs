---
title: External Dependencies
route: /Documentation/External-Dependencies
navLabel: External Dependencies
section: Getting Started
group: Tooling
order: 25
description: Use npm packages in Slice.js — bare imports resolved from node_modules, or files served from src/public/.
component: ExternalDependenciesDocumentation
tags: [dependencies, external, public, bundling, node_modules]
---

# External Dependencies

## Overview
Slice.js supports two ways to use third-party code, so you can pick the one that fits the library you have.

| Situation | Reach for |
|-----------|-----------|
| An npm package installed in `node_modules` (`dayjs`, `gsap`, `date-fns`, …) | **Bare imports** |
| A vendored script/file you drop into your project | **The `public/` folder** |

Bare imports resolve packages from `node_modules` — the same mental model as a React or Vite project. The `public/` folder serves a file you place under `src/public/`, with no resolution step. Both are covered below.

## Bare Imports from `node_modules`
Install a package and import it by name — no configuration required:

```bash title="Install"
pnpm add gsap
```

```javascript title="HeroBanner.js"
import gsap from 'gsap';

export default class HeroBanner extends HTMLElement {
  init() {
    gsap.from(this.querySelector('.title'), { y: 24, opacity: 0, duration: 0.4 });
  }
}
```

Slice resolves the package with esbuild — the same resolver in development and in production — so CommonJS and ESM packages behave identically across `slice dev`, `slice build`, and `slice start`.

### How it works
- **`slice dev`**: no app bundling. Bare specifiers in your served modules are rewritten to a virtual `/@slice-modules/<package>` URL, and each package is pre-bundled on demand and cached (on disk under `node_modules/.slice-deps`, keyed by version). Your components still load as native ES modules.
- **`slice build` / `slice start`**: each package is bundled once and registered in the production bundle. A package used by two or more route bundles is extracted into a single shared `slice-bundle.vendor-shared.js` (no duplication).

:::tip
Because dev and build share the same esbuild resolver, a package that works in `slice dev` works the same way after `slice build`. There is no separate dev-only shim to keep in sync.
:::

### Module formats and assets
Resolution and interop are handled by esbuild, so the following all work:

- **CommonJS, ESM and UMD** packages, including modern `exports` maps (with `browser`/`import` conditions), the legacy `browser` field, scoped packages (`@scope/pkg`) and subpath specifiers (`pkg/feature`).
- **Transitive dependencies** — a package's own dependencies are bundled in automatically.
- **Static and dynamic imports** — both `import gsap from 'gsap'` and `const g = await import('gsap')` resolve to the same bundled package.
- **Re-exports** — a package (or a relative helper of yours) can `export * from '…'` / `export { x } from '…'`; the bundler wires them.
- **Assets a package imports**: CSS is bundled and injected as a `<style>` at runtime (once per stylesheet); WASM, images and fonts are inlined as data URLs; text assets (`.glsl/.vert/.frag/.txt`) are inlined as strings. Everything stays self-contained — no sidecar files.
- **Browser globals**: static `process.env.NODE_ENV` and `global` are substituted at build time, and a small runtime shim provides `process`/`global` for dynamic references — so packages that touch them work without a polyfill. This is **not** a full Node polyfill (see Gotchas).

### Strict builds (CI)
By default an unresolved package warns, and the component that imported it fails at runtime. In CI, prefer a hard failure so a missing install never ships:

```bash title="Fail the build on any unresolved dependency"
slice build --strict-external
```

`slice doctor` also lists bare imports that are missing from `node_modules`, so you can catch a forgotten install before building.

## The `public/` folder
Use this for files you vendor directly into your project (a pre-built UMD/ESM script, a polyfill, an image, a font — anything you don't install via npm).

Everything under **`src/public/`** is served at the **root URL** and copied verbatim into the build — no configuration required. So `src/public/libs/my-widget.min.js` is available at `/libs/my-widget.min.js`:

```text
src/
  public/
    libs/
      my-widget.min.js
    images/
      logo.png
```

```javascript title="Component usage"
import '/libs/my-widget.min.js';
```

Your `Themes`, `Styles` and `images` folders live under `public/` too (`src/public/Themes`, …); their URLs (`/Themes`, `/Styles`, `/images`) are unchanged.

- `slice dev`: `src/public/` is served at `/`.
- `slice build`: `src/public/` is copied into `dist/` and served at `/`.
- Absolute imports (`/libs/…`) are preserved when the file exists under `public/`; otherwise the CLI warns and strips them.

## Relative Imports
Relative imports (`./`, `../`) for your own modules always work and need no configuration:

```javascript title="UserCard.js"
import { formatName } from './helpers.js';
```

A relative helper can itself import and **re-export** (`export * from './x.js'`, `export { y } from './x.js'`) — the bundler inlines the whole helper graph.

**JSON** imports work too: the default import is the whole document and named imports map to top-level keys.

```javascript title="Importing JSON"
import config from './config.json';        // whole document
import { version } from './package-info.json'; // a top-level key
```

## Gotchas

:::warning
Packages must be **browser-compatible**. A package that imports Node built-ins (`fs`, `os`, `util`, real `stream`, or needs `Buffer`, …) cannot run in the browser, so the build reports a clear resolution error instead of shipping a broken bundle. Slice provides only a minimal `process`/`global` shim — **not** a full Node polyfill layer. Use a browser build of the library, or drop a vendored file into `src/public/`.
:::

:::warning
If a bare import isn't resolved, Slice CLI warns and strips it. Check that the package is installed in `node_modules` (run your package manager's install). Use `slice doctor` to list bare imports that are missing.
:::

:::warning
`public/` imports must start with `/` (absolute path) and the file must exist under `src/public/...` before building.
:::

## From a vendored file to an npm package
If you vendored a library only because bare imports weren't available, install it from npm and switch the import:

```javascript title="Before — vendored file"
import '/libs/dayjs/dayjs.min.js';
```

```javascript title="After — npm package"
import dayjs from 'dayjs';
```

Then remove the vendored copy from `src/public/`.
