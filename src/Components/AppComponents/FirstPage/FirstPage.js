export default class FirstPage extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/first-page.md";
    this.markdownContent = "---\ntitle: Your First Page\nroute: /Documentation/First-Page\nnavLabel: Your First Page\nsection: Getting Started\ngroup: ''\norder: 50\ndescription: Edit a section and add a new one in the App Shell starter, end to end.\ncomponent: FirstPage\ntags: [getting-started, components, routing]\n---\n\n# Your First Page\n\n## Overview\nThis walkthrough takes the App Shell starter from `slice init` to a new page on screen. You will\nedit an existing section, then add a brand-new one and wire it into the shell.\n\n## Run the starter\nFrom inside the project folder that `slice init` created (see Installation):\n\n```bash title=\"Start the dev server\"\nslice dev     # or: npm run dev / pnpm run dev\n```\nOpen the printed URL (default `http://localhost:3000`). You should see the Home section with a\nbutton that navigates to About.\n\n## Step 1 — Edit the Home section\nOpen `src/Components/AppComponents/HomeSection/HomeSection.html` and change the heading and text.\nSave; the dev server reloads. The markup lives in `.html`; behavior lives in `.js`.\n\n## Step 2 — Add a new section component\n```bash title=\"Scaffold a component\"\nslice component create ContactSection --category AppComponents\n```\nThis creates `src/Components/AppComponents/ContactSection/` with `.js`, `.html`, `.css`, and\nregisters it in `components.js`. (Run `slice component create` with no arguments to be prompted\nfor the name and category instead.)\n\n## Step 3 — Write the component\nA Slice component follows three rules (see Lifecycle Methods for the full model):\n\n- The template is only available **after** `slice.attachTemplate(this)` — call it first in the\n  constructor; then `querySelector` and listener binding work inside the constructor.\n- Props go through setters, so put side effects in setters. Call `setComponentProps` **last**.\n- `slice.build()` is async — always `await` it.\n\n```javascript title=\"ContactSection.js\"\nexport default class ContactSection extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    this.$cta = this.querySelector('.contact__cta');\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    const button = await slice.build('Button', {\n      value: 'Back Home',\n      onClick: () => slice.router.navigate('/')\n    });\n    this.$cta.appendChild(button);\n  }\n}\n\ncustomElements.define('slice-contact-section', ContactSection);\n```\n\n```html title=\"ContactSection.html\"\n<section class=\"contact\">\n  <h1>Contact</h1>\n  <p>Reach us at hello@example.com.</p>\n  <div class=\"contact__cta\"></div>\n</section>\n```\n\n## Step 4 — Add the route\nAdd the path in `src/routes.js`. Every section URL maps to `AppShell`:\n\n```javascript title=\"src/routes.js\"\nconst routes = [\n  { path: '/',        component: 'AppShell', metadata: { title: 'Home' } },\n  { path: '/about',   component: 'AppShell', metadata: { title: 'About' } },\n  { path: '/contact', component: 'AppShell', metadata: { title: 'Contact' } },\n  { path: '/404',     component: 'NotFound', metadata: { title: 'Not Found' } }\n];\n\nexport default routes;\n```\n\n## Step 5 — Wire it into the shell\nIn `AppShell.js`, add the section to the `MultiRoute` and a navbar item:\n\n```javascript title=\"AppShell.js (inside init)\"\nconst content = await slice.build('MultiRoute', {\n  sliceId: 'app-content',\n  routes: [\n    { path: '/',        component: 'HomeSection' },\n    { path: '/about',   component: 'AboutSection' },\n    { path: '/contact', component: 'ContactSection' }\n  ]\n});\n```\n\nAdd `{ text: 'Contact', path: '/contact' }` to the navbar `items` array in the same file.\n\n:::tip\nUse `${name}` for dynamic segments (e.g. `/users/${id}`), never `:name`. Read params inside the\ncomponent with `slice.router.activeRoute.params`.\n:::\n\n## Step 6 — See it\nSave and the page reloads. Click through Home → About → Contact. Because `MultiRoute` caches each\nsection, give a section an `update()` method if it must refresh when revisited.\n\n:::warning\nIf a component does not appear, confirm it is listed in `src/Components/components.js`. If you\ncreated folders by hand, run `slice component list` to regenerate that file.\n:::\n\n## Next\n\n:::related\n- [The Development Loop](/Documentation/Development-Workflow) - The full edit-build-ship cycle.\n- [Project Anatomy](/Documentation/Project-Anatomy) - What `slice init` creates.\n- [CLI Commands](/Documentation/CLI) - The commands used on this page.\n- [Installation](/Documentation/Installation) - Start from a fresh project.\n:::\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"Getting Started"}]
            });
            if (breadcrumbs) {
               container.appendChild(breadcrumbs);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice dev     # or: npm run dev / pnpm run dev",
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class ContactSection extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    this.$cta = this.querySelector('.contact__cta');\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    const button = await slice.build('Button', {\n      value: 'Back Home',\n      onClick: () => slice.router.navigate('/')\n    });\n    this.$cta.appendChild(button);\n  }\n}\n\ncustomElements.define('slice-contact-section', ContactSection);",
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
         const container = this.querySelector('[data-block-id="doc-block-5"]');
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
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
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Use <code>${name}</code> for dynamic segments (e.g. <code>/users/${id}</code>), never <code>:name</code>. Read params inside the component with <code>slice.router.activeRoute.params</code>.</p>";
            const callout = await slice.build('Callout', {
               tone: "success",
               variant: "soft",
               title: "Tip",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>If a component does not appear, confirm it is listed in <code>src/Components/components.js</code>. If you created folders by hand, run <code>slice component list</code> to regenerate that file.</p>";
            const callout = await slice.build('Callout', {
               tone: "warning",
               variant: "soft",
               title: "Warning",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const items = [{"title":"The Development Loop","path":"/Documentation/Development-Workflow","text":"The full edit-build-ship cycle."},{"title":"Project Anatomy","path":"/Documentation/Project-Anatomy","text":"What slice init creates."},{"title":"CLI Commands","path":"/Documentation/CLI","text":"The commands used on this page."},{"title":"Installation","path":"/Documentation/Installation","text":"Start from a fresh project."}];
            const grid = await slice.build('Grid', {
               columns: items.length === 4 ? 2 : Math.min(3, Math.max(1, items.length)),
               rows: 1,
               gap: '14px'
            });
            for (const item of items) {
               const card = await slice.build('Card', {
                  title: item.title,
                  text: item.text || '',
                  icon: { name: 'arrow-right', iconStyle: 'outlined' },
                  interactive: true,
                  onClick: () => {
                     if (/^https?:/i.test(item.path)) {
                        window.open(item.path, '_blank', 'noopener,noreferrer');
                     } else {
                        slice.router.navigate(item.path);
                     }
                  }
               });
               if (card && grid) await grid.setItem(card);
            }
            if (grid) container.appendChild(grid);
         }
      }
  }

  async update() {
    // Refresh dynamic content here if needed
  }

  beforeDestroy() {
    if (this._contentClick) {
      this.removeEventListener('click', this._contentClick);
      this._contentClick = null;
    }
  }

  // Internal markdown links are plain anchors with data-route. One delegated
  // handler keeps them inside the SPA, including "/page#section" links, without
  // building a component for every link on the page.
  setupRouterLinks() {
    this._contentClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest?.('a[data-route]');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('#')) {
        event.preventDefault();
        this.scrollToHash(href.slice(1));
        return;
      }
      if (!href.startsWith('/') || href.startsWith('//')) return;

      event.preventDefault();
      const hashIndex = href.indexOf('#');
      const path = hashIndex === -1 ? href : href.slice(0, hashIndex);
      const hash = hashIndex === -1 ? '' : href.slice(hashIndex + 1);
      Promise.resolve(slice.router.navigate(path)).then(() => {
        if (hash) requestAnimationFrame(() => this.scrollToHash(hash));
      });
    };
    this.addEventListener('click', this._contentClick);
  }

  scrollToHash(hash) {
    let id = hash;
    try {
      id = decodeURIComponent(hash);
    } catch {
      id = hash;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
