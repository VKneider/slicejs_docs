export default class ServiceDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/services.md";
    this.markdownContent = "---\r\ntitle: Services\r\nroute: /Documentation/Service\r\nnavLabel: Services\r\nsection: Getting Started\r\ngroup: Components\r\norder: 34\r\ndescription: Service components for shared logic and data.\r\ncomponent: ServiceDocumentation\r\ntags: [services, fetch, state]\r\n---\r\n\r\n# Services\r\n\r\n## Overview\r\nServices centralize logic and data access. They can cache results, encapsulate API calls,\r\nand integrate with EventManager or ContextManager.\r\n\r\nServices are created with `slice.build()` like other components, but they do not render UI.\r\n\r\n## Built-in Services\r\n| Service | Purpose | Notes |\r\n| --- | --- | --- |\r\n| `FetchManager` | HTTP requests with loading, timeout, and optional caching | Uses `Loading` component automatically. |\r\n| `IndexedDbManager` | IndexedDB CRUD helpers | Creates store with `keyPath: 'id'`. |\r\n| `LocalStorageManager` | LocalStorage JSON wrapper | Returns parsed JSON or null. |\r\n| `Link` | SPA navigation anchor | Calls `slice.router.navigate`. |\r\n\r\n## Using a Service\r\n```javascript title=\"Access via slice shortcut\"\r\nconst dataService = await slice.build('FetchManager', {\r\n  baseUrl: 'https://api.myapp.com/v1',\r\n  sliceId: 'data-service'\r\n});\r\n\r\nexport default class ProductList extends HTMLElement {\r\n  async init() {\r\n    this.dataService = slice.getComponent('data-service');\r\n    await this.loadProducts();\r\n  }\r\n}\r\n```\r\n\r\n## Service Singleton Pattern (sliceId)\r\nUse a stable `sliceId` to create a shared service instance and retrieve it from any component.\r\n\r\n```javascript title=\"Singleton service setup\"\r\nconst audioService = await slice.build('AudioService', {\r\n  sliceId: 'imposter-audio-service'\r\n});\r\n\r\nexport default class GameScreen extends HTMLElement {\r\n  async init() {\r\n    this.audioService = slice.getComponent('imposter-audio-service');\r\n  }\r\n}\r\n```\r\n\r\n:::tip\r\nUse `sliceId` when you need a single instance across routes or screens.\r\n:::\r\n\r\n:::warning\r\nDo not store service instances or functions in `slice.context`. Persist only serializable state.\r\n:::\r\n\r\n## FetchManager API\r\n| Method | Signature | Returns | Notes |\r\n| --- | --- | --- | --- |\r\n| `request` | `(method, data, endpoint, onSuccess, onError, refetchOnError=false, requestOptions={})` | `Promise<any>` | Returns JSON response. Caches last response if enabled. |\r\n| `enableCache` | `()` | `void` | Enables in-memory cache. |\r\n| `disableCache` | `()` | `void` | Disables cache. |\r\n| `setDefaultHeaders` | `(headers)` | `void` | Merges default headers into requests. |\r\n\r\n## IndexedDbManager API\r\n| Method | Signature | Returns | Notes |\r\n| --- | --- | --- | --- |\r\n| `openDatabase` | `()` | `Promise<IDBDatabase>` | Opens or creates database. |\r\n| `closeDatabase` | `()` | `void` | Closes the connection. |\r\n| `addItem` | `(item)` | `Promise<number>` | Returns new key. |\r\n| `updateItem` | `(item)` | `Promise<number>` | Returns key. |\r\n| `getItem` | `(id)` | `Promise<any>` | Gets item by id. |\r\n| `deleteItem` | `(id)` | `Promise<void>` | Deletes item by id. |\r\n| `getAllItems` | `()` | `Promise<any[]>` | Returns all items. |\r\n| `clearItems` | `()` | `Promise<void>` | Clears store. |\r\n\r\n## LocalStorageManager API\r\n| Method | Signature | Returns | Notes |\r\n| --- | --- | --- | --- |\r\n| `getItem` | `(key)` | `any | null` | Returns parsed JSON or null. |\r\n| `setItem` | `(key, value)` | `boolean` | Returns success boolean. |\r\n| `removeItem` | `(key)` | `boolean` | Returns success boolean. |\r\n| `clear` | `()` | `boolean` | Clears localStorage. |\r\n\r\n## Link API\r\n| Prop | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `path` | `string` | `'#'` | Route path to navigate. |\r\n| `classes` | `string` | `''` | CSS classes for the anchor. |\r\n| `text` | `string` | `''` | Anchor text. |\r\n\r\n```javascript title=\"Link usage\"\r\nconst link = await slice.build('Link', {\r\n  path: '/account',\r\n  classes: 'nav-link',\r\n  text: 'Account'\r\n});\r\n\r\nnav.appendChild(link);\r\n```\r\n\r\n## Best Practices\r\n:::tip\r\nUse `sliceId` when you need global access to a service instance.\r\n:::\r\n\r\n:::tip\r\nPair services with EventManager for notifications or ContextManager for shared state.\r\n:::\r\n\r\n## Gotchas\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Service | Purpose | Notes |\r","| --- | --- | --- |\r","| `FetchManager` | HTTP requests with loading, timeout, and optional caching | Uses `Loading` component automatically. |\r","| `IndexedDbManager` | IndexedDB CRUD helpers | Creates store with `keyPath: 'id'`. |\r","| `LocalStorageManager` | LocalStorage JSON wrapper | Returns parsed JSON or null. |\r","| `Link` | SPA navigation anchor | Calls `slice.router.navigate`. |\r"];
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
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => formatCell(cell)));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const dataService = await slice.build('FetchManager', {\r\n  baseUrl: 'https://api.myapp.com/v1',\r\n  sliceId: 'data-service'\r\n});\r\n\r\nexport default class ProductList extends HTMLElement {\r\n  async init() {\r\n    this.dataService = slice.getComponent('data-service');\r\n    await this.loadProducts();\r\n  }\r\n}\r",
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const audioService = await slice.build('AudioService', {\r\n  sliceId: 'imposter-audio-service'\r\n});\r\n\r\nexport default class GameScreen extends HTMLElement {\r\n  async init() {\r\n    this.audioService = slice.getComponent('imposter-audio-service');\r\n  }\r\n}\r",
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const lines = ["| Method | Signature | Returns | Notes |\r","| --- | --- | --- | --- |\r","| `request` | `(method, data, endpoint, onSuccess, onError, refetchOnError=false, requestOptions={})` | `Promise<any>` | Returns JSON response. Caches last response if enabled. |\r","| `enableCache` | `()` | `void` | Enables in-memory cache. |\r","| `disableCache` | `()` | `void` | Disables cache. |\r","| `setDefaultHeaders` | `(headers)` | `void` | Merges default headers into requests. |\r"];
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
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => formatCell(cell)));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const lines = ["| Method | Signature | Returns | Notes |\r","| --- | --- | --- | --- |\r","| `openDatabase` | `()` | `Promise<IDBDatabase>` | Opens or creates database. |\r","| `closeDatabase` | `()` | `void` | Closes the connection. |\r","| `addItem` | `(item)` | `Promise<number>` | Returns new key. |\r","| `updateItem` | `(item)` | `Promise<number>` | Returns key. |\r","| `getItem` | `(id)` | `Promise<any>` | Gets item by id. |\r","| `deleteItem` | `(id)` | `Promise<void>` | Deletes item by id. |\r","| `getAllItems` | `()` | `Promise<any[]>` | Returns all items. |\r","| `clearItems` | `()` | `Promise<void>` | Clears store. |\r"];
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
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => formatCell(cell)));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const lines = ["| Method | Signature | Returns | Notes |\r","| --- | --- | --- | --- |\r","| `getItem` | `(key)` | `any | null` | Returns parsed JSON or null. |\r","| `setItem` | `(key, value)` | `boolean` | Returns success boolean. |\r","| `removeItem` | `(key)` | `boolean` | Returns success boolean. |\r","| `clear` | `()` | `boolean` | Clears localStorage. |\r"];
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
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => formatCell(cell)));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const lines = ["| Prop | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `path` | `string` | `'#'` | Route path to navigate. |\r","| `classes` | `string` | `''` | CSS classes for the anchor. |\r","| `text` | `string` | `''` | Anchor text. |\r"];
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
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => formatCell(cell)));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const link = await slice.build('Link', {\r\n  path: '/account',\r\n  classes: 'nav-link',\r\n  text: 'Account'\r\n});\r\n\r\nnav.appendChild(link);\r",
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

customElements.define('slice-servicedocumentation', ServiceDocumentation);
