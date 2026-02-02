export default class BeforeDestroyDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/before-destroy.md";
    this.markdownContent = "---\ntitle: beforeDestroy()\nroute: /Documentation/LifeCycle-Methods/beforeDestroy\nnavLabel: beforeDestroy()\nsection: Getting Started\ngroup: Components\norder: 43\ndescription: Cleanup hooks to avoid memory leaks in Slice.js.\ncomponent: BeforeDestroyDocumentation\ntags: [lifecycle, destroy, cleanup]\n---\n\n# beforeDestroy()\n\n## Overview\n`beforeDestroy()` runs right before a component is destroyed by the controller. Use it for\ncleanup: timers, listeners, subscriptions, and pending async work.\n\nThe controller does not await this method, so keep it synchronous or fire-and-forget.\n\n## API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `beforeDestroy` | `beforeDestroy()` | `void` | Called right before the component is removed. |\n\n## Ideal Use Cases\n- Clear intervals and timeouts\n- Abort pending fetch requests\n- Remove global event listeners\n- Dispose third-party instances (charts, maps, etc.)\n\n## Example\n```javascript title=\"Cleanup in beforeDestroy()\"\nexport default class LiveChart extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n    this.abortController = new AbortController();\n  }\n\n  async init() {\n    this._pollingId = setInterval(() => this.fetchData(), 5000);\n    window.addEventListener('resize', this.onResize);\n    await fetch('/api/chart', { signal: this.abortController.signal });\n  }\n\n  beforeDestroy() {\n    clearInterval(this._pollingId);\n    this.abortController.abort();\n    window.removeEventListener('resize', this.onResize);\n    this.chartInstance?.destroy();\n  }\n}\n```\n\n## Best Practices\n:::tip\nKeep `beforeDestroy()` idempotent so it can be called safely.\n:::\n\n:::tip\nUse `AbortController` for fetch cleanup.\n:::\n\n## Gotchas\n:::warning\nIf you add global listeners in `init()`, remove them in `beforeDestroy()`.\n:::\n\n:::warning\nDo not rely on `await` inside `beforeDestroy()`.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Signature | Returns | Notes |","| --- | --- | --- | --- |","| `beforeDestroy` | `beforeDestroy()` | `void` | Called right before the component is removed. |"];
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
               value: "export default class LiveChart extends HTMLElement {\n  constructor(props) {\n    super();\n    slice.attachTemplate(this);\n    slice.controller.setComponentProps(this, props);\n    this.abortController = new AbortController();\n  }\n\n  async init() {\n    this._pollingId = setInterval(() => this.fetchData(), 5000);\n    window.addEventListener('resize', this.onResize);\n    await fetch('/api/chart', { signal: this.abortController.signal });\n  }\n\n  beforeDestroy() {\n    clearInterval(this._pollingId);\n    this.abortController.abort();\n    window.removeEventListener('resize', this.onResize);\n    this.chartInstance?.destroy();\n  }\n}",
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
