export default class ServicePatternsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "project-architecture/service-patterns.md";
    this.markdownContent = "---\ntitle: Service Patterns\nroute: /Documentation/Architecture/Service-Patterns\nnavLabel: Service Patterns\nsection: Guides\ngroup: ''\norder: 50\ndescription: Where state and logic should live in a Slice app — instance fields, plain helpers, singleton services, providers — and how cleanup actually works.\ncomponent: ServicePatternsDocumentation\nstatus: new\ntags: [architecture, services, singleton, state, cleanup]\n---\n\n# Service Patterns\n\nWhere state and shared logic live decides whether your app leaks. One rule, a decision table, and the cleanup contract.\n\n## The one rule\n\n> **Anything built with `slice.build(...)` is registered and must be cleaned up. Plain instance fields and plain objects are not — the GC frees them with their owner.**\n\n`slice.build` keeps a strong reference in `slice.controller.activeComponents` until you `destroyComponent` it. A value on `this` (`new MyClass()`, an array) is freed automatically. So ask: *does this need to be registered (shared / discoverable), or not?*\n\n## Where should it live?\n\n| What you have | Where it goes | Cleanup |\n| --- | --- | --- |\n| Per-instance view state (page, sort, open/closed) | **instance fields** (`this._page`) | automatic (GC) |\n| Per-instance stateful helper (an engine, a calculator) | **`new Helper()`** on `this` — not `slice.build` | automatic (GC) |\n| Reusable **stateless** logic | a **singleton Service** or a pure module | none — app-lifetime |\n| App-wide singletons (auth, api, store) | one **composition-root** Service | none — app-lifetime |\n| App-wide **UI** (toasts, tooltips, modals) | a **Provider Service** owning the Visuals | the provider is the singleton |\n| ❌ Per-instance Service built with `slice.build` | avoid — needs manual `destroyComponent` | manual + fragile |\n\n## Instance state → plain fields\n\n```javascript\nset page(value) { this._page = value; this.$page.textContent = value; }   // GC'd with the component\n```\n\nBig state logic → wrap in a **plain class** and `new` it (still no registration, still GC'd):\n\n```javascript\nasync init() {\n  this._engine = new DataGridEngine({ data: this._rows, pageSize: 10 }); // plain new, not slice.build\n}\n```\n\n## App-wide singletons → a composition root\n\nBuild app-wide singletons in **one place** — a Service (e.g. `AppServices` / `Providers`) whose `init()` builds the rest and seeds context. Everywhere else, **recover** with `slice.getComponent(name)`.\n\n```javascript title=\"Components/AppServices/AppServices.js\"\nexport default class AppServices {\n  async init() {\n    await slice.build('AuthService',  { sliceId: 'AuthService' });\n    await slice.build('FetchManager', { sliceId: 'api', baseUrl: API_URL });\n    slice.context.create('settings', { theme: 'dark' });\n  }\n}\n```\n\n```javascript\nawait slice.build('AppServices', { singleton: true });  // one bootstrap call from the App Shell's init()\nconst auth = slice.getComponent('AuthService');          // recover anywhere\n```\n\n:::tip\n**Default: build once + `getComponent`** — one owner creates, consumers only read. Use **`slice.build('X', { singleton: true })`** (Service only — get-or-create) when a service can be built from **more than one entry point** (e.g. an `AuthService` needed by both the composition root and a standalone `/login` route): it returns the shared instance with no `getComponent(x) || build(x)` guard and no duplicate-`sliceId` race. `props` apply only on the first (creating) call.\n:::\n\n:::warning\n`slice.build` **awaits the component's `init()`** — building a service already ran it. Calling `init()` again runs it twice (and re-building a child with the same `sliceId` throws \"already registered\"). Make `init()` idempotent: `if (this._ready) return this;`.\n:::\n\nApp-lifetime singletons are never destroyed, so there is nothing to clean up.\n\n## Global UI → a Provider Service\n\n`singleton: true` works only for Services, because a DOM node lives in **one place at a time** — a shared Visual would teleport between mount points. So \"one global widget\" means \"a **Provider Service** that owns the Visual.\" That is how `ToastProvider` / `ToolTipProvider` work: the provider is the singleton; the toasts/tooltips it creates are ephemeral.\n\n## Cleanup\n\n> **`destroyComponent(parent)` cascades to nested Visual children, but NOT to Services. Destroy any Service you built by hand, in `beforeDestroy()`.**\n\nA Service has no DOM node, so nothing can discover it — not the parent cascade, not `destroyByContainer`. Same for a Visual child appended *after* `init()` (too late to be linked).\n\n```javascript\nasync init() {\n  this._engine = await slice.build('DataGridEngine', { sliceId: `grid-${++Table._seq}` }); // Service\n}\nbeforeDestroy() {\n  slice.controller.destroyComponent(this._engine);   // Services never cascade — destroy by hand\n}\n```\n\nTo tear down a region: **`slice.controller.destroyByContainer(node)`** (destroys every Visual inside a DOM subtree) **then** clear. `innerHTML = ''` alone skips `beforeDestroy` and leaks.\n\n:::warning\nTearing a subtree down with `innerHTML = ''` does **not** run `beforeDestroy` and does **not** unregister anything — listeners stay bound and registry entries leak. Always `destroyByContainer(node)` **then** clear.\n:::\n\n## Anti-patterns\n\n- ❌ A stateful per-instance Service via `slice.build` relied on to auto-clean — it won't. Destroy it explicitly, or (if it is pure per-instance state) use a plain `new`.\n- ❌ Scattering `build({ singleton: true })` across call sites for an app-wide service — centralize it in the composition root and `getComponent` it.\n- ❌ Storing service instances or functions in `slice.context` — keep only serializable state (and note `setState` **replaces** the value, it does not merge).\n- ❌ Declaring `id`, `sliceId`, or `singleton` in `static props` — reserved build directives, consumed by `build` before your setters run. See [Reserved build keys](/Documentation/The-build-method).\n\n:::related\n- [DomService](https://components.slicejs.com/docs/services/dom-service) - Reconcile lists without leaking.\n- [Refreshing Component Data](/Documentation/Architecture/Refreshing-Component-Data) - When to refresh, reconcile or rebuild.\n- [beforeDestroy()](/Documentation/LifeCycle-Methods/beforeDestroy) - The cleanup contract for Services.\n- [The build method](/Documentation/The-build-method) - `singleton`, `sliceId` and reserved keys.\n:::\n";
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
            const presets = {
               new: { label: 'New', tone: 'accent' },
               updated: { label: 'Updated', tone: 'info' },
               deprecated: { label: 'Deprecated', tone: 'warning' },
               beta: { label: 'Beta', tone: 'info' },
               experimental: { label: 'Experimental', tone: 'neutral' }
            };
            const key = String("new").toLowerCase();
            const preset = presets[key] || { label: "new", tone: 'neutral' };
            const badge = await slice.build('Badge', {
               label: preset.label,
               tone: preset.tone,
               variant: 'soft',
               size: 'sm',
               shape: 'rounded'
            });
            if (badge) container.appendChild(badge);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["What you have","Where it goes","Cleanup"],
               rows: [[{"html":"Per-instance view state (page, sort, open/closed)"},{"html":"<strong>instance fields</strong> (<code>this._page</code>)"},{"html":"automatic (GC)"}],[{"html":"Per-instance stateful helper (an engine, a calculator)"},{"html":"<strong><code>new Helper()</code></strong> on <code>this</code> — not <code>slice.build</code>"},{"html":"automatic (GC)"}],[{"html":"Reusable <strong>stateless</strong> logic"},{"html":"a <strong>singleton Service</strong> or a pure module"},{"html":"none — app-lifetime"}],[{"html":"App-wide singletons (auth, api, store)"},{"html":"one <strong>composition-root</strong> Service"},{"html":"none — app-lifetime"}],[{"html":"App-wide <strong>UI</strong> (toasts, tooltips, modals)"},{"html":"a <strong>Provider Service</strong> owning the Visuals"},{"html":"the provider is the singleton"}],[{"html":"❌ Per-instance Service built with <code>slice.build</code>"},{"html":"avoid — needs manual <code>destroyComponent</code>"},{"html":"manual + fragile"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "set page(value) { this._page = value; this.$page.textContent = value; }   // GC'd with the component",
               language: "javascript"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "async init() {\n  this._engine = new DataGridEngine({ data: this._rows, pageSize: 10 }); // plain new, not slice.build\n}",
               language: "javascript"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class AppServices {\n  async init() {\n    await slice.build('AuthService',  { sliceId: 'AuthService' });\n    await slice.build('FetchManager', { sliceId: 'api', baseUrl: API_URL });\n    slice.context.create('settings', { theme: 'dark' });\n  }\n}",
               language: "javascript"
            });
            if ("Components/AppServices/AppServices.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Components/AppServices/AppServices.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "await slice.build('AppServices', { singleton: true });  // one bootstrap call from the App Shell's init()\nconst auth = slice.getComponent('AuthService');          // recover anywhere",
               language: "javascript"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p><strong>Default: build once + <code>getComponent</code></strong> — one owner creates, consumers only read. Use <strong><code>slice.build('X', { singleton: true })</code></strong> (Service only — get-or-create) when a service can be built from <strong>more than one entry point</strong> (e.g. an <code>AuthService</code> needed by both the composition root and a standalone <code>/login</code> route): it returns the shared instance with no <code>getComponent(x) || build(x)</code> guard and no duplicate-<code>sliceId</code> race. <code>props</code> apply only on the first (creating) call.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p><code>slice.build</code> <strong>awaits the component's <code>init()</code></strong> — building a service already ran it. Calling <code>init()</code> again runs it twice (and re-building a child with the same <code>sliceId</code> throws \"already registered\"). Make <code>init()</code> idempotent: <code>if (this._ready) return this;</code>.</p>";
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
               value: "async init() {\n  this._engine = await slice.build('DataGridEngine', { sliceId: `grid-${++Table._seq}` }); // Service\n}\nbeforeDestroy() {\n  slice.controller.destroyComponent(this._engine);   // Services never cascade — destroy by hand\n}",
               language: "javascript"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Tearing a subtree down with <code>innerHTML = ''</code> does <strong>not</strong> run <code>beforeDestroy</code> and does <strong>not</strong> unregister anything — listeners stay bound and registry entries leak. Always <code>destroyByContainer(node)</code> <strong>then</strong> clear.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const items = [{"title":"DomService","path":"https://components.slicejs.com/docs/services/dom-service","text":"Reconcile lists without leaking."},{"title":"Refreshing Component Data","path":"/Documentation/Architecture/Refreshing-Component-Data","text":"When to refresh, reconcile or rebuild."},{"title":"beforeDestroy()","path":"/Documentation/LifeCycle-Methods/beforeDestroy","text":"The cleanup contract for Services."},{"title":"The build method","path":"/Documentation/The-build-method","text":"singleton, sliceId and reserved keys."}];
            const grid = await slice.build('Grid', {
               columns: items.length === 4 ? 2 : Math.min(3, Math.max(1, items.length)),
               rows: 1,
               gap: '14px'
            });
            for (const item of items) {
               const card = await slice.build('Card', {
                  title: item.title,
                  text: item.text || '',
                  // The small mark beside the title, not the banner: a page
                  // of four related links should not be four big arrows.
                  headerIcon: 'arrow-right',
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

customElements.define('slice-servicepatternsdocumentation', ServicePatternsDocumentation);
