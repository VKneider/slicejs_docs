export default class ServiceDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/services.md";
    this.markdownContent = "---\ntitle: Services\nroute: /Documentation/Service\nnavLabel: Services\nsection: Components\ngroup: Component Model\norder: 50\ndescription: Service components for shared logic and data.\ncomponent: ServiceDocumentation\ntags: [services, fetch, state]\n---\n\n# Services\n\n## Overview\nServices centralize logic and data access. They can cache results, encapsulate API calls,\nand integrate with EventManager or ContextManager.\n\nServices are created with `slice.build()` like other components, but they do not render UI.\n\n## Built-in Services\n| Service | Purpose | Notes |\n| --- | --- | --- |\n| `FetchManager` | HTTP requests with loading, timeout, and optional caching | Uses `Loading` component automatically. |\n| `IndexedDbManager` | IndexedDB CRUD helpers | Creates store with `keyPath: 'id'`. |\n| `LocalStorageManager` | LocalStorage JSON wrapper | Returns parsed JSON or null. |\n| `Link` | SPA navigation anchor | Calls `slice.router.navigate`. |\n\n## Using a Service\n```javascript title=\"Access via slice shortcut\"\nconst dataService = await slice.build('FetchManager', {\n  baseUrl: 'https://api.myapp.com/v1',\n  sliceId: 'data-service'\n});\n\nexport default class ProductList extends HTMLElement {\n  async init() {\n    this.dataService = slice.getComponent('data-service');\n    await this.loadProducts();\n  }\n}\n```\n\n## Service Singleton Pattern (sliceId)\nUse a stable `sliceId` to create a shared service instance and retrieve it from any component.\n\n```javascript title=\"Singleton service setup\"\nconst audioService = await slice.build('AudioService', {\n  sliceId: 'imposter-audio-service'\n});\n\nexport default class GameScreen extends HTMLElement {\n  async init() {\n    this.audioService = slice.getComponent('imposter-audio-service');\n  }\n}\n```\n\n:::tip\nUse `sliceId` when you need a single instance across routes or screens.\n:::\n\n:::warning\nDo not store service instances or functions in `slice.context`. Persist only serializable state.\n:::\n\n## Where services live and how to share them\nMost services are **app-lifetime singletons**. Where to build them, how to share one instance, the\n`singleton: true` get-or-create shortcut, Provider Services for global UI, and the cleanup contract\nall live in one canonical place:\n\n➡️ **[Service Patterns](/Documentation/Architecture/Service-Patterns)**\n\nIn short: build app-wide singletons **once** (a composition-root Service) and recover them with\n`slice.getComponent(name)`; reach for `slice.build('X', { singleton: true })` (Service only) when a\nservice can be built from more than one entry point.\n\n## FetchManager API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `request` | `(method, data, endpoint, onSuccess, onError, refetchOnError=false, requestOptions={})` | `Promise<any>` | Returns JSON response. Caches last response if enabled. |\n| `enableCache` | `()` | `void` | Enables in-memory cache. |\n| `disableCache` | `()` | `void` | Disables cache. |\n| `setDefaultHeaders` | `(headers)` | `void` | Merges default headers into requests. |\n\n## IndexedDbManager API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `openDatabase` | `()` | `Promise<IDBDatabase>` | Opens or creates database. |\n| `closeDatabase` | `()` | `void` | Closes the connection. |\n| `addItem` | `(item)` | `Promise<number>` | Returns new key. |\n| `updateItem` | `(item)` | `Promise<number>` | Returns key. |\n| `getItem` | `(id)` | `Promise<any>` | Gets item by id. |\n| `deleteItem` | `(id)` | `Promise<void>` | Deletes item by id. |\n| `getAllItems` | `()` | `Promise<any[]>` | Returns all items. |\n| `clearItems` | `()` | `Promise<void>` | Clears store. |\n\n## LocalStorageManager API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `getItem` | `(key)` | parsed value or `null` | Returns parsed JSON or null. |\n| `setItem` | `(key, value)` | `boolean` | Returns success boolean. |\n| `removeItem` | `(key)` | `boolean` | Returns success boolean. |\n| `clear` | `()` | `boolean` | Clears localStorage. |\n\n## Link API\n| Prop | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `path` | `string` | `'#'` | Route path to navigate. |\n| `classes` | `string` | `''` | CSS classes for the anchor. |\n| `text` | `string` | `''` | Anchor text. |\n\n```javascript title=\"Link usage\"\nconst link = await slice.build('Link', {\n  path: '/account',\n  classes: 'nav-link',\n  text: 'Account'\n});\n\nnav.appendChild(link);\n```\n\n## Best Practices\nUse `sliceId` when you need global access to a service instance.\n\nPair services with EventManager for notifications or ContextManager for shared state.\n\n## Gotchas\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"Components"},{"text":"Component Model"}]
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
               headers: ["Service","Purpose","Notes"],
               rows: [[{"html":"<code>FetchManager</code>"},{"html":"HTTP requests with loading, timeout, and optional caching"},{"html":"Uses <code>Loading</code> component automatically."}],[{"html":"<code>IndexedDbManager</code>"},{"html":"IndexedDB CRUD helpers"},{"html":"Creates store with <code>keyPath: 'id'</code>."}],[{"html":"<code>LocalStorageManager</code>"},{"html":"LocalStorage JSON wrapper"},{"html":"Returns parsed JSON or null."}],[{"html":"<code>Link</code>"},{"html":"SPA navigation anchor"},{"html":"Calls <code>slice.router.navigate</code>."}]]
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
               value: "const dataService = await slice.build('FetchManager', {\n  baseUrl: 'https://api.myapp.com/v1',\n  sliceId: 'data-service'\n});\n\nexport default class ProductList extends HTMLElement {\n  async init() {\n    this.dataService = slice.getComponent('data-service');\n    await this.loadProducts();\n  }\n}",
               language: "javascript"
            });
            if ("Access via slice shortcut") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Access via slice shortcut";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const audioService = await slice.build('AudioService', {\n  sliceId: 'imposter-audio-service'\n});\n\nexport default class GameScreen extends HTMLElement {\n  async init() {\n    this.audioService = slice.getComponent('imposter-audio-service');\n  }\n}",
               language: "javascript"
            });
            if ("Singleton service setup") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Singleton service setup";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Use <code>sliceId</code> when you need a single instance across routes or screens.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Do not store service instances or functions in <code>slice.context</code>. Persist only serializable state.</p>";
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
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Returns","Notes"],
               rows: [[{"html":"<code>request</code>"},{"html":"<code>(method, data, endpoint, onSuccess, onError, refetchOnError=false, requestOptions={})</code>"},{"html":"<code>Promise&lt;any&gt;</code>"},{"html":"Returns JSON response. Caches last response if enabled."}],[{"html":"<code>enableCache</code>"},{"html":"<code>()</code>"},{"html":"<code>void</code>"},{"html":"Enables in-memory cache."}],[{"html":"<code>disableCache</code>"},{"html":"<code>()</code>"},{"html":"<code>void</code>"},{"html":"Disables cache."}],[{"html":"<code>setDefaultHeaders</code>"},{"html":"<code>(headers)</code>"},{"html":"<code>void</code>"},{"html":"Merges default headers into requests."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Method","Signature","Returns","Notes"],
               rows: [[{"html":"<code>openDatabase</code>"},{"html":"<code>()</code>"},{"html":"<code>Promise&lt;IDBDatabase&gt;</code>"},{"html":"Opens or creates database."}],[{"html":"<code>closeDatabase</code>"},{"html":"<code>()</code>"},{"html":"<code>void</code>"},{"html":"Closes the connection."}],[{"html":"<code>addItem</code>"},{"html":"<code>(item)</code>"},{"html":"<code>Promise&lt;number&gt;</code>"},{"html":"Returns new key."}],[{"html":"<code>updateItem</code>"},{"html":"<code>(item)</code>"},{"html":"<code>Promise&lt;number&gt;</code>"},{"html":"Returns key."}],[{"html":"<code>getItem</code>"},{"html":"<code>(id)</code>"},{"html":"<code>Promise&lt;any&gt;</code>"},{"html":"Gets item by id."}],[{"html":"<code>deleteItem</code>"},{"html":"<code>(id)</code>"},{"html":"<code>Promise&lt;void&gt;</code>"},{"html":"Deletes item by id."}],[{"html":"<code>getAllItems</code>"},{"html":"<code>()</code>"},{"html":"<code>Promise&lt;any[]&gt;</code>"},{"html":"Returns all items."}],[{"html":"<code>clearItems</code>"},{"html":"<code>()</code>"},{"html":"<code>Promise&lt;void&gt;</code>"},{"html":"Clears store."}]]
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
               headers: ["Method","Signature","Returns","Notes"],
               rows: [[{"html":"<code>getItem</code>"},{"html":"<code>(key)</code>"},{"html":"parsed value or <code>null</code>"},{"html":"Returns parsed JSON or null."}],[{"html":"<code>setItem</code>"},{"html":"<code>(key, value)</code>"},{"html":"<code>boolean</code>"},{"html":"Returns success boolean."}],[{"html":"<code>removeItem</code>"},{"html":"<code>(key)</code>"},{"html":"<code>boolean</code>"},{"html":"Returns success boolean."}],[{"html":"<code>clear</code>"},{"html":"<code>()</code>"},{"html":"<code>boolean</code>"},{"html":"Clears localStorage."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Prop","Type","Default","Notes"],
               rows: [[{"html":"<code>path</code>"},{"html":"<code>string</code>"},{"html":"<code>'#'</code>"},{"html":"Route path to navigate."}],[{"html":"<code>classes</code>"},{"html":"<code>string</code>"},{"html":"<code>''</code>"},{"html":"CSS classes for the anchor."}],[{"html":"<code>text</code>"},{"html":"<code>string</code>"},{"html":"<code>''</code>"},{"html":"Anchor text."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const link = await slice.build('Link', {\n  path: '/account',\n  classes: 'nav-link',\n  text: 'Account'\n});\n\nnav.appendChild(link);",
               language: "javascript"
            });
            if ("Link usage") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Link usage";
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

customElements.define('slice-servicedocumentation', ServiceDocumentation);
