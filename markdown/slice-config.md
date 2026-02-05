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

## server
| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `port` | `number` | `3001` | Dev server port fallback. |
| `host` | `string` | `localhost` | Dev server host. |

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
