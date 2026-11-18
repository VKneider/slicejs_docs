---
title: Environment Variables
route: /Documentation/Configuration/environment-variables
navLabel: Environment Variables
section: Configuration
group: ''
order: 20
description: Expose browser-safe env values with SLICE_PUBLIC_ and runtime helpers.
component: EnvironmentVariablesDocumentation
tags: [config, env, security]
---

# Environment Variables

## Overview
Slice.js exposes browser-safe environment variables through:

- `GET /slice-env.json`
- `slice.getEnv(key, fallback)`
- `slice.getPublicEnv()`

This is intended for public runtime configuration (for example API base URLs or feature flags).

## Public vs Private Variables
Only variables prefixed with `SLICE_PUBLIC_` are exposed to the browser.

| Variable | Exposed to browser | Example |
| --- | --- | --- |
| `SLICE_PUBLIC_*` | yes | `SLICE_PUBLIC_API_URL=https://api.example.com` |
| Any other key | no | `DB_PASSWORD=...` |

:::warning
Everything sent to the browser is public. Never put secrets, private tokens, or credentials in `SLICE_PUBLIC_*` variables.
:::

## Define Variables
Create or update your `.env` file:

```bash title=".env"
SLICE_PUBLIC_API_URL=https://api.example.com
SLICE_PUBLIC_ENABLE_CHAT=true
DB_PASSWORD=server-only
```

## Build-time Artifact
`slice build` writes two files into `dist/`:

- `slice-env.json` — the shared payload (`{ mode, env }`).
- `slice-env.generated.js` — a tiny ESM shim that exports the same object.

The runtime **imports** `/slice-env.generated.js` at boot. There is no env endpoint in production.
`slice dev` keeps `/slice-env.json` live so `.env` edits do not require a build.

```json title="dist/slice-env.json"
{
  "mode": "production",
  "env": {
    "SLICE_PUBLIC_API_URL": "https://api.example.com",
    "SLICE_PUBLIC_ENABLE_CHAT": "true"
  }
}
```

### Resolution Rules
- `process.env` has priority over `.env` when both define the same key.
- In development, values are resolved per request.
- In production, values are frozen at build time. Rebuild after changing `.env` or `SLICE_PUBLIC_*`.
- `slice export` copies both files to the static output; `slice start` serves them as static assets.

### Deployment Modes
| Mode | Command | Env delivery |
| --- | --- | --- |
| Express | `slice build` + `slice start` | `dist/slice-env.generated.js` served as a static asset |
| Static | `slice build` + `slice export` | `slice-env.generated.js` at the static root |

## Runtime Access in Components

```javascript title="Read public env from Slice runtime"
export default class HomePage extends HTMLElement {
  async init() {
    const apiUrl = slice.getEnv('SLICE_PUBLIC_API_URL', 'http://localhost:3000');
    const env = slice.getPublicEnv();

    console.log('API URL:', apiUrl);
    console.log('All public env:', env);
  }
}
```

## Typed Accessors (`slice.env`)
`slice.getEnv` always returns a string (env values are strings). `slice.env.*` parses common shapes for you, so you stop re-writing `String(...).split(',')` and boolean checks across the app.

| Accessor | Returns | Example |
| --- | --- | --- |
| `slice.env.get(key, fallback?)` | `string` | `slice.env.get('SLICE_PUBLIC_API_URL', '')` |
| `slice.env.bool(key, fallback?)` | `boolean` | `'1' \| 'true' \| 'yes' \| 'on'` → `true` |
| `slice.env.int(key, fallback?)` | `number` | `slice.env.int('SLICE_PUBLIC_TIMEOUT', 5000)` |
| `slice.env.list(key, fallback?)` | `string[]` | `'a, b'` → `['a','b']` (trims, drops empties) |
| `slice.env.has(key)` | `boolean` | key present in the public env |
| `slice.env.all()` | `object` | snapshot of all `SLICE_PUBLIC_*` keys |

```javascript title="Typed reads"
const auth   = slice.env.bool('SLICE_PUBLIC_AUTH_ENABLED');        // false if missing
const models = slice.env.list('SLICE_PUBLIC_MODELS', ['default']); // ['a','b',...]
const apiUrl = slice.env.get('SLICE_PUBLIC_API_URL', '');
```

Missing or empty values fall back: `bool`/`int`/`list` return the provided fallback (or `false` / `0` / `[]`).

## Recommended Workflow
:::steps
1. Define browser-safe keys using `SLICE_PUBLIC_`.
2. Keep secrets in non-public env keys.
3. Run `slice build` (or `slice export`) after changing public env values.
4. Read values with `slice.env.*` (or `slice.getEnv`) in runtime code.
:::

## Troubleshooting
:::tip
If a key is missing in browser runtime, verify the key starts with `SLICE_PUBLIC_`.
:::

:::tip
If production values do not update, restart the server process to refresh cached env payload.
:::

## Related Docs
- `sliceConfig.json`: `/Documentation/Configuration/sliceConfig`
