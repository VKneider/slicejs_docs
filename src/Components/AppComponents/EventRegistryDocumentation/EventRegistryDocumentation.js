export default class EventRegistryDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "event-registry.md";
    this.markdownContent = "---\ntitle: Event Registry\nroute: /Documentation/Structural/EventRegistry\nnavLabel: Event Registry\nsection: Getting Started\ngroup: Events\norder: 21\ndescription: Declare a typed, namespaced catalog of events for dev validation, autocompletion, and pub/sub tracing.\ncomponent: EventRegistryDocumentation\ntags: [events, registry, pubsub, types, tracing]\n---\n\n# Event Registry\n\n## Overview\nPub/sub decouples senders from receivers — which is exactly why it is hard to trace:\nevent names are bare strings, payloads are untyped, and a typo silently creates a new\nevent nobody listens to. The **Event Registry** is an opt-in catalog that turns your\nevents into a **declared, typed, namespaced contract**.\n\nDeclaring events buys you three things:\n- **Dev-time validation** — emitting or subscribing to an event you never declared warns once.\n- **Typed `emit`/`subscribe`** — `slice types generate` reads the catalog so payloads autocomplete and wrong shapes fail `tsc`.\n- **A documented graph** — who emits and who listens to each event, both statically (from code) and live (this session).\n\nThe registry is **opt-in and safe by default**: if you never call `register()`, the\nEventManager behaves exactly as before (no warnings, no overhead).\n\n## Declaring events\n\nDeclare events at your composition root (e.g. a `Providers` service built from\n`AppShell.init()`). `register()` is **mergeable** — call it as many times as you like,\nfrom as many modules as you like.\n\n```javascript title=\"Flat keys (namespace:event)\"\nslice.events.register({\n  'cart:add':     { description: 'Item added to cart', payload: { sku: 'string', qty: 'number' } },\n  'cart:cleared': { description: 'Cart emptied', payload: null },   // null => no payload\n});\n```\n\n```javascript title=\"Grouped by namespace — register(namespace, catalog)\"\nslice.events.register('user', {\n  login:  { payload: { id: 'number', name: 'string' } },\n  logout: { payload: null },\n}); // => declares 'user:login' and 'user:logout'\n```\n\nThe `payload` mini-schema uses the same vocabulary as `static props` types: a field map\nlike `{ id: 'number', name: 'string' }`, or `null` for events that carry no data.\n\n### Modularize by domain\nKeep one catalog per domain in its own module and register them where you wire singletons:\n\n```javascript title=\"src/events/cart.events.js\"\nexport const cartEvents = {\n  'cart:add':     { payload: { sku: 'string', qty: 'number' } },\n  'cart:cleared': { payload: null },\n};\n```\n\n```javascript title=\"Providers.init() — the composition root\"\nimport { cartEvents } from '../events/cart.events.js';\nimport { userEvents } from '../events/user.events.js';\n\nslice.events.register(cartEvents).register(userEvents);\n```\n\n## Validation (dev only)\nOnce any catalog is registered, the EventManager validates usage in development. It\n**never throws and never blocks delivery** — it logs a one-time warning and records the\ndrift for the debugger:\n\n- **Undeclared event** — `emit`/`subscribe` for an event not in the catalog.\n- **No namespace** — an event name without a `namespace:` prefix (prefer `cart:add` over `add`).\n\nIn production all of this is silent and zero-overhead.\n\n## Typed events\nRun the CLI to generate TypeScript declarations from the catalog:\n\n```bash title=\"Generate types + the event graph manifest\"\nslice types generate\n```\n\nThis emits a `SliceEventRegistry` interface and types `slice.events.emit`/`subscribe`\nby event name. Known events enforce their payload; unknown or dynamic events stay\npermissive.\n\n```typescript title=\"Typed at compile time\"\nslice.events.emit('cart:add', { sku: 'A1', qty: 2 });   // ✅ ok\nslice.events.emit('cart:add', { sku: 'A1' });            // ❌ tsc error: qty is required\nslice.events.subscribe('user:login', (u) => u.name);     // u is { id: number; name: string }\n```\n\n## API Reference\n| Method | Signature | Notes |\n| --- | --- | --- |\n| `register` | `(catalog)` or `(namespace, catalog)` | Mergeable; turns on dev validation |\n| `isDeclared` | `(eventName)` | Whether the event is in the catalog |\n| `namespaceOf` | `(eventName)` | Segment before the first colon, or null |\n| `loadGraph` | `(manifest)` | Loads the generated static graph (documentation) |\n| `staticEmittersOf` | `(eventName)` | Code sites that emit this event |\n| `staticListenersOf` | `(eventName)` | Code sites that subscribe to this event |\n\n## Tracing: two complementary layers\nKnowing the graph \"who emits, who listens\" comes from two sources that cover each\nother's blind spots:\n\n| Question | Layer | Source |\n| --- | --- | --- |\n| Who can emit this event? (documentation) | Static | `slice types generate` scans `emit`/`subscribe` call sites |\n| Who actually emitted it this session? | Runtime | Live attribution recorded while the debugger is open |\n\n**Static graph (documentation).** `slice types generate` writes\n`src/slice-events.generated.js`: per event, the emitter and listener call sites\n(`file:line` plus the enclosing component). It is complete because it reads code, not\nexecution — an emit on a branch that never ran is still documented. Events emitted with\na computed name (`emit(\\`cart:${x}\\`)`) cannot be resolved statically and are listed as\ndynamic.\n\n**Runtime tracing (observational).** While the Events panel is open, every `emit()` is\nattributed to its source: the component when emitted through `slice.events.bind(this)`,\nor a best-effort `file:line` from the call stack for global emits. This is what *actually*\nfired, with counts — and anything that fires but is missing from the static graph is a\ndynamic emit worth a look.\n\n## Debugger panel\nEnable the Events UI and open it with the shortcut to inspect all of the above:\n\n```json title=\"sliceConfig.json\"\n{\n  \"events\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+e\" } }\n}\n```\n\n- **Registry** — the declared catalog grouped by namespace: payload shape, live listener\n  count, and the static emitters/listeners from the manifest. Drift badges flag\n  declared-but-idle and used-but-undeclared events.\n- **Subscribers** — live listeners per event plus the runtime emitters that fired.\n- **History** — reverse-chronological feed of every `emit()` with its origin and a\n  relative timestamp.\n\n## Best Practices\n:::tip\nAlways namespace events (`cart:add`, not `add`). The namespace groups the catalog, the\ndebugger, and the generated types.\n:::\n\n:::tip\nDeclare catalogs as plain object literals (or imported literals) and pass them to\n`register()`. The type generator resolves literals statically — a computed object won't\nbe typed.\n:::\n\n:::tip\nRegister all catalogs from one place (your `Providers`/composition root). One file is\nstandardization; many `register()` calls is modularization — both work with the same API.\n:::\n\n:::tip\nRe-run `slice types generate` after adding events or emit/subscribe sites so the types\nand the static graph stay in sync.\n:::\n\n## Gotchas\n:::warning\nValidation only activates after the first `register()`. Until then the EventManager runs\nin loose mode with no warnings — declaring the catalog is what opts you in.\n:::\n\n:::warning\nEvents emitted with a computed name (`emit(\\`user:${id}\\`)`) cannot be typed or documented\nstatically. Use literal names where you want the contract; the runtime tracer still shows\nthem under dynamic sites.\n:::\n\n## FAQ\n:::details title=\"Is the registry required?\"\nNo. It is fully opt-in. Without `register()` the EventManager works exactly as before.\n:::\n\n:::details title=\"Why warn instead of throw on an undeclared event?\"\nSafe by default: a missing declaration should never break a running app. Validation is a\ndev aid (a one-time warning plus a debugger badge), not a runtime gate.\n:::\n\n:::details title=\"Where do the static emitters/listeners come from?\"\nFrom `slice types generate`, which scans your `emit`/`subscribe` call sites and writes\n`src/slice-events.generated.js`. The Events panel loads it to show the documented graph\nalongside live runtime activity. See [EventManager](/Documentation/Structural/EventManager).\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.events.register({\n  'cart:add':     { description: 'Item added to cart', payload: { sku: 'string', qty: 'number' } },\n  'cart:cleared': { description: 'Cart emptied', payload: null },   // null => no payload\n});",
               language: "javascript"
            });
            if ("Flat keys (namespace:event)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Flat keys (namespace:event)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.events.register('user', {\n  login:  { payload: { id: 'number', name: 'string' } },\n  logout: { payload: null },\n}); // => declares 'user:login' and 'user:logout'",
               language: "javascript"
            });
            if ("Grouped by namespace — register(namespace, catalog)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Grouped by namespace — register(namespace, catalog)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export const cartEvents = {\n  'cart:add':     { payload: { sku: 'string', qty: 'number' } },\n  'cart:cleared': { payload: null },\n};",
               language: "javascript"
            });
            if ("src/events/cart.events.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "src/events/cart.events.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import { cartEvents } from '../events/cart.events.js';\nimport { userEvents } from '../events/user.events.js';\n\nslice.events.register(cartEvents).register(userEvents);",
               language: "javascript"
            });
            if ("Providers.init() — the composition root") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Providers.init() — the composition root";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice types generate",
               language: "bash"
            });
            if ("Generate types + the event graph manifest") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Generate types + the event graph manifest";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.events.emit('cart:add', { sku: 'A1', qty: 2 });   // ✅ ok\nslice.events.emit('cart:add', { sku: 'A1' });            // ❌ tsc error: qty is required\nslice.events.subscribe('user:login', (u) => u.name);     // u is { id: number; name: string }",
               language: "typescript"
            });
            if ("Typed at compile time") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Typed at compile time";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const lines = ["| Method | Signature | Notes |","| --- | --- | --- |","| `register` | `(catalog)` or `(namespace, catalog)` | Mergeable; turns on dev validation |","| `isDeclared` | `(eventName)` | Whether the event is in the catalog |","| `namespaceOf` | `(eventName)` | Segment before the first colon, or null |","| `loadGraph` | `(manifest)` | Loads the generated static graph (documentation) |","| `staticEmittersOf` | `(eventName)` | Code sites that emit this event |","| `staticListenersOf` | `(eventName)` | Code sites that subscribe to this event |"];
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const lines = ["| Question | Layer | Source |","| --- | --- | --- |","| Who can emit this event? (documentation) | Static | `slice types generate` scans `emit`/`subscribe` call sites |","| Who actually emitted it this session? | Runtime | Live attribution recorded while the debugger is open |"];
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
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"events\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+e\" } }\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const details = await slice.build('Details', { title: "Is the registry required?", text: "No. It is fully opt-in. Without `register()` the EventManager works exactly as before." });
            container.appendChild(details);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const details = await slice.build('Details', { title: "Why warn instead of throw on an undeclared event?", text: "Safe by default: a missing declaration should never break a running app. Validation is a\ndev aid (a one-time warning plus a debugger badge), not a runtime gate." });
            container.appendChild(details);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const details = await slice.build('Details', { title: "Where do the static emitters/listeners come from?", text: "From `slice types generate`, which scans your `emit`/`subscribe` call sites and writes\n`src/slice-events.generated.js`. The Events panel loads it to show the documented graph\nalongside live runtime activity. See [EventManager](/Documentation/Structural/EventManager)." });
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

customElements.define('slice-eventregistrydocumentation', EventRegistryDocumentation);
