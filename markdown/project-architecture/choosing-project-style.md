---
title: Choosing a Project Style
route: /Documentation/Architecture
navLabel: Choosing a Project Style
section: Guides
group: ''
order: 10
description: Decide whether your Slice app should use App Shell + MultiRoute or a Single-View SPA.
component: ProjectArchitectureDocumentation
tags: [architecture, project-structure, multiroute, spa]
---

# Choosing a Project Style

Slice supports different app structures. Pick the one that matches your product shape, not just your current page count.

## Quick Decision Matrix
| Project signal | Recommended style | Why |
| --- | --- | --- |
| Multiple sections with shared navbar/sidebar | App Shell + MultiRoute | Keeps layout persistent and swaps section views cleanly |
| Single gameplay/flow surface with internal states | Single-View SPA | Keeps transitions in one component tree and avoids route overhead |
| You expect to add many independent sections soon | App Shell + MultiRoute | Easier long-term navigation scaling |
| You optimize for one focused interaction | Single-View SPA | Faster to reason about state transitions |

## Style A: App Shell + MultiRoute
- Shared shell component renders persistent layout elements.
- A `MultiRoute` container renders section components by URL.
- Best for dashboard, portfolio, documentation, and admin-style apps.

## Style B: Single-View SPA
- App uses one route (`/`) and one root view component.
- UI transitions are driven by internal state, context, or events.
- Best for games, wizards, onboarding flows, and kiosk-like interactions.

## Recommended Folder Shapes
```text title="App Shell + MultiRoute"
src/
  App/index.js
  routes.js
  Components/
    AppComponents/
      AppShell/
      HomeSection/
      SettingsSection/
    Visual/
```

```text title="Single-View SPA"
src/
  App/index.js
  routes.js
  Components/
    AppComponents/
      GameRoot/
      GameSetup/
      GameRound/
      GameSummary/
    Service/
```

## Rule of thumb

:::compare left="App Shell + MultiRoute" right="Single-View SPA" leftTone="info" rightTone="accent"
Navigation is user-visible and URL-driven: sections, deep links, back button, shared navbar/sidebar. The shell persists and `MultiRoute` swaps the section.
---
Transitions are state-machine-driven inside one experience: a game, a wizard, a kiosk. One route, one root view, internal state/context decides what renders.
:::

:::related
- [App Shell + MultiRoute](/Documentation/Architecture/App-Shell-MultiRoute) - The persistent-shell pattern in full.
- [Single-View SPA](/Documentation/Architecture/Single-View-SPA) - One route, internal transitions.
- [Routing and Data Passing](/Documentation/Architecture/Routing-Data) - Params and route metadata.
- [Project Anatomy](/Documentation/Project-Anatomy) - Where each folder lives.
:::
