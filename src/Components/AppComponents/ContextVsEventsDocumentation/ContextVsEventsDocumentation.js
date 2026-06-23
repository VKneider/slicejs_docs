export default class ContextVsEventsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/context-vs-events.md";
    this.markdownContent = "---\ntitle: Context vs Events\nroute: /Documentation/Structural/Context-vs-Events\nnavLabel: Context vs Events\nsection: Getting Started\ngroup: Components\norder: 56\ndescription: When to reach for ContextManager and when for EventManager — the one decision that keeps shared state clean.\ncomponent: ContextVsEventsDocumentation\ntags: [context, events, state, architecture]\n---\n\n# Context vs Events\n\nBoth let components react to things happening elsewhere — but they answer different questions. Pick\nby the question you're asking:\n\n- **Context** → *\"What is the current state?\"* Shared, retained, readable at any time.\n- **Events** → *\"Did something just happen?\"* A one-shot signal, with no retained value.\n\n## Which one?\n| You need… | Reach for | Why |\n| --- | --- | --- |\n| A value many components read and react to | **Context** | It holds state; watchers re-run on change, and selectors narrow what triggers them. |\n| To persist state across reloads | **Context** | Contexts can persist; events are ephemeral. |\n| To announce \"X happened\" without holding a value | **Events** | Fire-and-forget; subscribers decide what to do. |\n| To decouple a producer from unknown consumers | **Events** | The emitter doesn't know who listens. |\n| A side effect in another domain when something changes | **Events** | Emit after the state change so the other domain reacts. |\n\n## Context — the current state\nA value several components depend on. Each `watch`es it (auto-cleaned on destroy); anyone calls\n`setState`. See [ContextManager](/Documentation/Structural/ContextManager).\n\n```javascript title=\"Shared state with a selector\"\nasync init() {\n  this.$count = this.querySelector('.cart-count');\n  slice.context.watch(\n    'cart',\n    this,\n    (count) => { this.$count.textContent = count; },\n    (state) => state.items.length            // selector: only re-run when the count changes\n  );\n}\n\n// anywhere a change happens:\nslice.context.setState('cart', (prev) => ({ ...prev, items: [...prev.items, item] }));\n```\n\n## Events — something happened\nA signal with no retained value. A component subscribes; another part of the app emits. See\n[EventManager](/Documentation/Structural/EventManager).\n\n```javascript title=\"React to a signal\"\nasync init() {\n  this.events = slice.events.bind(this);     // bound API → auto-cleaned on destroy\n  this.events.subscribe('orders:updated', () => this.refresh());\n}\n\n// elsewhere, after a mutation:\nslice.events.emit('orders:updated');\n```\n\n## They compose\nUse Context for the state, and add an Event when a **different domain** must react to a change.\n\n```javascript title=\"State in Context, cross-domain signal via Events\"\nslice.context.setState('orders', (prev) => ({ ...prev, list: fresh }));\nslice.events.emit('orders:updated');   // let unrelated features react too\n```\n\n:::tip\nDefault to **Context** for shared state. Add an **Event** only when a producer must notify\nconsumers it doesn't know about. For refreshing one component you hold, you often need neither — see\n[Refreshing Component Data](/Documentation/Architecture/Refreshing-Component-Data).\n:::\n\n:::warning\nDon't model state as a stream of events you replay to rebuild it — that's what Context is for. Use\nevents for *moments*, not for *state*.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| You need… | Reach for | Why |","| --- | --- | --- |","| A value many components read and react to | **Context** | It holds state; watchers re-run on change, and selectors narrow what triggers them. |","| To persist state across reloads | **Context** | Contexts can persist; events are ephemeral. |","| To announce \"X happened\" without holding a value | **Events** | Fire-and-forget; subscribers decide what to do. |","| To decouple a producer from unknown consumers | **Events** | The emitter doesn't know who listens. |","| A side effect in another domain when something changes | **Events** | Emit after the state change so the other domain reacts. |"];
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
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "async init() {\n  this.$count = this.querySelector('.cart-count');\n  slice.context.watch(\n    'cart',\n    this,\n    (count) => { this.$count.textContent = count; },\n    (state) => state.items.length            // selector: only re-run when the count changes\n  );\n}\n\n// anywhere a change happens:\nslice.context.setState('cart', (prev) => ({ ...prev, items: [...prev.items, item] }));",
               language: "javascript"
            });
            if ("Shared state with a selector") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Shared state with a selector";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "async init() {\n  this.events = slice.events.bind(this);     // bound API → auto-cleaned on destroy\n  this.events.subscribe('orders:updated', () => this.refresh());\n}\n\n// elsewhere, after a mutation:\nslice.events.emit('orders:updated');",
               language: "javascript"
            });
            if ("React to a signal") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "React to a signal";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.context.setState('orders', (prev) => ({ ...prev, list: fresh }));\nslice.events.emit('orders:updated');   // let unrelated features react too",
               language: "javascript"
            });
            if ("State in Context, cross-domain signal via Events") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "State in Context, cross-domain signal via Events";
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

customElements.define('slice-contextvseventsdocumentation', ContextVsEventsDocumentation);
