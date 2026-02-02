export default class LifeCycleMethods extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/lifecycle-overview.md";
    this.setupCopyButton();
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Called when | Async awaited | Typical responsibilities |","| --- | --- | --- | --- |","| `init()` | After construction, before first use | yes | Cache DOM, fetch initial data, build static children. |","| `update()` | When a cached route/component is reused | yes | Re-fetch data, rebuild dynamic lists, update state. |","| `beforeDestroy()` | Right before destruction | no | Cleanup timers, listeners, subscriptions, aborts. |"];
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
               value: "class Example extends HTMLElement {\n  async init() {\n    // Runs once after template is attached and props are set\n  }\n\n  async update() {\n    // Runs when the component is reused or refreshed\n  }\n\n  beforeDestroy() {\n    // Runs right before the component is destroyed\n  }\n}",
               language: "javascript"
            });
            if ("Lifecycle timing") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Lifecycle timing";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class UserList extends HTMLElement {\n  async init() {\n    this.$container = this.querySelector('.users');\n    await this.loadUsers();\n    await this.buildUserCards();\n  }\n\n  async update() {\n    slice.controller.destroyByContainer(this.$container);\n    this.$container.innerHTML = '';\n    await this.loadUsers();\n    await this.buildUserCards();\n  }\n\n  beforeDestroy() {\n    clearInterval(this._pollingId);\n    this.abortController?.abort();\n  }\n}",
               language: "javascript"
            });
            if ("Recommended separation") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Recommended separation";
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

customElements.define('slice-lifecyclemethods', LifeCycleMethods);
