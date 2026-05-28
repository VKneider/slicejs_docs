export default class StructuralDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/structural-components.md";
    this.markdownContent = "---\r\ntitle: Structural\r\nroute: /Documentation/Structural\r\nnavLabel: Structural\r\nsection: Getting Started\r\ngroup: Components\r\norder: 33\r\ndescription: Structural components that power Slice.js.\r\ncomponent: StructuralDocumentation\r\ntags: [structural, controller, router, styles]\r\n---\r\n\r\n# Structural Components\r\n\r\n## Overview\r\nStructural components power the framework runtime. They are created by Slice.js and exposed\r\nunder `slice.*`. You do not build them directly.\r\n\r\n## Key Components\r\n- `slice.controller` for component lifecycle and lookup\r\n- `slice.router` for navigation and route rendering\r\n- `slice.stylesManager` for styles and themes\r\n- `slice.events` for pub/sub (optional)\r\n- `slice.context` for shared state (optional)\r\n\r\n## Controller API\r\n| Method | Signature | Returns | Notes |\r\n| --- | --- | --- | --- |\r\n| `getComponent` | `(sliceId)` | `HTMLElement | undefined` | Lookup by sliceId. |\r\n| `destroyByContainer` | `(container)` | `number` | Destroys Slice components inside container. |\r\n| `destroyByPattern` | `(pattern)` | `number` | Destroys components whose sliceId matches pattern. |\r\n\r\n```javascript title=\"Destroy components safely\"\r\nconst container = this.querySelector('.items');\r\nslice.controller.destroyByContainer(container);\r\ncontainer.innerHTML = '';\r\n```\r\n\r\n## Router API\r\n| Method | Signature | Notes |\r\n| --- | --- | --- |\r\n| `navigate` | `(path, _redirectChain?, _options?)` | Programmatic navigation. |\r\n| `beforeEach` | `(to, from, next)` | Register a guard before navigation. |\r\n| `afterEach` | `(to, from)` | Run logic after navigation. |\r\n| `start` | `()` | Start routing immediately. |\r\n\r\n## Styles and Themes\r\n`slice.setTheme(themeName)` applies a theme through the StylesManager.\r\n\r\n```javascript title=\"Switch themes\"\r\nawait slice.setTheme('DARK');\r\n```\r\n\r\n## EventManager (Optional)\r\nProvides pub/sub via `slice.events`. When disabled, the API is a no-op.\r\n\r\n| Method | Signature | Notes |\r\n| --- | --- | --- |\r\n| `subscribe` | `(eventName, callback, options?)` | Returns subscription id. |\r\n| `subscribeOnce` | `(eventName, callback, options?)` | Auto-unsubscribe after first emit. |\r\n| `unsubscribe` | `(eventName, id)` | Returns boolean. |\r\n| `emit` | `(eventName, data?)` | Emits to all subscribers. |\r\n| `bind` | `(component)` | Returns component-bound API. |\r\n\r\n## ContextManager (Optional)\r\nShared state system available at `slice.context`.\r\n\r\n| Method | Signature | Notes |\r\n| --- | --- | --- |\r\n| `create` | `(name, initialState, options?)` | Options include `persist`. |\r\n| `getState` | `(name)` | Returns current state or null. |\r\n| `setState` | `(name, updater)` | Accepts object or updater function. |\r\n| `watch` | `(name, component, callback, selector?)` | Auto-cleanup via component. |\r\n| `destroy` | `(name)` | Removes a context. |\r\n| `list` | `()` | Returns context names. |\r\n\r\n## Best Practices\r\n:::tip\r\nUse `destroyByContainer` before recreating dynamic lists to avoid leaks.\r\n:::\r\n\r\n:::tip\r\nRegister guards before calling `slice.router.start()`.\r\n:::\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Signature | Returns | Notes |\r","| --- | --- | --- | --- |\r","| `getComponent` | `(sliceId)` | `HTMLElement | undefined` | Lookup by sliceId. |\r","| `destroyByContainer` | `(container)` | `number` | Destroys Slice components inside container. |\r","| `destroyByPattern` | `(pattern)` | `number` | Destroys components whose sliceId matches pattern. |\r"];
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
               value: "const container = this.querySelector('.items');\r\nslice.controller.destroyByContainer(container);\r\ncontainer.innerHTML = '';\r",
               language: "javascript"
            });
            if ("Destroy components safely") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Destroy components safely";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const lines = ["| Method | Signature | Notes |\r","| --- | --- | --- |\r","| `navigate` | `(path, _redirectChain?, _options?)` | Programmatic navigation. |\r","| `beforeEach` | `(to, from, next)` | Register a guard before navigation. |\r","| `afterEach` | `(to, from)` | Run logic after navigation. |\r","| `start` | `()` | Start routing immediately. |\r"];
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "await slice.setTheme('DARK');\r",
               language: "javascript"
            });
            if ("Switch themes") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Switch themes";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const lines = ["| Method | Signature | Notes |\r","| --- | --- | --- |\r","| `subscribe` | `(eventName, callback, options?)` | Returns subscription id. |\r","| `subscribeOnce` | `(eventName, callback, options?)` | Auto-unsubscribe after first emit. |\r","| `unsubscribe` | `(eventName, id)` | Returns boolean. |\r","| `emit` | `(eventName, data?)` | Emits to all subscribers. |\r","| `bind` | `(component)` | Returns component-bound API. |\r"];
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
            const lines = ["| Method | Signature | Notes |\r","| --- | --- | --- |\r","| `create` | `(name, initialState, options?)` | Options include `persist`. |\r","| `getState` | `(name)` | Returns current state or null. |\r","| `setState` | `(name, updater)` | Accepts object or updater function. |\r","| `watch` | `(name, component, callback, selector?)` | Auto-cleanup via component. |\r","| `destroy` | `(name)` | Removes a context. |\r","| `list` | `()` | Returns context names. |\r"];
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
      label: 'â'
    });

    container.appendChild(copyMenu);
  }

  async copyMarkdown() {}
}

customElements.define('slice-structuraldocumentation', StructuralDocumentation);

