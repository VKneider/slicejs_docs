export default class UpdateDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/update-method.md";
    this.setupCopyButton();
      await this.appendCodeBlock("doc-block-1", "export default class ProductList extends HTMLElement {\n  async init() {\n    this.$productContainer = this.querySelector('.products-container');\n    await this.loadAndRenderProducts();\n  }\n\n  async update() {\n    slice.controller.destroyByContainer(this.$productContainer);\n    this.$productContainer.innerHTML = '';\n    await this.loadAndRenderProducts();\n  }\n\n  async loadAndRenderProducts() {\n    this.products = await this.fetchProducts();\n\n    for (const product of this.products) {\n      const productCard = await slice.build('ProductCard', {\n        sliceId: `product-${product.id}`,\n        title: product.title,\n        price: product.price,\n        image: product.image\n      });\n\n      this.$productContainer.appendChild(productCard);\n    }\n  }\n}", "javascript", "Rebuild dynamic UI in update()");
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

  async appendCodeBlock(blockId, value, language, title = null) {
    const container = this.querySelector('[data-block-id="' + blockId + '"]');
    if (!container) return;

    const code = await slice.build('CodeVisualizer', {
      value,
      language
    });

    if (title) {
      const label = document.createElement('div');
      label.classList.add('code-block-title');
      label.textContent = title;
      container.appendChild(label);
    }

    container.appendChild(code);
  }

  async appendDetailsBlock(blockId, title, text) {
    const container = this.querySelector('[data-block-id="' + blockId + '"]');
    if (!container) return;

    const details = await slice.build('Details', { title, text });
    container.appendChild(details);
  }

  async appendComponentBlock(blockId, componentName, propsText) {
    const container = this.querySelector('[data-block-id="' + blockId + '"]');
    if (!container || !componentName) return;

    let props = {};
    if (propsText) {
      try {
        props = JSON.parse(propsText);
      } catch (error) {
        console.warn('Invalid component props JSON:', error);
      }
    }

    const component = await slice.build(componentName, props);
    container.appendChild(component);
  }

  async appendTableBlock(blockId, rows) {
    const container = this.querySelector('[data-block-id="' + blockId + '"]');
    if (!container) return;

    const parsed = this.parseMarkdownTable(rows);
    const table = await slice.build('Table', {
      headers: parsed.headers,
      rows: parsed.rows
    });
    container.appendChild(table);
  }

  parseMarkdownTable(lines) {
    if (!lines || lines.length < 2) return { headers: [], rows: [] };

    const leadingPipe = new RegExp('^\|');
    const trailingPipe = new RegExp('\|$');

    const clean = (line) => line
      .trim()
      .replace(leadingPipe, '')
      .replace(trailingPipe, '')
      .split('|')
      .map((cell) => cell.trim());

    const headerCells = clean(lines[0]);
    const bodyLines = lines.slice(2);
    const rows = bodyLines.map((line) => clean(line).map((cell) => this.renderInline(cell)));

    return { headers: headerCells, rows };
  }

  renderInline(text) {
    if (!text) return '';
    let output = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const backtick = String.fromCharCode(96);
    const codeRegex = new RegExp(backtick + '([^' + backtick + ']+)' + backtick, 'g');
    output = output.replace(codeRegex, '<code>$1</code>');
    const boldToken = '**';
    let start = output.indexOf(boldToken);
    while (start !== -1) {
      const end = output.indexOf(boldToken, start + 2);
      if (end === -1) break;
      const inner = output.slice(start + 2, end);
      output = output.slice(0, start) + '<strong>' + inner + '</strong>' + output.slice(end + 2);
      start = output.indexOf(boldToken, start + inner.length + 17);
    }
    return output;
  }

  async runInlineScript(scriptContent) {
    if (!scriptContent) return;
    try {
      const fn = new Function('component', 'slice', 'document', scriptContent);
      await fn(this, slice, document);
    } catch (error) {
      console.warn('Inline script failed:', error);
    }
  }
}

customElements.define('slice-updatedocumentation', UpdateDocumentation);
