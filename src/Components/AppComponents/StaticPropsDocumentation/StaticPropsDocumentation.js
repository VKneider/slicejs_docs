export default class StaticPropsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/static-props.md";
    this.markdownContent = "---\ntitle: Static Props\nroute: /Documentation/Static-Props\nnavLabel: Static Props\nsection: Components\ngroup: Component Model\norder: 30\ndescription: Define and validate component props in Slice.js.\ncomponent: StaticPropsDocumentation\ntags: [props, static, validation]\n---\n\n# Static Props\n\n## Overview\nStatic Props define a component's public API. They provide defaults, development-only validation,\nand consistent prop behavior across Slice.js. They also power the debugger by describing which\nprops are available and used.\n\n## Static Props Schema\n| Field | Type | Required | Notes |\n| --- | --- | --- | --- |\n| `type` | `string` | no | Informational only (debugger). |\n| `default` | `any` | no | Applied when prop is not provided. |\n| `required` | `boolean` | no | Logs error when missing in development. |\n| `allowedValues` | `array` | no | Strict dev-time whitelist for accepted values. |\n| `schema` | `object` | no | Nested object contract when `type: 'object'`. |\n| `items` | `object` | no | Nested item contract when `type: 'array'`. |\n\n## How Props Are Applied\nWhen a component is built:\n\n- Defaults are applied for missing props.\n- Unknown props produce warnings in development.\n- Missing required props produce errors in development.\n- Props are assigned to the instance (`component[prop]`) and tracked internally.\n\n```javascript title=\"Props are processed by the Controller\"\nexport default class Button extends HTMLElement {\n  static props = {\n    value: { type: 'string', default: 'Button' },\n    onClick: { type: 'function', default: null }\n  };\n\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n\n    // Props are now available\n    console.log(this.value);\n    console.log(this.onClick);\n  }\n}\n```\n\n## Defaults and Required Fields\n```javascript title=\"Defaults and required props\"\nstatic props = {\n  title: { type: 'string', default: 'Untitled', required: false },\n  id: { type: 'string', required: true }\n};\n```\n\n## Validation (Development Only)\nSlice warns about unknown props and errors on missing required props in development mode.\nIn production, validation is skipped for performance.\n\nWhen `allowedValues` is defined, Slice validates values using strict equality (`===`) in development.\n\n```javascript title=\"allowedValues example\"\nstatic props = {\n  variant: {\n    type: 'string',\n    default: 'primary',\n    allowedValues: ['primary', 'secondary', 'danger']\n  }\n};\n```\n\n## Nested Props Contract\nFor nested shapes, use this contract:\n\n- `schema` for object props (`type: 'object'`)\n- `items` for array props (`type: 'array'`)\n\n```javascript title=\"Nested object and array contract\"\nstatic props = {\n  options: {\n    type: 'object',\n    schema: {\n      theme: {\n        type: 'object',\n        schema: {\n          mode: { type: 'string', allowedValues: ['light', 'dark'] }\n        }\n      }\n    }\n  },\n  steps: {\n    type: 'array',\n    items: {\n      type: 'object',\n      schema: {\n        id: { type: 'string', required: true }\n      }\n    }\n  }\n};\n```\n\n## Type Generation (`npm run slice:types`)\nYou can generate declaration files from `static props` so editor IntelliSense and checks follow\nthe same contract.\n\n```bash title=\"Generate declarations\"\nnpm run slice:types\n```\n\nThen validate in JS projects with:\n\n```bash title=\"Validate generated types\"\nnpm exec slice typecheck\n```\n\nThe generated types include:\n\n- union types from homogeneous `allowedValues` (for example `'a'` or `'b'`, or `1` or `2`) — **but only when the array is written literally in the prop definition.** The generator reads the AST of your component and does not resolve variables, so `allowedValues: SIZE_VALUES` is not seen at all and the prop silently degrades to plain `string`. Write the list inline, and read it back from `this.constructor.props.<prop>` in the setter rather than keeping a second copy of it.\n- nested object/array types from `schema/items`\n- component prop map support for `slice.build(...)`\n\nThe same literal rule applies to the whole metadata: `type`, `allowedValues`, `schema`, `items` are read from the AST, so a constant (`type: TYPE_STRING`, `schema: SHARED_SCHEMA`, or `static props = SHARED`) is invisible and the prop falls back to `any`. `slice types generate` now warns when it finds one, and `slice build` / `slice doctor` report it as an advisory naming the property.\n\n## Usage Patterns\n```javascript title=\"Building with props\"\nconst card = await slice.build('Card', {\n  title: 'My Card',\n  text: 'Card content',\n  icon: { name: 'star', iconStyle: 'filled' }\n});\n```\n\n```javascript title=\"Props with arrays and objects\"\nconst grid = await slice.build('Grid', {\n  columns: 3,\n  rows: 2,\n  gap: '16px',\n  style: { border: '1px solid #ccc' }\n});\n```\n\n```javascript title=\"Function props\"\nconst button = await slice.build('Button', {\n  value: 'Save',\n  onClick: () => this.save()\n});\n```\n\n## Validation\nSlice validates your `static props` definitions in two places, so a malformed prop is caught before it ships:\n\n- **`slice doctor`** reports every issue (errors and style warnings).\n- **`slice build`** blocks the build on definition errors — an unknown `type`, a `schema` on a non-`object` prop, an `items` on a non-`array` prop, or `allowedValues` that don't match the `type`. Style issues (`type: \"any\"`, a `required` prop without a default) warn but don't block. See [CLI commands](/Documentation/CLI).\n\n## Best Practices\n:::tip\nDefine only public props in `static props` and use internal fields for private state.\n:::\n\nUse defaults to keep components predictable and reduce boilerplate.\n\n## Gotchas\n:::warning\nStatic Props validation runs only in development; validate critical data yourself.\n:::\n\n:::warning\n`id`, `sliceId`, and `singleton` are **reserved build directives**, not props. Never declare them in\n`static props` — `build` strips them before Static Props are applied, so such an entry is dead and its\nsetter never fires. See [Reserved build keys](/Documentation/The-build-method).\n:::\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"Components"},{"text":"Component Model"}]
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
               headers: ["Field","Type","Required","Notes"],
               rows: [[{"html":"<code>type</code>"},{"html":"<code>string</code>"},{"html":"no"},{"html":"Informational only (debugger)."}],[{"html":"<code>default</code>"},{"html":"<code>any</code>"},{"html":"no"},{"html":"Applied when prop is not provided."}],[{"html":"<code>required</code>"},{"html":"<code>boolean</code>"},{"html":"no"},{"html":"Logs error when missing in development."}],[{"html":"<code>allowedValues</code>"},{"html":"<code>array</code>"},{"html":"no"},{"html":"Strict dev-time whitelist for accepted values."}],[{"html":"<code>schema</code>"},{"html":"<code>object</code>"},{"html":"no"},{"html":"Nested object contract when <code>type: 'object'</code>."}],[{"html":"<code>items</code>"},{"html":"<code>object</code>"},{"html":"no"},{"html":"Nested item contract when <code>type: 'array'</code>."}]]
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
               value: "export default class Button extends HTMLElement {\n  static props = {\n    value: { type: 'string', default: 'Button' },\n    onClick: { type: 'function', default: null }\n  };\n\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n\n    // Props are now available\n    console.log(this.value);\n    console.log(this.onClick);\n  }\n}",
               language: "javascript"
            });
            if ("Props are processed by the Controller") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Props are processed by the Controller";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "static props = {\n  title: { type: 'string', default: 'Untitled', required: false },\n  id: { type: 'string', required: true }\n};",
               language: "javascript"
            });
            if ("Defaults and required props") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Defaults and required props";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "static props = {\n  variant: {\n    type: 'string',\n    default: 'primary',\n    allowedValues: ['primary', 'secondary', 'danger']\n  }\n};",
               language: "javascript"
            });
            if ("allowedValues example") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "allowedValues example";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "static props = {\n  options: {\n    type: 'object',\n    schema: {\n      theme: {\n        type: 'object',\n        schema: {\n          mode: { type: 'string', allowedValues: ['light', 'dark'] }\n        }\n      }\n    }\n  },\n  steps: {\n    type: 'array',\n    items: {\n      type: 'object',\n      schema: {\n        id: { type: 'string', required: true }\n      }\n    }\n  }\n};",
               language: "javascript"
            });
            if ("Nested object and array contract") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Nested object and array contract";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run slice:types",
               language: "bash"
            });
            if ("Generate declarations") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Generate declarations";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm exec slice typecheck",
               language: "bash"
            });
            if ("Validate generated types") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Validate generated types";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const card = await slice.build('Card', {\n  title: 'My Card',\n  text: 'Card content',\n  icon: { name: 'star', iconStyle: 'filled' }\n});",
               language: "javascript"
            });
            if ("Building with props") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Building with props";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const grid = await slice.build('Grid', {\n  columns: 3,\n  rows: 2,\n  gap: '16px',\n  style: { border: '1px solid #ccc' }\n});",
               language: "javascript"
            });
            if ("Props with arrays and objects") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Props with arrays and objects";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const button = await slice.build('Button', {\n  value: 'Save',\n  onClick: () => this.save()\n});",
               language: "javascript"
            });
            if ("Function props") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Function props";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Define only public props in <code>static props</code> and use internal fields for private state.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Static Props validation runs only in development; validate critical data yourself.</p>";
            const callout = await slice.build('Callout', {
               tone: "warning",
               variant: "soft",
               title: "Warning",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-14"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p><code>id</code>, <code>sliceId</code>, and <code>singleton</code> are <strong>reserved build directives</strong>, not props. Never declare them in <code>static props</code> — <code>build</code> strips them before Static Props are applied, so such an entry is dead and its setter never fires. See <a href=\"/Documentation/The-build-method\" data-route>Reserved build keys</a>.</p>";
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

customElements.define('slice-staticpropsdocumentation', StaticPropsDocumentation);
