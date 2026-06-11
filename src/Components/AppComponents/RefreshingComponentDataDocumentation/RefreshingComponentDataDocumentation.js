export default class RefreshingComponentDataDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/refreshing-component-data.md";
    this.markdownContent = "---\ntitle: Refreshing Component Data\nroute: /Documentation/Architecture/Refreshing-Component-Data\nnavLabel: Refreshing Data\nsection: Project Architecture\ngroup: Styles and Patterns\norder: 7\ndescription: How to update what a component shows after it's built — prop setters, update(), context, events, or destroy+recreate — and which to reach for.\ncomponent: RefreshingComponentDataDocumentation\ntags: [architecture, state, update, context, events]\n---\n\n# Refreshing Component Data\n\nThe data behind a component changed — how do you update what's on screen? Slice gives you several\nmechanisms, from the cheapest (set a prop) to the heaviest (destroy + recreate). **Reach for the\nlightest one that fits** — the heavier the mechanism, the more you throw away (instance state, focus,\nscroll, async cost).\n\n## Which one?\n\n| Situation | Reach for |\n| --- | --- |\n| You hold the instance and the data/props changed | **a prop setter** or an update method (§1) |\n| A **cached route** is revisited | **`update()`** (§2) |\n| State that **several components** share and react to | **Context** — `watch` / `setState` (§3) |\n| \"Something happened, refresh\" **across the app** | **Events** — `emit` / `subscribe` (§4) |\n| The component's **structure** fundamentally changed | **Destroy + recreate** — last resort (§5) |\n\n## 1. Set a prop or call a method (the default)\nIn Slice, props go through **setters** — so updating data is usually just *assigning a prop*. The setter\nre-renders; the instance (and its focus/scroll/internal state) is preserved.\n\n```javascript title=\"Same instance, new data\"\nconst table = await slice.build('Table', { columns, rows });\n\n// later — the rows changed:\ntable.rows = await fetchRows();   // the setter re-renders; no rebuild\n```\n\nComponents also expose **methods** for finer updates — same idea, just a call:\n\n```javascript\nselect.options = await fetchOptions();   // a setter\nform.setValue('email', user.email);      // a method\ntable.loading = true;                    // toggle a busy state, then set rows\n```\n\n> Design your own components so that **assigning a prop or calling a method drives the re-render** — that\n> is what makes this the default refresh path.\n\n## 2. `update()` — cached route revisits\n`MultiRoute` / `Route` **cache** instances. When you navigate away and back, Slice calls\n**`update()`**, not `init()` — so refresh route-level data there (and you can call it manually too).\n\n```javascript title=\"Refresh on revisit\"\nexport default class OrdersPage extends HTMLElement {\n  async init()   { await this.load(); }   // first visit\n  async update() { await this.load(); }   // cached revisit → refresh\n\n  async load() {\n    this.orders = await slice.getComponent('api').request('GET', null, '/orders');\n    this.render();\n  }\n}\n```\n\nSee [`update()`](/Documentation/LifeCycle-Methods/update). Keep it idempotent.\n\n## 3. Context — shared state many components react to\nWhen several components depend on the **same** state, put it in [`slice.context`](/Documentation/Structural/ContextManager).\nEach component `watch`es it and refreshes when it changes; anyone calls `setState` to change it.\n\n```javascript title=\"Watch shared state\"\nasync init() {\n  this.$count = this.querySelector('.cart-count');\n  slice.context.watch(\n    'cart',\n    this,\n    (count) => { this.$count.textContent = count; },\n    (state) => state.items.length        // selector: only refresh when the count changes\n  );\n}\n\n// anywhere a change happens:\nslice.context.setState('cart', (prev) => ({ ...prev, items: [...prev.items, item] }));\n```\n\nWatchers registered with `this` are **auto-cleaned** on destroy — don't unwatch them by hand.\n\n## 4. Events — react to \"something happened\"\nFor cross-cutting \"X happened, refresh\" signals, use [`slice.events`](/Documentation/Structural/EventManager).\nA component subscribes; some other part of the app emits.\n\n```javascript title=\"Refresh on an event\"\nasync init() {\n  this.events = slice.events.bind(this);\n  this.events.subscribe('orders:updated', () => this.refresh());\n}\n\nasync refresh() {\n  this.rows = await fetchRows();   // note: re-uses the setter from §1\n}\n\n// elsewhere, after a mutation:\nslice.events.emit('orders:updated');\n```\n\nSubscriptions made via `slice.events.bind(this)` are **auto-cleaned** on destroy.\n\n**Context vs Events:** ask *\"what is the current state?\"* → Context. Ask *\"did something happen?\"* →\nEvents. Prefer Context for state, and add an Event when cross-domain side effects must react.\n\n## 5. Destroy + recreate (last resort)\nOnly when the component's **structure** changed so fundamentally that reconfiguring it would be more code\nthan rebuilding. It is the heaviest option: you lose instance state, pay an async rebuild, and **must\nclean up** the old instance and its children first.\n\n```javascript title=\"Rebuild a region\"\nslice.controller.destroyByContainer(this.$slot);   // runs beforeDestroy on everything inside\nthis.$slot.innerHTML = '';\nconst fresh = await slice.build('BigWidget', { ...newConfig });\nthis.$slot.appendChild(fresh);\n```\n\nBefore reaching for this, check whether a setter/method (§1) can express the change instead — e.g. the\n`Table` reconfigures its pager by **setting props**, it never destroys and rebuilds it. And remember the\ncleanup rules: components built with `slice.build` are **not** auto-destroyed by a parent, and Services\nhave no DOM so they are never cascaded — see [Service Patterns](/Documentation/Architecture/Service-Patterns).\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Situation | Reach for |","| --- | --- |","| You hold the instance and the data/props changed | **a prop setter** or an update method (§1) |","| A **cached route** is revisited | **`update()`** (§2) |","| State that **several components** share and react to | **Context** — `watch` / `setState` (§3) |","| \"Something happened, refresh\" **across the app** | **Events** — `emit` / `subscribe` (§4) |","| The component's **structure** fundamentally changed | **Destroy + recreate** — last resort (§5) |"];
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
               value: "const table = await slice.build('Table', { columns, rows });\n\n// later — the rows changed:\ntable.rows = await fetchRows();   // the setter re-renders; no rebuild",
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
               value: "select.options = await fetchOptions();   // a setter\nform.setValue('email', user.email);      // a method\ntable.loading = true;                    // toggle a busy state, then set rows",
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
               value: "export default class OrdersPage extends HTMLElement {\n  async init()   { await this.load(); }   // first visit\n  async update() { await this.load(); }   // cached revisit → refresh\n\n  async load() {\n    this.orders = await slice.getComponent('api').request('GET', null, '/orders');\n    this.render();\n  }\n}",
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
               value: "async init() {\n  this.$count = this.querySelector('.cart-count');\n  slice.context.watch(\n    'cart',\n    this,\n    (count) => { this.$count.textContent = count; },\n    (state) => state.items.length        // selector: only refresh when the count changes\n  );\n}\n\n// anywhere a change happens:\nslice.context.setState('cart', (prev) => ({ ...prev, items: [...prev.items, item] }));",
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
               value: "async init() {\n  this.events = slice.events.bind(this);\n  this.events.subscribe('orders:updated', () => this.refresh());\n}\n\nasync refresh() {\n  this.rows = await fetchRows();   // note: re-uses the setter from §1\n}\n\n// elsewhere, after a mutation:\nslice.events.emit('orders:updated');",
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
               value: "slice.controller.destroyByContainer(this.$slot);   // runs beforeDestroy on everything inside\nthis.$slot.innerHTML = '';\nconst fresh = await slice.build('BigWidget', { ...newConfig });\nthis.$slot.appendChild(fresh);",
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
