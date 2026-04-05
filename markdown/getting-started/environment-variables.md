---
title: Environment Variables
route: /Documentation/Configuration/environment-variables
navLabel: Environment Variables
section: Getting Started
group: Configuration
order: 21
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

## Runtime Endpoint Contract
Slice.js serves environment data at `/slice-env.json` in both development and production.

```json title="/slice-env.json"
{
  "mode": "development",
  "env": {
    "SLICE_PUBLIC_API_URL": "https://api.example.com",
    "SLICE_PUBLIC_ENABLE_CHAT": "true"
  }
}
```

### Resolution Rules
- `process.env` has priority over `.env` when both define the same key.
- In development, values are resolved per request.
- In production, values are resolved at startup and cached for the process lifetime.

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

## Recommended Workflow
:::steps
1. Define browser-safe keys using `SLICE_PUBLIC_`.
2. Keep secrets in non-public env keys.
3. Verify endpoint output at `/slice-env.json`.
4. Read values from `slice.getEnv(...)` in runtime code.
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
