export default class ContextManagerDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "context-manager.md";
    this.markdownContent = "---\ntitle: ContextManager\nroute: /Documentation/Structural/ContextManager\nnavLabel: ContextManager\nsection: Getting Started\ngroup: State\norder: 30\ndescription: Shared state with watchers, selectors, and persistence.\ncomponent: ContextManagerDocumentation\ntags: [context, state, persistence]\n---\n\n# ContextManager\n\n## Overview\nContextManager provides shared state across components with watchers and optional persistence.\nIt uses EventManager internally to notify watchers and supports selectors for efficient updates.\n\nEnable it in `sliceConfig.json` to use `slice.context`.\n\n## Enable ContextManager\n```json title=\"sliceConfig.json\"\n{\n  \"context\": { \"enabled\": true }\n}\n```\n\n## Context UI (Optional)\nYou can enable the ContextManager debug panel with a keyboard shortcut.\n\n```json title=\"sliceConfig.json\"\n{\n  \"context\": {\n    \"enabled\": true,\n    \"ui\": {\n      \"enabled\": true,\n      \"shortcut\": \"ctrl+7\"\n    }\n  }\n}\n```\n\n## Core API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `create` | `(name, initialState = {}, options = {})` | `boolean` | Options include `persist`, `storageKey`. |\n| `getState` | `(name)` | `any | null` | Returns current state or `null` if missing. |\n| `setState` | `(name, updater)` | `void` | `updater` can be object or `(prev) => newState`. |\n| `watch` | `(name, component, callback, selector?)` | `string | null` | Auto-cleanup via component sliceId. |\n| `has` | `(name)` | `boolean` | Check if a context exists. |\n| `destroy` | `(name)` | `boolean` | Removes a context and persisted storage. |\n| `list` | `()` | `string[]` | Returns all context names. |\n\n## Context Options\n| Option | Type | Default | Notes |\n| --- | --- | --- | --- |\n| `persist` | `boolean` | `false` | Saves state to `localStorage`. |\n| `storageKey` | `string` | `slice_context_<name>` | Override persistence key. |\n\n## Create and Read\n```javascript title=\"Create a context\"\nslice.context.create('auth', {\n  isLoggedIn: false,\n  user: null\n});\n\nconst authState = slice.context.getState('auth');\nconsole.log(authState.isLoggedIn);\n```\n\n## Watchers\nWatchers are bound to components for auto-cleanup. Pass the component as the second argument.\n\n```javascript title=\"Watch with selector\"\nexport default class AccountMenu extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    slice.context.watch(\n      'auth',\n      this,\n      (isLoggedIn) => {\n        this.classList.toggle('signed-in', isLoggedIn);\n      },\n      (state) => state.isLoggedIn\n    );\n  }\n}\n```\n\n## Selectors and Derived Data\nSelectors run on every update and should be fast and side-effect free. ContextManager performs\na shallow comparison of the selected value to decide when to notify.\n\n```javascript title=\"Derived value selector\"\nslice.context.watch(\n  'cart',\n  this,\n  (count) => {\n    this.$badge.textContent = count;\n  },\n  (state) => state.items.length\n);\n```\n\n## Persistence\nPersist a context to `localStorage` for session survival.\n\n```javascript title=\"Persistent context\"\nslice.context.create(\n  'preferences',\n  { theme: 'light', locale: 'en' },\n  { persist: true, storageKey: 'app:preferences' }\n);\n```\n\n## Functional Updates\nUse functional updates when new state depends on previous state.\n\n```javascript title=\"Functional update\"\nslice.context.setState('cart', (prev) => ({\n  ...prev,\n  items: [...prev.items, newItem],\n  total: prev.total + newItem.price\n}));\n```\n\n## Service Singleton Example\n```javascript title=\"Context access via singleton service\"\nconst contextService = await slice.build('ImposterGameContextService', {\n  sliceId: 'imposter-context-service'\n});\n\nexport default class GameScreen extends HTMLElement {\n  async init() {\n    this.contextService = slice.getComponent('imposter-context-service');\n    const config = this.contextService.getGameConfig();\n    this.contextService.updateGameConfig({ step: 'reveal' });\n  }\n}\n```\n\n## Best Practices\n:::tip\nKeep contexts small and focused by domain.\n:::\n\n:::tip\nUse selectors to reduce unnecessary updates.\n:::\n\n:::tip\nPrefer serializable state only. Avoid storing class instances or functions.\n:::\n\n:::tip\nUse a service singleton to encapsulate context reads/writes when multiple components share the same domain state.\n:::\n\n## Gotchas\n:::warning\n`watch()` requires a component with a `sliceId`. Otherwise it returns `null`.\n:::\n\n:::warning\nPersist only small, serializable state.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
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
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"context\": {\n    \"enabled\": true,\n    \"ui\": {\n      \"enabled\": true,\n      \"shortcut\": \"ctrl+7\"\n    }\n  }\n}",
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
            const lines = ["| Method | Signature | Returns | Notes |","| --- | --- | --- | --- |","| `create` | `(name, initialState = {}, options = {})` | `boolean` | Options include `persist`, `storageKey`. |","| `getState` | `(name)` | `any | null` | Returns current state or `null` if missing. |","| `setState` | `(name, updater)` | `void` | `updater` can be object or `(prev) => newState`. |","| `watch` | `(name, component, callback, selector?)` | `string | null` | Auto-cleanup via component sliceId. |","| `has` | `(name)` | `boolean` | Check if a context exists. |","| `destroy` | `(name)` | `boolean` | Removes a context and persisted storage. |","| `list` | `()` | `string[]` | Returns all context names. |"];
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
            const lines = ["| Option | Type | Default | Notes |","| --- | --- | --- | --- |","| `persist` | `boolean` | `false` | Saves state to `localStorage`. |","| `storageKey` | `string` | `slice_context_<name>` | Override persistence key. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
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
         const container = this.querySelector('[data-block-id="doc-block-9"]');
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
         const container = this.querySelector('[data-block-id="doc-block-10"]');
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
