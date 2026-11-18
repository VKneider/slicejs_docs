---
title: App Shell + MultiRoute
route: /Documentation/Architecture/App-Shell-MultiRoute
navLabel: App Shell + MultiRoute
section: Guides
group: ''
order: 20
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

> Deciding between this and Single-View SPA? See the [decision matrix](/Documentation/Architecture).

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

## Who owns what

| Owner | What lives there |
| --- | --- |
| Shell | The layout frame: navbar, side menu, footer, theme selector, global UI state (theme/user/session), and the route table. |
| Section | Its own data, child components and section-specific UI. |
| URL | State that must survive a refresh or be shareable: route params and query. |

:::details title="Common mistakes"
- Duplicating the global layout per route. Keep one shell and switch only the inner content with
  `MultiRoute`.
- Putting every tiny piece of state in query params. Use the URL only when deep-linking matters;
  local state belongs in the section.
:::

:::related
- [Single-View SPA](/Documentation/Architecture/Single-View-SPA) - The alternative for one focused experience.
- [Choosing a Project Style](/Documentation/Architecture) - The decision matrix.
- [Routing and Data Passing](/Documentation/Architecture/Routing-Data) - Params and route metadata.
- [Layout](https://components.slicejs.com/docs/layout/layout) - The registry layout component.
:::

## Upgrade Trigger
If a single-view app starts adding independent URL sections, migrate to this style.
