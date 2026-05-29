export default class UpdateMethodDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/update-method.md";
    this.markdownContent = "---\ntitle: update()\nroute: /Documentation/LifeCycle-Methods/update\nnavLabel: update()\nsection: Getting Started\ngroup: Components\norder: 42\ndescription: Refresh dynamic UI in Slice.js components.\ncomponent: UpdateMethodDocumentation\ntags: [lifecycle, update]\n---\n\n# update()\n\n## Overview\n`update()` runs whenever a component needs to refresh. The router calls it when a cached\ncomponent is reused by `Route` or `MultiRoute`. You can also call it manually after changing\nprops or state.\n\n## API\n| Method | Signature | Returns | Notes |\n| --- | --- | --- | --- |\n| `update` | `async update()` | `Promise<void>` | Called on cached components when revisited. |\n\n## Ideal Use Cases\n- Re-fetch data that can change\n- Rebuild dynamic child components\n- Re-apply dynamic state to the DOM\n\n## Example\n```javascript title=\"Rebuild dynamic UI in update()\"\nexport default class ProductList extends HTMLElement {\n  async init() {\n    this.$productContainer = this.querySelector('.products-container');\n    await this.loadAndRenderProducts();\n  }\n\n  async update() {\n    slice.controller.destroyByContainer(this.$productContainer);\n    this.$productContainer.innerHTML = '';\n    await this.loadAndRenderProducts();\n  }\n\n  async loadAndRenderProducts() {\n    this.products = await this.fetchProducts();\n\n    for (const product of this.products) {\n      const productCard = await slice.build('ProductCard', {\n        sliceId: `product-${product.id}`,\n        title: product.title,\n        price: product.price,\n        image: product.image\n      });\n\n      this.$productContainer.appendChild(productCard);\n    }\n  }\n}\n```\n\n## Best Practices\n:::steps\n1. Destroy old components with `destroyByContainer`.\n2. Clear the container.\n3. Fetch fresh data.\n4. Rebuild components with stable `sliceId`s.\n:::\n\n:::tip\nKeep `update()` idempotent and safe to call multiple times.\n:::\n\n## Gotchas\n:::warning\nClearing `innerHTML` alone does not destroy Slice components.\n:::\n\n:::warning\nDo not rebuild static UI in `update()` unless it depends on changing data.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Signature | Returns | Notes |","| --- | --- | --- | --- |","| `update` | `async update()` | `Promise<void>` | Called on cached components when revisited. |"];
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
               value: "export default class ProductList extends HTMLElement {\n  async init() {\n    this.$productContainer = this.querySelector('.products-container');\n    await this.loadAndRenderProducts();\n  }\n\n  async update() {\n    slice.controller.destroyByContainer(this.$productContainer);\n    this.$productContainer.innerHTML = '';\n    await this.loadAndRenderProducts();\n  }\n\n  async loadAndRenderProducts() {\n    this.products = await this.fetchProducts();\n\n    for (const product of this.products) {\n      const productCard = await slice.build('ProductCard', {\n        sliceId: `product-${product.id}`,\n        title: product.title,\n        price: product.price,\n        image: product.image\n      });\n\n      this.$productContainer.appendChild(productCard);\n    }\n  }\n}",
               language: "javascript"
            });
            if ("Rebuild dynamic UI in update()") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Rebuild dynamic UI in update()";
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

customElements.define('slice-updatemethoddocumentation', UpdateMethodDocumentation);
