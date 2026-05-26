export default class UpdateMethodDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/update-method.md";
    this.markdownContent = "---\r\ntitle: update()\r\nroute: /Documentation/LifeCycle-Methods/update\r\nnavLabel: update()\r\nsection: Getting Started\r\ngroup: Components\r\norder: 42\r\ndescription: Refresh dynamic UI in Slice.js components.\r\ncomponent: UpdateMethodDocumentation\r\ntags: [lifecycle, update]\r\n---\r\n\r\n# update()\r\n\r\n## Overview\r\n`update()` runs whenever a component needs to refresh. The router calls it when a cached\r\ncomponent is reused by `Route` or `MultiRoute`. You can also call it manually after changing\r\nprops or state.\r\n\r\n## API\r\n| Method | Signature | Returns | Notes |\r\n| --- | --- | --- | --- |\r\n| `update` | `async update()` | `Promise<void>` | Called on cached components when revisited. |\r\n\r\n## Ideal Use Cases\r\n- Re-fetch data that can change\r\n- Rebuild dynamic child components\r\n- Re-apply dynamic state to the DOM\r\n\r\n## Example\r\n```javascript title=\"Rebuild dynamic UI in update()\"\r\nexport default class ProductList extends HTMLElement {\r\n  async init() {\r\n    this.$productContainer = this.querySelector('.products-container');\r\n    await this.loadAndRenderProducts();\r\n  }\r\n\r\n  async update() {\r\n    slice.controller.destroyByContainer(this.$productContainer);\r\n    this.$productContainer.innerHTML = '';\r\n    await this.loadAndRenderProducts();\r\n  }\r\n\r\n  async loadAndRenderProducts() {\r\n    this.products = await this.fetchProducts();\r\n\r\n    for (const product of this.products) {\r\n      const productCard = await slice.build('ProductCard', {\r\n        sliceId: `product-${product.id}`,\r\n        title: product.title,\r\n        price: product.price,\r\n        image: product.image\r\n      });\r\n\r\n      this.$productContainer.appendChild(productCard);\r\n    }\r\n  }\r\n}\r\n```\r\n\r\n## Best Practices\r\n:::steps\r\n1. Destroy old components with `destroyByContainer`.\r\n2. Clear the container.\r\n3. Fetch fresh data.\r\n4. Rebuild components with stable `sliceId`s.\r\n:::\r\n\r\n:::tip\r\nKeep `update()` idempotent and safe to call multiple times.\r\n:::\r\n\r\n## Gotchas\r\n:::warning\r\nClearing `innerHTML` alone does not destroy Slice components.\r\n:::\r\n\r\n:::warning\r\nDo not rebuild static UI in `update()` unless it depends on changing data.\r\n:::\r\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Method | Signature | Returns | Notes |\r","| --- | --- | --- | --- |\r","| `update` | `async update()` | `Promise<void>` | Called on cached components when revisited. |\r"];
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
               value: "export default class ProductList extends HTMLElement {\r\n  async init() {\r\n    this.$productContainer = this.querySelector('.products-container');\r\n    await this.loadAndRenderProducts();\r\n  }\r\n\r\n  async update() {\r\n    slice.controller.destroyByContainer(this.$productContainer);\r\n    this.$productContainer.innerHTML = '';\r\n    await this.loadAndRenderProducts();\r\n  }\r\n\r\n  async loadAndRenderProducts() {\r\n    this.products = await this.fetchProducts();\r\n\r\n    for (const product of this.products) {\r\n      const productCard = await slice.build('ProductCard', {\r\n        sliceId: `product-${product.id}`,\r\n        title: product.title,\r\n        price: product.price,\r\n        image: product.image\r\n      });\r\n\r\n      this.$productContainer.appendChild(productCard);\r\n    }\r\n  }\r\n}\r",
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
