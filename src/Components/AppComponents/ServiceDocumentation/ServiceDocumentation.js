export default class ServiceDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/services.md";
    this.markdownContent = "---\ntitle: Services\nroute: /Documentation/Service\nnavLabel: Services\nsection: Getting Started\ngroup: Components\norder: 34\ndescription: Service components for shared logic and data.\ncomponent: ServiceDocumentation\ntags: [services, fetch, state]\n---\n\n# Services\n\n## Overview\nServices centralize logic and data access. They can cache results, encapsulate API calls,\nand integrate with EventManager or ContextManager.\n\nServices are created with `slice.build()` like other components, but they do not render UI.\n\n## Built-in Services\n| Service | Purpose | Notes |\n| --- | --- | --- |\n| `FetchManager` | HTTP requests with loading, timeout, and optional caching | Uses `Loading` component automatically. |\n| `IndexedDbManager` | IndexedDB CRUD helpers | Creates store with `keyPath: 'id'`. |\n| `LocalStorageManager` | LocalStorage JSON wrapper | Returns parsed JSON or null. |\n| `Link` | SPA navigation anchor | Calls `slice.router.navigate`. |\n\n## Using a Service\n```javascript title=\"Access via slice shortcut\"\nconst dataService = await slice.build('FetchManager', {\n  baseUrl: 'https://api.myapp.com/v1',\n  sliceId: 'data-service'\n});\n\nexport default class ProductList extends HTMLElement {\n  async init() {\n    this.dataService = slice.getComponent('data-service');\n    await this.loadProducts();\n  }\n}\n```\n\n## Service Singleton Pattern (sliceId)\nUse a stable `sliceId` to create a shared service instance and retrieve it from any component.\n\n```javascript title=\"Singleton service setup\"\nconst audioService = await slice.build('AudioService', {\n  sliceId: 'imposter-audio-service'\n});\n\nexport default class GameScreen extends HTMLElement {\n  async init() {\n    this.audioService = slice.getComponent('imposter-audio-service');\n  }\n}\n```\n\n:::tip\nUse `sliceId` when you need a single instance across routes or screens.\n:::\n\n:::warning\nDo not store service instances or functions in `slice.context`. Persist only serializable state.\n:::\n\n## FetchManager API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `request` | `(method, data, endpoint, onSuccess, onError, refetchOnError=false, requestOptions={})` | `Promise<any>` | Returns JSON response. Caches last response if enabled. |\n| `enableCache` | `()` | `void` | Enables in-memory cache. |\n| `disableCache` | `()` | `void` | Disables cache. |\n| `setDefaultHeaders` | `(headers)` | `void` | Merges default headers into requests. |\n\n## IndexedDbManager API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `openDatabase` | `()` | `Promise<IDBDatabase>` | Opens or creates database. |\n| `closeDatabase` | `()` | `void` | Closes the connection. |\n| `addItem` | `(item)` | `Promise<number>` | Returns new key. |\n| `updateItem` | `(item)` | `Promise<number>` | Returns key. |\n| `getItem` | `(id)` | `Promise<any>` | Gets item by id. |\n| `deleteItem` | `(id)` | `Promise<void>` | Deletes item by id. |\n| `getAllItems` | `()` | `Promise<any[]>` | Returns all items. |\n| `clearItems` | `()` | `Promise<void>` | Clears store. |\n\n## LocalStorageManager API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `getItem` | `(key)` | `any | null` | Returns parsed JSON or null. |\n| `setItem` | `(key, value)` | `boolean` | Returns success boolean. |\n| `removeItem` | `(key)` | `boolean` | Returns success boolean. |\n| `clear` | `()` | `boolean` | Clears localStorage. |\n\n## Link API\n| Prop | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `path` | `string` | `'#'` | Route path to navigate. |\n| `classes` | `string` | `''` | CSS classes for the anchor. |\n| `text` | `string` | `''` | Anchor text. |\n\n```javascript title=\"Link usage\"\nconst link = await slice.build('Link', {\n  path: '/account',\n  classes: 'nav-link',\n  text: 'Account'\n});\n\nnav.appendChild(link);\n```\n\n## Best Practices\n:::tip\nUse `sliceId` when you need global access to a service instance.\n:::\n\n:::tip\nPair services with EventManager for notifications or ContextManager for shared state.\n:::\n\n## Gotchas\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Service | Purpose | Notes |","| --- | --- | --- |","| `FetchManager` | HTTP requests with loading, timeout, and optional caching | Uses `Loading` component automatically. |","| `IndexedDbManager` | IndexedDB CRUD helpers | Creates store with `keyPath: 'id'`. |","| `LocalStorageManager` | LocalStorage JSON wrapper | Returns parsed JSON or null. |","| `Link` | SPA navigation anchor | Calls `slice.router.navigate`. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const lines = ["| Method | Signature | Returns | Notes |","| --- | --- | --- | --- |","| `request` | `(method, data, endpoint, onSuccess, onError, refetchOnError=false, requestOptions={})` | `Promise<any>` | Returns JSON response. Caches last response if enabled. |","| `enableCache` | `()` | `void` | Enables in-memory cache. |","| `disableCache` | `()` | `void` | Disables cache. |","| `setDefaultHeaders` | `(headers)` | `void` | Merges default headers into requests. |"];
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
            const lines = ["| Method | Signature | Returns | Notes |","| --- | --- | --- | --- |","| `openDatabase` | `()` | `Promise<IDBDatabase>` | Opens or creates database. |","| `closeDatabase` | `()` | `void` | Closes the connection. |","| `addItem` | `(item)` | `Promise<number>` | Returns new key. |","| `updateItem` | `(item)` | `Promise<number>` | Returns key. |","| `getItem` | `(id)` | `Promise<any>` | Gets item by id. |","| `deleteItem` | `(id)` | `Promise<void>` | Deletes item by id. |","| `getAllItems` | `()` | `Promise<any[]>` | Returns all items. |","| `clearItems` | `()` | `Promise<void>` | Clears store. |"];
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
            const lines = ["| Method | Signature | Returns | Notes |","| --- | --- | --- | --- |","| `getItem` | `(key)` | `any | null` | Returns parsed JSON or null. |","| `setItem` | `(key, value)` | `boolean` | Returns success boolean. |","| `removeItem` | `(key)` | `boolean` | Returns success boolean. |","| `clear` | `()` | `boolean` | Clears localStorage. |"];
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
            const lines = ["| Prop | Type | Default | Notes |","| --- | --- | --- | --- |","| `path` | `string` | `'#'` | Route path to navigate. |","| `classes` | `string` | `''` | CSS classes for the anchor. |","| `text` | `string` | `''` | Anchor text. |"];
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
