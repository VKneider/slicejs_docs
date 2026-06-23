---
title: Single-View SPA
route: /Documentation/Architecture/Single-View-SPA
navLabel: Single-View SPA
section: Project Architecture
group: Styles and Patterns
order: 3
description: Build flow-driven apps with one route and internal state transitions.
component: SingleViewSpaDocumentation
tags: [architecture, spa, state-machine, game]
---

# Single-View SPA

Use this style when your app is one main experience and transitions happen inside that experience.

## When to Use
- Games (Impostor-style)
- Multi-step wizards with one dominant screen
- Tools where URL sections are not the main interaction model

> Deciding between this and App Shell + MultiRoute? See the [decision matrix](/Documentation/Architecture).

## Minimal Route Setup
```javascript title="src/routes.js"
const routes = [
  { path: '/', component: 'GameRoot' },
  { path: '/404', component: 'NotFound' }
];

export default routes;
```

## Root State Flow Example
```javascript title="src/Components/AppComponents/GameRoot/GameRoot.js"
export default class GameRoot extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.state = { phase: 'setup', players: [] };
  }

  async init() {
    await this.showPhase();
  }

  async showPhase() {
    const viewMap = {
      setup: 'GameSetup',
      round: 'GameRound',
      summary: 'GameSummary'
    };

    const component = await slice.build(viewMap[this.state.phase], {
      state: this.state,
      onNext: async (patch) => {
        this.state = { ...this.state, ...patch };
        await this.showPhase();
      }
    });

    const root = this.querySelector('.game-root-view');
    slice.controller.destroyByContainer(root);   // clean up the previous phase (no leak)
    root.replaceChildren(component);
  }
}

customElements.define('slice-game-root', GameRoot);
```

## Data Flow Tips
- Keep flow state in root component state and/or `slice.context`.
- Emit events for cross-cutting concerns (audio, analytics, notifications).
- Keep URL stable unless deep links are required.

## Common Mistakes
:::warning
Do not create many routes just to represent internal game phases. That usually increases complexity without user value.
:::

## Outgrowing single-view → App Shell
When users need independent, URL-addressable sections, grow into the
[App Shell + MultiRoute](/Documentation/Architecture/App-Shell-MultiRoute) pattern. Do it in
slices, keeping the app working at each step:

1. Add an `AppShell` that owns persistent UI (navbar, theme, footer) and hosts the section content.
2. Wrap your current single view as **one** section route (e.g. `/play`).
3. Add new sections only when they're independently navigable and meaningful as URLs.
4. Move global controls into the shell; keep shared state in `slice.context` to avoid prop-drilling.
5. Add [route guards](/Documentation/Routing/Guards) only when navigation policy needs it.

:::tip
Migrate in small slices: keep one route stable, move one section at a time, and verify after each move.
:::
