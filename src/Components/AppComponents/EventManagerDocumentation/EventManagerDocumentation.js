export default class EventManagerDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "event-manager.md";
    this.markdownContent = "---\r\ntitle: EventManager\r\nroute: /Documentation/Structural/EventManager\r\nnavLabel: Events\r\nsection: Getting Started\r\ngroup: Events\r\norder: 20\r\ndescription: Lightweight pub/sub for component and app events.\r\ncomponent: EventManagerDocumentation\r\ntags: [events, pubsub, lifecycle, cleanup]\r\n---\r\n\r\n# EventManager\r\n\r\n## Overview\r\nEventManager provides a lightweight pub/sub system for Slice.js. It supports global subscriptions,\r\ncomponent-bound subscriptions with auto-cleanup, and one-time listeners. It is designed for\r\ncross-cutting signals and decoupled communication between components and services.\r\n\r\n## When to Use\r\n- App-level signals (app:ready, user:login, notification:show)\r\n- Decoupled UI updates (service emits, UI listens)\r\n- One-time bootstrap actions\r\n\r\n## When Not to Use\r\n- Shared, persistent state: use ContextManager instead\r\n- High-frequency real-time data: use dedicated data streams\r\n\r\n## Enable\r\n```json\r\n{\r\n  \"events\": { \"enabled\": true }\r\n}\r\n```\r\n\r\n## Events UI (Optional)\r\nYou can enable the EventManager debug panel with a keyboard shortcut.\r\n\r\n```json title=\"sliceConfig.json\"\r\n{\r\n  \"events\": {\r\n    \"enabled\": true,\r\n    \"ui\": {\r\n      \"enabled\": true,\r\n      \"shortcut\": \"alt+shift+e\"\r\n    }\r\n  }\r\n}\r\n```\r\n\r\n## Concepts\r\n- Event names are strings, typically namespaced (`domain:action`).\r\n- Subscriptions can be global or component-bound.\r\n- Component-bound subscriptions are auto-removed when the component is destroyed.\r\n\r\n## API Reference\r\n| Method | Signature | Notes |\r\n| --- | --- | --- |\r\n| `subscribe` | `(eventName, callback, options?)` | Auto-cleanup if `options.component` set |\r\n| `subscribeOnce` | `(eventName, callback, options?)` | Auto-unsubscribe after first emit |\r\n| `unsubscribe` | `(eventName, subscriptionId)` | Returns boolean |\r\n| `emit` | `(eventName, data?)` | Emits to all subscribers |\r\n| `bind` | `(component)` | Returns component-bound API |\r\n| `hasSubscribers` | `(eventName)` | Diagnostics only |\r\n| `subscriberCount` | `(eventName)` | Diagnostics only |\r\n| `clear` | `()` | Clears all subscriptions |\r\n\r\n## Usage Patterns\r\n```javascript title=\"Component-bound subscription in init() (recommended)\"\r\nexport default class Navbar extends HTMLElement {\r\n  constructor(props) {\r\n    super();\r\n    slice.attachTemplate(this);\r\n    slice.controller.setComponentProps(this, props);\r\n  }\r\n\r\n  async init() {\r\n    this.events = slice.events.bind(this);\r\n    this.events.subscribe(\"user:logout\", () => this.resetUI());\r\n  }\r\n\r\n  resetUI() {\r\n    // ...\r\n  }\r\n}\r\n```\r\n\r\n```javascript title=\"Component-bound without bind() in init()\"\r\nexport default class Navbar extends HTMLElement {\r\n  async init() {\r\n    slice.events.subscribe(\r\n      \"user:logout\",\r\n      () => this.resetUI(),\r\n      { component: this }\r\n    );\r\n  }\r\n}\r\n```\r\n\r\n```javascript title=\"One-time initialization in init()\"\r\nexport default class AppShell extends HTMLElement {\r\n  async init() {\r\n    slice.events.subscribeOnce(\"app:ready\", () => {\r\n      console.log(\"App ready\");\r\n    });\r\n  }\r\n}\r\n```\r\n\r\n```javascript title=\"Global notification from a service\"\r\nexport default class NotificationService {\r\n  notify(message, type = \"success\") {\r\n    slice.events.emit(\"notification:show\", { type, message });\r\n  }\r\n}\r\n```\r\n\r\n## Component Integration\r\n```javascript title=\"Service emits, UI listens\"\r\nexport default class NotificationService {\r\n  notify(message, type = \"info\") {\r\n    slice.events.emit(\"notification:show\", { message, type });\r\n  }\r\n}\r\n\r\nexport default class Toasts extends HTMLElement {\r\n  constructor(props) {\r\n    super();\r\n    slice.attachTemplate(this);\r\n    slice.controller.setComponentProps(this, props);\r\n  }\r\n\r\n  async init() {\r\n    this.events = slice.events.bind(this);\r\n    this.events.subscribe(\"notification:show\", ({ message, type }) => {\r\n      this.showToast(message, type);\r\n    });\r\n  }\r\n}\r\n```\r\n\r\n## Implementation Recipe\r\n:::steps\r\n1. Choose a namespaced event name (e.g., `cart:updated`).\r\n2. Emit the event where the change happens.\r\n3. Subscribe in the UI or other consumers using `bind()`.\r\n4. Use `subscribeOnce` for bootstrapping or single-run tasks.\r\n:::\r\n\r\n## Best Practices\r\n:::tip\r\nUse namespaced event names. Avoid generic names like `update` or `change`.\r\n:::\r\n\r\n:::tip\r\nKeep payloads small and serializable when possible.\r\n:::\r\n\r\n:::tip\r\nPrefer `bind()` for components. It prevents leaks by default.\r\n:::\r\n\r\n:::tip\r\nUse EventManager for signals, not for shared state. Pair with ContextManager when state must persist.\r\n:::\r\n\r\n## Gotchas\r\n:::warning\r\nClearing a container does not remove subscriptions. Use component-bound subscriptions or manual\r\n`unsubscribe` calls.\r\n:::\r\n\r\n:::warning\r\nAvoid using EventManager as a data store. It does not retain state.\r\n:::\r\n\r\n## Diagnostics\r\n```javascript title=\"Check if anyone is listening\"\r\nif (slice.events.hasSubscribers(\"cart:updated\")) {\r\n  slice.events.emit(\"cart:updated\", { items: 3 });\r\n}\r\n```\r\n\r\n## FAQ\r\n:::details title=\"Should I use EventManager for shared state?\"\r\nNo. Use ContextManager for shared state. EventManager is for ephemeral signals.\r\n:::\r\n\r\n:::details title=\"What happens if events are disabled?\"\r\nSlice.js provides a no-op implementation so calls to `slice.events` are safe.\r\n:::\r\n\r\n:::details title=\"Do I need to unsubscribe manually?\"\r\nOnly if you are not using `bind()` or `options.component`. Component-bound subscriptions auto-clean.\r\n:::\r\n\r\n:::details title=\"Can I debug event usage?\"\r\nUse `hasSubscribers` or `subscriberCount` for diagnostics in development.\r\n:::\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\r\n  \"events\": { \"enabled\": true }\r\n}\r",
               language: "json"
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
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\r\n  \"events\": {\r\n    \"enabled\": true,\r\n    \"ui\": {\r\n      \"enabled\": true,\r\n      \"shortcut\": \"alt+shift+e\"\r\n    }\r\n  }\r\n}\r",
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
            const lines = ["| Method | Signature | Notes |\r","| --- | --- | --- |\r","| `subscribe` | `(eventName, callback, options?)` | Auto-cleanup if `options.component` set |\r","| `subscribeOnce` | `(eventName, callback, options?)` | Auto-unsubscribe after first emit |\r","| `unsubscribe` | `(eventName, subscriptionId)` | Returns boolean |\r","| `emit` | `(eventName, data?)` | Emits to all subscribers |\r","| `bind` | `(component)` | Returns component-bound API |\r","| `hasSubscribers` | `(eventName)` | Diagnostics only |\r","| `subscriberCount` | `(eventName)` | Diagnostics only |\r","| `clear` | `()` | Clears all subscriptions |\r"];
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
               value: "export default class Navbar extends HTMLElement {\r\n  constructor(props) {\r\n    super();\r\n    slice.attachTemplate(this);\r\n    slice.controller.setComponentProps(this, props);\r\n  }\r\n\r\n  async init() {\r\n    this.events = slice.events.bind(this);\r\n    this.events.subscribe(\"user:logout\", () => this.resetUI());\r\n  }\r\n\r\n  resetUI() {\r\n    // ...\r\n  }\r\n}\r",
               language: "javascript"
            });
            if ("Component-bound subscription in init() (recommended)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Component-bound subscription in init() (recommended)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class Navbar extends HTMLElement {\r\n  async init() {\r\n    slice.events.subscribe(\r\n      \"user:logout\",\r\n      () => this.resetUI(),\r\n      { component: this }\r\n    );\r\n  }\r\n}\r",
               language: "javascript"
            });
            if ("Component-bound without bind() in init()") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Component-bound without bind() in init()";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class AppShell extends HTMLElement {\r\n  async init() {\r\n    slice.events.subscribeOnce(\"app:ready\", () => {\r\n      console.log(\"App ready\");\r\n    });\r\n  }\r\n}\r",
               language: "javascript"
            });
            if ("One-time initialization in init()") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "One-time initialization in init()";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class NotificationService {\r\n  notify(message, type = \"success\") {\r\n    slice.events.emit(\"notification:show\", { type, message });\r\n  }\r\n}\r",
               language: "javascript"
            });
            if ("Global notification from a service") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Global notification from a service";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class NotificationService {\r\n  notify(message, type = \"info\") {\r\n    slice.events.emit(\"notification:show\", { message, type });\r\n  }\r\n}\r\n\r\nexport default class Toasts extends HTMLElement {\r\n  constructor(props) {\r\n    super();\r\n    slice.attachTemplate(this);\r\n    slice.controller.setComponentProps(this, props);\r\n  }\r\n\r\n  async init() {\r\n    this.events = slice.events.bind(this);\r\n    this.events.subscribe(\"notification:show\", ({ message, type }) => {\r\n      this.showToast(message, type);\r\n    });\r\n  }\r\n}\r",
               language: "javascript"
            });
            if ("Service emits, UI listens") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Service emits, UI listens";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "if (slice.events.hasSubscribers(\"cart:updated\")) {\r\n  slice.events.emit(\"cart:updated\", { items: 3 });\r\n}\r",
               language: "javascript"
            });
            if ("Check if anyone is listening") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Check if anyone is listening";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const details = await slice.build('Details', { title: "Should I use EventManager for shared state?", text: "No. Use ContextManager for shared state. EventManager is for ephemeral signals." });
            container.appendChild(details);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const details = await slice.build('Details', { title: "What happens if events are disabled?", text: "Slice.js provides a no-op implementation so calls to `slice.events` are safe." });
            container.appendChild(details);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const details = await slice.build('Details', { title: "Do I need to unsubscribe manually?", text: "Only if you are not using `bind()` or `options.component`. Component-bound subscriptions auto-clean." });
            container.appendChild(details);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const details = await slice.build('Details', { title: "Can I debug event usage?", text: "Use `hasSubscribers` or `subscriberCount` for diagnostics in development." });
            container.appendChild(details);
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

customElements.define('slice-eventmanagerdocumentation', EventManagerDocumentation);
