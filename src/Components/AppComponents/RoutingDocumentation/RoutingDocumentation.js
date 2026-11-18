export default class RoutingDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/routing.md";
    this.markdownContent = "---\ntitle: Slice Routing\nroute: /Documentation/Routing\nnavLabel: Routing\nsection: State & Routing\ngroup: ''\norder: 10\ndescription: Router setup, navigation, and guards.\ncomponent: RoutingDocumentation\ntags: [routing, router, guards]\n---\n\n# Slice Routing\n\n## Overview\nSlice Router handles client-side navigation, route parameters, nested routes, and route containers.\nIt auto-starts shortly after initialization, but you should call `start()` manually when you use\nguards to ensure your guard logic runs before the first navigation.\n\nRouting is driven by a `routes.js` file and a runtime router available at `slice.router`.\n\nPath matching is **case-insensitive**: `/About` resolves to a route declared as `/about`. This\napplies to both static and `${param}` routes, and to `MultiRoute` containers. Captured parameter\nvalues keep their original case (for example `${id}` in `/User/AB12` is `AB12`).\n\n## Router API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `start` | `() => Promise<void>` | `Promise<void>` | Starts routing immediately. Recommended when using guards. |\n| `navigate` | `(path, options?)` | `Promise<void>` | Programmatic navigation. Pass `{ replace: true }` to replace history instead of pushing, and `{ locale }` to switch language when the translator puts the locale in the URL. |\n| `href` | `(path, { locale? }?) => string` | `string` | The URL to render in an `<a>`. With `translator.localePrefix` it carries the locale (`/pricing` → `/en/pricing`); without it, the path is returned unchanged. |\n| `path` | getter | `string` | The app path the router is showing, without locale or query. Use it instead of `window.location.pathname`. |\n| `beforeEach` | `(guard)` | `void` | Registers a guard `(to, from, next)`. |\n| `afterEach` | `(guard)` | `void` | Registers a guard `(to, from)` after navigation. |\n\n`slice.path` and `slice.href(path)` are the shortcuts at the `slice` level: components use those\ninstead of `window.location.pathname` and of a per-component helper.\n\n## Route Configuration\n```javascript title=\"routes.js\"\nconst routes = [\n  { path: '/', component: 'HomePage' },\n  { path: '/about', component: 'AboutPage' },\n  { path: '/user/${id}', component: 'UserProfile', metadata: { private: true } },\n  { path: '/docs', component: 'Docs', children: [\n    { path: '/intro', component: 'DocsIntro' }\n  ]},\n  { path: '/404', component: 'NotFound' }\n];\n\nexport default routes;\n```\n\n### Route Definition Fields\n| Field | Type | Required | Notes |\n| --- | --- | --- | --- |\n| `path` | `string` | yes | Supports dynamic params using `${param}`. |\n| `component` | `string` | yes | Component name from `components.js`. |\n| `children` | `Array<Route>` | no | Nested routes inherit parent path. |\n| `metadata` | `object` | no | Arbitrary data for guards and UI. `title`/`titleKey` and `description`/`descriptionKey` are read by the router (see below). |\n\n### Route metadata and the document title\n`metadata` is free-form. The router reads these fields on every navigation, including the first one:\n\n| Field | Effect |\n| --- | --- |\n| `title` | `document.title`, literal |\n| `titleKey` | a dictionary key; with the translator on it wins over `title` |\n| `titlePrefix` / `titleSuffix` | per-route affixes; default to `router.titlePrefix` / `router.titleSuffix`, `false` disables them |\n| `titlePrefix` / `titleSuffix` | text before/after the title; the separator is part of the string, `false` disables it |\n| `description` / `descriptionKey` | the `meta[name=\"description\"]` content, same rules |\n\nThe product name belongs in the config, not in every route:\n\n```json title=\"src/sliceConfig.json\"\n\"router\": {\n  \"titleSuffix\": \" · Acme\"\n}\n```\n\nA route with `metadata: { titleKey: 'pricing.title' }` renders `Precios · Acme` in Spanish and\n`Pricing · Acme` in English. `titlePrefix` is the mirror (`\"Acme · \"`), and both compose as\n`prefix + title + suffix`; only one, both or neither are valid. The separator is part of the string.\n\n`titleKey` wins over `title` when the translator is enabled. With it disabled the key is shown as the\ntitle and the router logs one warning per key, so an untranslated page is visible instead of silently\nwrong. The server reads the same `router.titlePrefix/titleSuffix` when it prerenders, so the tab title\ndoes not change after hydration.\n\nIt only writes what the route declares: a route without a title keeps whatever the server sent, so a\nprerendered page is never downgraded. `canonical` and `robots` are never written from the client —\ncrawlers do not run JavaScript. A `router:change` listener still wins, because the metadata is applied\nbefore the event. Opt out with `router.updateTitles: false` in `sliceConfig.json`.\n\nSee [SEO and Share Cards](/Documentation/Architecture/SEO) for the server half of the same metadata.\n\n## Route Info Object\nGuards and route events receive `to` and `from` objects created by the router.\n\n| Field | Type | Notes |\n| --- | --- | --- |\n| `path` | `string` | The app path, without a locale prefix: `/pricing`. |\n| `component` | `string` | Component for the route (parent if nested). |\n| `params` | `object` | Dynamic params from `${param}` patterns. |\n| `query` | `object` | Parsed query string values. |\n| `metadata` | `object` | Route metadata from config. |\n| `locale` | `string \\| null` | The locale of this navigation, when `translator.localePrefix` is on. |\n| `url` | `string` | What the address bar shows (`/en/pricing` with a locale prefix). |\n\nSee [Translating an app](/Documentation/Translator) for locale-in-URL routing.\n\n## Basic Navigation\n```javascript title=\"Navigate programmatically\"\nawait slice.router.navigate('/about');\n\n// Replace the current history entry instead of pushing a new one:\nawait slice.router.navigate('/login', { replace: true });\n```\n\n## Route Containers\nSlice provides two route container components:\n\n- `slice-route` for a single path\n- `slice-multi-route` for a list of routes\n\nThey cache components and call `update()` when a cached component is reused.\n\n:::warning\n`routes.js` is the **single source of truth** for the Router. Containers do **not** register their\npaths with the Router — they only choose which component to show for the current URL. So every path\na `Route`/`MultiRoute` can show must also exist in `routes.js` (in the App Shell pattern it maps to\nthe shell). Otherwise a direct load, refresh, or deep-link to that URL resolves before the container\nmounts and falls through to `/404`.\n:::\n\n```javascript title=\"Route container\"\nconst route = await slice.build('Route', {\n  path: '/settings',\n  component: 'SettingsPage'\n});\n\nsomeContainer.appendChild(route);\n```\n\n```javascript title=\"MultiRoute container\"\nconst multi = await slice.build('MultiRoute', {\n  routes: [\n    { path: '/account', component: 'AccountPage' },\n    { path: '/billing', component: 'BillingPage' }\n  ]\n});\n\nsomeContainer.appendChild(multi);\n```\n\n## Guards\n```javascript title=\"beforeEach and afterEach\"\nslice.router.beforeEach(async (to, from, next) => {\n  if (to.metadata?.private && !isAuthenticated()) {\n    return next({ path: '/login' });\n  }\n  return next();\n});\n\nslice.router.afterEach((to) => {\n  document.title = to.metadata?.title || 'My App';\n});\n\nawait slice.router.start();\n```\n\n## Route Change Events\nThe router emits `router:change` **once per navigation**, after the new route has been rendered.\nHow you listen depends on whether EventManager is enabled — it's one or the other, **never both**:\n\n- **`events.enabled: true`** → it goes through EventManager (`slice.events`).\n- **`events.enabled: false`** → it dispatches a `CustomEvent` of the same name on `window` instead.\n\nEither way the payload is `{ to, from }`, where each is a route object shaped\n`{ path, component, params, query, metadata }`:\n\n```javascript title=\"Events enabled — EventManager\"\nslice.events.subscribe('router:change', ({ to, from }) => {\n  console.log('Route changed:', from?.path, '->', to.path);\n});\n```\n\n```javascript title=\"Events disabled — window CustomEvent\"\nwindow.addEventListener('router:change', (e) => {\n  const { to, from } = e.detail; // same { to, from } payload, under event.detail\n  console.log('Route changed:', from?.path, '->', to.path);\n});\n```\n\nWhen events are enabled, `router:change` is **auto-declared** in the\n[Event Registry](/Documentation/Structural/EventRegistry), so you can subscribe without\n`register()`-ing it first.\n\n:::warning\nPrefer the event's `to` payload over reading `slice.router.activeRoute` inside the handler.\n`activeRoute` does reflect the new route by the time `router:change` fires, but the payload is the\nguaranteed source and keeps your listener decoupled from router internals. If you only need the\ncurrent URL, `window.location.pathname` is always trustworthy the instant the event fires.\n:::\n\n## Best Practices\n:::tip\nCall `start()` after registering guards to avoid missing the first navigation.\n:::\n\n:::tip\nUse metadata flags to keep guard logic declarative and centralized.\n:::\n\n## Gotchas\n:::warning\n`navigate()` is async. Await it when you depend on the next route being ready.\n:::\n\n:::warning\nDynamic params use `${param}` syntax, not `:param`.\n:::\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"State & Routing"}]
            });
            if (breadcrumbs) {
               container.appendChild(breadcrumbs);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Returns","Notes"],
               rows: [[{"html":"<code>start</code>"},{"html":"<code>() =&gt; Promise&lt;void&gt;</code>"},{"html":"<code>Promise&lt;void&gt;</code>"},{"html":"Starts routing immediately. Recommended when using guards."}],[{"html":"<code>navigate</code>"},{"html":"<code>(path, options?)</code>"},{"html":"<code>Promise&lt;void&gt;</code>"},{"html":"Programmatic navigation. Pass <code>{ replace: true }</code> to replace history instead of pushing, and <code>{ locale }</code> to switch language when the translator puts the locale in the URL."}],[{"html":"<code>href</code>"},{"html":"<code>(path, { locale? }?) =&gt; string</code>"},{"html":"<code>string</code>"},{"html":"The URL to render in an <code>&lt;a&gt;</code>. With <code>translator.localePrefix</code> it carries the locale (<code>/pricing</code> → <code>/en/pricing</code>); without it, the path is returned unchanged."}],[{"html":"<code>path</code>"},{"html":"getter"},{"html":"<code>string</code>"},{"html":"The app path the router is showing, without locale or query. Use it instead of <code>window.location.pathname</code>."}],[{"html":"<code>beforeEach</code>"},{"html":"<code>(guard)</code>"},{"html":"<code>void</code>"},{"html":"Registers a guard <code>(to, from, next)</code>."}],[{"html":"<code>afterEach</code>"},{"html":"<code>(guard)</code>"},{"html":"<code>void</code>"},{"html":"Registers a guard <code>(to, from)</code> after navigation."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Required","Notes"],
               rows: [[{"html":"<code>path</code>"},{"html":"<code>string</code>"},{"html":"yes"},{"html":"Supports dynamic params using <code>${param}</code>."}],[{"html":"<code>component</code>"},{"html":"<code>string</code>"},{"html":"yes"},{"html":"Component name from <code>components.js</code>."}],[{"html":"<code>children</code>"},{"html":"<code>Array&lt;Route&gt;</code>"},{"html":"no"},{"html":"Nested routes inherit parent path."}],[{"html":"<code>metadata</code>"},{"html":"<code>object</code>"},{"html":"no"},{"html":"Arbitrary data for guards and UI. <code>title</code>/<code>titleKey</code> and <code>description</code>/<code>descriptionKey</code> are read by the router (see below)."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Effect"],
               rows: [[{"html":"<code>title</code>"},{"html":"<code>document.title</code>, literal"}],[{"html":"<code>titleKey</code>"},{"html":"a dictionary key; with the translator on it wins over <code>title</code>"}],[{"html":"<code>titlePrefix</code> / <code>titleSuffix</code>"},{"html":"per-route affixes; default to <code>router.titlePrefix</code> / <code>router.titleSuffix</code>, <code>false</code> disables them"}],[{"html":"<code>titlePrefix</code> / <code>titleSuffix</code>"},{"html":"text before/after the title; the separator is part of the string, <code>false</code> disables it"}],[{"html":"<code>description</code> / <code>descriptionKey</code>"},{"html":"the <code>meta[name=\"description\"]</code> content, same rules"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","Type","Notes"],
               rows: [[{"html":"<code>path</code>"},{"html":"<code>string</code>"},{"html":"The app path, without a locale prefix: <code>/pricing</code>."}],[{"html":"<code>component</code>"},{"html":"<code>string</code>"},{"html":"Component for the route (parent if nested)."}],[{"html":"<code>params</code>"},{"html":"<code>object</code>"},{"html":"Dynamic params from <code>${param}</code> patterns."}],[{"html":"<code>query</code>"},{"html":"<code>object</code>"},{"html":"Parsed query string values."}],[{"html":"<code>metadata</code>"},{"html":"<code>object</code>"},{"html":"Route metadata from config."}],[{"html":"<code>locale</code>"},{"html":"<code>string | null</code>"},{"html":"The locale of this navigation, when <code>translator.localePrefix</code> is on."}],[{"html":"<code>url</code>"},{"html":"<code>string</code>"},{"html":"What the address bar shows (<code>/en/pricing</code> with a locale prefix)."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
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
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p><code>routes.js</code> is the <strong>single source of truth</strong> for the Router. Containers do <strong>not</strong> register their paths with the Router — they only choose which component to show for the current URL. So every path a <code>Route</code>/<code>MultiRoute</code> can show must also exist in <code>routes.js</code> (in the App Shell pattern it maps to the shell). Otherwise a direct load, refresh, or deep-link to that URL resolves before the container mounts and falls through to <code>/404</code>.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-11"]');
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
         const container = this.querySelector('[data-block-id="doc-block-12"]');
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
         const container = this.querySelector('[data-block-id="doc-block-13"]');
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
         const container = this.querySelector('[data-block-id="doc-block-14"]');
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
      {
         const container = this.querySelector('[data-block-id="doc-block-15"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Prefer the event's <code>to</code> payload over reading <code>slice.router.activeRoute</code> inside the handler. <code>activeRoute</code> does reflect the new route by the time <code>router:change</code> fires, but the payload is the guaranteed source and keeps your listener decoupled from router internals. If you only need the current URL, <code>window.location.pathname</code> is always trustworthy the instant the event fires.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-16"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Call <code>start()</code> after registering guards to avoid missing the first navigation.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-17"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Use metadata flags to keep guard logic declarative and centralized.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-18"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p><code>navigate()</code> is async. Await it when you depend on the next route being ready.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-19"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Dynamic params use <code>${param}</code> syntax, not <code>:param</code>.</p>";
            const callout = await slice.build('Callout', {
               tone: "warning",
               variant: "soft",
               title: "Warning",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
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

customElements.define('slice-routingdocumentation', RoutingDocumentation);
