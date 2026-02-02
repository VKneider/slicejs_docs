export default class VisualDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/visual-components.md";
    this.setupCopyButton();
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const myButton = await slice.build('Button', {\n  value: 'Click me!',\n  onClickCallback: () => console.log('Clicked')\n});\n\ndocument.querySelector('#container').appendChild(myButton);",
               language: "javascript"
            });
            if ("Build a visual component") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Build a visual component";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const lines = ["| Component | Purpose |","| --- | --- |","| `Button` | Clickable button UI. |","| `Card` | Structured content card. |","| `Checkbox` | Checkbox input. |","| `CodeVisualizer` | Code rendering blocks. |","| `Details` | Expandable details/summary. |","| `DropDown` | Dropdown menu. |","| `Grid` | Grid layout container. |","| `Icon` | Icon rendering. |","| `Input` | Text input field. |","| `Layout` | Page layout structure. |","| `Loading` | Loading indicator. |","| `MultiRoute` | Route container for multiple routes. |","| `Navbar` | Navigation bar. |","| `NotFound` | 404 UI component. |","| `Route` | Route container for a single path. |","| `Select` | Select input. |","| `Switch` | Toggle switch. |","| `TreeItem` | Tree view item. |","| `TreeView` | Tree view container. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const simpleButton = await slice.build('Button', {\n  // value defaults to \"Button\"\n  // onClickCallback defaults to null\n  // customColor defaults to null\n  // icon defaults to null\n});",
               language: "javascript"
            });
            if ("Defaults applied automatically") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Defaults applied automatically";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class CustomVisualComponent extends HTMLElement {\n  static props = {\n    value: { type: 'string', default: 'Default Text' },\n    color: { type: 'string', default: '#000000' },\n    disabled: { type: 'boolean', default: false },\n    items: { type: 'array', default: [] },\n    config: { type: 'object', default: null },\n    onClickCallback: { type: 'function', default: null }\n  };\n\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    this.$button = this.querySelector('.my-button');\n    slice.controller.setComponentProps(this, props);\n  }\n\n  async init() {\n    // One-time setup\n  }\n\n  async update() {\n    // Refresh UI\n  }\n}",
               language: "javascript"
            });
            if ("Visual component structure") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Visual component structure";
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

customElements.define('slice-visualdocumentation', VisualDocumentation);
