---
title: Logger
route: /Documentation/Structural/Logger
navLabel: Logger
section: Getting Started
group: Diagnostics
order: 40
description: Structured logging and filters for Slice.js.
component: LoggerDocumentation
tags: [logger, diagnostics, debugging]
---

# Logger

## Overview
Logger collects logs and routes them to configured outputs (e.g. console). It supports filtering
by level and basic querying over the in-memory log list.

## Enable
```json title="sliceConfig.json"
{
  "logger": {
    "enabled": true,
    "showLogs": {
      "console": { "error": true, "warning": true, "info": true }
    }
  }
}
```

## Logger UI (Optional)
You can enable the LogViewer debug panel with a keyboard shortcut.

```json title="sliceConfig.json"
{
  "logger": {
    "enabled": true,
    "ui": {
      "enabled": true,
      "shortcut": "alt+shift+l"
    }
  }
}
```

The panel shows a live feed of all logs with level filtering and a search input. It is built with the same `--si-*` tokens as the other debugger panels and only processes logs while visible (conditional subscribe on toggle).

## API Reference
| Method | Signature | Notes |
| --- | --- | --- |
| `logError` | `(componentSliceId, message, error?)` | Logs error + optional error object |
| `logWarning` | `(componentSliceId, message)` | Logs warning |
| `logInfo` | `(componentSliceId, message)` | Logs info |
| `getLogs` | `()` | Returns all logs |
| `clearLogs` | `()` | Clears stored logs |
| `getLogsByLogType` | `(type)` | Filter by `error | warning | info` |
| `getLogsByComponentCategory` | `(category)` | Filter by component category |
| `getLogsByComponent` | `(sliceId)` | Filter by component sliceId |

## Usage
```javascript title="Log from a component"
export default class Navbar extends HTMLElement {
  async init() {
    slice.logger.logInfo('Navbar', 'Navbar initialized');
  }
}
```

```javascript title="Log with error"
try {
  await doWork();
} catch (error) {
  slice.logger.logError('MyService', 'Work failed', error);
}
```

## Notes
- Logging is disabled when `logger.enabled` is false.
- Log outputs depend on `logger.showLogs` configuration.
