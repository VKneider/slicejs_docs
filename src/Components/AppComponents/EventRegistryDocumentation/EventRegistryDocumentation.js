export default class EventRegistryDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "event-registry.md";
    this.markdownContent = "---\ntitle: Event Registry\nroute: /Documentation/Structural/EventRegistry\nnavLabel: Event Registry\nsection: State & Routing\ngroup: ''\norder: 40\ndescription: Declare a typed, namespaced catalog of events for dev validation, autocompletion, and pub/sub tracing.\ncomponent: EventRegistryDocumentation\ntags: [events, registry, pubsub, types, tracing]\n---\n\n# Event Registry\n\n## Overview\nPub/sub decouples senders from receivers — which is exactly why it is hard to trace:\nevent names are bare strings, payloads are untyped, and a typo silently creates a new\nevent nobody listens to. The **Event Registry** is an opt-in catalog that turns your\nevents into a **declared, typed, namespaced contract**.\n\nDeclaring events buys you three things:\n- **Dev-time validation** — emitting or subscribing to an event you never declared warns once.\n- **Typed `emit`/`subscribe`** — `slice docs generate types` reads the catalog so payloads autocomplete and wrong shapes fail `tsc`.\n- **A documented graph** — who emits and who listens to each event, both statically (from code) and live (this session).\n\nThe registry is **opt-in and safe by default**: if you never call `register()`, the\nEventManager behaves exactly as before (no warnings, no overhead).\n\n## Declaring events\n\nDeclare events at your composition root (e.g. a `Providers` service built from\n`AppShell.init()`). `register()` is **mergeable** — call it as many times as you like,\nfrom as many modules as you like.\n\n```javascript title=\"Flat keys (namespace:event)\"\nslice.events.register({\n  'cart:add':     { description: 'Item added to cart', payload: { sku: 'string', qty: 'number' } },\n  'cart:cleared': { description: 'Cart emptied', payload: null },   // null => no payload\n});\n```\n\n```javascript title=\"Grouped by namespace — register(namespace, catalog)\"\nslice.events.register('user', {\n  login:  { payload: { id: 'number', name: 'string' } },\n  logout: { payload: null },\n}); // => declares 'user:login' and 'user:logout'\n```\n\nThe `payload` mini-schema uses the same vocabulary as `static props` types: a field map\nlike `{ id: 'number', name: 'string' }`, or `null` for events that carry no data.\n\n### Modularize by domain\nKeep one catalog per domain in its own module and register them where you wire singletons:\n\n```javascript title=\"src/events/cart.events.js\"\nexport const cartEvents = {\n  'cart:add':     { payload: { sku: 'string', qty: 'number' } },\n  'cart:cleared': { payload: null },\n};\n```\n\n```javascript title=\"Providers.init() — the composition root\"\nimport { cartEvents } from '../events/cart.events.js';\nimport { userEvents } from '../events/user.events.js';\n\nslice.events.register(cartEvents).register(userEvents);\n```\n\n## Validation (dev only)\nOnce any catalog is registered, the EventManager validates usage in development. It\n**never throws and never blocks delivery** — it logs a one-time warning and records the\ndrift for the debugger:\n\n- **Undeclared event** — `emit`/`subscribe` for an event not in the catalog.\n- **No namespace** — an event name without a `namespace:` prefix (prefer `cart:add` over `add`).\n\nIn production all of this is silent and zero-overhead.\n\n## Typed events\nRun the CLI to generate TypeScript declarations from the catalog:\n\n```bash title=\"Generate types + the event graph manifest\"\nslice docs generate types\n```\n\nThis emits a `SliceEventRegistry` interface and types `slice.events.emit`/`subscribe`\nby event name. Known events enforce their payload; unknown or dynamic events stay\npermissive.\n\n```typescript title=\"Typed at compile time\"\nslice.events.emit('cart:add', { sku: 'A1', qty: 2 });   // ✅ ok\nslice.events.emit('cart:add', { sku: 'A1' });            // ❌ tsc error: qty is required\nslice.events.subscribe('user:login', (u) => u.name);     // u is { id: number; name: string }\n```\n\n## API Reference\n| Method | Signature | Notes |\n| --- | --- | --- |\n| `register` | `(catalog)` or `(namespace, catalog)` | Mergeable; turns on dev validation |\n| `isDeclared` | `(eventName)` | Whether the event is in the catalog |\n| `namespaceOf` | `(eventName)` | Segment before the first colon, or null |\n| `loadGraph` | `(manifest)` | Loads the generated static graph (documentation) |\n| `staticEmittersOf` | `(eventName)` | Code sites that emit this event |\n| `staticListenersOf` | `(eventName)` | Code sites that subscribe to this event |\n\n## Tracing: two complementary layers\nKnowing the graph \"who emits, who listens\" comes from two sources that cover each\nother's blind spots:\n\n| Question | Layer | Source |\n| --- | --- | --- |\n| Who can emit this event? (documentation) | Static | `slice docs generate types` scans `emit`/`subscribe` call sites |\n| Who actually emitted it this session? | Runtime | Live attribution recorded while the debugger is open |\n\n**Static graph (documentation).** `slice docs generate types` writes\n`src/slice-events.generated.js`: per event, the emitter and listener call sites\n(`file:line` plus the enclosing component). It is complete because it reads code, not\nexecution — an emit on a branch that never ran is still documented. Events emitted with\na computed name (`emit(\\`cart:${x}\\`)`) cannot be resolved statically and are listed as\ndynamic.\n\n**Runtime tracing (observational).** While the Events panel is open, every `emit()` is\nattributed to its source: the component when emitted through `slice.events.bind(this)`,\nor a best-effort `file:line` from the call stack for global emits. This is what *actually*\nfired, with counts — and anything that fires but is missing from the static graph is a\ndynamic emit worth a look.\n\n## Human-readable event docs\n\n`slice docs generate events` turns the same graph into a committed event catalog:\n\n```text\ndocs/events/\n├── index.md          # summary by namespace + drift\n├── cart.md           # one page per namespace\n├── router.md\n├── diagram.mmd       # Mermaid source\n└── diagram.html      # self-contained HTML + inline SVG\n```\n\nEach namespace page lists the payload and the emitters/listeners with component, category\nand `file:line`. `index.md` flags declared-but-unused events, used-but-undeclared events,\nnames without a namespace, and dynamic sites. The scanner excludes specs, tests and generated\nfiles. `slice docs check events` is the drift gate. See\n[Documentation & AGENTS.md](/Documentation/Documentation-System).\n\n## Debugger panel\nEnable the Events UI and open it with the shortcut to inspect all of the above:\n\n```json title=\"sliceConfig.json\"\n{\n  \"events\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+e\" } }\n}\n```\n\n- **Registry** — the declared catalog grouped by namespace: payload shape, live listener\n  count, and the static emitters/listeners from the manifest. Drift badges flag\n  declared-but-idle and used-but-undeclared events.\n- **Subscribers** — live listeners per event plus the runtime emitters that fired.\n- **History** — reverse-chronological feed of every `emit()` with its origin and a\n  relative timestamp.\n\n## Best Practices\n:::tip\nAlways namespace events (`cart:add`, not `add`). The namespace groups the catalog, the\ndebugger, and the generated types.\n:::\n\n:::tip\nDeclare catalogs as plain object literals (or imported literals) and pass them to\n`register()`. The type generator resolves literals statically — a computed object won't\nbe typed.\n:::\n\nRegister all catalogs from one place (your `Providers`/composition root). One file is\nstandardization; many `register()` calls is modularization — both work with the same API.\n\nAfter adding events or emit/subscribe sites, run `slice docs generate types` for the typed\ncontract and `slice docs generate events` for the human catalog. `slice docs check` catches\ndrift.\n\n## Gotchas\n:::warning\nValidation only activates after the first `register()`. Until then the EventManager runs\nin loose mode with no warnings — declaring the catalog is what opts you in.\n:::\n\nEvents emitted with a computed name (`emit(\\`user:${id}\\`)`) cannot be typed or documented\nstatically. Use literal names where you want the contract; the runtime tracer still shows\nthem under dynamic sites.\n\n## FAQ\n:::details title=\"Is the registry required?\"\nNo. It is fully opt-in. Without `register()` the EventManager works exactly as before.\n:::\n\n:::details title=\"Why warn instead of throw on an undeclared event?\"\nSafe by default: a missing declaration should never break a running app. Validation is a\ndev aid (a one-time warning plus a debugger badge), not a runtime gate.\n:::\n\n:::details title=\"Where do the static emitters/listeners come from?\"\nFrom `slice docs generate types`, which scans your `emit`/`subscribe` call sites and writes\n`src/slice-events.generated.js`. The Events panel loads it to show the documented graph\nalongside live runtime activity. The file is only published and served when\n`events.ui.enabled` is true; with the panel off there is no consumer, so `slice start` and\n`slice export` leave it out. `slice docs generate events` writes the human catalog under\n`docs/events/`. See [EventManager](/Documentation/Structural/EventManager).\n:::\n";
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
            const code = await slice.build('CodeVisualizer', {
               value: "slice.events.register({\n  'cart:add':     { description: 'Item added to cart', payload: { sku: 'string', qty: 'number' } },\n  'cart:cleared': { description: 'Cart emptied', payload: null },   // null => no payload\n});",
               language: "javascript"
            });
            if ("Flat keys (namespace:event)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Flat keys (namespace:event)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.events.register('user', {\n  login:  { payload: { id: 'number', name: 'string' } },\n  logout: { payload: null },\n}); // => declares 'user:login' and 'user:logout'",
               language: "javascript"
            });
            if ("Grouped by namespace — register(namespace, catalog)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Grouped by namespace — register(namespace, catalog)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export const cartEvents = {\n  'cart:add':     { payload: { sku: 'string', qty: 'number' } },\n  'cart:cleared': { payload: null },\n};",
               language: "javascript"
            });
            if ("src/events/cart.events.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "src/events/cart.events.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import { cartEvents } from '../events/cart.events.js';\nimport { userEvents } from '../events/user.events.js';\n\nslice.events.register(cartEvents).register(userEvents);",
               language: "javascript"
            });
            if ("Providers.init() — the composition root") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Providers.init() — the composition root";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice docs generate types",
               language: "bash"
            });
            if ("Generate types + the event graph manifest") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Generate types + the event graph manifest";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.events.emit('cart:add', { sku: 'A1', qty: 2 });   // ✅ ok\nslice.events.emit('cart:add', { sku: 'A1' });            // ❌ tsc error: qty is required\nslice.events.subscribe('user:login', (u) => u.name);     // u is { id: number; name: string }",
               language: "typescript"
            });
            if ("Typed at compile time") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Typed at compile time";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Notes"],
               rows: [[{"html":"<code>register</code>"},{"html":"<code>(catalog)</code> or <code>(namespace, catalog)</code>"},{"html":"Mergeable; turns on dev validation"}],[{"html":"<code>isDeclared</code>"},{"html":"<code>(eventName)</code>"},{"html":"Whether the event is in the catalog"}],[{"html":"<code>namespaceOf</code>"},{"html":"<code>(eventName)</code>"},{"html":"Segment before the first colon, or null"}],[{"html":"<code>loadGraph</code>"},{"html":"<code>(manifest)</code>"},{"html":"Loads the generated static graph (documentation)"}],[{"html":"<code>staticEmittersOf</code>"},{"html":"<code>(eventName)</code>"},{"html":"Code sites that emit this event"}],[{"html":"<code>staticListenersOf</code>"},{"html":"<code>(eventName)</code>"},{"html":"Code sites that subscribe to this event"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Question","Layer","Source"],
               rows: [[{"html":"Who can emit this event? (documentation)"},{"html":"Static"},{"html":"<code>slice docs generate types</code> scans <code>emit</code>/<code>subscribe</code> call sites"}],[{"html":"Who actually emitted it this session?"},{"html":"Runtime"},{"html":"Live attribution recorded while the debugger is open"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "docs/events/\n├── index.md          # summary by namespace + drift\n├── cart.md           # one page per namespace\n├── router.md\n├── diagram.mmd       # Mermaid source\n└── diagram.html      # self-contained HTML + inline SVG",
               language: "text"
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
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"events\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+e\" } }\n}",
               language: "json"
            });
            if ("sliceConfig.json") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "sliceConfig.json";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Always namespace events (<code>cart:add</code>, not <code>add</code>). The namespace groups the catalog, the debugger, and the generated types.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Declare catalogs as plain object literals (or imported literals) and pass them to <code>register()</code>. The type generator resolves literals statically — a computed object won't be typed.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-14"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Validation only activates after the first <code>register()</code>. Until then the EventManager runs in loose mode with no warnings — declaring the catalog is what opts you in.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-15"]');
         if (container) {
            const details = await slice.build('Details', { title: "Is the registry required?" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<p>No. It is fully opt-in. Without <code>register()</code> the EventManager works exactly as before.</p>";
            if (details) {
               details.addDetail(body);
               container.appendChild(details);
            } else {
               container.appendChild(body);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-16"]');
         if (container) {
            const details = await slice.build('Details', { title: "Why warn instead of throw on an undeclared event?" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<p>Safe by default: a missing declaration should never break a running app. Validation is a dev aid (a one-time warning plus a debugger badge), not a runtime gate.</p>";
            if (details) {
               details.addDetail(body);
               container.appendChild(details);
            } else {
               container.appendChild(body);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-17"]');
         if (container) {
            const details = await slice.build('Details', { title: "Where do the static emitters/listeners come from?" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<p>From <code>slice docs generate types</code>, which scans your <code>emit</code>/<code>subscribe</code> call sites and writes <code>src/slice-events.generated.js</code>. The Events panel loads it to show the documented graph alongside live runtime activity. The file is only published and served when <code>events.ui.enabled</code> is true; with the panel off there is no consumer, so <code>slice start</code> and <code>slice export</code> leave it out. <code>slice docs generate events</code> writes the human catalog under <code>docs/events/</code>. See <a href=\"/Documentation/Structural/EventManager\" data-route>EventManager</a>.</p>";
            if (details) {
               details.addDetail(body);
               container.appendChild(details);
            } else {
               container.appendChild(body);
            }
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

customElements.define('slice-eventregistrydocumentation', EventRegistryDocumentation);
