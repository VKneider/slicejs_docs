export default class RoutingDataDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "project-architecture/routing-data.md";
    this.markdownContent = "---\ntitle: Routing and Data Passing\nroute: /Documentation/Architecture/Routing-Data\nnavLabel: Routing and Data Passing\nsection: Guides\ngroup: ''\norder: 40\ndescription: Understand current Slice routing behavior, slug support, query usage, and route-to-route data strategies.\ncomponent: RoutingDataDocumentation\ntags: [routing, params, query, context, events]\n---\n\n# Routing and Data Passing\n\nThis page documents current runtime behavior so architecture decisions match real Slice capabilities.\n\n## Router Behavior (Current)\n| Capability | Supported | Notes |\n| --- | --- | --- |\n| `pathname` route matching | Yes | Uses History API and `window.location.pathname` |\n| Dynamic params (`${param}`) | Yes | One segment per param |\n| Query parsing (`?a=1`) | Yes | Exposed in route info (`to.query`, `from.query`) |\n| Hash-based route matching (`#state`) | No | Hash is not used for route matching |\n| Arbitrary props in `navigate()` | No | No native payload channel in `navigate(path, options)` |\n\n## Dynamic Params (Slugs)\n```javascript title=\"routes.js\"\nconst routes = [\n  { path: '/post/${slug}', component: 'PostPage' },\n  { path: '/404', component: 'NotFound' }\n];\n```\n\nUse slugs when the URL should represent identity (post, product, user).\n\n## Query Params\n```javascript title=\"Read query in guard\"\nslice.router.beforeEach((to, from, next) => {\n  if (to.query.preview === 'true') {\n    // preview mode behavior\n  }\n  next();\n});\n```\n\n## Route-to-Route Data Strategies\n1. URL params for identity\n2. Query params for URL-visible flags\n3. `slice.context` for shared app state\n4. `slice.events` for event-driven coordination\n\n```javascript title=\"Shared state with ContextManager\"\nslice.context.create('session', { userId: null, role: 'guest' });\n\nslice.context.setState('session', { userId: 'u-42', role: 'member' });\n```\n\n```javascript title=\"Event-driven handoff\"\nslice.events.emit('checkout:started', { cartId: 'c-1001' });\n```\n\n## Important Constraint\n:::warning\nDo not assume `slice.router.navigate('/path', { data })` passes arbitrary props to destination components. Use context/events/URL state instead.\n:::\n";
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
            const table = await slice.build('Table', {
               headers: ["Capability","Supported","Notes"],
               rows: [[{"html":"<code>pathname</code> route matching"},{"html":"Yes"},{"html":"Uses History API and <code>window.location.pathname</code>"}],[{"html":"Dynamic params (<code>${param}</code>)"},{"html":"Yes"},{"html":"One segment per param"}],[{"html":"Query parsing (<code>?a=1</code>)"},{"html":"Yes"},{"html":"Exposed in route info (<code>to.query</code>, <code>from.query</code>)"}],[{"html":"Hash-based route matching (<code>#state</code>)"},{"html":"No"},{"html":"Hash is not used for route matching"}],[{"html":"Arbitrary props in <code>navigate()</code>"},{"html":"No"},{"html":"No native payload channel in <code>navigate(path, options)</code>"}]]
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
               value: "const routes = [\n  { path: '/post/${slug}', component: 'PostPage' },\n  { path: '/404', component: 'NotFound' }\n];",
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
            const code = await slice.build('CodeVisualizer', {
               value: "slice.router.beforeEach((to, from, next) => {\n  if (to.query.preview === 'true') {\n    // preview mode behavior\n  }\n  next();\n});",
               language: "javascript"
            });
            if ("Read query in guard") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Read query in guard";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.context.create('session', { userId: null, role: 'guest' });\n\nslice.context.setState('session', { userId: 'u-42', role: 'member' });",
               language: "javascript"
            });
            if ("Shared state with ContextManager") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Shared state with ContextManager";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.events.emit('checkout:started', { cartId: 'c-1001' });",
               language: "javascript"
            });
            if ("Event-driven handoff") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Event-driven handoff";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Do not assume <code>slice.router.navigate('/path', { data })</code> passes arbitrary props to destination components. Use context/events/URL state instead.</p>";
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

customElements.define('slice-routingdatadocumentation', RoutingDataDocumentation);
