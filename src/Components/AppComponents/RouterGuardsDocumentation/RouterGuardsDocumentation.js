export default class RouterGuardsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/routing-guards.md";
    this.markdownContent = "---\r\ntitle: Route Guards\r\nroute: /Documentation/Routing/Guards\r\nnavLabel: Route Guards\r\nsection: Getting Started\r\ngroup: Routing\r\norder: 51\r\ndescription: Guard patterns for secure navigation.\r\ncomponent: RouterGuardsDocumentation\r\ntags: [routing, guards]\r\n---\r\n\r\n# Route Guards\r\n\r\n## Overview\r\nRoute guards let you intercept navigation before and after a route change. Use them for auth,\r\nfeature flags, redirects, analytics, and scroll or title updates.\r\n\r\nGuards run on every navigation, including the initial page load. Call `slice.router.start()`\r\nafter registering guards to ensure they are active before the first navigation.\r\n\r\n## Guard API\r\n| Method | Signature | Can block | Notes |\r\n| --- | --- | --- | --- |\r\n| `beforeEach` | `(to, from, next) => void` | yes | Call `next()` to continue or redirect. |\r\n| `afterEach` | `(to, from) => void` | no | Runs after navigation completes. |\r\n\r\n### `next()` behavior\r\n| Call | Result | Notes |\r\n| --- | --- | --- |\r\n| `next()` | continue | Normal navigation. |\r\n| `next(false)` | cancel | Navigation is cancelled. |\r\n| `next('/login')` | redirect | Redirect to path (pushState). |\r\n| `next({ path: '/login', replace: true })` | redirect | Redirect with history replace. |\r\n\r\n## Guard Context\r\n`to` and `from` include path, component, params, query, and metadata.\r\n\r\n| Field | Type | Notes |\r\n| --- | --- | --- |\r\n| `path` | `string` | Requested path or resolved full path. |\r\n| `component` | `string` | Component for the route (parent if nested). |\r\n| `params` | `object` | Params parsed from `${param}` in routes. |\r\n| `query` | `object` | URL query parameters. |\r\n| `metadata` | `object` | Route metadata from config. |\r\n\r\n## beforeEach\r\n```javascript title=\"Block or redirect\"\r\nslice.router.beforeEach(async (to, from, next) => {\r\n  if (to.metadata?.private && !isAuthenticated()) {\r\n    return next({ path: '/login' });\r\n  }\r\n  return next();\r\n});\r\n```\r\n\r\n## afterEach\r\n```javascript title=\"Post-navigation logic\"\r\nslice.router.afterEach((to, from) => {\r\n  document.title = to.metadata?.title || 'My App';\r\n  window.scrollTo(0, 0);\r\n});\r\n```\r\n\r\n## Patterns\r\n```javascript title=\"Feature flag guard\"\r\nslice.router.beforeEach((to, from, next) => {\r\n  if (to.metadata?.flag && !featureEnabled(to.metadata.flag)) {\r\n    return next('/404');\r\n  }\r\n  return next();\r\n});\r\n```\r\n\r\n```javascript title=\"Guard with replace\"\r\nslice.router.beforeEach((to, from, next) => {\r\n  if (to.path === '/old-path') {\r\n    return next({ path: '/new-path', replace: true });\r\n  }\r\n  return next();\r\n});\r\n```\r\n\r\n## Best Practices\r\n:::tip\r\nAlways call `next()` in `beforeEach`. Missing it logs a warning and navigation continues.\r\n:::\r\n\r\n:::tip\r\nKeep guard logic fast. Long async work slows down navigation.\r\n:::\r\n\r\n## Gotchas\r\n:::warning\r\nGuards can create redirect loops. The router detects loops and stops after 10 redirects.\r\n:::\r\n\r\n:::warning\r\n`afterEach` cannot block navigation. Use `beforeEach` if you need to cancel or redirect.\r\n:::\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Signature | Can block | Notes |\r","| --- | --- | --- | --- |\r","| `beforeEach` | `(to, from, next) => void` | yes | Call `next()` to continue or redirect. |\r","| `afterEach` | `(to, from) => void` | no | Runs after navigation completes. |\r"];
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
            const lines = ["| Call | Result | Notes |\r","| --- | --- | --- |\r","| `next()` | continue | Normal navigation. |\r","| `next(false)` | cancel | Navigation is cancelled. |\r","| `next('/login')` | redirect | Redirect to path (pushState). |\r","| `next({ path: '/login', replace: true })` | redirect | Redirect with history replace. |\r"];
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
            const lines = ["| Field | Type | Notes |\r","| --- | --- | --- |\r","| `path` | `string` | Requested path or resolved full path. |\r","| `component` | `string` | Component for the route (parent if nested). |\r","| `params` | `object` | Params parsed from `${param}` in routes. |\r","| `query` | `object` | URL query parameters. |\r","| `metadata` | `object` | Route metadata from config. |\r"];
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
               value: "slice.router.beforeEach(async (to, from, next) => {\r\n  if (to.metadata?.private && !isAuthenticated()) {\r\n    return next({ path: '/login' });\r\n  }\r\n  return next();\r\n});\r",
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
               value: "slice.router.afterEach((to, from) => {\r\n  document.title = to.metadata?.title || 'My App';\r\n  window.scrollTo(0, 0);\r\n});\r",
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
               value: "slice.router.beforeEach((to, from, next) => {\r\n  if (to.metadata?.flag && !featureEnabled(to.metadata.flag)) {\r\n    return next('/404');\r\n  }\r\n  return next();\r\n});\r",
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
               value: "slice.router.beforeEach((to, from, next) => {\r\n  if (to.path === '/old-path') {\r\n    return next({ path: '/new-path', replace: true });\r\n  }\r\n  return next();\r\n});\r",
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
