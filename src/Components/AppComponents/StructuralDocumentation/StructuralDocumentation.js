export default class StructuralDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/structural-components.md";
    this.markdownContent = "---\ntitle: Structural\nroute: /Documentation/Structural\nnavLabel: Structural\nsection: Getting Started\ngroup: Components\norder: 33\ndescription: Structural components that power Slice.js.\ncomponent: StructuralDocumentation\ntags: [structural, controller, router, styles]\n---\n\n# Structural Components\n\n## Overview\nStructural components power the framework runtime. They are created by Slice.js and exposed\nunder `slice.*`. You do not build them directly.\n\n## Key Components\n- `slice.controller` for component lifecycle and lookup\n- `slice.router` for navigation and route rendering\n- `slice.stylesManager` for styles and themes\n- `slice.events` for pub/sub (optional)\n- `slice.context` for shared state (optional)\n\n## Controller API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `getComponent` | `(sliceId)` | `HTMLElement | undefined` | Lookup by sliceId. |\n| `destroyByContainer` | `(container)` | `number` | Destroys Slice components inside container. |\n| `destroyByPattern` | `(pattern)` | `number` | Destroys components whose sliceId matches pattern. |\n\n```javascript title=\"Destroy components safely\"\nconst container = this.querySelector('.items');\nslice.controller.destroyByContainer(container);\ncontainer.innerHTML = '';\n```\n\n## Router API\n| Method | Signature | Notes |\n| --- | --- | --- |\n| `navigate` | `(path, _redirectChain?, _options?)` | Programmatic navigation. |\n| `beforeEach` | `(to, from, next)` | Register a guard before navigation. |\n| `afterEach` | `(to, from)` | Run logic after navigation. |\n| `start` | `()` | Start routing immediately. |\n\n## Styles and Themes\n`slice.setTheme(themeName)` applies a theme through the StylesManager.\n\n```javascript title=\"Switch themes\"\nawait slice.setTheme('Dark');\n```\n\n## EventManager (Optional)\nProvides pub/sub via `slice.events`. When disabled, the API is a no-op.\n\n| Method | Signature | Notes |\n| --- | --- | --- |\n| `subscribe` | `(eventName, callback, options?)` | Returns subscription id. |\n| `subscribeOnce` | `(eventName, callback, options?)` | Auto-unsubscribe after first emit. |\n| `unsubscribe` | `(eventName, id)` | Returns boolean. |\n| `emit` | `(eventName, data?)` | Emits to all subscribers. |\n| `bind` | `(component)` | Returns component-bound API. |\n\n## ContextManager (Optional)\nShared state system available at `slice.context`.\n\n| Method | Signature | Notes |\n| --- | --- | --- |\n| `create` | `(name, initialState, options?)` | Options include `persist`. |\n| `getState` | `(name)` | Returns current state or null. |\n| `setState` | `(name, updater)` | Accepts object or updater function. |\n| `watch` | `(name, component, callback, selector?)` | Auto-cleanup via component. |\n| `destroy` | `(name)` | Removes a context. |\n| `list` | `()` | Returns context names. |\n\n## Best Practices\n:::tip\nUse `destroyByContainer` before recreating dynamic lists to avoid leaks.\n:::\n\n:::tip\nRegister guards before calling `slice.router.start()`.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Signature | Returns | Notes |","| --- | --- | --- | --- |","| `getComponent` | `(sliceId)` | `HTMLElement | undefined` | Lookup by sliceId. |","| `destroyByContainer` | `(container)` | `number` | Destroys Slice components inside container. |","| `destroyByPattern` | `(pattern)` | `number` | Destroys components whose sliceId matches pattern. |"];
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
               value: "const container = this.querySelector('.items');\nslice.controller.destroyByContainer(container);\ncontainer.innerHTML = '';",
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
            const lines = ["| Method | Signature | Notes |","| --- | --- | --- |","| `navigate` | `(path, _redirectChain?, _options?)` | Programmatic navigation. |","| `beforeEach` | `(to, from, next)` | Register a guard before navigation. |","| `afterEach` | `(to, from)` | Run logic after navigation. |","| `start` | `()` | Start routing immediately. |"];
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
               value: "await slice.setTheme('Dark');",
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
            const lines = ["| Method | Signature | Notes |","| --- | --- | --- |","| `subscribe` | `(eventName, callback, options?)` | Returns subscription id. |","| `subscribeOnce` | `(eventName, callback, options?)` | Auto-unsubscribe after first emit. |","| `unsubscribe` | `(eventName, id)` | Returns boolean. |","| `emit` | `(eventName, data?)` | Emits to all subscribers. |","| `bind` | `(component)` | Returns component-bound API. |"];
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
            const lines = ["| Method | Signature | Notes |","| --- | --- | --- |","| `create` | `(name, initialState, options?)` | Options include `persist`. |","| `getState` | `(name)` | Returns current state or null. |","| `setState` | `(name, updater)` | Accepts object or updater function. |","| `watch` | `(name, component, callback, selector?)` | Auto-cleanup via component. |","| `destroy` | `(name)` | Removes a context. |","| `list` | `()` | Returns context names. |"];
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
      label: '❐'
    });

    container.appendChild(copyMenu);
  }

  async copyMarkdown() {}
}

customElements.define('slice-structuraldocumentation', StructuralDocumentation);
