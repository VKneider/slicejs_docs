export default class RouterGuardsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/routing-guards.md";
    this.markdownContent = "---\ntitle: Route Guards\nroute: /Documentation/Routing/Guards\nnavLabel: Route Guards\nsection: State & Routing\ngroup: ''\norder: 20\ndescription: Block, redirect or observe navigation with beforeEach and afterEach.\ncomponent: RouterGuardsDocumentation\ntags: [routing, guards, auth, redirects]\n---\n\n# Route Guards\n\n## Overview\nRoute guards let you intercept navigation before and after a route change. Use them for auth,\nfeature flags, redirects, analytics, and scroll or title updates.\n\nGuards run on every navigation, including the initial page load. Call `slice.router.start()` after\nregistering guards to ensure they are active before the first navigation.\n\n## Guard API\n| Method | Signature | Can block | Notes |\n| --- | --- | --- | --- |\n| `beforeEach` | `(to, from, next) => void` | yes | Call `next()` to continue or redirect. |\n| `afterEach` | `(to, from) => void` | no | Runs after navigation completes. |\n\n:::compare left=\"beforeEach — gate\" right=\"afterEach — observer\" leftTone=\"accent\" rightTone=\"info\"\nCan cancel, redirect or continue. Use it for auth, feature flags and canonical paths. Every path through the guard must call `next()`.\n---\nCannot block; the navigation already happened. Use it for titles, scroll position, analytics and other post-navigation effects.\n:::\n\n### `next()` behavior\n| Call | Result | Notes |\n| --- | --- | --- |\n| `next()` | continue | Normal navigation. |\n| `next(false)` | cancel | Navigation is cancelled. |\n| `next('/login')` | redirect | Redirect to path (pushState). |\n| `next({ path: '/login', replace: true })` | redirect | Redirect with history replace. |\n\n## Guard context\n`to` and `from` are **Route Info** objects (`path`, `component`, `params`, `query`, `metadata`).\nSee [Routing → Route Info Object](/Documentation/Routing) for the field reference.\n\n## beforeEach\n```javascript title=\"Block or redirect\"\nslice.router.beforeEach(async (to, from, next) => {\n  if (to.metadata?.private && !isAuthenticated()) {\n    return next({ path: '/login' });\n  }\n  return next();\n});\n```\n\n## afterEach\n```javascript title=\"Post-navigation logic\"\nslice.router.afterEach((to, from) => {\n  document.title = to.metadata?.title || 'My App';\n  window.scrollTo(0, 0);\n});\n```\n\n## Patterns\n```javascript title=\"Feature flag guard\"\nslice.router.beforeEach((to, from, next) => {\n  if (to.metadata?.flag && !featureEnabled(to.metadata.flag)) {\n    return next('/404');\n  }\n  return next();\n});\n```\n\n```javascript title=\"Guard with replace\"\nslice.router.beforeEach((to, from, next) => {\n  if (to.path === '/old-path') {\n    return next({ path: '/new-path', replace: true });\n  }\n  return next();\n});\n```\n\n:::details title=\"Can a guard be async?\"\nYes: `beforeEach` may be `async`, but it must still call `next()` (or return a redirect). Keep the\nguard fast — it runs on every navigation. Put a one-time session check in a Service and reuse the\nresult instead of fetching it again on each route change.\n:::\n\n:::warning\nGuards can create redirect loops. The router detects them and stops after 10 redirects, but the real\nfix is to make the redirect target reachable without running the same guard again (for example,\nexclude `/login` from the auth redirect).\n:::\n\n:::related\n- [Routing](/Documentation/Routing) - Route Info, `router:change` and navigation.\n- [App Shell + MultiRoute](/Documentation/Architecture/App-Shell-MultiRoute) - Where guards live in an app shell.\n- [SEO and Share Cards](/Documentation/Architecture/SEO) - Per-route titles and metadata.\n- [Events](/Documentation/Structural/EventManager) - `router:change` for post-navigation effects.\n:::\n";
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
               headers: ["Method","Signature","Can block","Notes"],
               rows: [[{"html":"<code>beforeEach</code>"},{"html":"<code>(to, from, next) =&gt; void</code>"},{"html":"yes"},{"html":"Call <code>next()</code> to continue or redirect."}],[{"html":"<code>afterEach</code>"},{"html":"<code>(to, from) =&gt; void</code>"},{"html":"no"},{"html":"Runs after navigation completes."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const grid = await slice.build('Grid', { columns: 2, rows: 1, gap: '14px' });
            const buildSide = async (side) => {
               const body = document.createElement('div');
               body.className = 'doc-callout-body';
               body.innerHTML = side.html;
               const callout = await slice.build('Callout', {
                  tone: side.tone,
                  title: side.title,
                  content: Array.from(body.childNodes)
               });
               return callout || body;
            };
            const left = await buildSide({"title":"beforeEach — gate","tone":"accent","html":"<p>Can cancel, redirect or continue. Use it for auth, feature flags and canonical paths. Every path through the guard must call <code>next()</code>.</p>"});
            const right = await buildSide({"title":"afterEach — observer","tone":"info","html":"<p>Cannot block; the navigation already happened. Use it for titles, scroll position, analytics and other post-navigation effects.</p>"});
            if (grid) {
               await grid.setItem(left);
               await grid.setItem(right);
               container.appendChild(grid);
            } else {
               container.appendChild(left);
               container.appendChild(right);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Call","Result","Notes"],
               rows: [[{"html":"<code>next()</code>"},{"html":"continue"},{"html":"Normal navigation."}],[{"html":"<code>next(false)</code>"},{"html":"cancel"},{"html":"Navigation is cancelled."}],[{"html":"<code>next('/login')</code>"},{"html":"redirect"},{"html":"Redirect to path (pushState)."}],[{"html":"<code>next({ path: '/login', replace: true })</code>"},{"html":"redirect"},{"html":"Redirect with history replace."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
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
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const details = await slice.build('Details', { title: "Can a guard be async?" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<p>Yes: <code>beforeEach</code> may be <code>async</code>, but it must still call <code>next()</code> (or return a redirect). Keep the guard fast — it runs on every navigation. Put a one-time session check in a Service and reuse the result instead of fetching it again on each route change.</p>";
            if (details) {
               details.addDetail(body);
               container.appendChild(details);
            } else {
               container.appendChild(body);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Guards can create redirect loops. The router detects them and stops after 10 redirects, but the real fix is to make the redirect target reachable without running the same guard again (for example, exclude <code>/login</code> from the auth redirect).</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const items = [{"title":"Routing","path":"/Documentation/Routing","text":"Route Info, router:change and navigation."},{"title":"App Shell + MultiRoute","path":"/Documentation/Architecture/App-Shell-MultiRoute","text":"Where guards live in an app shell."},{"title":"SEO and Share Cards","path":"/Documentation/Architecture/SEO","text":"Per-route titles and metadata."},{"title":"Events","path":"/Documentation/Structural/EventManager","text":"router:change for post-navigation effects."}];
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

customElements.define('slice-routerguardsdocumentation', RouterGuardsDocumentation);
