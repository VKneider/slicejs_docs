---
title: App Shell + MultiRoute
route: /Documentation/Architecture/App-Shell-MultiRoute
navLabel: App Shell + MultiRoute
section: Project Architecture
group: Styles and Patterns
order: 2
description: Build section-based apps with a persistent shell and route-driven content switching.
component: AppShellMultiRouteDocumentation
tags: [architecture, multiroute, routing, layout]
---

# App Shell + MultiRoute

Use this style when your app has multiple sections that share the same layout frame (navbar, side menu, footer, theme selector).

## When to Use
- Portfolio or company website with several top-level sections
- Dashboard/admin panels
- Product apps with stable global navigation

## Structure
```javascript title="src/routes.js"
const routes = [
  { path: '/', component: 'AppShell' },
  { path: '/about', component: 'AppShell' },
  { path: '/projects', component: 'AppShell' },
  { path: '/contact', component: 'AppShell' },
  { path: '/404', component: 'NotFound' }
];

export default routes;
```

```javascript title="src/Components/AppComponents/AppShell/AppShell.js"
export default class AppShell extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
  }

  async init() {
    const nav = await slice.build('Navbar', {
      items: [
        { text: 'About', path: '/' },
        { text: 'Projects', path: '/projects' },
        { text: 'Contact', path: '/contact' }
      ]
    });

    const sections = await slice.build('MultiRoute', {
      routes: [
        { path: '/', component: 'AboutSection' },
        { path: '/projects', component: 'ProjectsSection' },
        { path: '/contact', component: 'ContactSection' }
      ]
    });

    this.appendChild(nav);
    this.querySelector('.shell-content').appendChild(sections);
  }
}

customElements.define('slice-app-shell', AppShell);
```

## Data Flow Tips
- Keep global UI state (theme/user/session) in `slice.context`.
- Keep section-local data inside each section component.
- Use route params/query only when URL should reflect the current state.

## Common Mistakes
:::warning
Do not duplicate global layout per route. Keep one shell and switch only inner content.
:::

:::warning
Do not put every tiny state in query params. Use URL state only when deep-linking matters.
:::

## Upgrade Trigger
If a single-view app starts adding independent URL sections, migrate to this style.
