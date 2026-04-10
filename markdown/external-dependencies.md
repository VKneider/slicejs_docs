---
title: External Dependencies
route: /Documentation/External-Dependencies
navLabel: External Dependencies
section: Getting Started
group: Tooling
order: 25
description: Temporary official pattern for using external scripts and libraries in Slice.js.
component: ExternalDependenciesDocumentation
tags: [dependencies, external, publicFolders, bundling]
---

# External Dependencies

## Overview
Slice.js currently supports a temporary official pattern for external scripts and libraries using public folders.

This is the recommended approach until native bare-package imports are available.

## What Is Supported Today
- Relative imports (`./`, `../`) for internal project modules.
- Absolute imports that point to folders listed in `sliceConfig.json` `publicFolders`.

Example:

```javascript title="Valid absolute import"
import '/libs/dayjs/dayjs.min.js';
```

## What Is Not Supported Yet
- Bare package imports such as:

```javascript title="Not supported yet"
import dayjs from 'dayjs';
```

- Automatic browser resolution from `node_modules`.
- CommonJS package interop for browser runtime.

## Configure `publicFolders`
Add one or more public folders in `sliceConfig.json`.

```json title="sliceConfig.json"
{
  "publicFolders": ["/Themes", "/Styles", "/assets", "/libs"]
}
```

## Recommended Project Layout
Place third-party files in one of your configured public folders.

```text
src/
  libs/
    dayjs/
      dayjs.min.js
```

Then import them with an absolute URL path:

```javascript title="Component usage"
import '/libs/dayjs/dayjs.min.js';
```

## Dev and Production Behavior
- `slice dev`: absolute public-folder imports are resolved and preserved.
- `slice build`: absolute public-folder imports are preserved with the same rule.
- `slice start`: built output serves public files from `dist`.

## Build Warnings
Slice CLI warns when:
- You use bare imports (`import 'pkg'`).
- You use absolute imports outside configured `publicFolders`.

These warnings help keep behavior predictable between development and production.

## Troubleshooting
:::warning
If an external script works in dev but fails in production, verify that:
- the import starts with `/` (absolute path),
- the folder is included in `publicFolders`,
- the file exists under `src/<public-folder>/...` before building.
:::

## Migration Path
This approach is temporary by design.

When native package imports are released, you will be able to migrate from:

```javascript
import '/libs/some-lib/index.js';
```

to:

```javascript
import 'some-lib';
```
