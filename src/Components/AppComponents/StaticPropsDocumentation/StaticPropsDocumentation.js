export default class StaticPropsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/static-props.md";
    this.setupCopyButton();
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Field | Type | Required | Notes |","| --- | --- | --- | --- |","| `type` | `string` | no | Informational only (debugger). |","| `default` | `any` | no | Applied when prop is not provided. |","| `required` | `boolean` | no | Logs error when missing in development. |"];
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
               value: "export default class Button extends HTMLElement {\n  static props = {\n    value: { type: 'string', default: 'Button' },\n    onClickCallback: { type: 'function', default: null }\n  };\n\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n\n    // Props are now available\n    console.log(this.value);\n    console.log(this.onClickCallback);\n  }\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
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
         const container = this.querySelector('[data-block-id="doc-block-5"]');
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const button = await slice.build('Button', {\n  value: 'Save',\n  onClickCallback: () => this.save()\n});",
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
      label: '❐'
    });

    container.appendChild(copyMenu);
  }

  async copyMarkdown() {}
}

customElements.define('slice-staticpropsdocumentation', StaticPropsDocumentation);
