export default class FirstPage extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/first-page.md";
    this.markdownContent = "---\ntitle: Your First Page\nroute: /Documentation/First-Page\nnavLabel: Your First Page\nsection: Getting Started\ngroup: First Steps\norder: 12\ndescription: Edit a section and add a new one in the App Shell starter, end to end.\ncomponent: FirstPage\ntags: [getting-started, components, routing]\n---\n\n# Your First Page\n\n## Overview\nThis walkthrough takes the App Shell starter from `slice init` to a new page on screen. You will\nedit an existing section, then add a brand-new one and wire it into the shell.\n\n## Run the starter\n```bash title=\"Start the dev server\"\nnpm run dev\n```\nOpen the printed URL (default `http://localhost:3001`). You should see the Home section with a\nbutton that navigates to About.\n\n## Step 1 — Edit the Home section\nOpen `src/Components/AppComponents/HomeSection/HomeSection.html` and change the heading and text.\nSave; the dev server reloads. The markup lives in `.html`; behavior lives in `.js`.\n\n## Step 2 — Add a new section component\n```bash title=\"Scaffold a component\"\nslice component create ContactSection --category AppComponents\n```\nThis creates `src/Components/AppComponents/ContactSection/` with `.js`, `.html`, `.css`, and\nregisters it in `components.js`. (Run `slice component create` with no arguments to be prompted\nfor the name and category instead.)\n\n## Step 3 — Write the component\nA Slice component follows three rules (see Lifecycle Methods for the full model):\n\n- The template is only available **after** `slice.attachTemplate(this)` — call it first in the\n  constructor; then `querySelector` and listener binding work inside the constructor.\n- Props go through setters, so put side effects in setters. Call `setComponentProps` **last**.\n- `slice.build()` is async — always `await` it.\n\n```javascript title=\"ContactSection.js\"\nexport default class ContactSection extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    this.$cta = this.querySelector('.contact__cta');\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    const button = await slice.build('Button', {\n      value: 'Back Home',\n      onClickCallback: () => slice.router.navigate('/')\n    });\n    this.$cta.appendChild(button);\n  }\n}\n\ncustomElements.define('slice-contact-section', ContactSection);\n```\n\n```html title=\"ContactSection.html\"\n<section class=\"contact\">\n  <h1>Contact</h1>\n  <p>Reach us at hello@example.com.</p>\n  <div class=\"contact__cta\"></div>\n</section>\n```\n\n## Step 4 — Add the route\nAdd the path in `src/routes.js`. Every section URL maps to `AppShell`:\n\n```javascript title=\"src/routes.js\"\nconst routes = [\n  { path: '/',        component: 'AppShell', metadata: { title: 'Home' } },\n  { path: '/about',   component: 'AppShell', metadata: { title: 'About' } },\n  { path: '/contact', component: 'AppShell', metadata: { title: 'Contact' } },\n  { path: '/404',     component: 'NotFound', metadata: { title: 'Not Found' } }\n];\n\nexport default routes;\n```\n\n## Step 5 — Wire it into the shell\nIn `AppShell.js`, add the section to the `MultiRoute` and a navbar item:\n\n```javascript title=\"AppShell.js (inside init)\"\nconst content = await slice.build('MultiRoute', {\n  sliceId: 'app-content',\n  routes: [\n    { path: '/',        component: 'HomeSection' },\n    { path: '/about',   component: 'AboutSection' },\n    { path: '/contact', component: 'ContactSection' }\n  ]\n});\n```\n\nAdd `{ text: 'Contact', path: '/contact' }` to the navbar `items` array in the same file.\n\n:::tip\nUse `${name}` for dynamic segments (e.g. `/users/${id}`), never `:name`. Read params inside the\ncomponent with `slice.router.activeRoute.params`.\n:::\n\n## Step 6 — See it\nSave and the page reloads. Click through Home → About → Contact. Because `MultiRoute` caches each\nsection, give a section an `update()` method if it must refresh when revisited.\n\n:::warning\nIf a component does not appear, confirm it is listed in `src/Components/components.js`. If you\ncreated folders by hand, run `slice component list` to regenerate that file.\n:::\n\n## Next\nLearn the full edit-build-ship cycle in **The Development Loop**.\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run dev",
               language: "bash"
            });
            if ("Start the dev server") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Start the dev server";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice component create ContactSection --category AppComponents",
               language: "bash"
            });
            if ("Scaffold a component") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Scaffold a component";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class ContactSection extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    this.$cta = this.querySelector('.contact__cta');\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    const button = await slice.build('Button', {\n      value: 'Back Home',\n      onClickCallback: () => slice.router.navigate('/')\n    });\n    this.$cta.appendChild(button);\n  }\n}\n\ncustomElements.define('slice-contact-section', ContactSection);",
               language: "javascript"
            });
            if ("ContactSection.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "ContactSection.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "<section class=\"contact\">\n  <h1>Contact</h1>\n  <p>Reach us at hello@example.com.</p>\n  <div class=\"contact__cta\"></div>\n</section>",
               language: "html"
            });
            if ("ContactSection.html") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "ContactSection.html";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const routes = [\n  { path: '/',        component: 'AppShell', metadata: { title: 'Home' } },\n  { path: '/about',   component: 'AppShell', metadata: { title: 'About' } },\n  { path: '/contact', component: 'AppShell', metadata: { title: 'Contact' } },\n  { path: '/404',     component: 'NotFound', metadata: { title: 'Not Found' } }\n];\n\nexport default routes;",
               language: "javascript"
            });
            if ("src/routes.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "src/routes.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const content = await slice.build('MultiRoute', {\n  sliceId: 'app-content',\n  routes: [\n    { path: '/',        component: 'HomeSection' },\n    { path: '/about',   component: 'AboutSection' },\n    { path: '/contact', component: 'ContactSection' }\n  ]\n});",
               language: "javascript"
            });
            if ("AppShell.js (inside init)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "AppShell.js (inside init)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
  }

  async update() {
    // Refresh dynamic content here if needed
  }

  beforeDestroy() {
    // Cleanup timers, listeners, or pending work here
  }

  async setupCopyButton() {
    const container = this.querySelector('[data-copy-md]');
    if (!container) return;

    const copyMenu = await slice.build('CopyMarkdownMenu', {
      markdownPath: this.markdownPath,
      markdownContent: this.markdownContent,
      label: '❐'
    });

    container.appendChild(copyMenu);
  }

  async copyMarkdown() {}
}

customElements.define('slice-firstpage', FirstPage);
