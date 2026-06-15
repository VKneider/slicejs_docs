export default class DevToolsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/devtools.md";
    this.markdownContent = "---\r\ntitle: DevTools\r\nroute: /Documentation/DevTools\r\nnavLabel: DevTools\r\nsection: Getting Started\r\ngroup: Diagnostics\r\norder: 42\r\ndescription: The component inspector and the events and context panels, and how live editing works.\r\ncomponent: DevToolsDocumentation\r\ntags: [devtools, debugger, events, context, diagnostics]\r\n---\r\n\r\n# DevTools\r\n\r\n## Overview\r\nSlice ships three runtime panels for inspecting a live app — a **component inspector**, an\r\n**events** panel, and a **context** panel. They are built with Slice's own primitives (custom\r\nelements, the lifecycle, and setters), so they double as a reference for what the framework can do.\r\n\r\n## The component inspector\r\nEnable it in `sliceConfig.json`, then click a component (right-click by default) to open the panel:\r\n\r\n```json title=\"sliceConfig.json\"\r\n\"debugger\": { \"enabled\": true, \"click\": \"right\" }\r\n```\r\n\r\n- **Props tab** — every `static props` entry with its current value. Values are **editable**: change\r\n  one and the UI updates instantly.\r\n- **Info tab** — `sliceId`, class name, category, and connection status.\r\n\r\n### How live editing works\r\nThe inspector reads the component's `static props`, and when you edit a field it simply assigns the\r\nnew value back to the component:\r\n\r\n```javascript\r\ncomponent[propName] = newValue;\r\n```\r\n\r\nBecause Slice applies every prop through its **setter** (see Static Props), that single assignment\r\nfires the setter — which updates the DOM. There is no special data-binding layer: editing in the\r\ninspector is the exact same code path as a prop changing anywhere else in your app. This is why a\r\ncomponent with well-written setters is instantly inspectable and tweakable.\r\n\r\n## Events and context panels\r\nEnable them (and their keyboard shortcuts) in `sliceConfig.json`:\r\n\r\n```json title=\"sliceConfig.json\"\r\n\"events\":  { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+e\" } },\r\n\"context\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+c\" } }\r\n```\r\n\r\n- **Events** (`alt+shift+e`) — two tabs: **Subscribers** (every event with live subscriber details\r\n  and an emit counter ⚡) and **History** (reverse-chronological feed of all `emit()` calls with\r\n  relative timestamps). Use it for \"my listener isn't firing\", \"it fires twice\", or \"who emitted\r\n  what and when\".\r\n- **Context** (`alt+shift+c`) — every context, its key count, and a live JSON preview of its state.\r\n  Updates **in real time** on every `setState` / `patch` and auto-discovers newly created contexts.\r\n  Use it for \"my watcher isn't firing\" or \"persisted state didn't survive a refresh\".\r\n\r\n:::tip\r\nKeep these panels enabled in development and turn off the `ui` blocks for production.\r\n:::\r\n\r\n## Built with Slice — try it yourself\r\nThe inspector's \"edit a prop, see it update\" trick is small enough to build yourself. The\r\n`MiniInspector` component (in the visual library) does exactly that in ~80 lines:\r\n\r\n```javascript title=\"Live-edit a component's props\"\r\nconst card = await slice.build('Card', { sliceId: 'demo-card', title: 'Hello' });\r\ncontainer.appendChild(card);\r\n\r\nconst inspector = await slice.build('MiniInspector', { target: card, title: 'Card props' });\r\ncontainer.appendChild(inspector);\r\n// Edit a field in the inspector -> the card updates instantly via its setter.\r\n```\r\n\r\n`MiniInspector` reads `target.constructor.props`, builds an input per prop, and writes\r\n`target[prop] = value` on change. Read its source to see the pattern, then read the built-in\r\nDevTools (`Slice/Components/Structural/Debugger`, `.../EventManager/EventManagerDebugger`,\r\n`.../ContextManager/ContextManagerDebugger`) to see the full version.\r\n\r\n## Gotchas\r\n:::warning\r\nA prop only updates the UI if its **setter** does the DOM work. If editing a value in the inspector\r\nchanges nothing, the bug is in that prop's setter, not the inspector.\r\n:::\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "\"debugger\": { \"enabled\": true, \"click\": \"right\" }\r",
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
               value: "component[propName] = newValue;\r",
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
               value: "\"events\":  { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+e\" } },\r\n\"context\": { \"enabled\": true, \"ui\": { \"enabled\": true, \"shortcut\": \"alt+shift+c\" } }\r",
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
               value: "const card = await slice.build('Card', { sliceId: 'demo-card', title: 'Hello' });\r\ncontainer.appendChild(card);\r\n\r\nconst inspector = await slice.build('MiniInspector', { target: card, title: 'Card props' });\r\ncontainer.appendChild(inspector);\r\n// Edit a field in the inspector -> the card updates instantly via its setter.\r",
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
