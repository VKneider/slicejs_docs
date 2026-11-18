export default class BeforeDestroyDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/before-destroy.md";
    this.markdownContent = "---\ntitle: beforeDestroy()\nroute: /Documentation/LifeCycle-Methods/beforeDestroy\nnavLabel: beforeDestroy()\nsection: Components\ngroup: Lifecycle\norder: 40\ndescription: Cleanup hooks for timers, listeners, requests and Services that outlive the component.\ncomponent: BeforeDestroyDocumentation\ntags: [lifecycle, destroy, cleanup]\n---\n\n# beforeDestroy()\n\n## Overview\n`beforeDestroy()` runs right before a component is destroyed by the controller. Use it for cleanup:\ntimers, listeners, subscriptions, pending async work, and Services you built by hand.\n\nThe controller does not await this method, so keep it synchronous or fire-and-forget.\n\nA method named `destroy()`, `dispose()` or `teardown()` looks like cleanup but never runs — the\ncontroller only calls `beforeDestroy()`. `slice doctor` reports that, and it reports a\n`window`/`document` listener added without a matching `removeEventListener` in the same file unless\nit uses `{ once: true }` or `{ signal }`.\n\n## What is already cleaned up?\n\n:::compare left=\"Slice cleans up for you\" right=\"Your job in beforeDestroy\"\nComponent-bound events (`slice.events.bind(this)`), Context watchers registered with `this`, child Visual components built inside this one, and listeners on the component's own DOM node.\n---\nIntervals and timeouts; an `AbortController` for fetches; `window`/`document` listeners; third-party instances (charts, maps); and every Service built with `slice.build`.\n:::\n\nThe split matters: the parent destroy cascade reaches Visual children, but a Service has no DOM, so\nnothing discovers it.\n\n## API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `beforeDestroy` | `beforeDestroy()` | `void` | Called right before the component is removed. |\n\n## Ideal use cases\n- Clear intervals and timeouts.\n- Abort pending fetch requests.\n- Remove global event listeners.\n- Dispose third-party instances (charts, maps, etc.).\n- **Destroy child Services you built with `slice.build`**.\n\n## Example\n\n```javascript title=\"Cleanup in beforeDestroy()\"\nexport default class LiveChart extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n    this.abortController = new AbortController();\n  }\n\n  async init() {\n    this._pollingId = setInterval(() => this.fetchData(), 5000);\n    window.addEventListener('resize', this.onResize);\n    await fetch('/api/chart', { signal: this.abortController.signal });\n  }\n\n  beforeDestroy() {\n    clearInterval(this._pollingId);\n    this.abortController.abort();\n    window.removeEventListener('resize', this.onResize);\n    this.chartInstance?.destroy();\n  }\n}\n```\n\n```javascript title=\"Destroy a Service you built (it is not auto-cleaned)\"\nasync init() {\n  this._store = await slice.build('CartService', { sliceId: `cart-${this.sliceId}` });\n}\n\nbeforeDestroy() {\n  // A Service has no DOM, so the parent's destroy never reaches it — do it here.\n  slice.controller.destroyComponent(this._store);\n}\n```\n\n:::warning\nA Service built with `slice.build` is **not** destroyed when its owner is. Call\n`slice.controller.destroyComponent(...)` on it in `beforeDestroy()`, or it stays registered and its\nown `beforeDestroy` never runs. See [Service Patterns](/Documentation/Architecture/Service-Patterns).\n:::\n\nKeep `beforeDestroy()` idempotent: it can be called more than once in a teardown sequence, and every\ncleanup inside it must tolerate that.\n\n:::related\n- [Refreshing Component Data](/Documentation/Architecture/Refreshing-Component-Data) - Reconcile lists instead of rebuilding them.\n- [Service Patterns](/Documentation/Architecture/Service-Patterns) - Why Services never cascade.\n- [update()](/Documentation/LifeCycle-Methods/update) - Refresh on cached route revisits.\n- [Events](/Documentation/Structural/EventManager) - Component-bound subscriptions that auto-clean.\n:::\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"Components"},{"text":"Lifecycle"}]
            });
            if (breadcrumbs) {
               container.appendChild(breadcrumbs);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
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
            const left = await buildSide({"title":"Slice cleans up for you","tone":"success","html":"<p>Component-bound events (<code>slice.events.bind(this)</code>), Context watchers registered with <code>this</code>, child Visual components built inside this one, and listeners on the component's own DOM node.</p>"});
            const right = await buildSide({"title":"Your job in beforeDestroy","tone":"danger","html":"<p>Intervals and timeouts; an <code>AbortController</code> for fetches; <code>window</code>/<code>document</code> listeners; third-party instances (charts, maps); and every Service built with <code>slice.build</code>.</p>"});
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Returns","Notes"],
               rows: [[{"html":"<code>beforeDestroy</code>"},{"html":"<code>beforeDestroy()</code>"},{"html":"<code>void</code>"},{"html":"Called right before the component is removed."}]]
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
               value: "export default class LiveChart extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n    this.abortController = new AbortController();\n  }\n\n  async init() {\n    this._pollingId = setInterval(() => this.fetchData(), 5000);\n    window.addEventListener('resize', this.onResize);\n    await fetch('/api/chart', { signal: this.abortController.signal });\n  }\n\n  beforeDestroy() {\n    clearInterval(this._pollingId);\n    this.abortController.abort();\n    window.removeEventListener('resize', this.onResize);\n    this.chartInstance?.destroy();\n  }\n}",
               language: "javascript"
            });
            if ("Cleanup in beforeDestroy()") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Cleanup in beforeDestroy()";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "async init() {\n  this._store = await slice.build('CartService', { sliceId: `cart-${this.sliceId}` });\n}\n\nbeforeDestroy() {\n  // A Service has no DOM, so the parent's destroy never reaches it — do it here.\n  slice.controller.destroyComponent(this._store);\n}",
               language: "javascript"
            });
            if ("Destroy a Service you built (it is not auto-cleaned)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Destroy a Service you built (it is not auto-cleaned)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>A Service built with <code>slice.build</code> is <strong>not</strong> destroyed when its owner is. Call <code>slice.controller.destroyComponent(...)</code> on it in <code>beforeDestroy()</code>, or it stays registered and its own <code>beforeDestroy</code> never runs. See <a href=\"/Documentation/Architecture/Service-Patterns\" data-route>Service Patterns</a>.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const items = [{"title":"Refreshing Component Data","path":"/Documentation/Architecture/Refreshing-Component-Data","text":"Reconcile lists instead of rebuilding them."},{"title":"Service Patterns","path":"/Documentation/Architecture/Service-Patterns","text":"Why Services never cascade."},{"title":"update()","path":"/Documentation/LifeCycle-Methods/update","text":"Refresh on cached route revisits."},{"title":"Events","path":"/Documentation/Structural/EventManager","text":"Component-bound subscriptions that auto-clean."}];
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

customElements.define('slice-beforedestroydocumentation', BeforeDestroyDocumentation);
