---
title: sliceConfig.json
route: /Documentation/Configuration/sliceConfig
navLabel: sliceConfig.json
section: Getting Started
group: Configuration
order: 20
description: How Slice.js loads and uses sliceConfig.json.
component: SliceConfigDocumentation
tags: [config, setup]
---

# sliceConfig.json

## Overview
`sliceConfig.json` configures Slice.js at startup. It is fetched from `/sliceConfig.json` and
used to initialize the main `slice` instance and structural components.

The configuration controls debugging, logging, themes, global styles, routing, and optional
structural services like EventManager and ContextManager.

## How Slice.js Loads Config
Slice.js fetches the file in `Slice/ Slice.js` and creates the global `slice` instance:

```javascript title="Slice.js initialization (simplified)"
const response = await fetch('/sliceConfig.json');
const sliceConfig = await response.json();
window.slice = new Slice(sliceConfig);
```

## IntelliSense (JSON Schema)
You can enable editor IntelliSense by adding a `$schema` reference and using the official schema.

```json title="sliceConfig.json"
{
  "$schema": "/sliceConfig.schema.json"
}
```

Place `sliceConfig.schema.json` at the project root so it is served by your dev server.

Once loaded, Slice.js initializes structural components based on config:

- Logger and Debugger (if enabled)
- EventManager and ContextManager (if enabled)
- Loading component (if enabled)
- StylesManager + ThemeManager
- Router (routes loaded from `paths.routesFile`)

## Root Schema
| Key | Type | Required | Notes |
| --- | --- | --- | --- |
| `debugger` | `object` | no | Controls the UI debugger. |
| `stylesManager` | `object` | no | Global style sheet loading. |
| `themeManager` | `object` | no | Theme selection and persistence. |
| `logger` | `object` | no | Console log filters and enablement. |
| `paths` | `object` | yes | Component paths, themes, styles, routes file. |
| `router` | `object` | no | Router defaults. |
| `loading` | `object` | no | Loading component toggle. |
| `events` | `object` | no | EventManager toggle. |
| `context` | `object` | no | ContextManager toggle. |
| `production` | `object` | no | Production toggles (if supported). |
| `server` | `object` | no | Server port/host for dev server. |
| `publicFolders` | `string[]` | no | Allowlist of public folders served in production. |

## debugger
| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Enables the debug UI. |
| `click` | `string` | `right` | Mouse button to open debugger. |

## stylesManager
| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `requestedStyles` | `string[]` | `[]` | Styles loaded from `paths.styles`. |

## themeManager
| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Enables themes. |
| `defaultTheme` | `string` | none | Theme to load if none saved. |
| `saveThemeLocally` | `boolean` | `false` | Persists theme name and CSS in localStorage. |
| `useBrowserTheme` | `boolean` | `false` | Uses browser prefers-color-scheme. |

## logger
| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Master log toggle. |
| `showLogs` | `object` | none | Per-level log filters. |

## paths
| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `components` | `object` | yes | Category -> path/type map. |
| `themes` | `string` | yes | Base path for theme CSS. |
| `styles` | `string` | yes | Base path for shared styles. |
| `routesFile` | `string` | yes | Module that exports routes array. |

### paths.components
Each key is a category name used in `components.js`.

| Field | Type | Notes |
| --- | --- | --- |
| `path` | `string` | URL path to component folder. |
| `type` | `Visual | Service` | Controls template/CSS loading. |

## router
| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `defaultRoute` | `string` | `/` | Default route path. |

## loading
| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | Builds `Loading` component on init. |

## events
| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Enables EventManager at `slice.events`. |
| `ui` | `object` | none | UI panel configuration. |

### events.ui
| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Enables the Events debug panel. |
| `shortcut` | `string` | none | Keyboard shortcut to toggle the panel (e.g. `alt+shift+e`). |

## context
| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Enables ContextManager at `slice.context`. |
| `ui` | `object` | none | UI panel configuration. |

### context.ui
| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | Enables the Contexts debug panel. |
| `shortcut` | `string` | none | Keyboard shortcut to toggle the panel (e.g. `alt+shift+c`). |

## production
| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `false` | If supported, disables dev-only features. |

## publicFolders
Use `publicFolders` to declare **public asset folders** that should be served in production.
This keeps source-only folders private while still exposing the assets your app needs.

Defaults are intended to be sensible for most apps: `/Themes`, `/Styles`, `/assets`.

Structural framework components are bundled automatically during `slice build` based on which
features are enabled in `sliceConfig.json` (e.g. `logger.enabled`, `events.enabled`).

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `publicFolders` | `string[]` | `[/Themes, /Styles, /assets]` | Public asset folders served in production. |

## server
| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `port` | `number` | `3001` | Dev server port fallback. |
| `host` | `string` | `localhost` | Dev server host. |

## Public Browser Environment (`SLICE_PUBLIC_*`)
Slice.js can expose selected environment variables to the browser runtime.

Only variables that start with `SLICE_PUBLIC_` are included in the browser payload.
Any variable without this prefix stays server-only and is not exposed through the runtime env endpoint.

:::warning
All values exposed with `SLICE_PUBLIC_*` are public and readable by any user in the browser.
Never place secrets, tokens, private keys, or credentials in these variables.
:::

### Naming Contract
| Pattern | Exposed in Browser | Example |
| --- | --- | --- |
| `SLICE_PUBLIC_*` | yes | `SLICE_PUBLIC_API_URL=https://api.example.com` |
| Any other key | no | `DB_PASSWORD=...` |

### Runtime Endpoint Contract (`/slice-env.json`)
Slice.js serves browser-safe runtime environment data at `/slice-env.json`.

Response shape:

```json title="/slice-env.json"
{
  "mode": "development",
  "env": {
    "SLICE_PUBLIC_API_URL": "https://api.example.com"
  }
}
```

| Field | Type | Notes |
| --- | --- | --- |
| `mode` | `"development" | "production"` | Current runtime mode. |
| `env` | `object` | Key/value map of browser-exposed `SLICE_PUBLIC_*` variables. |

In development and production, the contract is the same: the endpoint returns `{ mode, env }` and `env` only contains `SLICE_PUBLIC_*` keys.

### Runtime API Access
After Slice.js initializes, use these runtime helpers:

| API | Returns | Example |
| --- | --- | --- |
| `slice.getEnv(key, fallback)` | Value for a single `SLICE_PUBLIC_*` key, or `fallback` when missing. | `slice.getEnv('SLICE_PUBLIC_API_URL', '')` |
| `slice.getPublicEnv()` | Full public env object currently loaded in runtime. | `slice.getPublicEnv()` |

```javascript title="Runtime usage"
const apiUrl = slice.getEnv('SLICE_PUBLIC_API_URL', 'http://localhost:3000');
const publicEnv = slice.getPublicEnv();
```

## Example
```json title="sliceConfig.json"
{
  "debugger": { "enabled": true, "click": "right" },
  "stylesManager": { "requestedStyles": ["sliceStyles", "DocumentationBase"] },
  "themeManager": {
    "enabled": true,
    "defaultTheme": "Slice",
    "saveThemeLocally": true,
    "useBrowserTheme": false
  },
  "logger": {
    "enabled": true,
    "showLogs": {
      "console": { "error": true, "warning": true, "info": true }
    }
  },
  "paths": {
    "components": {
      "AppComponents": { "path": "/Components/AppComponents", "type": "Visual" },
      "Visual": { "path": "/Components/Visual", "type": "Visual" },
      "Service": { "path": "/Components/Service", "type": "Service" }
    },
    "themes": "/Themes",
    "styles": "/Styles",
    "routesFile": "/routes.js"
  },
  "router": { "defaultRoute": "/" },
  "loading": { "enabled": true },
  "events": { "enabled": true, "ui": { "enabled": true, "shortcut": "alt+shift+e" } },
  "context": { "enabled": true, "ui": { "enabled": true, "shortcut": "alt+shift+c" } }
  ,
  "publicFolders": ["/Themes", "/Styles", "/assets"]
}
```

## Best Practices
:::tip
Keep `paths` accurate or component loading will fail.
:::

:::tip
Load shared styles through `stylesManager.requestedStyles`.
:::

## Gotchas
:::warning
If `themeManager.enabled` is true and `defaultTheme` is missing, theme loading will fail.
:::

:::warning
`events` and `context` are optional. If disabled, Slice.js provides no-op stubs.
:::
