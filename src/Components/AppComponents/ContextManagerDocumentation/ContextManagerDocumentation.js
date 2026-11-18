export default class ContextManagerDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "context-manager.md";
    this.markdownContent = "---\ntitle: ContextManager\nroute: /Documentation/Structural/ContextManager\nnavLabel: ContextManager\nsection: State & Routing\ngroup: ''\norder: 50\ndescription: Shared state with watchers, selectors, and persistence.\ncomponent: ContextManagerDocumentation\ntags: [context, state, persistence]\n---\n\n# ContextManager\n\n## Overview\nContextManager provides shared state across components with watchers and optional persistence.\nIt uses EventManager internally to notify watchers and supports selectors for efficient updates.\n\nEnable it in `sliceConfig.json` to use `slice.context`.\n\n## Enable ContextManager\n```json title=\"sliceConfig.json\"\n{\n  \"context\": { \"enabled\": true }\n}\n```\n\n## Context UI (Optional)\nYou can enable the ContextManager debug panel with a keyboard shortcut.\n\n```json title=\"sliceConfig.json\"\n{\n  \"context\": {\n    \"enabled\": true,\n    \"ui\": {\n      \"enabled\": true,\n      \"shortcut\": \"alt+shift+c\"\n    }\n  }\n}\n```\n\nThe panel updates **in real time** — whenever any context changes via `setState()` or `patch()`,\nthe list refreshes immediately. It also detects newly created contexts (via `create()`) and\nsubscribes to them automatically. The refresh button is available for manual updates, but the\npanel is designed to stay in sync without it.\n\n## Core API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `create` | `(name, initialState = {}, options = {})` | `boolean` | Options include `persist`, `storageKey`. |\n| `getState` | `(name)` | `any | null` | Returns current state or `null` if missing. |\n| `setState` | `(name, updater)` | `void` | **Replaces** the whole state. Pass the full next state, or `(prev) => newState`. |\n| `patch` | `(name, partial)` | `void` | First-level **merge** — keeps the other fields (the \"update one field\" case). |\n| `watch` | `(name, component, callback, selector?)` | `string | null` | Auto-cleanup via component sliceId. |\n| `has` | `(name)` | `boolean` | Check if a context exists. |\n| `destroy` | `(name)` | `boolean` | Removes a context and persisted storage. |\n| `list` | `()` | `string[]` | Returns all context names. |\n| `use` | `(name)` | `handle` | Handle bound to one context: `get/set/patch/watch/bind/has/destroy` without repeating the name. |\n\n## Context Options\n| Option | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `persist` | `boolean` | `false` | Saves state to `localStorage`. |\n| `storageKey` | `string` | `slice_context_<name>` | Override persistence key. |\n\n## Create and Read\n```javascript title=\"Create a context\"\nslice.context.create('auth', {\n  isLoggedIn: false,\n  user: null\n});\n\nconst authState = slice.context.getState('auth');\nconsole.log(authState.isLoggedIn);\n```\n\n## Watchers\nWatchers are bound to components for auto-cleanup. Pass the component as the second argument.\n\n```javascript title=\"Watch with selector\"\nexport default class AccountMenu extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    slice.context.watch(\n      'auth',\n      this,\n      (isLoggedIn) => {\n        this.classList.toggle('signed-in', isLoggedIn);\n      },\n      (state) => state.isLoggedIn\n    );\n  }\n}\n```\n\n## Selectors and Derived Data\nSelectors run on every update and should be fast and side-effect free. ContextManager performs\na shallow comparison of the selected value to decide when to notify.\n\n```javascript title=\"Derived value selector\"\nslice.context.watch(\n  'cart',\n  this,\n  (count) => {\n    this.$badge.textContent = count;\n  },\n  (state) => state.items.length\n);\n```\n\n## Persistence\nPersist a context to `localStorage` for session survival.\n\n```javascript title=\"Persistent context\"\nslice.context.create(\n  'preferences',\n  { theme: 'light', locale: 'en' },\n  { persist: true, storageKey: 'app:preferences' }\n);\n```\n\n## Functional Updates\n`setState` **replaces** the whole state. Use the functional form when the next state depends on the previous one.\n\n```javascript title=\"Functional update\"\nslice.context.setState('cart', (prev) => ({\n  ...prev,\n  items: [...prev.items, newItem],\n  total: prev.total + newItem.price\n}));\n```\n\n## Patch (partial merge)\nBecause `setState` replaces, a partial object **drops the other fields**. Use `patch` to merge one or more fields and keep the rest — the common \"update one field\" case.\n\n```javascript title=\"patch vs setState\"\nslice.context.setState('cart', { discount: 0.1 }); // ❌ replaces → items/total are gone\nslice.context.patch('cart', { discount: 0.1 });    // ✅ merges → keeps the rest\n```\n\n**Rule:** if the context has more than one field, update it with `patch` (or a functional `setState`); a bare object replaces the whole state and drops the other fields.\n\n## Context Handles (`use`)\n`slice.context.use(name)` returns a handle bound to a single context, so you stop repeating the name. It exposes `get`, `set`, `patch`, `watch`, `bind`, `has`, and `destroy`.\n\n```javascript title=\"A bound handle\"\nconst settings = slice.context.use('settings');\nsettings.get();                          // current state\nsettings.patch({ selectedModel: 'pro' }); // merge\nsettings.watch(this, (s) => { this.$model.textContent = s.selectedModel; });\n```\n\n`bind` is `watch` **plus an immediate call** with the current value — the \"run now and on every change\" pattern in one line (no separate initial run):\n\n```javascript title=\"bind = watch + initial run\"\nasync init() {\n  slice.context.use('cart').bind(\n    this,\n    (count) => { this.$badge.textContent = count; },\n    (state) => state.items.length\n  );\n}\n```\n\n## Service Singleton Example\n```javascript title=\"Context access via singleton service\"\nconst contextService = await slice.build('ImposterGameContextService', {\n  sliceId: 'imposter-context-service'\n});\n\nexport default class GameScreen extends HTMLElement {\n  async init() {\n    this.contextService = slice.getComponent('imposter-context-service');\n    const config = this.contextService.getGameConfig();\n    this.contextService.updateGameConfig({ step: 'reveal' });\n  }\n}\n```\n\n## Guidelines\n\n| Practice | Why |\n| --- | --- |\n| Keep contexts small and focused by domain | A context is a shared contract; a giant one becomes an untyped global. |\n| Use selectors for watchers | The selector decides when the callback runs; without one, every `setState` notifies. |\n| Store serializable state only | Persistence and debugging assume plain data; class instances and functions break both. |\n| Use a Service for shared read/write logic | Components keep their rendering; the Service owns the domain rules. |\n\n:::details title=\"Limits and gotchas\"\n- `watch()` requires a component with a `sliceId`; without one it returns `null`.\n- Persist only small, serializable state. `localStorage` is synchronous and shared across tabs.\n- `setState` replaces; `patch` merges one level. Nesting a partial object inside `setState` still\n  replaces the rest.\n:::\n\n:::related\n- [Context vs Events](/Documentation/Structural/Context-vs-Events) - State vs signal.\n- [Events](/Documentation/Structural/EventManager) - The pub/sub layer underneath.\n- [Refreshing Component Data](/Documentation/Architecture/Refreshing-Component-Data) - When a watcher should refresh.\n- [Service Patterns](/Documentation/Architecture/Service-Patterns) - Where shared domain logic lives.\n:::\n";
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
               value: "{\n  \"context\": { \"enabled\": true }\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"context\": {\n    \"enabled\": true,\n    \"ui\": {\n      \"enabled\": true,\n      \"shortcut\": \"alt+shift+c\"\n    }\n  }\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Returns","Notes"],
               rows: [[{"html":"<code>create</code>"},{"html":"<code>(name, initialState = {}, options = {})</code>"},{"html":"<code>boolean</code>"},{"html":"Options include <code>persist</code>, <code>storageKey</code>."}],[{"html":"<code>getState</code>"},{"html":"<code>(name)</code>"},{"html":"`any"},{"html":"null`"},{"html":"Returns current state or <code>null</code> if missing."}],[{"html":"<code>setState</code>"},{"html":"<code>(name, updater)</code>"},{"html":"<code>void</code>"},{"html":"<strong>Replaces</strong> the whole state. Pass the full next state, or <code>(prev) =&gt; newState</code>."}],[{"html":"<code>patch</code>"},{"html":"<code>(name, partial)</code>"},{"html":"<code>void</code>"},{"html":"First-level <strong>merge</strong> — keeps the other fields (the \"update one field\" case)."}],[{"html":"<code>watch</code>"},{"html":"<code>(name, component, callback, selector?)</code>"},{"html":"`string"},{"html":"null`"},{"html":"Auto-cleanup via component sliceId."}],[{"html":"<code>has</code>"},{"html":"<code>(name)</code>"},{"html":"<code>boolean</code>"},{"html":"Check if a context exists."}],[{"html":"<code>destroy</code>"},{"html":"<code>(name)</code>"},{"html":"<code>boolean</code>"},{"html":"Removes a context and persisted storage."}],[{"html":"<code>list</code>"},{"html":"<code>()</code>"},{"html":"<code>string[]</code>"},{"html":"Returns all context names."}],[{"html":"<code>use</code>"},{"html":"<code>(name)</code>"},{"html":"<code>handle</code>"},{"html":"Handle bound to one context: <code>get/set/patch/watch/bind/has/destroy</code> without repeating the name."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Option","Type","Default","Notes"],
               rows: [[{"html":"<code>persist</code>"},{"html":"<code>boolean</code>"},{"html":"<code>false</code>"},{"html":"Saves state to <code>localStorage</code>."}],[{"html":"<code>storageKey</code>"},{"html":"<code>string</code>"},{"html":"<code>slice_context_&lt;name&gt;</code>"},{"html":"Override persistence key."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.context.create('auth', {\n  isLoggedIn: false,\n  user: null\n});\n\nconst authState = slice.context.getState('auth');\nconsole.log(authState.isLoggedIn);",
               language: "javascript"
            });
            if ("Create a context") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Create a context";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class AccountMenu extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    slice.context.watch(\n      'auth',\n      this,\n      (isLoggedIn) => {\n        this.classList.toggle('signed-in', isLoggedIn);\n      },\n      (state) => state.isLoggedIn\n    );\n  }\n}",
               language: "javascript"
            });
            if ("Watch with selector") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Watch with selector";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.context.watch(\n  'cart',\n  this,\n  (count) => {\n    this.$badge.textContent = count;\n  },\n  (state) => state.items.length\n);",
               language: "javascript"
            });
            if ("Derived value selector") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Derived value selector";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.context.create(\n  'preferences',\n  { theme: 'light', locale: 'en' },\n  { persist: true, storageKey: 'app:preferences' }\n);",
               language: "javascript"
            });
            if ("Persistent context") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Persistent context";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.context.setState('cart', (prev) => ({\n  ...prev,\n  items: [...prev.items, newItem],\n  total: prev.total + newItem.price\n}));",
               language: "javascript"
            });
            if ("Functional update") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Functional update";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.context.setState('cart', { discount: 0.1 }); // ❌ replaces → items/total are gone\nslice.context.patch('cart', { discount: 0.1 });    // ✅ merges → keeps the rest",
               language: "javascript"
            });
            if ("patch vs setState") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "patch vs setState";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const settings = slice.context.use('settings');\nsettings.get();                          // current state\nsettings.patch({ selectedModel: 'pro' }); // merge\nsettings.watch(this, (s) => { this.$model.textContent = s.selectedModel; });",
               language: "javascript"
            });
            if ("A bound handle") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "A bound handle";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "async init() {\n  slice.context.use('cart').bind(\n    this,\n    (count) => { this.$badge.textContent = count; },\n    (state) => state.items.length\n  );\n}",
               language: "javascript"
            });
            if ("bind = watch + initial run") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "bind = watch + initial run";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-14"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const contextService = await slice.build('ImposterGameContextService', {\n  sliceId: 'imposter-context-service'\n});\n\nexport default class GameScreen extends HTMLElement {\n  async init() {\n    this.contextService = slice.getComponent('imposter-context-service');\n    const config = this.contextService.getGameConfig();\n    this.contextService.updateGameConfig({ step: 'reveal' });\n  }\n}",
               language: "javascript"
            });
            if ("Context access via singleton service") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Context access via singleton service";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-15"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Practice","Why"],
               rows: [[{"html":"Keep contexts small and focused by domain"},{"html":"A context is a shared contract; a giant one becomes an untyped global."}],[{"html":"Use selectors for watchers"},{"html":"The selector decides when the callback runs; without one, every <code>setState</code> notifies."}],[{"html":"Store serializable state only"},{"html":"Persistence and debugging assume plain data; class instances and functions break both."}],[{"html":"Use a Service for shared read/write logic"},{"html":"Components keep their rendering; the Service owns the domain rules."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-16"]');
         if (container) {
            const details = await slice.build('Details', { title: "Limits and gotchas" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<ul><li><code>watch()</code> requires a component with a <code>sliceId</code>; without one it returns <code>null</code>.</li><li>Persist only small, serializable state. <code>localStorage</code> is synchronous and shared across tabs.</li><li><code>setState</code> replaces; <code>patch</code> merges one level. Nesting a partial object inside <code>setState</code> still</li></ul><p>replaces the rest.</p>";
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
            const items = [{"title":"Context vs Events","path":"/Documentation/Structural/Context-vs-Events","text":"State vs signal."},{"title":"Events","path":"/Documentation/Structural/EventManager","text":"The pub/sub layer underneath."},{"title":"Refreshing Component Data","path":"/Documentation/Architecture/Refreshing-Component-Data","text":"When a watcher should refresh."},{"title":"Service Patterns","path":"/Documentation/Architecture/Service-Patterns","text":"Where shared domain logic lives."}];
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

customElements.define('slice-contextmanagerdocumentation', ContextManagerDocumentation);
