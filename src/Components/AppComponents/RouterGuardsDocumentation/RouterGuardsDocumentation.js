export default class RouterGuardsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/routing-guards.md";
    this.markdownContent = "---\ntitle: Route Guards\nroute: /Documentation/Routing/Guards\nnavLabel: Route Guards\nsection: Getting Started\ngroup: Routing\norder: 51\ndescription: Guard patterns for secure navigation.\ncomponent: RouterGuardsDocumentation\ntags: [routing, guards]\n---\n\n# Route Guards\n\n## Overview\nRoute guards let you intercept navigation before and after a route change. Use them for auth,\nfeature flags, redirects, analytics, and scroll or title updates.\n\nGuards run on every navigation, including the initial page load. Call `slice.router.start()`\nafter registering guards to ensure they are active before the first navigation.\n\n## Guard API\n| Method | Signature | Can block | Notes |\n| --- | --- | --- | --- |\n| `beforeEach` | `(to, from, next) => void` | yes | Call `next()` to continue or redirect. |\n| `afterEach` | `(to, from) => void` | no | Runs after navigation completes. |\n\n### `next()` behavior\n| Call | Result | Notes |\n| --- | --- | --- |\n| `next()` | continue | Normal navigation. |\n| `next(false)` | cancel | Navigation is cancelled. |\n| `next('/login')` | redirect | Redirect to path (pushState). |\n| `next({ path: '/login', replace: true })` | redirect | Redirect with history replace. |\n\n## Guard Context\n`to` and `from` include path, component, params, query, and metadata.\n\n| Field | Type | Notes |\n| --- | --- | --- |\n| `path` | `string` | Requested path or resolved full path. |\n| `component` | `string` | Component for the route (parent if nested). |\n| `params` | `object` | Params parsed from `${param}` in routes. |\n| `query` | `object` | URL query parameters. |\n| `metadata` | `object` | Route metadata from config. |\n\n## beforeEach\n```javascript title=\"Block or redirect\"\nslice.router.beforeEach(async (to, from, next) => {\n  if (to.metadata?.private && !isAuthenticated()) {\n    return next({ path: '/login' });\n  }\n  return next();\n});\n```\n\n## afterEach\n```javascript title=\"Post-navigation logic\"\nslice.router.afterEach((to, from) => {\n  document.title = to.metadata?.title || 'My App';\n  window.scrollTo(0, 0);\n});\n```\n\n## Patterns\n```javascript title=\"Feature flag guard\"\nslice.router.beforeEach((to, from, next) => {\n  if (to.metadata?.flag && !featureEnabled(to.metadata.flag)) {\n    return next('/404');\n  }\n  return next();\n});\n```\n\n```javascript title=\"Guard with replace\"\nslice.router.beforeEach((to, from, next) => {\n  if (to.path === '/old-path') {\n    return next({ path: '/new-path', replace: true });\n  }\n  return next();\n});\n```\n\n## Best Practices\n:::tip\nAlways call `next()` in `beforeEach`. Missing it logs a warning and navigation continues.\n:::\n\n:::tip\nKeep guard logic fast. Long async work slows down navigation.\n:::\n\n## Gotchas\n:::warning\nGuards can create redirect loops. The router detects loops and stops after 10 redirects.\n:::\n\n:::warning\n`afterEach` cannot block navigation. Use `beforeEach` if you need to cancel or redirect.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Signature | Can block | Notes |","| --- | --- | --- | --- |","| `beforeEach` | `(to, from, next) => void` | yes | Call `next()` to continue or redirect. |","| `afterEach` | `(to, from) => void` | no | Runs after navigation completes. |"];
            const clean = (line) => {
               let value = line.trim();
               if (value.startsWith('|')) {
                  value = value.slice(1);
               }
               if (value.endsWith('|')) {
                  value = value.slice(0, -1);
               }
               return value.split('|').map((cell) => cell.trim());
            };

            const formatCell = (text) => {
               let output = text
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');

               const applyBold = (input) => {
                  let result = '';
                  let index = 0;
                  while (index < input.length) {
                     const start = input.indexOf('**', index);
                     if (start === -1) {
                        result += input.slice(index);
                        break;
                     }
                     const end = input.indexOf('**', start + 2);
                     if (end === -1) {
                        result += input.slice(index);
                        break;
                     }
                     result += input.slice(index, start) + '<strong>' + input.slice(start + 2, end) + '</strong>';
                     index = end + 2;
                  }
                  return result;
               };

               const applyInlineCode = (input) => {
                  const parts = input.split(String.fromCharCode(96));
                  if (parts.length === 1) return input;
                  return parts
                     .map((part, idx) => (idx % 2 === 1 ? '<code>' + part + '</code>' : part))
                     .join('');
               };

               output = applyBold(output);
               output = applyInlineCode(output);
               return output;
            };

            const headers = lines.length > 0 ? clean(lines[0]) : [];
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => formatCell(cell)));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const lines = ["| Call | Result | Notes |","| --- | --- | --- |","| `next()` | continue | Normal navigation. |","| `next(false)` | cancel | Navigation is cancelled. |","| `next('/login')` | redirect | Redirect to path (pushState). |","| `next({ path: '/login', replace: true })` | redirect | Redirect with history replace. |"];
            const clean = (line) => {
               let value = line.trim();
               if (value.startsWith('|')) {
                  value = value.slice(1);
               }
               if (value.endsWith('|')) {
                  value = value.slice(0, -1);
               }
               return value.split('|').map((cell) => cell.trim());
            };

            const formatCell = (text) => {
               let output = text
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');

               const applyBold = (input) => {
                  let result = '';
                  let index = 0;
                  while (index < input.length) {
                     const start = input.indexOf('**', index);
                     if (start === -1) {
                        result += input.slice(index);
                        break;
                     }
                     const end = input.indexOf('**', start + 2);
                     if (end === -1) {
                        result += input.slice(index);
                        break;
                     }
                     result += input.slice(index, start) + '<strong>' + input.slice(start + 2, end) + '</strong>';
                     index = end + 2;
                  }
                  return result;
               };

               const applyInlineCode = (input) => {
                  const parts = input.split(String.fromCharCode(96));
                  if (parts.length === 1) return input;
                  return parts
                     .map((part, idx) => (idx % 2 === 1 ? '<code>' + part + '</code>' : part))
                     .join('');
               };

               output = applyBold(output);
               output = applyInlineCode(output);
               return output;
            };

            const headers = lines.length > 0 ? clean(lines[0]) : [];
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => formatCell(cell)));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const lines = ["| Field | Type | Notes |","| --- | --- | --- |","| `path` | `string` | Requested path or resolved full path. |","| `component` | `string` | Component for the route (parent if nested). |","| `params` | `object` | Params parsed from `${param}` in routes. |","| `query` | `object` | URL query parameters. |","| `metadata` | `object` | Route metadata from config. |"];
            const clean = (line) => {
               let value = line.trim();
               if (value.startsWith('|')) {
                  value = value.slice(1);
               }
               if (value.endsWith('|')) {
                  value = value.slice(0, -1);
               }
               return value.split('|').map((cell) => cell.trim());
            };

            const formatCell = (text) => {
               let output = text
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');

               const applyBold = (input) => {
                  let result = '';
                  let index = 0;
                  while (index < input.length) {
                     const start = input.indexOf('**', index);
                     if (start === -1) {
                        result += input.slice(index);
                        break;
                     }
                     const end = input.indexOf('**', start + 2);
                     if (end === -1) {
                        result += input.slice(index);
                        break;
                     }
                     result += input.slice(index, start) + '<strong>' + input.slice(start + 2, end) + '</strong>';
                     index = end + 2;
                  }
                  return result;
               };

               const applyInlineCode = (input) => {
                  const parts = input.split(String.fromCharCode(96));
                  if (parts.length === 1) return input;
                  return parts
                     .map((part, idx) => (idx % 2 === 1 ? '<code>' + part + '</code>' : part))
                     .join('');
               };

               output = applyBold(output);
               output = applyInlineCode(output);
               return output;
            };

            const headers = lines.length > 0 ? clean(lines[0]) : [];
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => formatCell(cell)));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.router.beforeEach(async (to, from, next) => {\n  if (to.metadata?.private && !isAuthenticated()) {\n    return next({ path: '/login' });\n  }\n  return next();\n});",
               language: "javascript"
            });
            if ("Block or redirect") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Block or redirect";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.router.afterEach((to, from) => {\n  document.title = to.metadata?.title || 'My App';\n  window.scrollTo(0, 0);\n});",
               language: "javascript"
            });
            if ("Post-navigation logic") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Post-navigation logic";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.router.beforeEach((to, from, next) => {\n  if (to.metadata?.flag && !featureEnabled(to.metadata.flag)) {\n    return next('/404');\n  }\n  return next();\n});",
               language: "javascript"
            });
            if ("Feature flag guard") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Feature flag guard";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.router.beforeEach((to, from, next) => {\n  if (to.path === '/old-path') {\n    return next({ path: '/new-path', replace: true });\n  }\n  return next();\n});",
               language: "javascript"
            });
            if ("Guard with replace") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Guard with replace";
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

customElements.define('slice-routerguardsdocumentation', RouterGuardsDocumentation);
