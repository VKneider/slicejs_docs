export default class EventManagerDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "example.md";
    this.markdownContent = "---\ntitle: EventManager\nroute: /Documentation/Structural/EventManager\nnavLabel: Events\nsection: Getting Started\ngroup: Events\norder: 20\ndescription: Lightweight pub/sub for component and app events.\ntags: [events, pubsub, lifecycle, cleanup]\n---\n\n# EventManager\n\n## Overview\nEventManager provides a lightweight pub/sub system for Slice.js. It supports global subscriptions,\ncomponent-bound subscriptions with auto-cleanup, and one-time listeners. It is designed for\ncross-cutting signals and decoupled communication between components and services.\n\n## When to Use\n- App-level signals (app:ready, user:login, notification:show)\n- Decoupled UI updates (service emits, UI listens)\n- One-time bootstrap actions\n\n## When Not to Use\n- Shared, persistent state: use ContextManager instead\n- High-frequency real-time data: use dedicated data streams\n\n## Enable\n```json\n{\n  \"events\": { \"enabled\": true }\n}\n```\n\n## Concepts\n- Event names are strings, typically namespaced (`domain:action`).\n- Subscriptions can be global or component-bound.\n- Component-bound subscriptions are auto-removed when the component is destroyed.\n\n## API Reference\n| Method | Signature | Notes |\n| --- | --- | --- |\n| `subscribe` | `(eventName, callback, options?)` | Auto-cleanup if `options.component` set |\n| `subscribeOnce` | `(eventName, callback, options?)` | Auto-unsubscribe after first emit |\n| `unsubscribe` | `(eventName, subscriptionId)` | Returns boolean |\n| `emit` | `(eventName, data?)` | Emits to all subscribers |\n| `bind` | `(component)` | Returns component-bound API |\n| `hasSubscribers` | `(eventName)` | Diagnostics only |\n| `subscriberCount` | `(eventName)` | Diagnostics only |\n| `clear` | `()` | Clears all subscriptions |\n\n## Usage Patterns\n```javascript title=\"Component-bound subscription in init() (recommended)\"\nexport default class Navbar extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    this.events = slice.events.bind(this);\n    this.events.subscribe(\"user:logout\", () => this.resetUI());\n  }\n\n  resetUI() {\n    // ...\n  }\n}\n```\n\n```javascript title=\"Component-bound without bind() in init()\"\nexport default class Navbar extends HTMLElement {\n  async init() {\n    slice.events.subscribe(\n      \"user:logout\",\n      () => this.resetUI(),\n      { component: this }\n    );\n  }\n}\n```\n\n```javascript title=\"One-time initialization in init()\"\nexport default class AppShell extends HTMLElement {\n  async init() {\n    slice.events.subscribeOnce(\"app:ready\", () => {\n      console.log(\"App ready\");\n    });\n  }\n}\n```\n\n```javascript title=\"Global notification from a service\"\nexport default class NotificationService {\n  notify(message, type = \"success\") {\n    slice.events.emit(\"notification:show\", { type, message });\n  }\n}\n```\n\n## Component Integration\n```javascript title=\"Service emits, UI listens\"\nexport default class NotificationService {\n  notify(message, type = \"info\") {\n    slice.events.emit(\"notification:show\", { message, type });\n  }\n}\n\nexport default class Toasts extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    this.events = slice.events.bind(this);\n    this.events.subscribe(\"notification:show\", ({ message, type }) => {\n      this.showToast(message, type);\n    });\n  }\n}\n```\n\n## Implementation Recipe\n:::steps\n1. Choose a namespaced event name (e.g., `cart:updated`).\n2. Emit the event where the change happens.\n3. Subscribe in the UI or other consumers using `bind()`.\n4. Use `subscribeOnce` for bootstrapping or single-run tasks.\n:::\n\n## Best Practices\n:::tip\nUse namespaced event names. Avoid generic names like `update` or `change`.\n:::\n\n:::tip\nKeep payloads small and serializable when possible.\n:::\n\n:::tip\nPrefer `bind()` for components. It prevents leaks by default.\n:::\n\n:::tip\nUse EventManager for signals, not for shared state. Pair with ContextManager when state must persist.\n:::\n\n## Gotchas\n:::warning\nClearing a container does not remove subscriptions. Use component-bound subscriptions or manual\n`unsubscribe` calls.\n:::\n\n:::warning\nAvoid using EventManager as a data store. It does not retain state.\n:::\n\n## Diagnostics\n```javascript title=\"Check if anyone is listening\"\nif (slice.events.hasSubscribers(\"cart:updated\")) {\n  slice.events.emit(\"cart:updated\", { items: 3 });\n}\n```\n\n## FAQ\n:::details title=\"Should I use EventManager for shared state?\"\nNo. Use ContextManager for shared state. EventManager is for ephemeral signals.\n:::\n\n:::details title=\"What happens if events are disabled?\"\nSlice.js provides a no-op implementation so calls to `slice.events` are safe.\n:::\n\n:::details title=\"Do I need to unsubscribe manually?\"\nOnly if you are not using `bind()` or `options.component`. Component-bound subscriptions auto-clean.\n:::\n\n:::details title=\"Can I debug event usage?\"\nUse `hasSubscribers` or `subscriberCount` for diagnostics in development.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"events\": { \"enabled\": true }\n}",
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
            const lines = ["| Method | Signature | Notes |","| --- | --- | --- |","| `subscribe` | `(eventName, callback, options?)` | Auto-cleanup if `options.component` set |","| `subscribeOnce` | `(eventName, callback, options?)` | Auto-unsubscribe after first emit |","| `unsubscribe` | `(eventName, subscriptionId)` | Returns boolean |","| `emit` | `(eventName, data?)` | Emits to all subscribers |","| `bind` | `(component)` | Returns component-bound API |","| `hasSubscribers` | `(eventName)` | Diagnostics only |","| `subscriberCount` | `(eventName)` | Diagnostics only |","| `clear` | `()` | Clears all subscriptions |"];
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class Navbar extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    this.events = slice.events.bind(this);\n    this.events.subscribe(\"user:logout\", () => this.resetUI());\n  }\n\n  resetUI() {\n    // ...\n  }\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class Navbar extends HTMLElement {\n  async init() {\n    slice.events.subscribe(\n      \"user:logout\",\n      () => this.resetUI(),\n      { component: this }\n    );\n  }\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class AppShell extends HTMLElement {\n  async init() {\n    slice.events.subscribeOnce(\"app:ready\", () => {\n      console.log(\"App ready\");\n    });\n  }\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class NotificationService {\n  notify(message, type = \"success\") {\n    slice.events.emit(\"notification:show\", { type, message });\n  }\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class NotificationService {\n  notify(message, type = \"info\") {\n    slice.events.emit(\"notification:show\", { message, type });\n  }\n}\n\nexport default class Toasts extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    this.events = slice.events.bind(this);\n    this.events.subscribe(\"notification:show\", ({ message, type }) => {\n      this.showToast(message, type);\n    });\n  }\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "if (slice.events.hasSubscribers(\"cart:updated\")) {\n  slice.events.emit(\"cart:updated\", { items: 3 });\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const details = await slice.build('Details', { title: "Should I use EventManager for shared state?", text: "No. Use ContextManager for shared state. EventManager is for ephemeral signals." });
            container.appendChild(details);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const details = await slice.build('Details', { title: "What happens if events are disabled?", text: "Slice.js provides a no-op implementation so calls to `slice.events` are safe." });
            container.appendChild(details);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const details = await slice.build('Details', { title: "Do I need to unsubscribe manually?", text: "Only if you are not using `bind()` or `options.component`. Component-bound subscriptions auto-clean." });
            container.appendChild(details);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
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
