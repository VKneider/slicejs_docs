export default class RefreshingComponentDataDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/refreshing-component-data.md";
    this.markdownContent = "---\r\ntitle: Refreshing Component Data\r\nroute: /Documentation/Architecture/Refreshing-Component-Data\r\nnavLabel: Refreshing Data\r\nsection: Project Architecture\r\ngroup: Styles and Patterns\r\norder: 7\r\ndescription: How to update what a component shows after it's built — prop setters, update(), context, events, or destroy+recreate — and which to reach for.\r\ncomponent: RefreshingComponentDataDocumentation\r\ntags: [architecture, state, update, context, events]\r\n---\r\n\r\n# Refreshing Component Data\r\n\r\nThe data behind a component changed — how do you update what's on screen? Slice gives you several\r\nmechanisms, from the cheapest (set a prop) to the heaviest (destroy + recreate). **Reach for the\r\nlightest one that fits** — the heavier the mechanism, the more you throw away (instance state, focus,\r\nscroll, async cost).\r\n\r\n## Which one?\r\n\r\n| Situation | Reach for |\r\n| --- | --- |\r\n| You hold the instance and the data/props changed | **a prop setter** or an update method (§1) |\r\n| A **cached route** is revisited | **`update()`** (§2) |\r\n| State that **several components** share and react to | **Context** — `watch` / `setState` (§3) |\r\n| \"Something happened, refresh\" **across the app** | **Events** — `emit` / `subscribe` (§4) |\r\n| The component's **structure** fundamentally changed | **Destroy + recreate** — last resort (§5) |\r\n\r\n## 1. Set a prop or call a method (the default)\r\nIn Slice, props go through **setters** — so updating data is usually just *assigning a prop*. The setter\r\nre-renders; the instance (and its focus/scroll/internal state) is preserved.\r\n\r\n```javascript title=\"Same instance, new data\"\r\nconst table = await slice.build('Table', { columns, rows });\r\n\r\n// later — the rows changed:\r\ntable.rows = await fetchRows();   // the setter re-renders; no rebuild\r\n```\r\n\r\nComponents also expose **methods** for finer updates — same idea, just a call:\r\n\r\n```javascript\r\nselect.options = await fetchOptions();   // a setter\r\nform.setValue('email', user.email);      // a method\r\ntable.loading = true;                    // toggle a busy state, then set rows\r\n```\r\n\r\n> Design your own components so that **assigning a prop or calling a method drives the re-render** — that\r\n> is what makes this the default refresh path.\r\n\r\n## 2. `update()` — cached route revisits\r\n`MultiRoute` / `Route` **cache** instances. When you navigate away and back, Slice calls\r\n**`update()`**, not `init()` — so refresh route-level data there (and you can call it manually too).\r\n\r\n```javascript title=\"Refresh on revisit\"\r\nexport default class OrdersPage extends HTMLElement {\r\n  async init()   { await this.load(); }   // first visit\r\n  async update() { await this.load(); }   // cached revisit → refresh\r\n\r\n  async load() {\r\n    this.orders = await slice.getComponent('api').request('GET', null, '/orders');\r\n    this.render();\r\n  }\r\n}\r\n```\r\n\r\nSee [`update()`](/Documentation/LifeCycle-Methods/update). Keep it idempotent.\r\n\r\n## 3. Context — shared state many components react to\r\nWhen several components depend on the **same** state, put it in [`slice.context`](/Documentation/Structural/ContextManager).\r\nEach component `watch`es it and refreshes when it changes; anyone calls `setState` to change it.\r\n\r\n```javascript title=\"Watch shared state\"\r\nasync init() {\r\n  this.$count = this.querySelector('.cart-count');\r\n  slice.context.watch(\r\n    'cart',\r\n    this,\r\n    (count) => { this.$count.textContent = count; },\r\n    (state) => state.items.length        // selector: only refresh when the count changes\r\n  );\r\n}\r\n\r\n// anywhere a change happens:\r\nslice.context.setState('cart', (prev) => ({ ...prev, items: [...prev.items, item] }));\r\n```\r\n\r\nWatchers registered with `this` are **auto-cleaned** on destroy — don't unwatch them by hand.\r\n\r\n## 4. Events — react to \"something happened\"\r\nFor cross-cutting \"X happened, refresh\" signals, use [`slice.events`](/Documentation/Structural/EventManager).\r\nA component subscribes; some other part of the app emits.\r\n\r\n```javascript title=\"Refresh on an event\"\r\nasync init() {\r\n  this.events = slice.events.bind(this);\r\n  this.events.subscribe('orders:updated', () => this.refresh());\r\n}\r\n\r\nasync refresh() {\r\n  this.rows = await fetchRows();   // note: re-uses the setter from §1\r\n}\r\n\r\n// elsewhere, after a mutation:\r\nslice.events.emit('orders:updated');\r\n```\r\n\r\nSubscriptions made via `slice.events.bind(this)` are **auto-cleaned** on destroy.\r\n\r\n**Context vs Events:** ask *\"what is the current state?\"* → Context. Ask *\"did something happen?\"* →\r\nEvents. Prefer Context for state, and add an Event when cross-domain side effects must react.\r\n\r\n## 5. Destroy + recreate (last resort)\r\nOnly when the component's **structure** changed so fundamentally that reconfiguring it would be more code\r\nthan rebuilding. It is the heaviest option: you lose instance state, pay an async rebuild, and **must\r\nclean up** the old instance and its children first.\r\n\r\n```javascript title=\"Rebuild a region\"\r\nslice.controller.destroyByContainer(this.$slot);   // runs beforeDestroy on everything inside\r\nthis.$slot.innerHTML = '';\r\nconst fresh = await slice.build('BigWidget', { ...newConfig });\r\nthis.$slot.appendChild(fresh);\r\n```\r\n\r\nBefore reaching for this, check whether a setter/method (§1) can express the change instead — e.g. the\r\n`Table` reconfigures its pager by **setting props**, it never destroys and rebuilds it. And remember the\r\ncleanup rules: components built with `slice.build` are **not** auto-destroyed by a parent, and Services\r\nhave no DOM so they are never cascaded — see [Service Patterns](/Documentation/Architecture/Service-Patterns).\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Situation | Reach for |\r","| --- | --- |\r","| You hold the instance and the data/props changed | **a prop setter** or an update method (§1) |\r","| A **cached route** is revisited | **`update()`** (§2) |\r","| State that **several components** share and react to | **Context** — `watch` / `setState` (§3) |\r","| \"Something happened, refresh\" **across the app** | **Events** — `emit` / `subscribe` (§4) |\r","| The component's **structure** fundamentally changed | **Destroy + recreate** — last resort (§5) |\r"];
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
               value: "const table = await slice.build('Table', { columns, rows });\r\n\r\n// later — the rows changed:\r\ntable.rows = await fetchRows();   // the setter re-renders; no rebuild\r",
               language: "javascript"
            });
            if ("Same instance, new data") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Same instance, new data";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "select.options = await fetchOptions();   // a setter\r\nform.setValue('email', user.email);      // a method\r\ntable.loading = true;                    // toggle a busy state, then set rows\r",
               language: "javascript"
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class OrdersPage extends HTMLElement {\r\n  async init()   { await this.load(); }   // first visit\r\n  async update() { await this.load(); }   // cached revisit → refresh\r\n\r\n  async load() {\r\n    this.orders = await slice.getComponent('api').request('GET', null, '/orders');\r\n    this.render();\r\n  }\r\n}\r",
               language: "javascript"
            });
            if ("Refresh on revisit") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Refresh on revisit";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "async init() {\r\n  this.$count = this.querySelector('.cart-count');\r\n  slice.context.watch(\r\n    'cart',\r\n    this,\r\n    (count) => { this.$count.textContent = count; },\r\n    (state) => state.items.length        // selector: only refresh when the count changes\r\n  );\r\n}\r\n\r\n// anywhere a change happens:\r\nslice.context.setState('cart', (prev) => ({ ...prev, items: [...prev.items, item] }));\r",
               language: "javascript"
            });
            if ("Watch shared state") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Watch shared state";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "async init() {\r\n  this.events = slice.events.bind(this);\r\n  this.events.subscribe('orders:updated', () => this.refresh());\r\n}\r\n\r\nasync refresh() {\r\n  this.rows = await fetchRows();   // note: re-uses the setter from §1\r\n}\r\n\r\n// elsewhere, after a mutation:\r\nslice.events.emit('orders:updated');\r",
               language: "javascript"
            });
            if ("Refresh on an event") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Refresh on an event";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice.controller.destroyByContainer(this.$slot);   // runs beforeDestroy on everything inside\r\nthis.$slot.innerHTML = '';\r\nconst fresh = await slice.build('BigWidget', { ...newConfig });\r\nthis.$slot.appendChild(fresh);\r",
               language: "javascript"
            });
            if ("Rebuild a region") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Rebuild a region";
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

customElements.define('slice-refreshingcomponentdatadocumentation', RefreshingComponentDataDocumentation);
