export default class AppShellMultiRouteDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/app-shell-multiroute.md";
    this.markdownContent = "---\ntitle: App Shell + MultiRoute\nroute: /Documentation/Architecture/App-Shell-MultiRoute\nnavLabel: App Shell + MultiRoute\nsection: Project Architecture\ngroup: Styles and Patterns\norder: 2\ndescription: Build section-based apps with a persistent shell and route-driven content switching.\ncomponent: AppShellMultiRouteDocumentation\ntags: [architecture, multiroute, routing, layout]\n---\n\n# App Shell + MultiRoute\n\nUse this style when your app has multiple sections that share the same layout frame (navbar, side menu, footer, theme selector).\n\n## When to Use\n- Portfolio or company website with several top-level sections\n- Dashboard/admin panels\n- Product apps with stable global navigation\n\n## Structure\n```javascript title=\"src/routes.js\"\nconst routes = [\n  { path: '/', component: 'AppShell' },\n  { path: '/about', component: 'AppShell' },\n  { path: '/projects', component: 'AppShell' },\n  { path: '/contact', component: 'AppShell' },\n  { path: '/404', component: 'NotFound' }\n];\n\nexport default routes;\n```\n\n```javascript title=\"src/Components/AppComponents/AppShell/AppShell.js\"\nexport default class AppShell extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    const nav = await slice.build('Navbar', {\n      items: [\n        { text: 'About', path: '/' },\n        { text: 'Projects', path: '/projects' },\n        { text: 'Contact', path: '/contact' }\n      ]\n    });\n\n    const sections = await slice.build('MultiRoute', {\n      routes: [\n        { path: '/', component: 'AboutSection' },\n        { path: '/projects', component: 'ProjectsSection' },\n        { path: '/contact', component: 'ContactSection' }\n      ]\n    });\n\n    this.appendChild(nav);\n    this.querySelector('.shell-content').appendChild(sections);\n  }\n}\n\ncustomElements.define('slice-app-shell', AppShell);\n```\n\n## Data Flow Tips\n- Keep global UI state (theme/user/session) in `slice.context`.\n- Keep section-local data inside each section component.\n- Use route params/query only when URL should reflect the current state.\n\n## Common Mistakes\n:::warning\nDo not duplicate global layout per route. Keep one shell and switch only inner content.\n:::\n\n:::warning\nDo not put every tiny state in query params. Use URL state only when deep-linking matters.\n:::\n\n## Upgrade Trigger\nIf a single-view app starts adding independent URL sections, migrate to this style.\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
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
         const container = this.querySelector('[data-block-id="doc-block-2"]');
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

customElements.define('slice-appshellmultiroutedocumentation', AppShellMultiRouteDocumentation);
