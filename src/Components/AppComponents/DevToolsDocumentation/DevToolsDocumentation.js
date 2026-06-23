export default class DevToolsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/devtools.md";
    this.markdownContent = "---\ntitle: DevTools\nroute: /Documentation/DevTools\nnavLabel: DevTools\nsection: Getting Started\ngroup: Diagnostics\norder: 42\ndescription: The component inspector and the events and context panels, and how live editing works.\ncomponent: DevToolsDocumentation\ntags: [devtools, debugger, events, context, diagnostics]\n---\n\n# DevTools\n\n## Overview\nSlice ships three runtime panels for inspecting a live app — a **component inspector**, an\n**events** panel, and a **context** panel. They are built with Slice's own primitives (custom\nelements, the lifecycle, and setters), so they double as a reference for what the framework can do.\n\n## The component inspector\nEnable it in `sliceConfig.json`, then click a component (right-click by default) to open the panel:\n\n```json title=\"sliceConfig.json\"\n\"debugger\": { \"enabled\": true, \"click\": \"right\" }\n```\n\n- **Props tab** — every `static props` entry with its current value. Values are **editable**: change\n  one and the UI updates instantly.\n- **Info tab** — `sliceId`, class name, category, and connection status.\n\n### How live editing works\nThe inspector reads the component's `static props`, and when you edit a field it simply assigns the\nnew value back to the component:\n\n```javascript\ncomponent[propName] = newValue;\n```\n\nBecause Slice applies every prop through its **setter** (see Static Props), that single assignment\nfires the setter — which updates the DOM. There is no special data-binding layer: editing in the\ninspector is the exact same code path as a prop changing anywhere else in your app. This is why a\ncomponent with well-written setters is instantly inspectable and tweakable.\n\n## Events and context panels\nEnable them (and their keyboard shortcuts) in `sliceConfig.json`:\n\n```json title=\"sliceConfig.json\"\n\"events\":  { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+e\" } },\n\"context\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+c\" } }\n```\n\n- **Events** (`alt+shift+e`) — three tabs: **Subscribers** (every event with live subscriber details,\n  an emit counter ⚡, and the emitters that fired it), **Registry** (the declared catalog grouped by\n  namespace with payload shapes and the static emit/listen graph — see\n  [Event Registry](/Documentation/Structural/EventRegistry)), and **History** (reverse-chronological\n  feed of all `emit()` calls with their origin and relative timestamps). Use it for \"my listener isn't\n  firing\", \"it fires twice\", or \"who emitted what and when\".\n- **Context** (`alt+shift+c`) — every context, its key count, and a live JSON preview of its state.\n  Updates **in real time** on every `setState` / `patch` and auto-discovers newly created contexts.\n  Use it for \"my watcher isn't firing\" or \"persisted state didn't survive a refresh\".\n\n:::tip\nKeep these panels enabled in development and turn off the `ui` blocks for production.\n:::\n\n## Leak Inspector\nA fourth dev-only panel surfaces components left **registered but detached from the DOM** — the\nsilent leak from clearing `slice.build`'d children without `destroyComponent`. Enable it under\n`debugger` and open it with its shortcut:\n\n```json title=\"sliceConfig.json\"\n\"debugger\": { \"leakInspector\": { \"enabled\": true, \"shortcut\": \"alt+shift+k\" } }\n```\n\nIt lists each orphan with its retain chain and a per-row destroy probe, and flags a `growing ▲`\ntrend when `activeComponents` accumulates across navigations. Cached `Route`/`MultiRoute` views are\nexcluded. Full details in [Leak Inspector](/Documentation/LeakInspector).\n\n## Built with Slice — try it yourself\nThe inspector's \"edit a prop, see it update\" trick is small enough to build yourself. The\n`MiniInspector` component (in the visual library) does exactly that in ~80 lines:\n\n```javascript title=\"Live-edit a component's props\"\nconst card = await slice.build('Card', { sliceId: 'demo-card', title: 'Hello' });\ncontainer.appendChild(card);\n\nconst inspector = await slice.build('MiniInspector', { target: card, title: 'Card props' });\ncontainer.appendChild(inspector);\n// Edit a field in the inspector -> the card updates instantly via its setter.\n```\n\n`MiniInspector` reads `target.constructor.props`, builds an input per prop, and writes\n`target[prop] = value` on change. Read its source to see the pattern, then read the built-in\nDevTools (`Slice/Components/Structural/Debugger`, `.../EventManager/EventManagerDebugger`,\n`.../ContextManager/ContextManagerDebugger`) to see the full version.\n\n## Gotchas\n:::warning\nA prop only updates the UI if its **setter** does the DOM work. If editing a value in the inspector\nchanges nothing, the bug is in that prop's setter, not the inspector.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "\"debugger\": { \"enabled\": true, \"click\": \"right\" }",
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
               value: "component[propName] = newValue;",
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "\"events\":  { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+e\" } },\n\"context\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+c\" } }",
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "\"debugger\": { \"leakInspector\": { \"enabled\": true, \"shortcut\": \"alt+shift+k\" } }",
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
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const card = await slice.build('Card', { sliceId: 'demo-card', title: 'Hello' });\ncontainer.appendChild(card);\n\nconst inspector = await slice.build('MiniInspector', { target: card, title: 'Card props' });\ncontainer.appendChild(inspector);\n// Edit a field in the inspector -> the card updates instantly via its setter.",
               language: "javascript"
            });
            if ("Live-edit a component's props") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Live-edit a component's props";
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

customElements.define('slice-devtoolsdocumentation', DevToolsDocumentation);
