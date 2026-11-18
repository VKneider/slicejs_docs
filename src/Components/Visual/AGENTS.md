# Visual

## Registry rule

`Visual` is where `slice get` installs registry Visual components. A downloaded component is not
edited by hand: its authoritative docs are `slice docs` / MCP. A local component added to this
category is app-owned and documents itself in its own `README.md`.


## Components

<!-- slice:generated:components:start -->
| Component | Type | Files | Docs |
| --- | --- | --- | --- |
| Badge | Visual | 3 | `slice docs get components:badge` |
| Breadcrumbs | Visual | 3 | `slice docs get components:breadcrumbs` |
| Button | Visual | 3 | `slice docs get components:button` |
| Callout | Visual | 3 | `slice docs get components:callout` |
| Card | Visual | 3 | `slice docs get components:card` |
| Checkbox | Visual | 3 | `slice docs get components:checkbox` |
| CodeVisualizer | Visual | 3 | `slice docs get components:code-visualizer` |
| Details | Visual | 3 | `slice docs get components:details` |
| DropDown | Visual | 3 | `slice docs get components:drop-down` |
| ElementCarrousel | Visual | 3 | `slice docs get components:element-carrousel` |
| Grid | Visual | 3 | `slice docs get components:grid` |
| Icon | Visual | 12 | `slice docs get components:icon` |
| Input | Visual | 3 | `slice docs get components:input` |
| Layout | Visual | 3 | `slice docs get components:layout` |
| Link | Visual | 3 | `slice docs get components:link` |
| Loading | Visual | 3 | `slice docs get components:loading` |
| MultiRoute | Visual | 1 | `slice docs get components:multi-route` |
| Navbar | Visual | 3 | `slice docs get components:navbar` |
| NotFound | Visual | 3 | `slice docs get components:not-found` |
| Route | Visual | 1 | `slice docs get components:route` |
| Select | Visual | 3 | `slice docs get components:select` |
| Switch | Visual | 3 | `slice docs get components:switch` |
| Table | Visual | 3 | `slice docs get components:table` |
| Tabs | Visual | 3 | `slice docs get components:tabs` |
| ThemeSelector | Visual | 3 | `slice docs get components:theme-selector` |
| TreeItem | Visual | 3 | `slice docs get components:tree-item` |
| TreeView | Visual | 3 | `slice docs get components:tree-view` |
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
