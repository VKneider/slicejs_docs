export default class LifeCycleMethods extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/lifecycle-overview.md";
    this.markdownContent = "---\r\ntitle: LifeCycle Methods\r\nroute: /Documentation/LifeCycle-Methods\r\nnavLabel: LifeCycle Methods\r\nsection: Getting Started\r\ngroup: Components\r\norder: 40\r\ndescription: Overview of init, update, and beforeDestroy in Slice.js.\r\ncomponent: LifeCycleMethods\r\ntags: [lifecycle, init, update, destroy]\r\n---\r\n\r\n# LifeCycle Methods\r\n\r\n## Overview\r\nSlice.js components expose three lifecycle methods for predictable behavior:\r\n\r\n- `init()` for one-time setup\r\n- `update()` for refreshes when data or routes change\r\n- `beforeDestroy()` for cleanup and memory safety\r\n\r\nThese methods are called by the framework and are the recommended places to manage state,\r\nsubscriptions, and DOM updates.\r\n\r\n## Lifecycle Summary\r\n| Method | Called when | Async awaited | Typical responsibilities |\r\n| --- | --- | --- | --- |\r\n| `init()` | After construction, before first use | yes | Cache DOM, fetch initial data, build static children. |\r\n| `update()` | When a cached route/component is reused | yes | Re-fetch data, rebuild dynamic lists, update state. |\r\n| `beforeDestroy()` | Right before destruction | no | Cleanup timers, listeners, subscriptions, aborts. |\r\n\r\n## Call Order and Timing\r\n```javascript title=\"Lifecycle timing\"\r\nclass Example extends HTMLElement {\r\n  async init() {\r\n    // Runs once after template is attached and props are set\r\n  }\r\n\r\n  async update() {\r\n    // Runs when the component is reused or refreshed\r\n  }\r\n\r\n  beforeDestroy() {\r\n    // Runs right before the component is destroyed\r\n  }\r\n}\r\n```\r\n\r\n## Navigation and Reuse\r\n`update()` is called when a cached component is reused by routing (for example, `Route` and\r\n`MultiRoute` containers). This keeps UI responsive without rebuilding static structure.\r\n\r\n## Recommended Structure\r\n```javascript title=\"Recommended separation\"\r\nexport default class UserList extends HTMLElement {\r\n  async init() {\r\n    this.$container = this.querySelector('.users');\r\n    await this.loadUsers();\r\n    await this.buildUserCards();\r\n  }\r\n\r\n  async update() {\r\n    slice.controller.destroyByContainer(this.$container);\r\n    this.$container.innerHTML = '';\r\n    await this.loadUsers();\r\n    await this.buildUserCards();\r\n  }\r\n\r\n  beforeDestroy() {\r\n    clearInterval(this._pollingId);\r\n    this.abortController?.abort();\r\n  }\r\n}\r\n```\r\n\r\n## Best Practices\r\n:::tip\r\nKeep `init()` focused on one-time setup and cache DOM references there.\r\n:::\r\n\r\n:::tip\r\nUse `destroyByContainer` before rebuilding dynamic lists in `update()`.\r\n:::\r\n\r\n## Gotchas\r\n:::warning\r\n`beforeDestroy()` is not awaited. Keep it synchronous or fire-and-forget.\r\n:::\r\n\r\n:::warning\r\nClearing `innerHTML` does not destroy Slice components. Use `destroyByContainer` first.\r\n:::\r\n\r\n## Guides\r\n- `init()`: /Documentation/LifeCycle-Methods/init\r\n- `update()`: /Documentation/LifeCycle-Methods/update\r\n- `beforeDestroy()`: /Documentation/LifeCycle-Methods/beforeDestroy\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Called when | Async awaited | Typical responsibilities |\r","| --- | --- | --- | --- |\r","| `init()` | After construction, before first use | yes | Cache DOM, fetch initial data, build static children. |\r","| `update()` | When a cached route/component is reused | yes | Re-fetch data, rebuild dynamic lists, update state. |\r","| `beforeDestroy()` | Right before destruction | no | Cleanup timers, listeners, subscriptions, aborts. |\r"];
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
               value: "class Example extends HTMLElement {\r\n  async init() {\r\n    // Runs once after template is attached and props are set\r\n  }\r\n\r\n  async update() {\r\n    // Runs when the component is reused or refreshed\r\n  }\r\n\r\n  beforeDestroy() {\r\n    // Runs right before the component is destroyed\r\n  }\r\n}\r",
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
               value: "export default class UserList extends HTMLElement {\r\n  async init() {\r\n    this.$container = this.querySelector('.users');\r\n    await this.loadUsers();\r\n    await this.buildUserCards();\r\n  }\r\n\r\n  async update() {\r\n    slice.controller.destroyByContainer(this.$container);\r\n    this.$container.innerHTML = '';\r\n    await this.loadUsers();\r\n    await this.buildUserCards();\r\n  }\r\n\r\n  beforeDestroy() {\r\n    clearInterval(this._pollingId);\r\n    this.abortController?.abort();\r\n  }\r\n}\r",
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
      markdownContent: this.markdownContent,
      label: '❐'
    });

    container.appendChild(copyMenu);
  }

  async copyMarkdown() {}
}

customElements.define('slice-lifecyclemethods', LifeCycleMethods);
