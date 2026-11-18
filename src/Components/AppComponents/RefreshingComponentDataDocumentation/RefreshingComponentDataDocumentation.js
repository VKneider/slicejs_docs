export default class RefreshingComponentDataDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "project-architecture/refreshing-component-data.md";
    this.markdownContent = "---\ntitle: Refreshing Component Data\nroute: /Documentation/Architecture/Refreshing-Component-Data\nnavLabel: Refreshing Data\nsection: Guides\ngroup: ''\norder: 70\ndescription: How to update what a component shows after it's built — prop setters, update(), list reconciliation, context, events, or destroy+recreate — and which to reach for.\ncomponent: RefreshingComponentDataDocumentation\ntags: [architecture, state, update, context, events, lists, reconcile, domservice]\n---\n\n# Refreshing Component Data\n\nThe data behind a component changed — how do you update what's on screen? Slice gives you several\nmechanisms, from the cheapest (set a prop) to the heaviest (destroy + recreate). **Reach for the\nlightest one that fits** — the heavier the mechanism, the more you throw away (instance state, focus,\nscroll, async cost).\n\n## Which one?\n\n| Situation | Reach for |\n| --- | --- |\n| You hold the instance and the data/props changed | **a prop setter** or an update method (§1) |\n| A **cached route** is revisited | **`update()`** (§2) |\n| A **list of child components** changed (add, remove, reorder, filter) | **`DomService.reconcile`** (§3) |\n| State that **several components** share and react to | **Context** — `watch` / `setState` (§4) |\n| \"Something happened, refresh\" **across the app** | **Events** — `emit` / `subscribe` (§5) |\n| The component's **structure** fundamentally changed | **Destroy + recreate** — last resort (§6) |\n\n## 1. Set a prop or call a method (the default)\nIn Slice, props go through **setters** — so updating data is usually just *assigning a prop*. The setter\nupdates the DOM; the instance (and its focus/scroll/internal state) is preserved.\n\n```javascript title=\"Same instance, new data\"\nconst table = await slice.build('Table', { columns, rows });\n\n// later — the rows changed:\ntable.rows = await fetchRows();   // the setter updates the DOM; no rebuild\n```\n\nComponents also expose **methods** for finer updates — same idea, just a call:\n\n```javascript\nselect.options = await fetchOptions();   // a setter\nform.setValue('email', user.email);      // a method\ntable.loading = true;                    // toggle a busy state, then set rows\n```\n\n> Design your own components so that **assigning a prop or calling a method drives the DOM update** — that\n> is what makes this the default refresh path.\n\n## 2. `update()` — cached route revisits\n`MultiRoute` / `Route` **cache** instances. When you navigate away and back, Slice calls\n**`update()`**, not `init()` — so refresh route-level data there (and you can call it manually too).\n\n```javascript title=\"Refresh on revisit\"\nexport default class OrdersPage extends HTMLElement {\n  async init()   { this.$list = this.querySelector('.orders'); await this.load(); }\n  async update() { await this.load(); }   // cached revisit → refresh\n\n  async load() {\n    const orders = await slice.getComponent('api').request('GET', null, '/orders');\n    await this.renderOrders(orders);      // §3: reconcile, never replaceChildren()\n  }\n}\n```\n\nThe framework **serializes** your `update()` — concurrent or rapid calls coalesce (last wins) — so\nit is safe under streaming or fast revisits without writing manual guards. For lists, refresh **in\nplace**; §3 shows the canonical way. See [`update()`](/Documentation/LifeCycle-Methods/update). Keep it\nidempotent.\n\n## 3. Lists — reconcile instead of rebuild\nWhen the data is a **variable-length list**, the change is not \"set one prop\": items are added,\nremoved, filtered or reordered. The tempting code is:\n\n```javascript\nthis.$list.replaceChildren();   // ✗ removes nodes without running beforeDestroy()\nfor (const order of orders) {\n  this.$list.appendChild(await slice.build('OrderRow', { title: order.title }));\n}\n```\n\nThat leaks every row's listeners, timers and registry entry, and throws away the state and focus of\nrows that did not change. Use the registry [`DomService`](https://components.slicejs.com/docs/services/dom-service)\ninstead:\n\n```javascript\nconst dom = await slice.build('DomService', { singleton: true });\n\nawait dom.reconcile(this.$list, orders, {\n  keyOf: (order) => `order-${order.id}`,   // stable, page-wide unique\n  component: 'OrderRow',\n  props: (order) => ({ title: order.title }),\n  equals: Object.is,                       // immutable data: refresh only changed rows\n});\n```\n\n`reconcile` does the three things the manual loop gets wrong:\n\n1. **Refresh in place.** A survivor is found by its stable key and updated through\n   `slice.setComponentProps` (or your `refresh` callback). Its state, focus and children survive.\n2. **Prune.** A row whose data is gone is destroyed with `slice.controller.destroyComponent`, which\n   runs `beforeDestroy()`.\n3. **Reorder with the fewest moves.** `insertBefore` moves a node instead of cloning it, so the\n   constructor does not run again and focus/animations are not restarted.\n\nIt also queues renders per container and coalesces rapid calls, so a filter box that re-renders on\nevery keystroke applies the last query, not every intermediate one. `await reconcile()` means the DOM\nis at least as fresh as that call.\n\n**Compose it with the other sections:** call `reconcile` from a prop setter (§1), from `update()`\n(§2), from a Context watcher (§4) or from an Event handler (§5). It is the list-level refresh\nprimitive, not a replacement for the trigger.\n\n:::warning\nKeys are page-wide `sliceId`s, not per-container. Two unrelated lists using `row-1` will adopt and\nfight over the same node. Prefix them (`orders-row-1`, `cart-row-1`).\n:::\n\n**When to skip `equals`:** use `equals: Object.is` only with immutable data. If you mutate item\nobjects in place, the mutated row will look unchanged and will not refresh.\n\n`dom.destroyChildren(container)` tears down every registered child at once when the whole list goes\naway.\n\n## 4. Context — shared state many components react to\nWhen several components depend on the **same** state, put it in [`slice.context`](/Documentation/Structural/ContextManager).\nEach component `watch`es it and refreshes when it changes; anyone calls `setState` to change it.\n\n```javascript title=\"Watch shared state\"\nasync init() {\n  this.$count = this.querySelector('.cart-count');\n  slice.context.watch(\n    'cart',\n    this,\n    (count) => { this.$count.textContent = count; },\n    (state) => state.items.length        // selector: only refresh when the count changes\n  );\n}\n\n// anywhere a change happens:\nslice.context.setState('cart', (prev) => ({ ...prev, items: [...prev.items, item] }));\n```\n\nWatchers registered with `this` are **auto-cleaned** on destroy — don't unwatch them by hand.\n\n## 5. Events — react to \"something happened\"\nFor cross-cutting \"X happened, refresh\" signals, use [`slice.events`](/Documentation/Structural/EventManager).\nA component subscribes; some other part of the app emits.\n\n```javascript title=\"Refresh on an event\"\nasync init() {\n  this.events = slice.events.bind(this);\n  this.events.subscribe('orders:updated', () => this.refresh());\n}\n\nasync refresh() {\n  this.rows = await fetchRows();   // note: re-uses the setter from §1\n}\n\n// elsewhere, after a mutation:\nslice.events.emit('orders:updated');\n```\n\nSubscriptions made via `slice.events.bind(this)` are **auto-cleaned** on destroy.\n\n**Context vs Events:** ask *\"what is the current state?\"* → Context. Ask *\"did something happen?\"* →\nEvents. Prefer Context for state, and add an Event when cross-domain side effects must react.\n\n## 6. Destroy + recreate (last resort)\nOnly when the component's **structure** changed so fundamentally that reconfiguring it would be more code\nthan rebuilding. It is the heaviest option: you lose instance state, pay an async rebuild, and **must\nclean up** the old instance and its children first.\n\n```javascript title=\"Rebuild a region\"\nslice.controller.destroyByContainer(this.$slot);   // runs beforeDestroy on everything inside\nthis.$slot.innerHTML = '';\nconst fresh = await slice.build('BigWidget', { ...newConfig });\nthis.$slot.appendChild(fresh);\n```\n\nBefore reaching for this, check whether a setter/method (§1) or `DomService.reconcile` (§3) can\nexpress the change instead — e.g. the `Table` reconfigures its pager by **setting props**, it never\ndestroys and rebuilds it. And remember the cleanup rules: components built with `slice.build` are\n**not** auto-destroyed by a parent, and Services have no DOM so they are never cascaded — see\n[Service Patterns](/Documentation/Architecture/Service-Patterns).\n\n## Choose the lightest refresh\n:::compare left=\"Update in place\" right=\"Rebuild the region\"\nAssign a prop, call a method, reconcile a list, or let Context/Events notify watchers. The instance, its state and its children survive.\n---\nDestroy the old component and build a new one. Only when the structure itself changed so much that reconfiguring it would cost more than rebuilding.\n:::\n\n:::related\n- [DomService](https://components.slicejs.com/docs/services/dom-service) - Full reconcile API: keys, equals, refresh, destroyChildren.\n- [Service Patterns](/Documentation/Architecture/Service-Patterns) - Where a service lives and how it is cleaned up.\n- [update()](/Documentation/LifeCycle-Methods/update) - Cached route revisits.\n- [beforeDestroy()](/Documentation/LifeCycle-Methods/beforeDestroy) - What cleanup actually runs.\n:::\n";
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
               headers: ["Situation","Reach for"],
               rows: [[{"html":"You hold the instance and the data/props changed"},{"html":"<strong>a prop setter</strong> or an update method (§1)"}],[{"html":"A <strong>cached route</strong> is revisited"},{"html":"<strong><code>update()</code></strong> (§2)"}],[{"html":"A <strong>list of child components</strong> changed (add, remove, reorder, filter)"},{"html":"<strong><code>DomService.reconcile</code></strong> (§3)"}],[{"html":"State that <strong>several components</strong> share and react to"},{"html":"<strong>Context</strong> — <code>watch</code> / <code>setState</code> (§4)"}],[{"html":"\"Something happened, refresh\" <strong>across the app</strong>"},{"html":"<strong>Events</strong> — <code>emit</code> / <code>subscribe</code> (§5)"}],[{"html":"The component's <strong>structure</strong> fundamentally changed"},{"html":"<strong>Destroy + recreate</strong> — last resort (§6)"}]]
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
               value: "const table = await slice.build('Table', { columns, rows });\n\n// later — the rows changed:\ntable.rows = await fetchRows();   // the setter updates the DOM; no rebuild",
               language: "javascript"
            });
            if ("Same instance, new data") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Same instance, new data";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "select.options = await fetchOptions();   // a setter\nform.setValue('email', user.email);      // a method\ntable.loading = true;                    // toggle a busy state, then set rows",
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
               value: "export default class OrdersPage extends HTMLElement {\n  async init()   { this.$list = this.querySelector('.orders'); await this.load(); }\n  async update() { await this.load(); }   // cached revisit → refresh\n\n  async load() {\n    const orders = await slice.getComponent('api').request('GET', null, '/orders');\n    await this.renderOrders(orders);      // §3: reconcile, never replaceChildren()\n  }\n}",
               language: "javascript"
            });
            if ("Refresh on revisit") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Refresh on revisit";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "this.$list.replaceChildren();   // ✗ removes nodes without running beforeDestroy()\nfor (const order of orders) {\n  this.$list.appendChild(await slice.build('OrderRow', { title: order.title }));\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const dom = await slice.build('DomService', { singleton: true });\n\nawait dom.reconcile(this.$list, orders, {\n  keyOf: (order) => `order-${order.id}`,   // stable, page-wide unique\n  component: 'OrderRow',\n  props: (order) => ({ title: order.title }),\n  equals: Object.is,                       // immutable data: refresh only changed rows\n});",
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
            body.innerHTML = "<p>Keys are page-wide <code>sliceId</code>s, not per-container. Two unrelated lists using <code>row-1</code> will adopt and fight over the same node. Prefix them (<code>orders-row-1</code>, <code>cart-row-1</code>).</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "async init() {\n  this.$count = this.querySelector('.cart-count');\n  slice.context.watch(\n    'cart',\n    this,\n    (count) => { this.$count.textContent = count; },\n    (state) => state.items.length        // selector: only refresh when the count changes\n  );\n}\n\n// anywhere a change happens:\nslice.context.setState('cart', (prev) => ({ ...prev, items: [...prev.items, item] }));",
               language: "javascript"
            });
            if ("Watch shared state") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Watch shared state";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "async init() {\n  this.events = slice.events.bind(this);\n  this.events.subscribe('orders:updated', () => this.refresh());\n}\n\nasync refresh() {\n  this.rows = await fetchRows();   // note: re-uses the setter from §1\n}\n\n// elsewhere, after a mutation:\nslice.events.emit('orders:updated');",
               language: "javascript"
            });
            if ("Refresh on an event") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Refresh on an event";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.controller.destroyByContainer(this.$slot);   // runs beforeDestroy on everything inside\nthis.$slot.innerHTML = '';\nconst fresh = await slice.build('BigWidget', { ...newConfig });\nthis.$slot.appendChild(fresh);",
               language: "javascript"
            });
            if ("Rebuild a region") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Rebuild a region";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
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
            const left = await buildSide({"title":"Update in place","tone":"success","html":"<p>Assign a prop, call a method, reconcile a list, or let Context/Events notify watchers. The instance, its state and its children survive.</p>"});
            const right = await buildSide({"title":"Rebuild the region","tone":"danger","html":"<p>Destroy the old component and build a new one. Only when the structure itself changed so much that reconfiguring it would cost more than rebuilding.</p>"});
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
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const items = [{"title":"DomService","path":"https://components.slicejs.com/docs/services/dom-service","text":"Full reconcile API: keys, equals, refresh, destroyChildren."},{"title":"Service Patterns","path":"/Documentation/Architecture/Service-Patterns","text":"Where a service lives and how it is cleaned up."},{"title":"update()","path":"/Documentation/LifeCycle-Methods/update","text":"Cached route revisits."},{"title":"beforeDestroy()","path":"/Documentation/LifeCycle-Methods/beforeDestroy","text":"What cleanup actually runs."}];
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

customElements.define('slice-refreshingcomponentdatadocumentation', RefreshingComponentDataDocumentation);
