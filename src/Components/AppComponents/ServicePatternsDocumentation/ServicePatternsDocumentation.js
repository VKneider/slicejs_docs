export default class ServicePatternsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/service-patterns.md";
    this.markdownContent = "---\ntitle: Service Patterns\nroute: /Documentation/Architecture/Service-Patterns\nnavLabel: Service Patterns\nsection: Project Architecture\ngroup: Styles and Patterns\norder: 6\ndescription: Where state and logic should live in a Slice app — instance fields, plain helpers, singleton services, providers — and how cleanup actually works.\ncomponent: ServicePatternsDocumentation\ntags: [architecture, services, singleton, state, cleanup]\n---\n\n# Service Patterns\n\nHow you place state and shared logic decides whether your app leaks, needs manual cleanup, or stays\nsimple. This guide distils the rules that follow from how Slice builds and destroys components.\n\n## The one rule everything follows\n\n> **Registering a thing in the component registry (any `slice.build(...)`) creates a cleanup\n> obligation. Plain instance fields and plain objects do not — the garbage collector handles them.**\n\n`slice.build` stores the instance in `slice.controller.activeComponents` (a strong reference). It\nstays alive until you explicitly `destroyComponent` it. A value you keep on `this` (a number, an\narray, a `new MyClass()`) is freed automatically when its owner is destroyed. So the question for any\npiece of state or logic is: *does this need to be registered (shared/discoverable), or not?*\n\n## Where should it live?\n\n| What you have | Where it goes | Cleanup |\n| --- | --- | --- |\n| Per-instance UI state (current page, sort, open/closed) | **instance fields** on the component (`this._page`) | automatic (GC) |\n| Per-instance stateful helper (a little engine, a calculator) | **`new Helper()`** stored on `this` — NOT `slice.build` | automatic (GC) |\n| Reusable **stateless** logic shared across components | a **singleton Service** (built once) or a pure module | none — lives for the app |\n| Several **app-wide singletons** (auth, api, store) | an **`AppServices` composition root** | none — app-lifetime |\n| App-wide **UI** (toasts, tooltips, a modal portal) | a **Provider Service** that owns the Visuals | the provider is the singleton |\n| ❌ A per-instance Service built with `slice.build` | avoid — needs manual `destroyComponent` | manual + fragile |\n\nThe rest of this page expands each row.\n\n## Instance state lives on the instance\n\nA component's own view state is intrinsic to that instance. Keep it in plain fields — never split it\ninto a separate registered object.\n\n```javascript\nset page(value) { this._page = value; this.render(); }   // GC'd with the component, zero ceremony\n```\n\nIf the state logic gets big, wrap it in a **plain class** and `new` it — still no registration, still\nGC'd with the owner:\n\n```javascript\nasync init() {\n  this._engine = new DataGridEngine({ data: this._rows, pageSize: 10 });  // plain new, not slice.build\n}\n```\n\n## Reusable logic → a singleton (or a pure module)\n\nFor logic shared across components, you have two leak-free options:\n\n- **Pure module** — relative `import` of plain functions (`import { paginate } from './engine.js'`).\n  Simplest; the trade-off is relative-path coupling when imported from far away in the tree.\n- **Singleton Service** — built once, retrieved by name from anywhere (no path coupling, discoverable).\n\nBare imports are not supported in Slice, so a Service is the idiomatic way to share logic without\nrelative paths. See the [Services](/Documentation/Service) guide for the singleton patterns\n(`AppServices` and the `build({ singleton: true })` shortcut).\n\n## App-wide singletons → a composition root\n\nBuild app-wide singletons (auth, an API client, a store, config) in **one place** — an `AppServices`\nService whose `init()` builds the rest and seeds context. Everywhere else, just `getComponent`.\n\n```javascript title=\"Service/AppServices/AppServices.js\"\nexport default class AppServices {\n  async init() {\n    this.auth = await slice.build('AuthService',  { sliceId: 'AuthService' });\n    this.api  = await slice.build('FetchManager', { sliceId: 'api', baseUrl: API_URL });\n    slice.context.set('theme', 'dark');\n  }\n}\n```\n\n```javascript\nawait slice.build('AppServices', { sliceId: 'AppServices' });   // one bootstrap call at app start\n```\n\n`AppServices` and its services are **app-lifetime** — you never destroy them, so there is nothing to\nclean up. Reach for `build({ singleton: true })` only for the lazy/decentralized case. Full detail and\nthe \"which one?\" table live in [Services](/Documentation/Service).\n\n## Global UI → a Provider Service\n\nA `singleton: true` works only for Services, because a DOM node can live in **one place at a time** —\na shared Visual would teleport between mount points. So \"I need one global widget\" is really \"I need a\n**Provider Service** that owns and manages the Visual.\" That is exactly how `ToastProvider` and\n`ToolTipProvider` work: the provider is the singleton; the toasts/tooltips it creates are ephemeral.\n\n## How cleanup actually works (important)\n\n> **`destroyComponent(parent)` cascades to nested Visual children, but NOT to Services — destroy any\n> Service you built by hand.**\n\n`destroyComponent(parent)` walks the parent→child index and destroys the subtree (running each\n`beforeDestroy`, deepest-first). Visual children that were built and placed in the parent's DOM by the\ntime the parent finished `init()` are linked automatically, so they cascade.\n\nA **Service has no DOM element**, so it can never be discovered — not by the parent's cascade and not\nby `destroyByContainer`. **Every Service you build with `slice.build` must be destroyed explicitly** in\nthe owner's `beforeDestroy()`. The same applies to any Visual child you append *after* `init()` (too\nlate to be linked).\n\n```javascript\nasync init() {\n  this._engine = await slice.build('DataGridEngine', { sliceId: `grid-${++Table._seq}` }); // a Service\n  this._pager  = await slice.build('Pagination', { /* ... */ });                            // a Visual child\n}\n\nbeforeDestroy() {\n  // The Service is NEVER auto-cascaded — destroy it by hand.\n  slice.controller.destroyComponent(this._engine);\n  // The Visual child IS cascaded once it is in the DOM; destroying it here too is\n  // harmless (destroyComponent is idempotent) and safe across framework versions.\n  slice.controller.destroyComponent(this._pager);\n}\n```\n\nFor tearing down a whole region, **`slice.controller.destroyByContainer(domNode)`** discovers every\nVisual component inside a DOM subtree and destroys them — the \"destroy-before-clear\" workhorse. (It\nstill won't find Services, since they have no DOM node.)\n\nApp-lifetime singletons (an `AppServices` graph) are the happy exception: they are never destroyed, so\nthere is nothing to clean up.\n\n:::warning\nA Service built with `slice.build` is registered in the component registry but has no DOM. If you drop\nits owner without destroying the Service, it **leaks** — it stays in `activeComponents` and its\n`beforeDestroy` never runs. Always destroy built Services explicitly.\n:::\n\n:::warning\nTearing a subtree down with `innerHTML = ''` does **not** run `beforeDestroy` and does **not** unregister\nanything — listeners stay bound and registry entries leak. Always `destroyByContainer(node)` **then**\nclear.\n:::\n\n## Worked example: the Table's data engine\n\nThe built-in `Table` shows the rules together:\n\n- **State** (page, sort) lives in a `DataGridEngine` — a per-instance object. The engine is built with\n  `slice.build` (so it is discoverable and could be inspected), with a unique `sliceId` per table.\n- The Table destroys **both** the engine and the `Pagination` child in `beforeDestroy()`. The engine\n  (a Service) is never auto-cascaded, so it **must** be destroyed by hand; destroying the pager too is\n  redundant-but-safe (a Visual child does cascade, and `destroyComponent` is idempotent).\n- The pure sort/paginate math also exists as **static helpers** on the engine, so callers that only need\n  a one-off computation can skip the instance entirely.\n\n## Anti-patterns\n\n- ❌ A **stateful per-instance Service** built with `slice.build` and relied on to be auto-cleaned — it\n  will not be. Either destroy it explicitly, or (better, if it is pure per-instance state) use a plain\n  `new`.\n- ❌ Scattering `build({ singleton: true })` across many call sites for an app-wide service — centralize\n  it in `AppServices` and `getComponent` it instead.\n- ❌ Storing service instances or functions in `slice.context` — keep only serializable state there.\n- ❌ Declaring `id`, `sliceId`, or `singleton` in `static props` — they are reserved build directives,\n  consumed by `build` before your setters run. See [Reserved build keys](/Documentation/The-build-method).\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| What you have | Where it goes | Cleanup |","| --- | --- | --- |","| Per-instance UI state (current page, sort, open/closed) | **instance fields** on the component (`this._page`) | automatic (GC) |","| Per-instance stateful helper (a little engine, a calculator) | **`new Helper()`** stored on `this` — NOT `slice.build` | automatic (GC) |","| Reusable **stateless** logic shared across components | a **singleton Service** (built once) or a pure module | none — lives for the app |","| Several **app-wide singletons** (auth, api, store) | an **`AppServices` composition root** | none — app-lifetime |","| App-wide **UI** (toasts, tooltips, a modal portal) | a **Provider Service** that owns the Visuals | the provider is the singleton |","| ❌ A per-instance Service built with `slice.build` | avoid — needs manual `destroyComponent` | manual + fragile |"];
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
               value: "set page(value) { this._page = value; this.render(); }   // GC'd with the component, zero ceremony",
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "async init() {\n  this._engine = new DataGridEngine({ data: this._rows, pageSize: 10 });  // plain new, not slice.build\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class AppServices {\n  async init() {\n    this.auth = await slice.build('AuthService',  { sliceId: 'AuthService' });\n    this.api  = await slice.build('FetchManager', { sliceId: 'api', baseUrl: API_URL });\n    slice.context.set('theme', 'dark');\n  }\n}",
               language: "javascript"
            });
            if ("Service/AppServices/AppServices.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Service/AppServices/AppServices.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "await slice.build('AppServices', { sliceId: 'AppServices' });   // one bootstrap call at app start",
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
               value: "async init() {\n  this._engine = await slice.build('DataGridEngine', { sliceId: `grid-${++Table._seq}` }); // a Service\n  this._pager  = await slice.build('Pagination', { /* ... */ });                            // a Visual child\n}\n\nbeforeDestroy() {\n  // The Service is NEVER auto-cascaded — destroy it by hand.\n  slice.controller.destroyComponent(this._engine);\n  // The Visual child IS cascaded once it is in the DOM; destroying it here too is\n  // harmless (destroyComponent is idempotent) and safe across framework versions.\n  slice.controller.destroyComponent(this._pager);\n}",
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

customElements.define('slice-servicepatternsdocumentation', ServicePatternsDocumentation);
