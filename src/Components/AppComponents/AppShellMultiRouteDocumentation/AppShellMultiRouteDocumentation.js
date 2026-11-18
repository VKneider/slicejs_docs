export default class AppShellMultiRouteDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "project-architecture/app-shell-multiroute.md";
    this.markdownContent = "---\ntitle: App Shell + MultiRoute\nroute: /Documentation/Architecture/App-Shell-MultiRoute\nnavLabel: App Shell + MultiRoute\nsection: Guides\ngroup: ''\norder: 20\ndescription: Build section-based apps with a persistent shell and route-driven content switching.\ncomponent: AppShellMultiRouteDocumentation\ntags: [architecture, multiroute, routing, layout]\n---\n\n# App Shell + MultiRoute\n\nUse this style when your app has multiple sections that share the same layout frame (navbar, side menu, footer, theme selector).\n\n## When to Use\n- Portfolio or company website with several top-level sections\n- Dashboard/admin panels\n- Product apps with stable global navigation\n\n> Deciding between this and Single-View SPA? See the [decision matrix](/Documentation/Architecture).\n\n## Structure\n```javascript title=\"src/routes.js\"\nconst routes = [\n  { path: '/', component: 'AppShell' },\n  { path: '/about', component: 'AppShell' },\n  { path: '/projects', component: 'AppShell' },\n  { path: '/contact', component: 'AppShell' },\n  { path: '/404', component: 'NotFound' }\n];\n\nexport default routes;\n```\n\n```javascript title=\"src/Components/AppComponents/AppShell/AppShell.js\"\nexport default class AppShell extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    const nav = await slice.build('Navbar', {\n      items: [\n        { text: 'About', path: '/' },\n        { text: 'Projects', path: '/projects' },\n        { text: 'Contact', path: '/contact' }\n      ]\n    });\n\n    const sections = await slice.build('MultiRoute', {\n      routes: [\n        { path: '/', component: 'AboutSection' },\n        { path: '/projects', component: 'ProjectsSection' },\n        { path: '/contact', component: 'ContactSection' }\n      ]\n    });\n\n    this.appendChild(nav);\n    this.querySelector('.shell-content').appendChild(sections);\n  }\n}\n\ncustomElements.define('slice-app-shell', AppShell);\n```\n\n## Who owns what\n\n| Owner | What lives there |\n| --- | --- |\n| Shell | The layout frame: navbar, side menu, footer, theme selector, global UI state (theme/user/session), and the route table. |\n| Section | Its own data, child components and section-specific UI. |\n| URL | State that must survive a refresh or be shareable: route params and query. |\n\n:::details title=\"Common mistakes\"\n- Duplicating the global layout per route. Keep one shell and switch only the inner content with\n  `MultiRoute`.\n- Putting every tiny piece of state in query params. Use the URL only when deep-linking matters;\n  local state belongs in the section.\n:::\n\n:::related\n- [Single-View SPA](/Documentation/Architecture/Single-View-SPA) - The alternative for one focused experience.\n- [Choosing a Project Style](/Documentation/Architecture) - The decision matrix.\n- [Routing and Data Passing](/Documentation/Architecture/Routing-Data) - Params and route metadata.\n- [Layout](https://components.slicejs.com/docs/layout/layout) - The registry layout component.\n:::\n\n## Upgrade Trigger\nIf a single-view app starts adding independent URL sections, migrate to this style.\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"Guides"}]
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
               value: "const routes = [\n  { path: '/', component: 'AppShell' },\n  { path: '/about', component: 'AppShell' },\n  { path: '/projects', component: 'AppShell' },\n  { path: '/contact', component: 'AppShell' },\n  { path: '/404', component: 'NotFound' }\n];\n\nexport default routes;",
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class AppShell extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    const nav = await slice.build('Navbar', {\n      items: [\n        { text: 'About', path: '/' },\n        { text: 'Projects', path: '/projects' },\n        { text: 'Contact', path: '/contact' }\n      ]\n    });\n\n    const sections = await slice.build('MultiRoute', {\n      routes: [\n        { path: '/', component: 'AboutSection' },\n        { path: '/projects', component: 'ProjectsSection' },\n        { path: '/contact', component: 'ContactSection' }\n      ]\n    });\n\n    this.appendChild(nav);\n    this.querySelector('.shell-content').appendChild(sections);\n  }\n}\n\ncustomElements.define('slice-app-shell', AppShell);",
               language: "javascript"
            });
            if ("src/Components/AppComponents/AppShell/AppShell.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "src/Components/AppComponents/AppShell/AppShell.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Owner","What lives there"],
               rows: [[{"html":"Shell"},{"html":"The layout frame: navbar, side menu, footer, theme selector, global UI state (theme/user/session), and the route table."}],[{"html":"Section"},{"html":"Its own data, child components and section-specific UI."}],[{"html":"URL"},{"html":"State that must survive a refresh or be shareable: route params and query."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const details = await slice.build('Details', { title: "Common mistakes" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<ul><li>Duplicating the global layout per route. Keep one shell and switch only the inner content with</li></ul><p><code>MultiRoute</code>.</p><ul><li>Putting every tiny piece of state in query params. Use the URL only when deep-linking matters;</li></ul><p>local state belongs in the section.</p>";
            if (details) {
               details.addDetail(body);
               container.appendChild(details);
            } else {
               container.appendChild(body);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const items = [{"title":"Single-View SPA","path":"/Documentation/Architecture/Single-View-SPA","text":"The alternative for one focused experience."},{"title":"Choosing a Project Style","path":"/Documentation/Architecture","text":"The decision matrix."},{"title":"Routing and Data Passing","path":"/Documentation/Architecture/Routing-Data","text":"Params and route metadata."},{"title":"Layout","path":"https://components.slicejs.com/docs/layout/layout","text":"The registry layout component."}];
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

customElements.define('slice-appshellmultiroutedocumentation', AppShellMultiRouteDocumentation);
