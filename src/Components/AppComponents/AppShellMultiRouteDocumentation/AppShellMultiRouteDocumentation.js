export default class AppShellMultiRouteDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/app-shell-multiroute.md";
    this.markdownContent = "---\r\ntitle: App Shell + MultiRoute\r\nroute: /Documentation/Architecture/App-Shell-MultiRoute\r\nnavLabel: App Shell + MultiRoute\r\nsection: Project Architecture\r\ngroup: Styles and Patterns\r\norder: 2\r\ndescription: Build section-based apps with a persistent shell and route-driven content switching.\r\ncomponent: AppShellMultiRouteDocumentation\r\ntags: [architecture, multiroute, routing, layout]\r\n---\r\n\r\n# App Shell + MultiRoute\r\n\r\nUse this style when your app has multiple sections that share the same layout frame (navbar, side menu, footer, theme selector).\r\n\r\n## When to Use\r\n- Portfolio or company website with several top-level sections\r\n- Dashboard/admin panels\r\n- Product apps with stable global navigation\r\n\r\n> Deciding between this and Single-View SPA? See the [decision matrix](/Documentation/Architecture).\r\n\r\n## Structure\r\n```javascript title=\"src/routes.js\"\r\nconst routes = [\r\n  { path: '/', component: 'AppShell' },\r\n  { path: '/about', component: 'AppShell' },\r\n  { path: '/projects', component: 'AppShell' },\r\n  { path: '/contact', component: 'AppShell' },\r\n  { path: '/404', component: 'NotFound' }\r\n];\r\n\r\nexport default routes;\r\n```\r\n\r\n```javascript title=\"src/Components/AppComponents/AppShell/AppShell.js\"\r\nexport default class AppShell extends HTMLElement {\r\n  constructor(props) {\r\n    super();\r\n    slice.attachTemplate(this);\r\n    slice.controller.setComponentProps(this, props);\r\n  }\r\n\r\n  async init() {\r\n    const nav = await slice.build('Navbar', {\r\n      items: [\r\n        { text: 'About', path: '/' },\r\n        { text: 'Projects', path: '/projects' },\r\n        { text: 'Contact', path: '/contact' }\r\n      ]\r\n    });\r\n\r\n    const sections = await slice.build('MultiRoute', {\r\n      routes: [\r\n        { path: '/', component: 'AboutSection' },\r\n        { path: '/projects', component: 'ProjectsSection' },\r\n        { path: '/contact', component: 'ContactSection' }\r\n      ]\r\n    });\r\n\r\n    this.appendChild(nav);\r\n    this.querySelector('.shell-content').appendChild(sections);\r\n  }\r\n}\r\n\r\ncustomElements.define('slice-app-shell', AppShell);\r\n```\r\n\r\n## Data Flow Tips\r\n- Keep global UI state (theme/user/session) in `slice.context`.\r\n- Keep section-local data inside each section component.\r\n- Use route params/query only when URL should reflect the current state.\r\n\r\n## Common Mistakes\r\n:::warning\r\nDo not duplicate global layout per route. Keep one shell and switch only inner content.\r\n:::\r\n\r\n:::warning\r\nDo not put every tiny state in query params. Use URL state only when deep-linking matters.\r\n:::\r\n\r\n## Upgrade Trigger\r\nIf a single-view app starts adding independent URL sections, migrate to this style.\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const routes = [\r\n  { path: '/', component: 'AppShell' },\r\n  { path: '/about', component: 'AppShell' },\r\n  { path: '/projects', component: 'AppShell' },\r\n  { path: '/contact', component: 'AppShell' },\r\n  { path: '/404', component: 'NotFound' }\r\n];\r\n\r\nexport default routes;\r",
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
               value: "export default class AppShell extends HTMLElement {\r\n  constructor(props) {\r\n    super();\r\n    slice.attachTemplate(this);\r\n    slice.controller.setComponentProps(this, props);\r\n  }\r\n\r\n  async init() {\r\n    const nav = await slice.build('Navbar', {\r\n      items: [\r\n        { text: 'About', path: '/' },\r\n        { text: 'Projects', path: '/projects' },\r\n        { text: 'Contact', path: '/contact' }\r\n      ]\r\n    });\r\n\r\n    const sections = await slice.build('MultiRoute', {\r\n      routes: [\r\n        { path: '/', component: 'AboutSection' },\r\n        { path: '/projects', component: 'ProjectsSection' },\r\n        { path: '/contact', component: 'ContactSection' }\r\n      ]\r\n    });\r\n\r\n    this.appendChild(nav);\r\n    this.querySelector('.shell-content').appendChild(sections);\r\n  }\r\n}\r\n\r\ncustomElements.define('slice-app-shell', AppShell);\r",
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
