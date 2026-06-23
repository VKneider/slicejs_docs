export default class CommonGotchasDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/common-gotchas.md";
    this.markdownContent = "---\ntitle: Common Gotchas\nroute: /Documentation/Common-Gotchas\nnavLabel: Common Gotchas\nsection: Getting Started\ngroup: First Steps\norder: 28\ndescription: The traps Slice.js developers hit first — DOM timing, cleanup, routing, props — and how to avoid each one.\ncomponent: CommonGotchasDocumentation\ntags: [gotchas, troubleshooting, errors, cleanup]\n---\n\n# Common Gotchas\n\nThe handful of surprises that trip up most newcomers. Each one is the symptom, the cause, and the\nfix — skim it once and save yourself the debugging.\n\n## The DOM is empty until `attachTemplate`\n`querySelector` returns `null` if you call it before `slice.attachTemplate(this)`. The template is\ninjected by that call.\n\n```javascript title=\"✅ cache refs after attachTemplate\"\nconstructor(props) {\n  super();\n  slice.attachTemplate(this);                 // template is now in the DOM\n  this.$title = this.querySelector('.title'); // works\n  slice.controller.setComponentProps(this, props);\n}\n```\n\n## `slice.build()` returns `null` when the component isn't registered\nA missing entry in `components.js` (or a wrong `paths.components` path/type) makes `build` resolve\nto `null` — not throw. Always guard, and resync the registry.\n\n```javascript title=\"Guard the result\"\nconst node = await slice.build('UserCard', props);\nif (node) container.appendChild(node);   // null = not registered → run `npm run component:list`\n```\n\n## Clearing `innerHTML` does NOT destroy components\n`container.innerHTML = ''` removes the DOM but leaves the Slice instances registered — a leak, and\ntheir `beforeDestroy` never runs.\n\n:::warning\nDestroy through the framework so `beforeDestroy` runs and the registry is cleaned:\n`slice.controller.destroyComponent(sliceId)` for one, or\n`slice.controller.destroyByContainer(node)` for a subtree.\n:::\n\n## Components built with `slice.build` are NOT auto-destroyed\nA parent does not automatically destroy children you built with `slice.build`. Destroy them\nexplicitly (or via `destroyByContainer`) when you tear down or refresh a region.\n\n## Services have no DOM — clean them up yourself\nA Service is never cascaded by a parent's destroy (it has no DOM). Release its timers, listeners,\nand subscriptions in `beforeDestroy()`. See\n[Service Patterns](/Documentation/Architecture/Service-Patterns).\n\n## `beforeDestroy()` is not awaited\nIt runs synchronously right before destruction. Keep it synchronous or fire-and-forget — do not\nrely on an `await` inside it completing.\n\n## Setters can run before `init()`\n`setComponentProps` runs in the **constructor**, before `init()`. If you cache DOM refs in\n`init()`, a setter may fire before they exist — guard with `?.`.\n\n```javascript title=\"Guard refs cached in init()\"\nset name(v) { this._name = v; this.applyName?.(); }   // setter may run before init()\nasync init() { this.$name = this.querySelector('.name'); this.applyName(); }\napplyName() { if (this.$name) this.$name.textContent = this._name; }\n```\n\n## `update()` is not called on first build\nThe framework calls `update()` only for **refreshes** (cached-route revisits, or when you call it).\n`init()` does the first paint. See [LifeCycle Methods](/Documentation/LifeCycle-Methods).\n\n## Route params are strings, one per segment\nA `${param}` captures a **single** URL segment and arrives as a **string**. For multiple values use\nseveral segments or query params, and parse types yourself.\n\n```javascript title=\"Params are strings\"\n// route: /user/${id}\nconst id = Number(params.id);   // it's a string — convert if you need a number\n```\n\n## A refresh keeps the props you don't pass\nRefreshing a built component with `slice.setComponentProps(comp, { a })` updates `a` and **leaves\nthe rest as-is** — omitted props are not reset to their defaults. To reset one, pass its value\nexplicitly. (Defaults only apply at build.)\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "constructor(props) {\n  super();\n  slice.attachTemplate(this);                 // template is now in the DOM\n  this.$title = this.querySelector('.title'); // works\n  slice.controller.setComponentProps(this, props);\n}",
               language: "javascript"
            });
            if ("✅ cache refs after attachTemplate") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "✅ cache refs after attachTemplate";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const node = await slice.build('UserCard', props);\nif (node) container.appendChild(node);   // null = not registered → run `npm run component:list`",
               language: "javascript"
            });
            if ("Guard the result") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Guard the result";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "set name(v) { this._name = v; this.applyName?.(); }   // setter may run before init()\nasync init() { this.$name = this.querySelector('.name'); this.applyName(); }\napplyName() { if (this.$name) this.$name.textContent = this._name; }",
               language: "javascript"
            });
            if ("Guard refs cached in init()") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Guard refs cached in init()";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "// route: /user/${id}\nconst id = Number(params.id);   // it's a string — convert if you need a number",
               language: "javascript"
            });
            if ("Params are strings") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Params are strings";
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

customElements.define('slice-commongotchasdocumentation', CommonGotchasDocumentation);
