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
    await this.renderPhase();
  }

  async renderPhase() {
    const viewMap = {
      setup: 'GameSetup',
      round: 'GameRound',
      summary: 'GameSummary'
    };

    const component = await slice.build(viewMap[this.state.phase], {
      state: this.state,
      onNext: async (patch) => {
        this.state = { ...this.state, ...patch };
        await this.renderPhase();
      }
    });

    const root = this.querySelector('.game-root-view');
    root.innerHTML = '';
    root.appendChild(component);
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

## Upgrade Trigger
When users need independent URL-addressable sections, move to App Shell + MultiRoute.
