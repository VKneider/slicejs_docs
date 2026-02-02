export default class MultiRouteDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "components/multi-route.md";
    this.setupCopyButton();
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Signature | Notes |","| --- | --- | --- |","| `renderRoute()` | `()` | Renders the active route and caches the component |","| `renderIfCurrentRoute()` | `()` | Render only if current path matches |","| `removeComponent()` | `()` | Remove cached component for current route |"];
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
            const lines = ["| Prop | Type | Default | Notes |","| --- | --- | --- | --- |","| `routes` | `array` | `[]` | Route objects with `path` and `component` |"];
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
               value: "const multiRoute = await slice.build(\"MultiRoute\", {\n  routes: [\n    { path: \"/docs/button\", component: \"ButtonDocumentation\" },\n    { path: \"/docs/select\", component: \"SelectDocumentation\" }\n  ]\n});",
               language: "javascript"
            });
            if ("Basic configuration") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Basic configuration";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         try {
            const fn = new Function('component', 'slice', 'document', "const root = component.querySelector('[data-demo=\"basic\"]');\nif (!root) return;\n\nconst navContainer = document.createElement('div');\nnavContainer.style.cssText = 'display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;';\n\nconst demoRoutes = [\n  { path: '/demo/button', component: 'ButtonDocumentation', label: 'Button Docs' },\n  { path: '/demo/input', component: 'InputDocumentation', label: 'Input Docs' }\n];\n\nfor (const route of demoRoutes) {\n  const button = await slice.build('Button', {\n    value: route.label,\n    onClickCallback: async () => {\n      await slice.router.navigate(route.path);\n      if (multiRoute) {\n        await multiRoute.render();\n      }\n    }\n  });\n  navContainer.appendChild(button);\n}\n\nconst multiRoute = await slice.build('MultiRoute', {\n  routes: demoRoutes.map(({ path, component }) => ({ path, component }))\n});\n\nawait multiRoute.renderIfCurrentRoute();\nroot.appendChild(navContainer);\nroot.appendChild(multiRoute);");
            await fn(this, slice, document);
         } catch (error) {
            console.warn('Inline script failed:', error);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const multiRoute = await slice.build(\"MultiRoute\", {\n  routes: [\n    { path: \"/cache/doc1\", component: \"ButtonDocumentation\" },\n    { path: \"/cache/doc2\", component: \"ButtonDocumentation\" },\n    { path: \"/cache/doc3\", component: \"ButtonDocumentation\" }\n  ]\n});",
               language: "javascript"
            });
            if ("Same component across multiple routes") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Same component across multiple routes";
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

customElements.define('slice-multiroutedocumentation', MultiRouteDocumentation);
