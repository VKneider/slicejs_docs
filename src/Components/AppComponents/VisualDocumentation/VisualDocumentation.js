export default class VisualDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/visual-components.md";
    this.markdownContent = "---\r\ntitle: Visual\nroute: /Documentation/Visual\nnavLabel: Visual\nsection: Getting Started\r\ngroup: Components\r\norder: 32\r\ndescription: Official visual component documentation entrypoint for Slice.js.\ncomponent: VisualDocumentation\ntags: [visual, components, docs]\n---\n\n# Visual Components Documentation\n\n## Overview\nVisual component API, interfaces, examples, and generated props metadata now live in the\nofficial `slice.js_visual_library` documentation site.\n\n## Why this page exists\n- Keep framework docs in `sliceDocs` and component reference docs in one place.\n- Avoid duplicated API tables and drift between repositories.\n- Ensure parser-generated component docs remain the source of truth.\n\n## Open the official components docs\n:::html\n<div class=\"components-docs-landing\" data-components-docs-landing></div>\n:::\n\n:::script\nconst root = component.querySelector('[data-components-docs-landing]');\nif (!root) return;\n\nconst docsUrl = slice.getEnv('SLICE_PUBLIC_COMPONENTS_DOCS_URL', '/docs');\nconst isExternal = /^https?:\\/\\//.test(docsUrl);\n\nconst card = document.createElement('div');\ncard.className = 'components-docs-card';\n\nconst title = document.createElement('h3');\ntitle.textContent = 'Components Docs Portal';\n\nconst text = document.createElement('p');\ntext.textContent = 'Open the official visual components documentation to browse API, interfaces, examples, and generated static props metadata.';\n\nconst link = document.createElement('a');\nlink.href = docsUrl;\nlink.textContent = isExternal ? 'Open components docs (external)' : 'Open components docs';\nlink.className = 'components-docs-link';\nif (isExternal) {\n  link.target = '_blank';\n  link.rel = 'noopener noreferrer';\n}\n\nconst urlHint = document.createElement('code');\nurlHint.textContent = docsUrl;\n\ncard.appendChild(title);\ncard.appendChild(text);\ncard.appendChild(link);\ncard.appendChild(urlHint);\nroot.appendChild(card);\n:::\n\n## Configuration\nSet `SLICE_PUBLIC_COMPONENTS_DOCS_URL` in your environment to point this page to the\npublic component docs deployment.\n\n```bash title=\".env\"\nSLICE_PUBLIC_COMPONENTS_DOCS_URL=https://example.com/docs\n```\n\n## Gotchas\n:::warning\nIf `SLICE_PUBLIC_COMPONENTS_DOCS_URL` is not configured, this page falls back to `/docs`.\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         try {
            const fn = new Function('component', 'slice', 'document', "const root = component.querySelector('[data-components-docs-landing]');\nif (!root) return;\n\nconst docsUrl = slice.getEnv('SLICE_PUBLIC_COMPONENTS_DOCS_URL', '/docs');\nconst isExternal = /^https?:\\/\\//.test(docsUrl);\n\nconst card = document.createElement('div');\ncard.className = 'components-docs-card';\n\nconst title = document.createElement('h3');\ntitle.textContent = 'Components Docs Portal';\n\nconst text = document.createElement('p');\ntext.textContent = 'Open the official visual components documentation to browse API, interfaces, examples, and generated static props metadata.';\n\nconst link = document.createElement('a');\nlink.href = docsUrl;\nlink.textContent = isExternal ? 'Open components docs (external)' : 'Open components docs';\nlink.className = 'components-docs-link';\nif (isExternal) {\n  link.target = '_blank';\n  link.rel = 'noopener noreferrer';\n}\n\nconst urlHint = document.createElement('code');\nurlHint.textContent = docsUrl;\n\ncard.appendChild(title);\ncard.appendChild(text);\ncard.appendChild(link);\ncard.appendChild(urlHint);\nroot.appendChild(card);");
            await fn(this, slice, document);
         } catch (error) {
            console.warn('Inline script failed:', error);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "SLICE_PUBLIC_COMPONENTS_DOCS_URL=https://example.com/docs",
               language: "bash"
            });
            if (".env") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = ".env";
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

customElements.define('slice-visualdocumentation', VisualDocumentation);
