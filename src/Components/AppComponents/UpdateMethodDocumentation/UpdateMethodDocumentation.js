export default class UpdateMethodDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/update-method.md";
    this.markdownContent = "---\ntitle: update()\nroute: /Documentation/LifeCycle-Methods/update\nnavLabel: update()\nsection: Components\ngroup: Lifecycle\norder: 30\ndescription: Refresh dynamic UI in Slice.js components.\ncomponent: UpdateMethodDocumentation\ntags: [lifecycle, update]\n---\n\n# update()\n\n## Overview\n`update()` refreshes a component **in place** after `init()` — same instance, no destroy, no\nflicker. The router calls it when a cached `Route` / `MultiRoute` is revisited; a parent, the\ncomponent itself, or a `slice.context` watcher can call it too. Define it only when a refresh\nneeds logic beyond a prop setter — rebuilding child components, an async fetch, or applying\nseveral props at once.\n\nThe framework **wraps your `update()`**: calls are **serialized and coalesced** (last wins). An\n`async update()` driven rapidly — streaming tokens, fast state changes — never overlaps itself\nor tears the DOM. You write a plain `update()`; no manual tokens, queues, or guards.\n\n## API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `update` | `async update(props?)` | `Promise<void>` | Wrapped by the framework (serialized + coalesced). The router calls it with no args — read `this.props` (route params); a parent passes props as the argument. |\n\n## Refresh in place — reuse, don't rebuild\nWhen the data changed but the entities persist, **reuse instances by a stable `sliceId`** and let\neach one refresh itself. Survivors are never recreated, so scroll, focus, and internal state are\npreserved.\n\n```javascript title=\"Reuse surviving rows, build new ones, prune the gone\"\nasync update(state = {}) {\n  const items = state.items || [];\n  const alive = new Set();\n\n  for (const item of items) {\n    const sliceId = `row-${item.id}`;\n    alive.add(sliceId);\n\n    const row = slice.getComponent(sliceId);\n    if (row) {\n      slice.setComponentProps(row, { title: item.title });   // refresh in place\n    } else {\n      const node = await slice.build('Row', { sliceId, ...item });\n      if (node) this.$list.appendChild(node);\n    }\n  }\n\n  // prune: destroy rows whose data is gone\n  for (const el of Array.from(this.$list.children)) {\n    const id = el.getAttribute('slice-id');\n    if (id && !alive.has(id)) slice.controller.destroyComponent(id);\n  }\n}\n```\n\n`slice.setComponentProps(comp, props)` applies a bag of props to a component. On a built\ncomponent it **refreshes**: re-runs the setters, does **not** re-apply defaults, and won't clobber\nthe props you omit. (At construction time the same call applies defaults — it detects the mode.)\n\n## Total replacement — build-then-swap\nWhen the new data shares nothing with the old (e.g. a different conversation), build the\nreplacement **off-DOM first**, then swap in one operation — no empty frame.\n\n```javascript title=\"Build off-DOM, then swap atomically\"\nasync update(state = {}) {\n  const old = Array.from(this.$slot.children)\n    .map((el) => el.getAttribute('slice-id')).filter(Boolean);\n\n  const frag = document.createDocumentFragment();\n  for (const item of state.items) {\n    const node = await slice.build('Card', { sliceId: `card-${item.id}`, ...item });\n    if (node) frag.appendChild(node);\n  }\n\n  this.$slot.replaceChildren(frag);                       // atomic swap\n  if (old.length) slice.controller.destroyComponent(old); // clean up the old instances\n}\n```\n\n## Setter or update()?\n\n:::compare left=\"A prop setter\" right=\"update()\"\nOne value changed and the setter can express it. Immediate, synchronous, no async work and no child rebuild.\n---\nSeveral props, an async fetch, a child rebuild, or a cached-route revisit. The framework serializes and coalesces calls, so rapid refreshes are safe.\n:::\n\nFor a variable-length list, [`DomService.reconcile`](https://components.slicejs.com/docs/services/dom-service)\nis the loop above generalized: it refreshes survivors, builds new items, prunes the gone and reorders\nwith the fewest moves.\n\n:::details title=\"Two traps\"\n- Clearing `innerHTML` alone does not destroy Slice components. Use `destroyComponent` /\n  `destroyByContainer` so `beforeDestroy` runs and the registry is cleaned.\n- `update()` is for refreshes **after** `init()`. The framework does not call it on first build;\n  `init()` does the first paint.\n:::\n\n:::related\n- [Refreshing Component Data](/Documentation/Architecture/Refreshing-Component-Data) - Setter, update, reconcile or rebuild.\n- [DomService](https://components.slicejs.com/docs/services/dom-service) - Reconcile a list without leaking.\n- [beforeDestroy()](/Documentation/LifeCycle-Methods/beforeDestroy) - Cleanup when a refreshed subtree goes away.\n- [init()](/Documentation/LifeCycle-Methods/init) - The first paint.\n:::\n";
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
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Returns","Notes"],
               rows: [[{"html":"<code>update</code>"},{"html":"<code>async update(props?)</code>"},{"html":"<code>Promise&lt;void&gt;</code>"},{"html":"Wrapped by the framework (serialized + coalesced). The router calls it with no args — read <code>this.props</code> (route params); a parent passes props as the argument."}]]
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
               value: "async update(state = {}) {\n  const items = state.items || [];\n  const alive = new Set();\n\n  for (const item of items) {\n    const sliceId = `row-${item.id}`;\n    alive.add(sliceId);\n\n    const row = slice.getComponent(sliceId);\n    if (row) {\n      slice.setComponentProps(row, { title: item.title });   // refresh in place\n    } else {\n      const node = await slice.build('Row', { sliceId, ...item });\n      if (node) this.$list.appendChild(node);\n    }\n  }\n\n  // prune: destroy rows whose data is gone\n  for (const el of Array.from(this.$list.children)) {\n    const id = el.getAttribute('slice-id');\n    if (id && !alive.has(id)) slice.controller.destroyComponent(id);\n  }\n}",
               language: "javascript"
            });
            if ("Reuse surviving rows, build new ones, prune the gone") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Reuse surviving rows, build new ones, prune the gone";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "async update(state = {}) {\n  const old = Array.from(this.$slot.children)\n    .map((el) => el.getAttribute('slice-id')).filter(Boolean);\n\n  const frag = document.createDocumentFragment();\n  for (const item of state.items) {\n    const node = await slice.build('Card', { sliceId: `card-${item.id}`, ...item });\n    if (node) frag.appendChild(node);\n  }\n\n  this.$slot.replaceChildren(frag);                       // atomic swap\n  if (old.length) slice.controller.destroyComponent(old); // clean up the old instances\n}",
               language: "javascript"
            });
            if ("Build off-DOM, then swap atomically") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Build off-DOM, then swap atomically";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
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
            const left = await buildSide({"title":"A prop setter","tone":"success","html":"<p>One value changed and the setter can express it. Immediate, synchronous, no async work and no child rebuild.</p>"});
            const right = await buildSide({"title":"update()","tone":"danger","html":"<p>Several props, an async fetch, a child rebuild, or a cached-route revisit. The framework serializes and coalesces calls, so rapid refreshes are safe.</p>"});
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const details = await slice.build('Details', { title: "Two traps" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<ul><li>Clearing <code>innerHTML</code> alone does not destroy Slice components. Use <code>destroyComponent</code> /</li></ul><p><code>destroyByContainer</code> so <code>beforeDestroy</code> runs and the registry is cleaned.</p><ul><li><code>update()</code> is for refreshes <strong>after</strong> <code>init()</code>. The framework does not call it on first build;</li></ul><p><code>init()</code> does the first paint.</p>";
            if (details) {
               details.addDetail(body);
               container.appendChild(details);
            } else {
               container.appendChild(body);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const items = [{"title":"Refreshing Component Data","path":"/Documentation/Architecture/Refreshing-Component-Data","text":"Setter, update, reconcile or rebuild."},{"title":"DomService","path":"https://components.slicejs.com/docs/services/dom-service","text":"Reconcile a list without leaking."},{"title":"beforeDestroy()","path":"/Documentation/LifeCycle-Methods/beforeDestroy","text":"Cleanup when a refreshed subtree goes away."},{"title":"init()","path":"/Documentation/LifeCycle-Methods/init","text":"The first paint."}];
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

customElements.define('slice-updatemethoddocumentation', UpdateMethodDocumentation);
