export default class ContextManagerDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "context-manager.md";
    this.markdownContent = "---\r\ntitle: ContextManager\r\nroute: /Documentation/Structural/ContextManager\r\nnavLabel: ContextManager\r\nsection: Getting Started\r\ngroup: State\r\norder: 30\r\ndescription: Shared state with watchers, selectors, and persistence.\r\ncomponent: ContextManagerDocumentation\r\ntags: [context, state, persistence]\r\n---\r\n\r\n# ContextManager\r\n\r\n## Overview\r\nContextManager provides shared state across components with watchers and optional persistence.\r\nIt uses EventManager internally to notify watchers and supports selectors for efficient updates.\r\n\r\nEnable it in `sliceConfig.json` to use `slice.context`.\r\n\r\n## Enable ContextManager\r\n```json title=\"sliceConfig.json\"\r\n{\r\n  \"context\": { \"enabled\": true }\r\n}\r\n```\r\n\r\n## Context UI (Optional)\r\nYou can enable the ContextManager debug panel with a keyboard shortcut.\r\n\r\n```json title=\"sliceConfig.json\"\r\n{\r\n  \"context\": {\r\n    \"enabled\": true,\r\n    \"ui\": {\r\n      \"enabled\": true,\r\n      \"shortcut\": \"alt+shift+c\"\r\n    }\r\n  }\r\n}\r\n```\r\n\r\n## Core API\r\n| Method | Signature | Returns | Notes |\r\n| --- | --- | --- | --- |\r\n| `create` | `(name, initialState = {}, options = {})` | `boolean` | Options include `persist`, `storageKey`. |\r\n| `getState` | `(name)` | `any | null` | Returns current state or `null` if missing. |\r\n| `setState` | `(name, updater)` | `void` | `updater` can be object or `(prev) => newState`. |\r\n| `watch` | `(name, component, callback, selector?)` | `string | null` | Auto-cleanup via component sliceId. |\r\n| `has` | `(name)` | `boolean` | Check if a context exists. |\r\n| `destroy` | `(name)` | `boolean` | Removes a context and persisted storage. |\r\n| `list` | `()` | `string[]` | Returns all context names. |\r\n\r\n## Context Options\r\n| Option | Type | Default | Notes |\r\n| --- | --- | --- | --- |\r\n| `persist` | `boolean` | `false` | Saves state to `localStorage`. |\r\n| `storageKey` | `string` | `slice_context_<name>` | Override persistence key. |\r\n\r\n## Create and Read\r\n```javascript title=\"Create a context\"\r\nslice.context.create('auth', {\r\n  isLoggedIn: false,\r\n  user: null\r\n});\r\n\r\nconst authState = slice.context.getState('auth');\r\nconsole.log(authState.isLoggedIn);\r\n```\r\n\r\n## Watchers\r\nWatchers are bound to components for auto-cleanup. Pass the component as the second argument.\r\n\r\n```javascript title=\"Watch with selector\"\r\nexport default class AccountMenu extends HTMLElement {\r\n  constructor(props) {\r\n    super();\r\n    slice.attachTemplate(this);\r\n    slice.controller.setComponentProps(this, props);\r\n  }\r\n\r\n  async init() {\r\n    slice.context.watch(\r\n      'auth',\r\n      this,\r\n      (isLoggedIn) => {\r\n        this.classList.toggle('signed-in', isLoggedIn);\r\n      },\r\n      (state) => state.isLoggedIn\r\n    );\r\n  }\r\n}\r\n```\r\n\r\n## Selectors and Derived Data\r\nSelectors run on every update and should be fast and side-effect free. ContextManager performs\r\na shallow comparison of the selected value to decide when to notify.\r\n\r\n```javascript title=\"Derived value selector\"\r\nslice.context.watch(\r\n  'cart',\r\n  this,\r\n  (count) => {\r\n    this.$badge.textContent = count;\r\n  },\r\n  (state) => state.items.length\r\n);\r\n```\r\n\r\n## Persistence\r\nPersist a context to `localStorage` for session survival.\r\n\r\n```javascript title=\"Persistent context\"\r\nslice.context.create(\r\n  'preferences',\r\n  { theme: 'light', locale: 'en' },\r\n  { persist: true, storageKey: 'app:preferences' }\r\n);\r\n```\r\n\r\n## Functional Updates\r\nUse functional updates when new state depends on previous state.\r\n\r\n```javascript title=\"Functional update\"\r\nslice.context.setState('cart', (prev) => ({\r\n  ...prev,\r\n  items: [...prev.items, newItem],\r\n  total: prev.total + newItem.price\r\n}));\r\n```\r\n\r\n## Service Singleton Example\r\n```javascript title=\"Context access via singleton service\"\r\nconst contextService = await slice.build('ImposterGameContextService', {\r\n  sliceId: 'imposter-context-service'\r\n});\r\n\r\nexport default class GameScreen extends HTMLElement {\r\n  async init() {\r\n    this.contextService = slice.getComponent('imposter-context-service');\r\n    const config = this.contextService.getGameConfig();\r\n    this.contextService.updateGameConfig({ step: 'reveal' });\r\n  }\r\n}\r\n```\r\n\r\n## Best Practices\r\n:::tip\r\nKeep contexts small and focused by domain.\r\n:::\r\n\r\n:::tip\r\nUse selectors to reduce unnecessary updates.\r\n:::\r\n\r\n:::tip\r\nPrefer serializable state only. Avoid storing class instances or functions.\r\n:::\r\n\r\n:::tip\r\nUse a service singleton to encapsulate context reads/writes when multiple components share the same domain state.\r\n:::\r\n\r\n## Gotchas\r\n:::warning\r\n`watch()` requires a component with a `sliceId`. Otherwise it returns `null`.\r\n:::\r\n\r\n:::warning\r\nPersist only small, serializable state.\r\n:::\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\r\n  \"context\": { \"enabled\": true }\r\n}\r",
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
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\r\n  \"context\": {\r\n    \"enabled\": true,\r\n    \"ui\": {\r\n      \"enabled\": true,\r\n      \"shortcut\": \"alt+shift+c\"\r\n    }\r\n  }\r\n}\r",
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
            const lines = ["| Method | Signature | Returns | Notes |\r","| --- | --- | --- | --- |\r","| `create` | `(name, initialState = {}, options = {})` | `boolean` | Options include `persist`, `storageKey`. |\r","| `getState` | `(name)` | `any | null` | Returns current state or `null` if missing. |\r","| `setState` | `(name, updater)` | `void` | `updater` can be object or `(prev) => newState`. |\r","| `watch` | `(name, component, callback, selector?)` | `string | null` | Auto-cleanup via component sliceId. |\r","| `has` | `(name)` | `boolean` | Check if a context exists. |\r","| `destroy` | `(name)` | `boolean` | Removes a context and persisted storage. |\r","| `list` | `()` | `string[]` | Returns all context names. |\r"];
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
            const lines = ["| Option | Type | Default | Notes |\r","| --- | --- | --- | --- |\r","| `persist` | `boolean` | `false` | Saves state to `localStorage`. |\r","| `storageKey` | `string` | `slice_context_<name>` | Override persistence key. |\r"];
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
            const code = await slice.build('CodeVisualizer', {
               value: "slice.context.create('auth', {\r\n  isLoggedIn: false,\r\n  user: null\r\n});\r\n\r\nconst authState = slice.context.getState('auth');\r\nconsole.log(authState.isLoggedIn);\r",
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class AccountMenu extends HTMLElement {\r\n  constructor(props) {\r\n    super();\r\n    slice.attachTemplate(this);\r\n    slice.controller.setComponentProps(this, props);\r\n  }\r\n\r\n  async init() {\r\n    slice.context.watch(\r\n      'auth',\r\n      this,\r\n      (isLoggedIn) => {\r\n        this.classList.toggle('signed-in', isLoggedIn);\r\n      },\r\n      (state) => state.isLoggedIn\r\n    );\r\n  }\r\n}\r",
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.context.watch(\r\n  'cart',\r\n  this,\r\n  (count) => {\r\n    this.$badge.textContent = count;\r\n  },\r\n  (state) => state.items.length\r\n);\r",
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.context.create(\r\n  'preferences',\r\n  { theme: 'light', locale: 'en' },\r\n  { persist: true, storageKey: 'app:preferences' }\r\n);\r",
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
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.context.setState('cart', (prev) => ({\r\n  ...prev,\r\n  items: [...prev.items, newItem],\r\n  total: prev.total + newItem.price\r\n}));\r",
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
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const contextService = await slice.build('ImposterGameContextService', {\r\n  sliceId: 'imposter-context-service'\r\n});\r\n\r\nexport default class GameScreen extends HTMLElement {\r\n  async init() {\r\n    this.contextService = slice.getComponent('imposter-context-service');\r\n    const config = this.contextService.getGameConfig();\r\n    this.contextService.updateGameConfig({ step: 'reveal' });\r\n  }\r\n}\r",
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

customElements.define('slice-contextmanagerdocumentation', ContextManagerDocumentation);
