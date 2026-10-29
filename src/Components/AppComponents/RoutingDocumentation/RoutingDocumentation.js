export default class RoutingDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/routing.md";
    this.markdownContent = "---\ntitle: Slice Routing\nroute: /Documentation/Routing\nnavLabel: Routing\nsection: Getting Started\ngroup: Routing\norder: 50\ndescription: Router setup, navigation, and guards.\ncomponent: RoutingDocumentation\ntags: [routing, router, guards]\n---\n\n# Slice Routing\n\n## Overview\nSlice Router handles client-side navigation, route parameters, nested routes, and route containers.\nIt auto-starts shortly after initialization, but you should call `start()` manually when you use\nguards to ensure your guard logic runs before the first navigation.\n\nRouting is driven by a `routes.js` file and a runtime router available at `slice.router`.\n\nPath matching is **case-insensitive**: `/About` resolves to a route declared as `/about`. This\napplies to both static and `${param}` routes, and to `MultiRoute` containers. Captured parameter\nvalues keep their original case (for example `${id}` in `/User/AB12` is `AB12`).\n\n## Router API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `start` | `() => Promise<void>` | `Promise<void>` | Starts routing immediately. Recommended when using guards. |\n| `navigate` | `(path, options?)` | `Promise<void>` | Programmatic navigation. Pass `{ replace: true }` to replace history instead of pushing, and `{ locale }` to switch language when the translator puts the locale in the URL. |\n| `href` | `(path, { locale? }?) => string` | `string` | The URL to render in an `<a>`. With `translator.localePrefix` it carries the locale (`/pricing` → `/en/pricing`); without it, the path is returned unchanged. |\n| `path` | getter | `string` | The app path the router is showing, without locale or query. Use it instead of `window.location.pathname`. |\n| `beforeEach` | `(guard)` | `void` | Registers a guard `(to, from, next)`. |\n| `afterEach` | `(guard)` | `void` | Registers a guard `(to, from)` after navigation. |\n\n`slice.path` and `slice.href(path)` are the shortcuts at the `slice` level: components use those\ninstead of `window.location.pathname` and of a per-component helper.\n\n## Route Configuration\n```javascript title=\"routes.js\"\nconst routes = [\n  { path: '/', component: 'HomePage' },\n  { path: '/about', component: 'AboutPage' },\n  { path: '/user/${id}', component: 'UserProfile', metadata: { private: true } },\n  { path: '/docs', component: 'Docs', children: [\n    { path: '/intro', component: 'DocsIntro' }\n  ]},\n  { path: '/404', component: 'NotFound' }\n];\n\nexport default routes;\n```\n\n### Route Definition Fields\n| Field | Type | Required | Notes |\n| --- | --- | --- | --- |\n| `path` | `string` | yes | Supports dynamic params using `${param}`. |\n| `component` | `string` | yes | Component name from `components.js`. |\n| `children` | `Array<Route>` | no | Nested routes inherit parent path. |\n| `metadata` | `object` | no | Arbitrary data for guards and UI. `title`/`titleKey` and `description`/`descriptionKey` are read by the router (see below). |\n\n### Route metadata and the document title\n`metadata` is free-form. The router reads these fields on every navigation, including the first one:\n\n| Field | Effect |\n| --- | --- |\n| `title` | `document.title`, literal |\n| `titleKey` | a dictionary key; with the translator on it wins over `title` |\n| `titlePrefix` / `titleSuffix` | per-route affixes; default to `router.titlePrefix` / `router.titleSuffix`, `false` disables them |\n| `titlePrefix` / `titleSuffix` | text before/after the title; the separator is part of the string, `false` disables it |\n| `description` / `descriptionKey` | the `meta[name=\"description\"]` content, same rules |\n\nThe product name belongs in the config, not in every route:\n\n```json title=\"src/sliceConfig.json\"\n\"router\": {\n  \"titleSuffix\": \" · Acme\"\n}\n```\n\nA route with `metadata: { titleKey: 'pricing.title' }` renders `Precios · Acme` in Spanish and\n`Pricing · Acme` in English. `titlePrefix` is the mirror (`\"Acme · \"`), and both compose as\n`prefix + title + suffix`; only one, both or neither are valid. The separator is part of the string.\n\n`titleKey` wins over `title` when the translator is enabled. With it disabled the key is shown as the\ntitle and the router logs one warning per key, so an untranslated page is visible instead of silently\nwrong. The server reads the same `router.titlePrefix/titleSuffix` when it prerenders, so the tab title\ndoes not change after hydration.\n\nIt only writes what the route declares: a route without a title keeps whatever the server sent, so a\nprerendered page is never downgraded. `canonical` and `robots` are never written from the client —\ncrawlers do not run JavaScript. A `router:change` listener still wins, because the metadata is applied\nbefore the event. Opt out with `router.updateTitles: false` in `sliceConfig.json`.\n\nSee [SEO and Share Cards](/Documentation/Architecture/SEO) for the server half of the same metadata.\n\n## Route Info Object\nGuards and route events receive `to` and `from` objects created by the router.\n\n| Field | Type | Notes |\n| --- | --- | --- |\n| `path` | `string` | The app path, without a locale prefix: `/pricing`. |\n| `component` | `string` | Component for the route (parent if nested). |\n| `params` | `object` | Dynamic params from `${param}` patterns. |\n| `query` | `object` | Parsed query string values. |\n| `metadata` | `object` | Route metadata from config. |\n| `locale` | `string \\| null` | The locale of this navigation, when `translator.localePrefix` is on. |\n| `url` | `string` | What the address bar shows (`/en/pricing` with a locale prefix). |\n\nSee [Translating an app](/Documentation/Translator) for locale-in-URL routing.\n\n## Basic Navigation\n```javascript title=\"Navigate programmatically\"\nawait slice.router.navigate('/about');\n\n// Replace the current history entry instead of pushing a new one:\nawait slice.router.navigate('/login', { replace: true });\n```\n\n## Route Containers\nSlice provides two route container components:\n\n- `slice-route` for a single path\n- `slice-multi-route` for a list of routes\n\nThey cache components and call `update()` when a cached component is reused.\n\n:::warning\n`routes.js` is the **single source of truth** for the Router. Containers do **not** register their\npaths with the Router — they only choose which component to show for the current URL. So every path\na `Route`/`MultiRoute` can show must also exist in `routes.js` (in the App Shell pattern it maps to\nthe shell). Otherwise a direct load, refresh, or deep-link to that URL resolves before the container\nmounts and falls through to `/404`.\n:::\n\n```javascript title=\"Route container\"\nconst route = await slice.build('Route', {\n  path: '/settings',\n  component: 'SettingsPage'\n});\n\nsomeContainer.appendChild(route);\n```\n\n```javascript title=\"MultiRoute container\"\nconst multi = await slice.build('MultiRoute', {\n  routes: [\n    { path: '/account', component: 'AccountPage' },\n    { path: '/billing', component: 'BillingPage' }\n  ]\n});\n\nsomeContainer.appendChild(multi);\n```\n\n## Guards\n```javascript title=\"beforeEach and afterEach\"\nslice.router.beforeEach(async (to, from, next) => {\n  if (to.metadata?.private && !isAuthenticated()) {\n    return next({ path: '/login' });\n  }\n  return next();\n});\n\nslice.router.afterEach((to) => {\n  document.title = to.metadata?.title || 'My App';\n});\n\nawait slice.router.start();\n```\n\n## Route Change Events\nThe router emits `router:change` **once per navigation**, after the new route has been rendered.\nHow you listen depends on whether EventManager is enabled — it's one or the other, **never both**:\n\n- **`events.enabled: true`** → it goes through EventManager (`slice.events`).\n- **`events.enabled: false`** → it dispatches a `CustomEvent` of the same name on `window` instead.\n\nEither way the payload is `{ to, from }`, where each is a route object shaped\n`{ path, component, params, query, metadata }`:\n\n```javascript title=\"Events enabled — EventManager\"\nslice.events.subscribe('router:change', ({ to, from }) => {\n  console.log('Route changed:', from?.path, '->', to.path);\n});\n```\n\n```javascript title=\"Events disabled — window CustomEvent\"\nwindow.addEventListener('router:change', (e) => {\n  const { to, from } = e.detail; // same { to, from } payload, under event.detail\n  console.log('Route changed:', from?.path, '->', to.path);\n});\n```\n\nWhen events are enabled, `router:change` is **auto-declared** in the\n[Event Registry](/Documentation/Structural/EventRegistry), so you can subscribe without\n`register()`-ing it first.\n\n:::warning\nPrefer the event's `to` payload over reading `slice.router.activeRoute` inside the handler.\n`activeRoute` does reflect the new route by the time `router:change` fires, but the payload is the\nguaranteed source and keeps your listener decoupled from router internals. If you only need the\ncurrent URL, `window.location.pathname` is always trustworthy the instant the event fires.\n:::\n\n## Best Practices\n:::tip\nCall `start()` after registering guards to avoid missing the first navigation.\n:::\n\n:::tip\nUse metadata flags to keep guard logic declarative and centralized.\n:::\n\n## Gotchas\n:::warning\n`navigate()` is async. Await it when you depend on the next route being ready.\n:::\n\n:::warning\nDynamic params use `${param}` syntax, not `:param`.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Signature | Returns | Notes |","| --- | --- | --- | --- |","| `start` | `() => Promise<void>` | `Promise<void>` | Starts routing immediately. Recommended when using guards. |","| `navigate` | `(path, options?)` | `Promise<void>` | Programmatic navigation. Pass `{ replace: true }` to replace history instead of pushing, and `{ locale }` to switch language when the translator puts the locale in the URL. |","| `href` | `(path, { locale? }?) => string` | `string` | The URL to render in an `<a>`. With `translator.localePrefix` it carries the locale (`/pricing` → `/en/pricing`); without it, the path is returned unchanged. |","| `path` | getter | `string` | The app path the router is showing, without locale or query. Use it instead of `window.location.pathname`. |","| `beforeEach` | `(guard)` | `void` | Registers a guard `(to, from, next)`. |","| `afterEach` | `(guard)` | `void` | Registers a guard `(to, from)` after navigation. |"];
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
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const routes = [\n  { path: '/', component: 'HomePage' },\n  { path: '/about', component: 'AboutPage' },\n  { path: '/user/${id}', component: 'UserProfile', metadata: { private: true } },\n  { path: '/docs', component: 'Docs', children: [\n    { path: '/intro', component: 'DocsIntro' }\n  ]},\n  { path: '/404', component: 'NotFound' }\n];\n\nexport default routes;",
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const lines = ["| Field | Type | Required | Notes |","| --- | --- | --- | --- |","| `path` | `string` | yes | Supports dynamic params using `${param}`. |","| `component` | `string` | yes | Component name from `components.js`. |","| `children` | `Array<Route>` | no | Nested routes inherit parent path. |","| `metadata` | `object` | no | Arbitrary data for guards and UI. `title`/`titleKey` and `description`/`descriptionKey` are read by the router (see below). |"];
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
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const lines = ["| Field | Effect |","| --- | --- |","| `title` | `document.title`, literal |","| `titleKey` | a dictionary key; with the translator on it wins over `title` |","| `titlePrefix` / `titleSuffix` | per-route affixes; default to `router.titlePrefix` / `router.titleSuffix`, `false` disables them |","| `titlePrefix` / `titleSuffix` | text before/after the title; the separator is part of the string, `false` disables it |","| `description` / `descriptionKey` | the `meta[name=\"description\"]` content, same rules |"];
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
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "\"router\": {\n  \"titleSuffix\": \" · Acme\"\n}",
               language: "json"
            });
            if ("src/sliceConfig.json") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "src/sliceConfig.json";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const lines = ["| Field | Type | Notes |","| --- | --- | --- |","| `path` | `string` | The app path, without a locale prefix: `/pricing`. |","| `component` | `string` | Component for the route (parent if nested). |","| `params` | `object` | Dynamic params from `${param}` patterns. |","| `query` | `object` | Parsed query string values. |","| `metadata` | `object` | Route metadata from config. |","| `locale` | `string \\| null` | The locale of this navigation, when `translator.localePrefix` is on. |","| `url` | `string` | What the address bar shows (`/en/pricing` with a locale prefix). |"];
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
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "await slice.router.navigate('/about');\n\n// Replace the current history entry instead of pushing a new one:\nawait slice.router.navigate('/login', { replace: true });",
               language: "javascript"
            });
            if ("Navigate programmatically") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Navigate programmatically";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const route = await slice.build('Route', {\n  path: '/settings',\n  component: 'SettingsPage'\n});\n\nsomeContainer.appendChild(route);",
               language: "javascript"
            });
            if ("Route container") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Route container";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const multi = await slice.build('MultiRoute', {\n  routes: [\n    { path: '/account', component: 'AccountPage' },\n    { path: '/billing', component: 'BillingPage' }\n  ]\n});\n\nsomeContainer.appendChild(multi);",
               language: "javascript"
            });
            if ("MultiRoute container") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "MultiRoute container";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.router.beforeEach(async (to, from, next) => {\n  if (to.metadata?.private && !isAuthenticated()) {\n    return next({ path: '/login' });\n  }\n  return next();\n});\n\nslice.router.afterEach((to) => {\n  document.title = to.metadata?.title || 'My App';\n});\n\nawait slice.router.start();",
               language: "javascript"
            });
            if ("beforeEach and afterEach") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "beforeEach and afterEach";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.events.subscribe('router:change', ({ to, from }) => {\n  console.log('Route changed:', from?.path, '->', to.path);\n});",
               language: "javascript"
            });
            if ("Events enabled — EventManager") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Events enabled — EventManager";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "window.addEventListener('router:change', (e) => {\n  const { to, from } = e.detail; // same { to, from } payload, under event.detail\n  console.log('Route changed:', from?.path, '->', to.path);\n});",
               language: "javascript"
            });
            if ("Events disabled — window CustomEvent") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Events disabled — window CustomEvent";
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

customElements.define('slice-routingdocumentation', RoutingDocumentation);
