export default class ContextVsEventsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/context-vs-events.md";
    this.markdownContent = "---\ntitle: Context vs Events\nroute: /Documentation/Structural/Context-vs-Events\nnavLabel: Context vs Events\nsection: State & Routing\ngroup: ''\norder: 60\ndescription: When to reach for ContextManager and when for EventManager — the one decision that keeps shared state clean.\ncomponent: ContextVsEventsDocumentation\ntags: [context, events, state, architecture]\n---\n\n# Context vs Events\n\nBoth let components react to things happening elsewhere — but they answer different questions. Pick\nby the question you're asking:\n\n- **Context** → *\"What is the current state?\"* Shared, retained, readable at any time.\n- **Events** → *\"Did something just happen?\"* A one-shot signal, with no retained value.\n\n## Which one?\n| You need… | Reach for | Why |\n| --- | --- | --- |\n| A value many components read and react to | **Context** | It holds state; watchers re-run on change, and selectors narrow what triggers them. |\n| To persist state across reloads | **Context** | Contexts can persist; events are ephemeral. |\n| To announce \"X happened\" without holding a value | **Events** | Fire-and-forget; subscribers decide what to do. |\n| To decouple a producer from unknown consumers | **Events** | The emitter doesn't know who listens. |\n| A side effect in another domain when something changes | **Events** | Emit after the state change so the other domain reacts. |\n\n## Context — the current state\nA value several components depend on. Each `watch`es it (auto-cleaned on destroy); anyone calls\n`setState`. See [ContextManager](/Documentation/Structural/ContextManager).\n\n```javascript title=\"Shared state with a selector\"\nasync init() {\n  this.$count = this.querySelector('.cart-count');\n  slice.context.watch(\n    'cart',\n    this,\n    (count) => { this.$count.textContent = count; },\n    (state) => state.items.length            // selector: only re-run when the count changes\n  );\n}\n\n// anywhere a change happens:\nslice.context.setState('cart', (prev) => ({ ...prev, items: [...prev.items, item] }));\n```\n\n## Events — something happened\nA signal with no retained value. A component subscribes; another part of the app emits. See\n[EventManager](/Documentation/Structural/EventManager).\n\n```javascript title=\"React to a signal\"\nasync init() {\n  this.events = slice.events.bind(this);     // bound API → auto-cleaned on destroy\n  this.events.subscribe('orders:updated', () => this.refresh());\n}\n\n// elsewhere, after a mutation:\nslice.events.emit('orders:updated');\n```\n\n## They compose\nUse Context for the state, and add an Event when a **different domain** must react to a change.\n\n```javascript title=\"State in Context, cross-domain signal via Events\"\nslice.context.setState('orders', (prev) => ({ ...prev, list: fresh }));\nslice.events.emit('orders:updated');   // let unrelated features react too\n```\n\n:::tip\nDefault to **Context** for shared state. Add an **Event** only when a producer must notify\nconsumers it doesn't know about. For refreshing one component you hold, you often need neither — see\n[Refreshing Component Data](/Documentation/Architecture/Refreshing-Component-Data).\n:::\n\n:::warning\nDon't model state as a stream of events you replay to rebuild it — that's what Context is for. Use\nevents for *moments*, not for *state*.\n:::\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"State & Routing"}]
            });
            if (breadcrumbs) {
               container.appendChild(breadcrumbs);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["You need…","Reach for","Why"],
               rows: [[{"html":"A value many components read and react to"},{"html":"<strong>Context</strong>"},{"html":"It holds state; watchers re-run on change, and selectors narrow what triggers them."}],[{"html":"To persist state across reloads"},{"html":"<strong>Context</strong>"},{"html":"Contexts can persist; events are ephemeral."}],[{"html":"To announce \"X happened\" without holding a value"},{"html":"<strong>Events</strong>"},{"html":"Fire-and-forget; subscribers decide what to do."}],[{"html":"To decouple a producer from unknown consumers"},{"html":"<strong>Events</strong>"},{"html":"The emitter doesn't know who listens."}],[{"html":"A side effect in another domain when something changes"},{"html":"<strong>Events</strong>"},{"html":"Emit after the state change so the other domain reacts."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
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
         const container = this.querySelector('[data-block-id="doc-block-5"]');
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
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Default to <strong>Context</strong> for shared state. Add an <strong>Event</strong> only when a producer must notify consumers it doesn't know about. For refreshing one component you hold, you often need neither — see <a href=\"/Documentation/Architecture/Refreshing-Component-Data\" data-route>Refreshing Component Data</a>.</p>";
            const callout = await slice.build('Callout', {
               tone: "success",
               variant: "soft",
               title: "Tip",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Don't model state as a stream of events you replay to rebuild it — that's what Context is for. Use events for <em>moments</em>, not for <em>state</em>.</p>";
            const callout = await slice.build('Callout', {
               tone: "warning",
               variant: "soft",
               title: "Warning",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
         }
      }
  }

  async update() {
    // Refresh dynamic content here if needed
  }

  beforeDestroy() {
    if (this._contentClick) {
      this.removeEventListener('click', this._contentClick);
      this._contentClick = null;
    }
  }

  // Internal markdown links are plain anchors with data-route. One delegated
  // handler keeps them inside the SPA, including "/page#section" links, without
  // building a component for every link on the page.
  setupRouterLinks() {
    this._contentClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest?.('a[data-route]');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('#')) {
        event.preventDefault();
        this.scrollToHash(href.slice(1));
        return;
      }
      if (!href.startsWith('/') || href.startsWith('//')) return;

      event.preventDefault();
      const hashIndex = href.indexOf('#');
      const path = hashIndex === -1 ? href : href.slice(0, hashIndex);
      const hash = hashIndex === -1 ? '' : href.slice(hashIndex + 1);
      Promise.resolve(slice.router.navigate(path)).then(() => {
        if (hash) requestAnimationFrame(() => this.scrollToHash(hash));
      });
    };
    this.addEventListener('click', this._contentClick);
  }

  scrollToHash(hash) {
    let id = hash;
    try {
      id = decodeURIComponent(hash);
    } catch {
      id = hash;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
