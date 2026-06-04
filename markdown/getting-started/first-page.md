---
title: Your First Page
route: /Documentation/First-Page
navLabel: Your First Page
section: Getting Started
group: First Steps
order: 12
description: Edit a section and add a new one in the App Shell starter, end to end.
component: FirstPage
tags: [getting-started, components, routing]
---

# Your First Page

## Overview
This walkthrough takes the App Shell starter from `slice init` to a new page on screen. You will
edit an existing section, then add a brand-new one and wire it into the shell.

## Run the starter
From inside the project folder that `slice init` created (see Installation):

```bash title="Start the dev server"
npm run dev     # or: pnpm run dev
```
Open the printed URL (default `http://localhost:3001`). You should see the Home section with a
button that navigates to About.

## Step 1 — Edit the Home section
Open `src/Components/AppComponents/HomeSection/HomeSection.html` and change the heading and text.
Save; the dev server reloads. The markup lives in `.html`; behavior lives in `.js`.

## Step 2 — Add a new section component
```bash title="Scaffold a component"
slice component create ContactSection --category AppComponents
```
This creates `src/Components/AppComponents/ContactSection/` with `.js`, `.html`, `.css`, and
registers it in `components.js`. (Run `slice component create` with no arguments to be prompted
for the name and category instead.)

## Step 3 — Write the component
A Slice component follows three rules (see Lifecycle Methods for the full model):

- The template is only available **after** `slice.attachTemplate(this)` — call it first in the
  constructor; then `querySelector` and listener binding work inside the constructor.
- Props go through setters, so put side effects in setters. Call `setComponentProps` **last**.
- `slice.build()` is async — always `await` it.

```javascript title="ContactSection.js"
export default class ContactSection extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    this.$cta = this.querySelector('.contact__cta');
    slice.controller.setComponentProps(this, props);
  }

  async init() {
    const button = await slice.build('Button', {
      value: 'Back Home',
      onClick: () => slice.router.navigate('/')
    });
    this.$cta.appendChild(button);
  }
}

customElements.define('slice-contact-section', ContactSection);
```

```html title="ContactSection.html"
<section class="contact">
  <h1>Contact</h1>
  <p>Reach us at hello@example.com.</p>
  <div class="contact__cta"></div>
</section>
```

## Step 4 — Add the route
Add the path in `src/routes.js`. Every section URL maps to `AppShell`:

```javascript title="src/routes.js"
const routes = [
  { path: '/',        component: 'AppShell', metadata: { title: 'Home' } },
  { path: '/about',   component: 'AppShell', metadata: { title: 'About' } },
  { path: '/contact', component: 'AppShell', metadata: { title: 'Contact' } },
  { path: '/404',     component: 'NotFound', metadata: { title: 'Not Found' } }
];

export default routes;
```

## Step 5 — Wire it into the shell
In `AppShell.js`, add the section to the `MultiRoute` and a navbar item:

```javascript title="AppShell.js (inside init)"
const content = await slice.build('MultiRoute', {
  sliceId: 'app-content',
  routes: [
    { path: '/',        component: 'HomeSection' },
    { path: '/about',   component: 'AboutSection' },
    { path: '/contact', component: 'ContactSection' }
  ]
});
```

Add `{ text: 'Contact', path: '/contact' }` to the navbar `items` array in the same file.

:::tip
Use `${name}` for dynamic segments (e.g. `/users/${id}`), never `:name`. Read params inside the
component with `slice.router.activeRoute.params`.
:::

## Step 6 — See it
Save and the page reloads. Click through Home → About → Contact. Because `MultiRoute` caches each
section, give a section an `update()` method if it must refresh when revisited.

:::warning
If a component does not appear, confirm it is listed in `src/Components/components.js`. If you
created folders by hand, run `slice component list` to regenerate that file.
:::

## Next
Learn the full edit-build-ship cycle in **The Development Loop**.
