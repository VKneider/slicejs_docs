export default class StructuralDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/structural-components.md";
    this.markdownContent = "---\ntitle: Structural\nroute: /Documentation/Structural\nnavLabel: Structural\nsection: Getting Started\ngroup: Components\norder: 33\ndescription: Structural components that power Slice.js.\ncomponent: StructuralDocumentation\ntags: [structural, controller, router, styles]\n---\n\n# Structural Components\n\n## Overview\nStructural components power the framework runtime. They are created by Slice.js and exposed\nunder `slice.*`. You do not build them directly.\n\n## Key Components\n- `slice.controller` for component lifecycle and lookup\n- `slice.router` for navigation and route rendering\n- `slice.stylesManager` for styles and themes\n- `slice.events` for pub/sub (optional)\n- `slice.context` for shared state (optional)\n\n## Which one?\n| Need | Use | One-liner |\n| --- | --- | --- |\n| Build / look up / destroy components | `slice.controller` | Lifecycle and the component registry. |\n| Navigate, guards, route params | `slice.router` | Client-side routing. |\n| Shared state many components read | `slice.context` | Holds state; watchers + selectors. |\n| Announce \"something happened\" | `slice.events` | Fire-and-forget pub/sub. |\n| Themes and styles | `slice.stylesManager` | `slice.setTheme(name)`. |\n\nFor state vs signals see [Context vs Events](/Documentation/Structural/Context-vs-Events); for full\nsignatures, the [API Reference](/Documentation/API-Reference).\n\n## Controller API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `getComponent` | `(sliceId)` | instance or undefined | Lookup by sliceId. |\n| `destroyByContainer` | `(container)` | `number` | Destroys Slice components inside container. |\n| `destroyByPattern` | `(pattern)` | `number` | Destroys components whose sliceId matches pattern. |\n\n```javascript title=\"Destroy components safely\"\nconst container = this.querySelector('.items');\nslice.controller.destroyByContainer(container);\ncontainer.innerHTML = '';\n```\n\n## Router API\n| Method | Signature | Notes |\n| --- | --- | --- |\n| `navigate` | `(path, options?)` | Programmatic navigation. `{ replace: true }` replaces history. |\n| `beforeEach` | `(to, from, next)` | Register a guard before navigation. |\n| `afterEach` | `(to, from)` | Run logic after navigation. |\n| `start` | `()` | Start routing immediately. |\n\n## Styles and Themes\n`slice.setTheme(themeName)` applies a theme through the StylesManager.\n\n```javascript title=\"Switch themes\"\nawait slice.setTheme('Dark');\n```\n\n## EventManager & ContextManager (Optional)\n- **`slice.events`** — pub/sub (`subscribe` / `emit` / `bind`). Full guide:\n  [EventManager](/Documentation/Structural/EventManager).\n- **`slice.context`** — shared state (`create` / `setState` / `watch`, with selectors and optional\n  persistence). Full guide: [ContextManager](/Documentation/Structural/ContextManager).\n\nWhen to use which: [Context vs Events](/Documentation/Structural/Context-vs-Events). All signatures:\n[API Reference](/Documentation/API-Reference).\n\nThe Events debug panel (`alt+shift+e`) shows live subscribers + an emit history; the Context panel\nshows live state. See [DevTools](/Documentation/DevTools).\n\n## Best Practices\n:::tip\nUse `destroyByContainer` before recreating dynamic lists to avoid leaks.\n:::\n\n:::tip\nRegister guards before calling `slice.router.start()`.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Need | Use | One-liner |","| --- | --- | --- |","| Build / look up / destroy components | `slice.controller` | Lifecycle and the component registry. |","| Navigate, guards, route params | `slice.router` | Client-side routing. |","| Shared state many components read | `slice.context` | Holds state; watchers + selectors. |","| Announce \"something happened\" | `slice.events` | Fire-and-forget pub/sub. |","| Themes and styles | `slice.stylesManager` | `slice.setTheme(name)`. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const lines = ["| Method | Signature | Returns | Notes |","| --- | --- | --- | --- |","| `getComponent` | `(sliceId)` | instance or undefined | Lookup by sliceId. |","| `destroyByContainer` | `(container)` | `number` | Destroys Slice components inside container. |","| `destroyByPattern` | `(pattern)` | `number` | Destroys components whose sliceId matches pattern. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const container = this.querySelector('.items');\nslice.controller.destroyByContainer(container);\ncontainer.innerHTML = '';",
               language: "javascript"
            });
            if ("Destroy components safely") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Destroy components safely";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const lines = ["| Method | Signature | Notes |","| --- | --- | --- |","| `navigate` | `(path, options?)` | Programmatic navigation. `{ replace: true }` replaces history. |","| `beforeEach` | `(to, from, next)` | Register a guard before navigation. |","| `afterEach` | `(to, from)` | Run logic after navigation. |","| `start` | `()` | Start routing immediately. |"];
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
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "await slice.setTheme('Dark');",
               language: "javascript"
            });
            if ("Switch themes") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Switch themes";
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

customElements.define('slice-structuraldocumentation', StructuralDocumentation);
