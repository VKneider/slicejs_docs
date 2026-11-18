# Service

## Registry rule

`Service` is where `slice get` installs registry Service components. A downloaded component is not
edited by hand: its authoritative docs are `slice docs` / MCP. A local service added to this
category is app-owned and documents itself in its own `README.md`.


## Components

<!-- slice:generated:components:start -->
| Component | Type | Files | Docs |
| --- | --- | --- | --- |
| FetchManager | Service | 1 | `slice docs get components:fetch-manager` |
| IndexedDbManager | Service | 1 | `slice docs get components:indexed-db-manager` |
| LocalStorageManager | Service | 1 | `slice docs get components:local-storage-manager` |
<!-- slice:generated:components:end -->

## Local rules

- Keep this guide current when adding, removing or changing a component in this category.
- Prefer the component `README.md` for API details; link it from the table above.
- Document non-obvious decisions and gotchas here.

## Events

- Emitted and listened events are documented in `docs/events/`.
- Event names use `namespace:action`.

## Changelog

- Optional: `CHANGELOG.md` next to this file.
