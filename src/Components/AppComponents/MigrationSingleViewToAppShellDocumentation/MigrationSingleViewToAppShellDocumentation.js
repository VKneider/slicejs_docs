export default class MigrationSingleViewToAppShellDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/migration-single-view-to-shell.md";
    this.markdownContent = "---\ntitle: Migration: Single-View to App Shell\nroute: /Documentation/Architecture/Migration\nnavLabel: Migration: Single-View to App Shell\nsection: Project Architecture\ngroup: Styles and Patterns\norder: 5\ndescription: Incrementally migrate a single-view Slice app to a shell + multiroute architecture.\ncomponent: MigrationSingleViewToAppShellDocumentation\ntags: [migration, architecture, multiroute, routing]\n---\n\n# Migration: Single-View to App Shell\n\nThis migration keeps your app functional while introducing route-based sections.\n\n## Step 1: Add Shell Component\nCreate an `AppShell` that owns persistent UI (navbar/theme/footer) and hosts section content.\n\n## Step 2: Keep Existing Flow as One Section\nWrap your current single-view root as one section route (for example `/play`).\n\n## Step 3: Add New URL Sections Incrementally\nAdd new sections only when they are independently navigable and meaningful as URLs.\n\n## Example Migration Route Config\n```javascript title=\"routes.js\"\nconst routes = [\n  { path: '/', component: 'AppShell' },\n  { path: '/play', component: 'AppShell' },\n  { path: '/history', component: 'AppShell' },\n  { path: '/settings', component: 'AppShell' },\n  { path: '/404', component: 'NotFound' }\n];\n\nexport default routes;\n```\n\n## Example MultiRoute Mapping\n```javascript title=\"AppShell.js\"\nconst page = await slice.build('MultiRoute', {\n  routes: [\n    { path: '/', component: 'PlayPage' },\n    { path: '/play', component: 'PlayPage' },\n    { path: '/history', component: 'HistoryPage' },\n    { path: '/settings', component: 'SettingsPage' }\n  ]\n});\n```\n\n## Migration Checklist\n1. Preserve old entry path behavior while adding shell.\n2. Move global controls into shell.\n3. Split heavy root view into section components.\n4. Keep shared state in context to avoid prop-drilling across sections.\n5. Add route guards only when navigation policy requires it.\n\n:::tip\nMigrate in small slices. Keep one route stable, move one section at a time, and verify after each move.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const routes = [\n  { path: '/', component: 'AppShell' },\n  { path: '/play', component: 'AppShell' },\n  { path: '/history', component: 'AppShell' },\n  { path: '/settings', component: 'AppShell' },\n  { path: '/404', component: 'NotFound' }\n];\n\nexport default routes;",
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
               value: "const page = await slice.build('MultiRoute', {\n  routes: [\n    { path: '/', component: 'PlayPage' },\n    { path: '/play', component: 'PlayPage' },\n    { path: '/history', component: 'HistoryPage' },\n    { path: '/settings', component: 'SettingsPage' }\n  ]\n});",
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
