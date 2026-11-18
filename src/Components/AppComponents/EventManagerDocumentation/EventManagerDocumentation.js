export default class EventManagerDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "event-manager.md";
    this.markdownContent = "---\ntitle: EventManager\nroute: /Documentation/Structural/EventManager\nnavLabel: Events\nsection: State & Routing\ngroup: ''\norder: 30\ndescription: Lightweight pub/sub for component and app signals — not a state store.\ncomponent: EventManagerDocumentation\ntags: [events, pubsub, lifecycle, cleanup, signals]\n---\n\n# EventManager\n\n## Overview\nEventManager provides a lightweight pub/sub system for Slice.js. It supports global subscriptions,\ncomponent-bound subscriptions with auto-cleanup, and one-time listeners. It is designed for\ncross-cutting signals and decoupled communication between components and services.\n\n## Events vs Context\nUse an event when something **happened**; use Context when you need to know the **current state**.\n\n:::compare left=\"EventManager\" right=\"ContextManager\" leftTone=\"info\" rightTone=\"accent\"\nApp-level signals (`app:ready`, `user:login`, `notification:show`), decoupled UI reactions, and one-time bootstrap actions. Emit and forget; there is no retained state.\n---\nShared state that several components read and react to (`cart`, `session`, `filters`). `watch` / `setState` keep the value; components refresh when it changes.\n:::\n\nPair them when both are true: keep the state in Context, and emit an event for a cross-domain side\neffect that is not a state change.\n\n## Enable\n```json\n{\n  \"events\": { \"enabled\": true }\n}\n```\n\n## Events UI (optional)\n```json title=\"sliceConfig.json\"\n{\n  \"events\": {\n    \"enabled\": true,\n    \"ui\": {\n      \"enabled\": true,\n      \"shortcut\": \"alt+shift+e\"\n    }\n  }\n}\n```\n\n## Concepts\n- Event names are strings, typically namespaced (`domain:action`).\n- Subscriptions can be global or component-bound.\n- Component-bound subscriptions are auto-removed when the component is destroyed.\n\nDeclare events with the [Event Registry](/Documentation/Structural/EventRegistry) to get dev-time\nvalidation, typed `emit`/`subscribe`, and a documented graph of who emits and who listens.\n\n## Framework-emitted events\nSlice emits a few events itself; subscribe to them like any other:\n\n| Event | Fired by | Payload |\n| --- | --- | --- |\n| `router:change` | Router — once per navigation, after the new route renders | `{ to, from }` route objects — see [Routing](/Documentation/Routing) |\n| `context:<name>` | ContextManager — on every `setState` for that context | the context's new state — see [ContextManager](/Documentation/Structural/ContextManager) |\n\nBoth are **auto-declared** in the [Event Registry](/Documentation/Structural/EventRegistry) — you\ndon't `register()` them, and subscribing works out of the box.\n\n:::details title=\"What happens when events are disabled?\"\nWith `events.enabled: false`, `slice.events` is a no-op:\n\n- `router:change` instead dispatches a `CustomEvent` on `window`\n  (`window.addEventListener('router:change', e => e.detail)`) — see\n  [Routing → Route Change Events](/Documentation/Routing).\n- the `context:<name>` signals are not emitted at all, so\n  [`slice.context.watch()`/`bind()`](/Documentation/Structural/ContextManager) stop reacting to\n  `setState` — context reactivity depends on EventManager being enabled.\n:::\n\n## API Reference\n| Method | Signature | Notes |\n| --- | --- | --- |\n| `subscribe` | `(eventName, callback, options?)` | Auto-cleanup if `options.component` set |\n| `subscribeOnce` | `(eventName, callback, options?)` | Auto-unsubscribe after first emit |\n| `unsubscribe` | `(eventName, subscriptionId)` | Returns boolean |\n| `emit` | `(eventName, data?)` | Emits to all subscribers |\n| `bind` | `(component)` | Returns component-bound API |\n| `register` | `(catalog)` or `(namespace, catalog)` | Declare events — see [Event Registry](/Documentation/Structural/EventRegistry) |\n| `hasSubscribers` | `(eventName)` | Diagnostics only |\n| `subscriberCount` | `(eventName)` | Diagnostics only |\n| `clear` | `()` | Clears all subscriptions |\n| `startRecording` | `()` | Activate emit history + counters (called by debugger on open) |\n| `stopRecording` | `()` | Deactivate emit recording (called by debugger on close) |\n\n## Usage Patterns\n\n```javascript title=\"Component-bound subscription in init() (recommended)\"\nexport default class Navbar extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    this.events = slice.events.bind(this);\n    this.events.subscribe(\"user:logout\", () => this.resetUI());\n  }\n\n  resetUI() {\n    // ...\n  }\n}\n```\n\n```javascript title=\"Component-bound without bind() in init()\"\nexport default class Navbar extends HTMLElement {\n  async init() {\n    slice.events.subscribe(\n      \"user:logout\",\n      () => this.resetUI(),\n      { component: this }\n    );\n  }\n}\n```\n\n```javascript title=\"One-time initialization in init()\"\nexport default class AppShell extends HTMLElement {\n  async init() {\n    slice.events.subscribeOnce(\"app:ready\", () => {\n      console.log(\"App ready\");\n    });\n  }\n}\n```\n\n```javascript title=\"Service emits, UI listens\"\nexport default class NotificationService {\n  notify(message, type = \"info\") {\n    slice.events.emit(\"notification:show\", { message, type });\n  }\n}\n\nexport default class Toasts extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    this.events = slice.events.bind(this);\n    this.events.subscribe(\"notification:show\", ({ message, type }) => {\n      this.showToast(message, type);\n    });\n  }\n}\n```\n\n## Implementation Recipe\n:::steps\n1. Choose a namespaced event name (e.g., `cart:updated`).\n2. Emit the event where the change happens.\n3. Subscribe in the UI or other consumers using `bind()`.\n4. Use `subscribeOnce` for bootstrapping or single-run tasks.\n:::\n\n## Guidelines\n\n| Do | Why |\n| --- | --- |\n| Namespace names (`cart:updated`, not `update`) | The namespace groups the catalog, the debugger and the generated types. |\n| Prefer `bind()` for components | The subscription is removed when the component is destroyed. |\n| Keep payloads small and serializable | Events are signals, not a data channel. |\n| Use the Event Registry for declared events | Dev validation, typed payloads and the static graph. |\n| Use Context for state that must persist | EventManager does not retain state; late subscribers miss what happened before. |\n\n## Gotchas\n\n:::warning\nClearing a container does **not** remove its subscriptions. Use `slice.events.bind(this)`,\n`{ component: this }`, or an explicit `unsubscribe`.\n:::\n\n## Diagnostics\n```javascript title=\"Check if anyone is listening\"\nif (slice.events.hasSubscribers(\"cart:updated\")) {\n  slice.events.emit(\"cart:updated\", { items: 3 });\n}\n```\n\n## Generated documentation\n`slice docs generate events` writes a committed event catalog under `docs/events/`: a summary\nindex, one page per namespace, a Mermaid diagram and a self-contained HTML diagram. It uses the same\nstatic graph as the debugger Registry tab and excludes specs/tests/generated files. Run\n`slice docs check events` in CI. Event names must be `namespace:action`. See\n[Documentation & AGENTS.md](/Documentation/Documentation-System).\n\n## Debugger panel\nThe panel has three tabs:\n\n- **Subscribers** — every event with its subscriber count, an **emit counter** (⚡), the\n  **emitters** that fired it this session, and expandable subscriber details (component name,\n  `sliceId`, and a `once` badge for one-time listeners).\n- **Registry** — the declared catalog grouped by namespace, with payload shapes and the static\n  emitter/listener graph. See [Event Registry](/Documentation/Structural/EventRegistry).\n- **History** — reverse-chronological feed of every `emit()` call with its origin and relative\n  timestamps (\"2s ago\", \"1m ago\"). Use it to trace \"who emitted what and when\".\n\nRecording is **zero-overhead in production**: the emit log, counters and emitter attribution are\nonly active while the panel is open (`startRecording`/`stopRecording`).\n\n## FAQ\n:::details title=\"Do I need to unsubscribe manually?\"\nOnly if the subscription is not component-bound. `slice.events.bind(this)` and\n`{ component: this }` auto-clean; a global `subscribe()` needs an `unsubscribe()`.\n:::\n\n:::related\n- [Event Registry](/Documentation/Structural/EventRegistry) - Declare events, typed payloads and the static graph.\n- [ContextManager](/Documentation/Structural/ContextManager) - Shared state that persists.\n- [Context vs Events](/Documentation/Structural/Context-vs-Events) - The decision in one page.\n- [Routing](/Documentation/Routing) - `router:change` and route metadata.\n:::\n";
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
            const left = await buildSide({"title":"EventManager","tone":"info","html":"<p>App-level signals (<code>app:ready</code>, <code>user:login</code>, <code>notification:show</code>), decoupled UI reactions, and one-time bootstrap actions. Emit and forget; there is no retained state.</p>"});
            const right = await buildSide({"title":"ContextManager","tone":"accent","html":"<p>Shared state that several components read and react to (<code>cart</code>, <code>session</code>, <code>filters</code>). <code>watch</code> / <code>setState</code> keep the value; components refresh when it changes.</p>"});
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
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"events\": { \"enabled\": true }\n}",
               language: "json"
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"events\": {\n    \"enabled\": true,\n    \"ui\": {\n      \"enabled\": true,\n      \"shortcut\": \"alt+shift+e\"\n    }\n  }\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Event","Fired by","Payload"],
               rows: [[{"html":"<code>router:change</code>"},{"html":"Router — once per navigation, after the new route renders"},{"html":"<code>{ to, from }</code> route objects — see <a href=\"/Documentation/Routing\" data-route>Routing</a>"}],[{"html":"<code>context:&lt;name&gt;</code>"},{"html":"ContextManager — on every <code>setState</code> for that context"},{"html":"the context's new state — see <a href=\"/Documentation/Structural/ContextManager\" data-route>ContextManager</a>"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const details = await slice.build('Details', { title: "What happens when events are disabled?" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<p>With <code>events.enabled: false</code>, <code>slice.events</code> is a no-op:</p><ul><li><code>router:change</code> instead dispatches a <code>CustomEvent</code> on <code>window</code></li></ul><p>(<code>window.addEventListener('router:change', e =&gt; e.detail)</code>) — see <a href=\"/Documentation/Routing\" data-route>Routing → Route Change Events</a>.</p><ul><li>the <code>context:&lt;name&gt;</code> signals are not emitted at all, so</li></ul><p><a href=\"/Documentation/Structural/ContextManager\" data-route><code>slice.context.watch()</code>/<code>bind()</code></a> stop reacting to <code>setState</code> — context reactivity depends on EventManager being enabled.</p>";
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
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Notes"],
               rows: [[{"html":"<code>subscribe</code>"},{"html":"<code>(eventName, callback, options?)</code>"},{"html":"Auto-cleanup if <code>options.component</code> set"}],[{"html":"<code>subscribeOnce</code>"},{"html":"<code>(eventName, callback, options?)</code>"},{"html":"Auto-unsubscribe after first emit"}],[{"html":"<code>unsubscribe</code>"},{"html":"<code>(eventName, subscriptionId)</code>"},{"html":"Returns boolean"}],[{"html":"<code>emit</code>"},{"html":"<code>(eventName, data?)</code>"},{"html":"Emits to all subscribers"}],[{"html":"<code>bind</code>"},{"html":"<code>(component)</code>"},{"html":"Returns component-bound API"}],[{"html":"<code>register</code>"},{"html":"<code>(catalog)</code> or <code>(namespace, catalog)</code>"},{"html":"Declare events — see <a href=\"/Documentation/Structural/EventRegistry\" data-route>Event Registry</a>"}],[{"html":"<code>hasSubscribers</code>"},{"html":"<code>(eventName)</code>"},{"html":"Diagnostics only"}],[{"html":"<code>subscriberCount</code>"},{"html":"<code>(eventName)</code>"},{"html":"Diagnostics only"}],[{"html":"<code>clear</code>"},{"html":"<code>()</code>"},{"html":"Clears all subscriptions"}],[{"html":"<code>startRecording</code>"},{"html":"<code>()</code>"},{"html":"Activate emit history + counters (called by debugger on open)"}],[{"html":"<code>stopRecording</code>"},{"html":"<code>()</code>"},{"html":"Deactivate emit recording (called by debugger on close)"}]]
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
               value: "export default class Navbar extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    this.events = slice.events.bind(this);\n    this.events.subscribe(\"user:logout\", () => this.resetUI());\n  }\n\n  resetUI() {\n    // ...\n  }\n}",
               language: "javascript"
            });
            if ("Component-bound subscription in init() (recommended)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Component-bound subscription in init() (recommended)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class Navbar extends HTMLElement {\n  async init() {\n    slice.events.subscribe(\n      \"user:logout\",\n      () => this.resetUI(),\n      { component: this }\n    );\n  }\n}",
               language: "javascript"
            });
            if ("Component-bound without bind() in init()") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Component-bound without bind() in init()";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class AppShell extends HTMLElement {\n  async init() {\n    slice.events.subscribeOnce(\"app:ready\", () => {\n      console.log(\"App ready\");\n    });\n  }\n}",
               language: "javascript"
            });
            if ("One-time initialization in init()") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "One-time initialization in init()";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class NotificationService {\n  notify(message, type = \"info\") {\n    slice.events.emit(\"notification:show\", { message, type });\n  }\n}\n\nexport default class Toasts extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    this.events = slice.events.bind(this);\n    this.events.subscribe(\"notification:show\", ({ message, type }) => {\n      this.showToast(message, type);\n    });\n  }\n}",
               language: "javascript"
            });
            if ("Service emits, UI listens") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Service emits, UI listens";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Do","Why"],
               rows: [[{"html":"Namespace names (<code>cart:updated</code>, not <code>update</code>)"},{"html":"The namespace groups the catalog, the debugger and the generated types."}],[{"html":"Prefer <code>bind()</code> for components"},{"html":"The subscription is removed when the component is destroyed."}],[{"html":"Keep payloads small and serializable"},{"html":"Events are signals, not a data channel."}],[{"html":"Use the Event Registry for declared events"},{"html":"Dev validation, typed payloads and the static graph."}],[{"html":"Use Context for state that must persist"},{"html":"EventManager does not retain state; late subscribers miss what happened before."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Clearing a container does <strong>not</strong> remove its subscriptions. Use <code>slice.events.bind(this)</code>, <code>{ component: this }</code>, or an explicit <code>unsubscribe</code>.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-14"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "if (slice.events.hasSubscribers(\"cart:updated\")) {\n  slice.events.emit(\"cart:updated\", { items: 3 });\n}",
               language: "javascript"
            });
            if ("Check if anyone is listening") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Check if anyone is listening";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-15"]');
         if (container) {
            const details = await slice.build('Details', { title: "Do I need to unsubscribe manually?" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<p>Only if the subscription is not component-bound. <code>slice.events.bind(this)</code> and <code>{ component: this }</code> auto-clean; a global <code>subscribe()</code> needs an <code>unsubscribe()</code>.</p>";
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
            const items = [{"title":"Event Registry","path":"/Documentation/Structural/EventRegistry","text":"Declare events, typed payloads and the static graph."},{"title":"ContextManager","path":"/Documentation/Structural/ContextManager","text":"Shared state that persists."},{"title":"Context vs Events","path":"/Documentation/Structural/Context-vs-Events","text":"The decision in one page."},{"title":"Routing","path":"/Documentation/Routing","text":"router:change and route metadata."}];
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

customElements.define('slice-eventmanagerdocumentation', EventManagerDocumentation);
