export default class BeforeDestroyDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/before-destroy.md";
    this.markdownContent = "---\r\ntitle: beforeDestroy()\r\nroute: /Documentation/LifeCycle-Methods/beforeDestroy\r\nnavLabel: beforeDestroy()\r\nsection: Getting Started\r\ngroup: Components\r\norder: 43\r\ndescription: Cleanup hooks to avoid memory leaks in Slice.js.\r\ncomponent: BeforeDestroyDocumentation\r\ntags: [lifecycle, destroy, cleanup]\r\n---\r\n\r\n# beforeDestroy()\r\n\r\n## Overview\r\n`beforeDestroy()` runs right before a component is destroyed by the controller. Use it for\r\ncleanup: timers, listeners, subscriptions, and pending async work.\r\n\r\nThe controller does not await this method, so keep it synchronous or fire-and-forget.\r\n\r\n## API\r\n| Method | Signature | Returns | Notes |\r\n| --- | --- | --- | --- |\r\n| `beforeDestroy` | `beforeDestroy()` | `void` | Called right before the component is removed. |\r\n\r\n## Ideal Use Cases\r\n- Clear intervals and timeouts\r\n- Abort pending fetch requests\r\n- Remove global event listeners\r\n- Dispose third-party instances (charts, maps, etc.)\r\n\r\n## Example\r\n```javascript title=\"Cleanup in beforeDestroy()\"\r\nexport default class LiveChart extends HTMLElement {\r\n  constructor(props) {\r\n    super();\r\n    slice.attachTemplate(this);\r\n    slice.controller.setComponentProps(this, props);\r\n    this.abortController = new AbortController();\r\n  }\r\n\r\n  async init() {\r\n    this._pollingId = setInterval(() => this.fetchData(), 5000);\r\n    window.addEventListener('resize', this.onResize);\r\n    await fetch('/api/chart', { signal: this.abortController.signal });\r\n  }\r\n\r\n  beforeDestroy() {\r\n    clearInterval(this._pollingId);\r\n    this.abortController.abort();\r\n    window.removeEventListener('resize', this.onResize);\r\n    this.chartInstance?.destroy();\r\n  }\r\n}\r\n```\r\n\r\n## Best Practices\r\n:::tip\r\nKeep `beforeDestroy()` idempotent so it can be called safely.\r\n:::\r\n\r\n:::tip\r\nUse `AbortController` for fetch cleanup.\r\n:::\r\n\r\n## Gotchas\r\n:::warning\r\nIf you add global listeners in `init()`, remove them in `beforeDestroy()`.\r\n:::\r\n\r\n:::warning\r\nDo not rely on `await` inside `beforeDestroy()`.\r\n:::\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Signature | Returns | Notes |\r","| --- | --- | --- | --- |\r","| `beforeDestroy` | `beforeDestroy()` | `void` | Called right before the component is removed. |\r"];
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
               value: "export default class LiveChart extends HTMLElement {\r\n  constructor(props) {\r\n    super();\r\n    slice.attachTemplate(this);\r\n    slice.controller.setComponentProps(this, props);\r\n    this.abortController = new AbortController();\r\n  }\r\n\r\n  async init() {\r\n    this._pollingId = setInterval(() => this.fetchData(), 5000);\r\n    window.addEventListener('resize', this.onResize);\r\n    await fetch('/api/chart', { signal: this.abortController.signal });\r\n  }\r\n\r\n  beforeDestroy() {\r\n    clearInterval(this._pollingId);\r\n    this.abortController.abort();\r\n    window.removeEventListener('resize', this.onResize);\r\n    this.chartInstance?.destroy();\r\n  }\r\n}\r",
               language: "javascript"
            });
            if ("Cleanup in beforeDestroy()") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Cleanup in beforeDestroy()";
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

customElements.define('slice-beforedestroydocumentation', BeforeDestroyDocumentation);
