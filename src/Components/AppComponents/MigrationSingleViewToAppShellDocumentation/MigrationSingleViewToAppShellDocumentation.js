export default class MigrationSingleViewToAppShellDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/migration-single-view-to-shell.md";
    this.markdownContent = "---\r\ntitle: Migration: Single-View to App Shell\r\nroute: /Documentation/Architecture/Migration\r\nnavLabel: Migration: Single-View to App Shell\r\nsection: Project Architecture\r\ngroup: Styles and Patterns\r\norder: 5\r\ndescription: Incrementally migrate a single-view Slice app to a shell + multiroute architecture.\r\ncomponent: MigrationSingleViewToAppShellDocumentation\r\ntags: [migration, architecture, multiroute, routing]\r\n---\r\n\r\n# Migration: Single-View to App Shell\r\n\r\nThis migration keeps your app functional while introducing route-based sections.\r\n\r\n## Step 1: Add Shell Component\r\nCreate an `AppShell` that owns persistent UI (navbar/theme/footer) and hosts section content.\r\n\r\n## Step 2: Keep Existing Flow as One Section\r\nWrap your current single-view root as one section route (for example `/play`).\r\n\r\n## Step 3: Add New URL Sections Incrementally\r\nAdd new sections only when they are independently navigable and meaningful as URLs.\r\n\r\n## Example Migration Route Config\r\n```javascript title=\"routes.js\"\r\nconst routes = [\r\n  { path: '/', component: 'AppShell' },\r\n  { path: '/play', component: 'AppShell' },\r\n  { path: '/history', component: 'AppShell' },\r\n  { path: '/settings', component: 'AppShell' },\r\n  { path: '/404', component: 'NotFound' }\r\n];\r\n\r\nexport default routes;\r\n```\r\n\r\n## Example MultiRoute Mapping\r\n```javascript title=\"AppShell.js\"\r\nconst page = await slice.build('MultiRoute', {\r\n  routes: [\r\n    { path: '/', component: 'PlayPage' },\r\n    { path: '/play', component: 'PlayPage' },\r\n    { path: '/history', component: 'HistoryPage' },\r\n    { path: '/settings', component: 'SettingsPage' }\r\n  ]\r\n});\r\n```\r\n\r\n## Migration Checklist\r\n1. Preserve old entry path behavior while adding shell.\r\n2. Move global controls into shell.\r\n3. Split heavy root view into section components.\r\n4. Keep shared state in context to avoid prop-drilling across sections.\r\n5. Add route guards only when navigation policy requires it.\r\n\r\n:::tip\r\nMigrate in small slices. Keep one route stable, move one section at a time, and verify after each move.\r\n:::\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const routes = [\r\n  { path: '/', component: 'AppShell' },\r\n  { path: '/play', component: 'AppShell' },\r\n  { path: '/history', component: 'AppShell' },\r\n  { path: '/settings', component: 'AppShell' },\r\n  { path: '/404', component: 'NotFound' }\r\n];\r\n\r\nexport default routes;\r",
               language: "javascript"
            });
            if ("routes.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "routes.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const page = await slice.build('MultiRoute', {\r\n  routes: [\r\n    { path: '/', component: 'PlayPage' },\r\n    { path: '/play', component: 'PlayPage' },\r\n    { path: '/history', component: 'HistoryPage' },\r\n    { path: '/settings', component: 'SettingsPage' }\r\n  ]\r\n});\r",
               language: "javascript"
            });
            if ("AppShell.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "AppShell.js";
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

customElements.define('slice-migrationsingleviewtoappshelldocumentation', MigrationSingleViewToAppShellDocumentation);
