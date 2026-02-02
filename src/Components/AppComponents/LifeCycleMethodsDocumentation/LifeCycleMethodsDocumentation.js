export default class LifeCycleMethodsDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/lifecycle-overview.md";
    this.setupCopyButton();
      await this.appendCodeBlock("doc-block-1", "class Example extends HTMLElement {\n  async init() {\n    // Runs once after template is attached\n  }\n\n  async update() {\n    // Runs when component is revisited or refreshed\n  }\n\n  beforeDestroy() {\n    // Runs right before component is destroyed\n  }\n}", "javascript", "Lifecycle timing");
      await this.appendCodeBlock("doc-block-2", "export default class UserList extends HTMLElement {\n  async init() {\n    this.$container = this.querySelector('.users');\n    await this.loadUsers();\n    await this.buildUserCards();\n  }\n\n  async update() {\n    slice.controller.destroyByContainer(this.$container);\n    this.$container.innerHTML = '';\n    await this.loadUsers();\n    await this.buildUserCards();\n  }\n\n  beforeDestroy() {\n    clearInterval(this._pollingId);\n    this.abortController?.abort();\n  }\n}", "javascript", "Recommended separation");
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

customElements.define('slice-lifecyclemethodsdocumentation', LifeCycleMethodsDocumentation);
