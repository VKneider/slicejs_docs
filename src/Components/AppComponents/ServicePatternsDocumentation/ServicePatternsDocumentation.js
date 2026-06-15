export default class ServicePatternsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/service-patterns.md";
    this.markdownContent = "---\r\ntitle: Service Patterns\r\nroute: /Documentation/Architecture/Service-Patterns\r\nnavLabel: Service Patterns\r\nsection: Project Architecture\r\ngroup: Styles and Patterns\r\norder: 6\r\ndescription: Where state and logic should live in a Slice app — instance fields, plain helpers, singleton services, providers — and how cleanup actually works.\r\ncomponent: ServicePatternsDocumentation\r\ntags: [architecture, services, singleton, state, cleanup]\r\n---\r\n\r\n# Service Patterns\r\n\r\nWhere state and shared logic live decides whether your app leaks. One rule, a decision table, and the cleanup contract.\r\n\r\n## The one rule\r\n\r\n> **Anything built with `slice.build(...)` is registered and must be cleaned up. Plain instance fields and plain objects are not — the GC frees them with their owner.**\r\n\r\n`slice.build` keeps a strong reference in `slice.controller.activeComponents` until you `destroyComponent` it. A value on `this` (`new MyClass()`, an array) is freed automatically. So ask: *does this need to be registered (shared / discoverable), or not?*\r\n\r\n## Where should it live?\r\n\r\n| What you have | Where it goes | Cleanup |\r\n| --- | --- | --- |\r\n| Per-instance view state (page, sort, open/closed) | **instance fields** (`this._page`) | automatic (GC) |\r\n| Per-instance stateful helper (an engine, a calculator) | **`new Helper()`** on `this` — not `slice.build` | automatic (GC) |\r\n| Reusable **stateless** logic | a **singleton Service** or a pure module | none — app-lifetime |\r\n| App-wide singletons (auth, api, store) | one **composition-root** Service | none — app-lifetime |\r\n| App-wide **UI** (toasts, tooltips, modals) | a **Provider Service** owning the Visuals | the provider is the singleton |\r\n| ❌ Per-instance Service built with `slice.build` | avoid — needs manual `destroyComponent` | manual + fragile |\r\n\r\n## Instance state → plain fields\r\n\r\n```javascript\r\nset page(value) { this._page = value; this.render(); }   // GC'd with the component\r\n```\r\n\r\nBig state logic → wrap in a **plain class** and `new` it (still no registration, still GC'd):\r\n\r\n```javascript\r\nasync init() {\r\n  this._engine = new DataGridEngine({ data: this._rows, pageSize: 10 }); // plain new, not slice.build\r\n}\r\n```\r\n\r\n## App-wide singletons → a composition root\r\n\r\nBuild app-wide singletons in **one place** — a Service (e.g. `AppServices` / `Providers`) whose `init()` builds the rest and seeds context. Everywhere else, **recover** with `slice.getComponent(name)`.\r\n\r\n```javascript title=\"Components/AppServices/AppServices.js\"\r\nexport default class AppServices {\r\n  async init() {\r\n    await slice.build('AuthService',  { sliceId: 'AuthService' });\r\n    await slice.build('FetchManager', { sliceId: 'api', baseUrl: API_URL });\r\n    slice.context.create('settings', { theme: 'dark' });\r\n  }\r\n}\r\n```\r\n\r\n```javascript\r\nawait slice.build('AppServices', { singleton: true });  // one bootstrap call from the App Shell's init()\r\nconst auth = slice.getComponent('AuthService');          // recover anywhere\r\n```\r\n\r\n:::tip\r\n**Default: build once + `getComponent`** — one owner creates, consumers only read. Use **`slice.build('X', { singleton: true })`** (Service only — get-or-create) when a service can be built from **more than one entry point** (e.g. an `AuthService` needed by both the composition root and a standalone `/login` route): it returns the shared instance with no `getComponent(x) || build(x)` guard and no duplicate-`sliceId` race. `props` apply only on the first (creating) call.\r\n:::\r\n\r\n:::warning\r\n`slice.build` **awaits the component's `init()`** — building a service already ran it. Calling `init()` again runs it twice (and re-building a child with the same `sliceId` throws \"already registered\"). Make `init()` idempotent: `if (this._ready) return this;`.\r\n:::\r\n\r\nApp-lifetime singletons are never destroyed, so there is nothing to clean up.\r\n\r\n## Global UI → a Provider Service\r\n\r\n`singleton: true` works only for Services, because a DOM node lives in **one place at a time** — a shared Visual would teleport between mount points. So \"one global widget\" means \"a **Provider Service** that owns the Visual.\" That is how `ToastProvider` / `ToolTipProvider` work: the provider is the singleton; the toasts/tooltips it creates are ephemeral.\r\n\r\n## Cleanup\r\n\r\n> **`destroyComponent(parent)` cascades to nested Visual children, but NOT to Services. Destroy any Service you built by hand, in `beforeDestroy()`.**\r\n\r\nA Service has no DOM node, so nothing can discover it — not the parent cascade, not `destroyByContainer`. Same for a Visual child appended *after* `init()` (too late to be linked).\r\n\r\n```javascript\r\nasync init() {\r\n  this._engine = await slice.build('DataGridEngine', { sliceId: `grid-${++Table._seq}` }); // Service\r\n}\r\nbeforeDestroy() {\r\n  slice.controller.destroyComponent(this._engine);   // Services never cascade — destroy by hand\r\n}\r\n```\r\n\r\nTo tear down a region: **`slice.controller.destroyByContainer(node)`** (destroys every Visual inside a DOM subtree) **then** clear. `innerHTML = ''` alone skips `beforeDestroy` and leaks.\r\n\r\n:::warning\r\nTearing a subtree down with `innerHTML = ''` does **not** run `beforeDestroy` and does **not** unregister anything — listeners stay bound and registry entries leak. Always `destroyByContainer(node)` **then** clear.\r\n:::\r\n\r\n## Anti-patterns\r\n\r\n- ❌ A stateful per-instance Service via `slice.build` relied on to auto-clean — it won't. Destroy it explicitly, or (if it is pure per-instance state) use a plain `new`.\r\n- ❌ Scattering `build({ singleton: true })` across call sites for an app-wide service — centralize it in the composition root and `getComponent` it.\r\n- ❌ Storing service instances or functions in `slice.context` — keep only serializable state (and note `setState` **replaces** the value, it does not merge).\r\n- ❌ Declaring `id`, `sliceId`, or `singleton` in `static props` — reserved build directives, consumed by `build` before your setters run. See [Reserved build keys](/Documentation/The-build-method).\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| What you have | Where it goes | Cleanup |\r","| --- | --- | --- |\r","| Per-instance view state (page, sort, open/closed) | **instance fields** (`this._page`) | automatic (GC) |\r","| Per-instance stateful helper (an engine, a calculator) | **`new Helper()`** on `this` — not `slice.build` | automatic (GC) |\r","| Reusable **stateless** logic | a **singleton Service** or a pure module | none — app-lifetime |\r","| App-wide singletons (auth, api, store) | one **composition-root** Service | none — app-lifetime |\r","| App-wide **UI** (toasts, tooltips, modals) | a **Provider Service** owning the Visuals | the provider is the singleton |\r","| ❌ Per-instance Service built with `slice.build` | avoid — needs manual `destroyComponent` | manual + fragile |\r"];
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
               value: "set page(value) { this._page = value; this.render(); }   // GC'd with the component\r",
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
               value: "async init() {\r\n  this._engine = new DataGridEngine({ data: this._rows, pageSize: 10 }); // plain new, not slice.build\r\n}\r",
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
               value: "export default class AppServices {\r\n  async init() {\r\n    await slice.build('AuthService',  { sliceId: 'AuthService' });\r\n    await slice.build('FetchManager', { sliceId: 'api', baseUrl: API_URL });\r\n    slice.context.create('settings', { theme: 'dark' });\r\n  }\r\n}\r",
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
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "await slice.build('AppServices', { singleton: true });  // one bootstrap call from the App Shell's init()\r\nconst auth = slice.getComponent('AuthService');          // recover anywhere\r",
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
               value: "async init() {\r\n  this._engine = await slice.build('DataGridEngine', { sliceId: `grid-${++Table._seq}` }); // Service\r\n}\r\nbeforeDestroy() {\r\n  slice.controller.destroyComponent(this._engine);   // Services never cascade — destroy by hand\r\n}\r",
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
