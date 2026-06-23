export default class ComponentAnatomy extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/component-anatomy.md";
    this.markdownContent = "---\ntitle: Component Anatomy\nroute: /Documentation/Component-Anatomy\nnavLabel: Component Anatomy\nsection: Getting Started\ngroup: Components\norder: 29\ndescription: How to author a Slice component, generate it with the CLI, and register it.\ncomponent: ComponentAnatomy\ntags: [components, cli, anatomy, props]\n---\n\n# Component Anatomy\n\n## Overview\nA Slice component is a small folder. A **Visual** component (with UI) has three files; a\n**Service** component (logic only) has one. This page shows how to generate a component with the\nCLI, what each file is for, and how the constructor, props, and registration work.\n\n## Generate components with the CLI\nDo not create component files by hand — let the CLI scaffold them and register them for you.\nPass the **name** and **`--category`** to run with no prompts:\n\n```bash title=\"Non-interactive (recommended for scripts and agents)\"\nnpm run component:create -- UserCard --category AppComponents\nnpm run component:create -- AuthService -c Service\n```\n\nOmit them to be prompted instead (only the missing pieces are asked):\n\n```bash title=\"Interactive\"\nnpm run component:create                  # prompts for name + category\nnpm run component:create -- UserCard      # prompts only for category\n```\n\nEither way, the CLI:\n- creates `src/Components/<Category>/<Name>/` with the right files, and\n- adds the component to `src/Components/components.js` so it is loadable immediately.\n\nThe category must exist in `paths.components` (see below). Through the npm script, separate the\nargs with `--`: `npm run component:create -- UserCard --category Visual`.\n\n```javascript title=\"Generated Visual component (skeleton)\"\nexport default class MyButton extends HTMLElement {\n  static props = {\n    // Define your public props here, e.g.\n    // value: { type: 'string', default: 'Button', required: false }\n  };\n\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  init() {\n    // One-time async setup (optional)\n  }\n\n  update() {\n    // Refresh when reused by routing (optional)\n  }\n}\n\ncustomElements.define('slice-mybutton', MyButton);\n```\n\n:::tip\nIf you ever add or move component folders by hand, run `npm run component:list` to regenerate\n`components.js`.\n:::\n\n## The three files of a Visual component\n```text title=\"src/Components/AppComponents/UserCard/\"\nUserCard.js     # the class: props, constructor, lifecycle, setters\nUserCard.html   # the template (inner markup only)\nUserCard.css    # the styles\n```\n\n- **`.html`** contains only the **inner** markup — no `<template>` wrapper and no root element\n  matching the tag. Slice injects it as **light-DOM children** of the custom element. Slice does\n  not use Shadow DOM; do not call `attachShadow()`.\n- **`.css`** should reference theme variables (`var(--...)`) instead of hardcoded colors, so theme\n  switching keeps working. Use BEM-style class names (`block__element--modifier`) to avoid clashes.\n\n## The constructor\nEvery Visual component's constructor does three things, in order:\n\n```javascript title=\"UserCard.js\"\nexport default class UserCard extends HTMLElement {\n  static props = {\n    name:     { type: 'string',   default: '' },\n    onSelect: { type: 'function', default: null }\n  };\n\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);                        // 1. inject the .html\n    this.$name = this.querySelector('.user-card__name'); // 2. cache refs (works now)\n    this.$root = this.querySelector('.user-card');\n    this.$root.addEventListener('click', () => this._onSelect?.());\n    slice.controller.setComponentProps(this, props);   // 3. apply props (fires setters) — LAST\n  }\n\n  async init() {\n    // async-only work: fetch, build children with await slice.build(...)\n  }\n\n  set name(value) { this._name = value || ''; this.$name.textContent = this._name; }\n  set onSelect(fn) { this._onSelect = typeof fn === 'function' ? fn : null; }\n}\n\ncustomElements.define('slice-user-card', UserCard);\n```\n\nKey rules:\n- The DOM exists **only after** `slice.attachTemplate(this)`. Before it, `querySelector` returns\n  `null`; after it, queries work in the constructor.\n- Call `slice.controller.setComponentProps(this, props)` **last**.\n\n### Where to cache DOM references\nTwo valid patterns:\n- **In the constructor**, after `attachTemplate` (shown above, as the official components do).\n  Setters can update the DOM directly with no extra guards.\n- **In `init()`** instead. Because `setComponentProps` runs in the constructor (before `init()`),\n  setters fire before those references exist — so guard their DOM access with `?.`:\n\n```javascript title=\"Caching refs in init()\"\nconstructor(props) {\n  super();\n  slice.attachTemplate(this);\n  slice.controller.setComponentProps(this, props);\n}\nasync init() {\n  this.$name = this.querySelector('.user-card__name');\n  this.applyName();\n}\nset name(v) { this._name = v || ''; this.applyName?.(); }   // ?. — setter may run before init\napplyName() { if (this.$name) this.$name.textContent = this._name; }\n```\n\n## static props and setters\n`static props` is the component's public contract. Each entry has a `type` and an optional\n`default` or `required: true`.\n\n```javascript title=\"static props\"\nstatic props = {\n  value:    { type: 'string',   default: 'Click me' },\n  disabled: { type: 'boolean',  default: false },\n  items:    { type: 'array',    default: [] },\n  onClick:  { type: 'function', default: null },\n  userId:   { type: 'string',   required: true }   // no default → required\n};\n```\n\nTypes: `string`, `number`, `boolean`, `array`, `object`, `function`. At **build**,\n`setComponentProps` applies defaults, validates in development, and assigns each prop **through its\nsetter** (`this[prop] = value`); defaults pass through setters too. On an already-built component it\n**refreshes** instead (see *Refreshing a built component* below). Because of this, **side effects\nbelong in setters** — assigning a prop is all the rest of your code needs to do, and the Debugger\ncan change props live through the same path. Keep internal state (cached data, timers) on `this`,\nnot in `static props`.\n\n## Refreshing a built component\nAfter a component is built, refresh it by **assigning a prop** (its setter runs) or, to apply\nseveral at once, with `slice.setComponentProps(component, props)`. It is the **same** function the\nconstructor uses — it detects build vs refresh automatically:\n\n| Context | What it does |\n| --- | --- |\n| Constructor (not yet registered) | Applies `static props` defaults, validates `required`, fires every setter. |\n| Built component (refresh) | Assigns only the props you pass — **no defaults, no `required` check** — and respects setter diff-guards, so unchanged values don't re-touch the DOM. |\n\n```javascript title=\"Refresh in place\"\nconst card = slice.getComponent('user-1');\ncard.name = 'Ada';                                            // one prop: the setter runs\nslice.setComponentProps(card, { name: 'Ada', role: 'Admin' }); // several at once, omitted props kept\n```\n\nThe key property: omitting a prop on refresh **leaves it as-is** — it is not reset to its default.\nThat is what makes refreshing surviving instances safe.\n\n:::tip\nCheck whether an instance is still the live registered one (not destroyed or replaced by a rebuild)\nwith `slice.isComponentAlive(component)`.\n:::\n\n## customElements.define\nRegister the custom element once at the bottom of the file:\n\n```javascript\ncustomElements.define('slice-user-card', UserCard);\n```\n\nThe tag must contain a hyphen. You rarely write the tag in HTML — `await slice.build('UserCard',\nprops)` instantiates it for you.\n\n## Component categories and registration\nTwo things make a component loadable:\n\n1. **`components.js`** maps each component name to a **category**:\n   ```javascript title=\"src/Components/components.js (auto-generated)\"\n   const components = {\n     \"UserCard\": \"AppComponents\",\n     \"Button\":   \"Visual\",\n     \"AuthService\": \"Service\"\n   };\n   export default components;\n   ```\n2. **`sliceConfig.json` → `paths.components`** defines each category's folder (`path`) and how to\n   load it (`type`: `Visual` loads `.js`+`.html`+`.css`; `Service` loads only `.js`). See\n   sliceConfig.json for the full explanation.\n\nWhen you call `slice.build('UserCard')`, Slice reads the category from `components.js`, finds the\nmatching `paths.components` entry, and loads the files from `<path>/UserCard/`. `slice component\ncreate` keeps both in sync; if a component is missing from `components.js`, `slice.build()` returns\n`null`.\n\n## Service components\nA Service is a plain class — no `HTMLElement`, no `static props`, no lifecycle, no\n`customElements.define`. Put it in a `Service`-type category and build it the same way:\n\n```javascript title=\"AuthService.js\"\nexport default class AuthService {\n  constructor(props = {}) { this.token = null; }\n  async login(email, password) {\n    const res = await fetch('/api/login', { method: 'POST', /* ... */ });\n    if (!res.ok) { slice.logger.error('AuthService', 'Login failed'); return false; }\n    this.token = (await res.json()).token;\n    return true;\n  }\n}\n```\n\n```javascript title=\"Build and reuse a service\"\nconst auth = await slice.build('AuthService', { sliceId: 'AuthService' });\n// later, anywhere:\nconst same = slice.controller.getComponent('AuthService');\n```\n\n## Best Practices\n:::tip\nGenerate components with `npm run component:create` so files and `components.js` stay correct.\n:::\n\n:::tip\nPut DOM side effects in setters; reserve `init()` for async setup and `update()` for refreshes.\n:::\n\n## Gotchas\n:::warning\nThe DOM is empty until `slice.attachTemplate(this)` runs. Querying before it returns `null`.\n:::\n\n:::warning\nA component missing from `components.js`, or a wrong `paths.components` `path`/`type`, makes\n`slice.build()` return `null`. Run `npm run component:list` to resync.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run component:create -- UserCard --category AppComponents\nnpm run component:create -- AuthService -c Service",
               language: "bash"
            });
            if ("Non-interactive (recommended for scripts and agents)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Non-interactive (recommended for scripts and agents)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npm run component:create                  # prompts for name + category\nnpm run component:create -- UserCard      # prompts only for category",
               language: "bash"
            });
            if ("Interactive") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Interactive";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class MyButton extends HTMLElement {\n  static props = {\n    // Define your public props here, e.g.\n    // value: { type: 'string', default: 'Button', required: false }\n  };\n\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n  }\n\n  init() {\n    // One-time async setup (optional)\n  }\n\n  update() {\n    // Refresh when reused by routing (optional)\n  }\n}\n\ncustomElements.define('slice-mybutton', MyButton);",
               language: "javascript"
            });
            if ("Generated Visual component (skeleton)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Generated Visual component (skeleton)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "UserCard.js     # the class: props, constructor, lifecycle, setters\nUserCard.html   # the template (inner markup only)\nUserCard.css    # the styles",
               language: "text"
            });
            if ("src/Components/AppComponents/UserCard/") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "src/Components/AppComponents/UserCard/";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class UserCard extends HTMLElement {\n  static props = {\n    name:     { type: 'string',   default: '' },\n    onSelect: { type: 'function', default: null }\n  };\n\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);                        // 1. inject the .html\n    this.$name = this.querySelector('.user-card__name'); // 2. cache refs (works now)\n    this.$root = this.querySelector('.user-card');\n    this.$root.addEventListener('click', () => this._onSelect?.());\n    slice.controller.setComponentProps(this, props);   // 3. apply props (fires setters) — LAST\n  }\n\n  async init() {\n    // async-only work: fetch, build children with await slice.build(...)\n  }\n\n  set name(value) { this._name = value || ''; this.$name.textContent = this._name; }\n  set onSelect(fn) { this._onSelect = typeof fn === 'function' ? fn : null; }\n}\n\ncustomElements.define('slice-user-card', UserCard);",
               language: "javascript"
            });
            if ("UserCard.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "UserCard.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "constructor(props) {\n  super();\n  slice.attachTemplate(this);\n  slice.controller.setComponentProps(this, props);\n}\nasync init() {\n  this.$name = this.querySelector('.user-card__name');\n  this.applyName();\n}\nset name(v) { this._name = v || ''; this.applyName?.(); }   // ?. — setter may run before init\napplyName() { if (this.$name) this.$name.textContent = this._name; }",
               language: "javascript"
            });
            if ("Caching refs in init()") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Caching refs in init()";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "static props = {\n  value:    { type: 'string',   default: 'Click me' },\n  disabled: { type: 'boolean',  default: false },\n  items:    { type: 'array',    default: [] },\n  onClick:  { type: 'function', default: null },\n  userId:   { type: 'string',   required: true }   // no default → required\n};",
               language: "javascript"
            });
            if ("static props") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "static props";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const lines = ["| Context | What it does |","| --- | --- |","| Constructor (not yet registered) | Applies `static props` defaults, validates `required`, fires every setter. |","| Built component (refresh) | Assigns only the props you pass — **no defaults, no `required` check** — and respects setter diff-guards, so unchanged values don't re-touch the DOM. |"];
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
               value: "const card = slice.getComponent('user-1');\ncard.name = 'Ada';                                            // one prop: the setter runs\nslice.setComponentProps(card, { name: 'Ada', role: 'Admin' }); // several at once, omitted props kept",
               language: "javascript"
            });
            if ("Refresh in place") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Refresh in place";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "customElements.define('slice-user-card', UserCard);",
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
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class AuthService {\n  constructor(props = {}) { this.token = null; }\n  async login(email, password) {\n    const res = await fetch('/api/login', { method: 'POST', /* ... */ });\n    if (!res.ok) { slice.logger.error('AuthService', 'Login failed'); return false; }\n    this.token = (await res.json()).token;\n    return true;\n  }\n}",
               language: "javascript"
            });
            if ("AuthService.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "AuthService.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const auth = await slice.build('AuthService', { sliceId: 'AuthService' });\n// later, anywhere:\nconst same = slice.controller.getComponent('AuthService');",
               language: "javascript"
            });
            if ("Build and reuse a service") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Build and reuse a service";
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

customElements.define('slice-componentanatomy', ComponentAnatomy);
