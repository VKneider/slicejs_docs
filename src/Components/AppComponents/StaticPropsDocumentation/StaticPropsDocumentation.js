export default class StaticPropsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/static-props.md";
    this.markdownContent = "---\r\ntitle: Static Props\r\nroute: /Documentation/Static-Props\r\nnavLabel: Static Props\r\nsection: Getting Started\r\ngroup: Components\r\norder: 30\r\ndescription: Define and validate component props in Slice.js.\r\ncomponent: StaticPropsDocumentation\r\ntags: [props, static, validation]\r\n---\r\n\r\n# Static Props\r\n\r\n## Overview\r\nStatic Props define a component's public API. They provide defaults, development-only validation,\r\nand consistent prop behavior across Slice.js. They also power the debugger by describing which\r\nprops are available and used.\r\n\r\n## Static Props Schema\n| Field | Type | Required | Notes |\n| --- | --- | --- | --- |\n| `type` | `string` | no | Informational only (debugger). |\n| `default` | `any` | no | Applied when prop is not provided. |\n| `required` | `boolean` | no | Logs error when missing in development. |\n| `allowedValues` | `array` | no | Strict dev-time whitelist for accepted values. |\n| `schema` | `object` | no | Nested object contract when `type: 'object'`. |\n| `items` | `object` | no | Nested item contract when `type: 'array'`. |\n\r\n## How Props Are Applied\r\nWhen a component is built:\r\n\r\n- Defaults are applied for missing props.\r\n- Unknown props produce warnings in development.\r\n- Missing required props produce errors in development.\r\n- Props are assigned to the instance (`component[prop]`) and tracked internally.\r\n\r\n```javascript title=\"Props are processed by the Controller\"\r\nexport default class Button extends HTMLElement {\r\n  static props = {\r\n    value: { type: 'string', default: 'Button' },\r\n    onClickCallback: { type: 'function', default: null }\r\n  };\r\n\r\n  constructor(props) {\r\n    super();\r\n    slice.attachTemplate(this);\r\n    slice.controller.setComponentProps(this, props);\r\n\r\n    // Props are now available\r\n    console.log(this.value);\r\n    console.log(this.onClickCallback);\r\n  }\r\n}\r\n```\r\n\r\n## Defaults and Required Fields\r\n```javascript title=\"Defaults and required props\"\r\nstatic props = {\r\n  title: { type: 'string', default: 'Untitled', required: false },\r\n  id: { type: 'string', required: true }\r\n};\r\n```\r\n\r\n## Validation (Development Only)\nSlice warns about unknown props and errors on missing required props in development mode.\nIn production, validation is skipped for performance.\n\nWhen `allowedValues` is defined, Slice validates values using strict equality (`===`) in development.\n\n```javascript title=\"allowedValues example\"\nstatic props = {\n  variant: {\n    type: 'string',\n    default: 'primary',\n    allowedValues: ['primary', 'secondary', 'danger']\n  }\n};\n```\n\n## Nested Props Contract\nFor nested shapes, use this contract:\n\n- `schema` for object props (`type: 'object'`)\n- `items` for array props (`type: 'array'`)\n\n```javascript title=\"Nested object and array contract\"\nstatic props = {\n  options: {\n    type: 'object',\n    schema: {\n      theme: {\n        type: 'object',\n        schema: {\n          mode: { type: 'string', allowedValues: ['light', 'dark'] }\n        }\n      }\n    }\n  },\n  steps: {\n    type: 'array',\n    items: {\n      type: 'object',\n      schema: {\n        id: { type: 'string', required: true }\n      }\n    }\n  }\n};\n```\n\n## Type Generation (`slice types generate`)\nYou can generate declaration files from `static props` so editor IntelliSense and checks follow\nthe same contract.\n\n```bash title=\"Generate declarations\"\nslice types generate\n```\n\nThen validate in JS projects with:\n\n```bash title=\"Validate generated types\"\nnpx -p typescript tsc --noEmit -p jsconfig.json\n```\n\nThe generated types include:\n\n- union types from homogeneous `allowedValues` (`'a' | 'b'`, `1 | 2`)\n- nested object/array types from `schema/items`\n- component prop map support for `slice.build(...)`\n\r\n## Usage Patterns\r\n```javascript title=\"Building with props\"\r\nconst card = await slice.build('Card', {\r\n  title: 'My Card',\r\n  text: 'Card content',\r\n  icon: { name: 'star', iconStyle: 'filled' }\r\n});\r\n```\r\n\r\n```javascript title=\"Props with arrays and objects\"\r\nconst grid = await slice.build('Grid', {\r\n  columns: 3,\r\n  rows: 2,\r\n  gap: '16px',\r\n  style: { border: '1px solid #ccc' }\r\n});\r\n```\r\n\r\n```javascript title=\"Function props\"\r\nconst button = await slice.build('Button', {\r\n  value: 'Save',\r\n  onClickCallback: () => this.save()\r\n});\r\n```\r\n\r\n## Best Practices\r\n:::tip\r\nDefine only public props in `static props` and use internal fields for private state.\r\n:::\r\n\r\n:::tip\r\nUse defaults to keep components predictable and reduce boilerplate.\r\n:::\r\n\r\n## Gotchas\r\n:::warning\r\nStatic Props validation runs only in development; validate critical data yourself.\r\n:::\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Field | Type | Required | Notes |","| --- | --- | --- | --- |","| `type` | `string` | no | Informational only (debugger). |","| `default` | `any` | no | Applied when prop is not provided. |","| `required` | `boolean` | no | Logs error when missing in development. |","| `allowedValues` | `array` | no | Strict dev-time whitelist for accepted values. |","| `schema` | `object` | no | Nested object contract when `type: 'object'`. |","| `items` | `object` | no | Nested item contract when `type: 'array'`. |"];
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
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => formatCell(cell)));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class Button extends HTMLElement {\r\n  static props = {\r\n    value: { type: 'string', default: 'Button' },\r\n    onClickCallback: { type: 'function', default: null }\r\n  };\r\n\r\n  constructor(props) {\r\n    super();\r\n    slice.attachTemplate(this);\r\n    slice.controller.setComponentProps(this, props);\r\n\r\n    // Props are now available\r\n    console.log(this.value);\r\n    console.log(this.onClickCallback);\r\n  }\r\n}\r",
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "static props = {\r\n  title: { type: 'string', default: 'Untitled', required: false },\r\n  id: { type: 'string', required: true }\r\n};\r",
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
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
         const container = this.querySelector('[data-block-id="doc-block-5"]');
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice types generate",
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npx -p typescript tsc --noEmit -p jsconfig.json",
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const lines = ["- union types from homogeneous `allowedValues` (`'a' | 'b'`, `1 | 2`)"];
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
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => formatCell(cell)));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const card = await slice.build('Card', {\r\n  title: 'My Card',\r\n  text: 'Card content',\r\n  icon: { name: 'star', iconStyle: 'filled' }\r\n});\r",
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
               value: "const grid = await slice.build('Grid', {\r\n  columns: 3,\r\n  rows: 2,\r\n  gap: '16px',\r\n  style: { border: '1px solid #ccc' }\r\n});\r",
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
               value: "const button = await slice.build('Button', {\r\n  value: 'Save',\r\n  onClickCallback: () => this.save()\r\n});\r",
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

customElements.define('slice-staticpropsdocumentation', StaticPropsDocumentation);
