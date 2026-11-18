import fs from 'fs';
import path from 'path';

const pascalCase = (value) => {
  return value
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

const safeComponentName = (frontMatter) => {
  if (frontMatter.component) return frontMatter.component;
  return `${pascalCase(frontMatter.title)}Documentation`;
};

const defaultCss = (tagName) => {
  return `/* Generated documentation styles */
/* Keep shared styles in src/public/Styles/DocumentationBase.css */
`;
};

const generateHtml = (componentClass, html) => {
  return `<div class="documentation-content ${componentClass.toLowerCase()}">
${html}
</div>
`;
};

const generateJs = (componentClass, jsBlocks, tagName, markdownPath = '', markdownContent = '', enableCopy = true) => {
  const buildBlocks = jsBlocks
    .map((block) => {
      if (block.type === 'code') {
        return `      {
         const container = this.querySelector('[data-block-id="${block.id}"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: ${JSON.stringify(block.value)},
               language: "${block.language}"
            });
            if (${JSON.stringify(block.title)}) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = ${JSON.stringify(block.title)};
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }`;
      }
      if (block.type === 'breadcrumb') {
        return `      {
         const container = this.querySelector('[data-block-id="${block.id}"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: ${JSON.stringify(block.items)}
            });
            if (breadcrumbs) {
               container.appendChild(breadcrumbs);
            }
         }
      }`;
      }
      if (block.type === 'status') {
        return `      {
         const container = this.querySelector('[data-block-id="${block.id}"]');
         if (container) {
            const presets = {
               new: { label: 'New', tone: 'accent' },
               updated: { label: 'Updated', tone: 'info' },
               deprecated: { label: 'Deprecated', tone: 'warning' },
               beta: { label: 'Beta', tone: 'info' },
               experimental: { label: 'Experimental', tone: 'neutral' }
            };
            const key = String(${JSON.stringify(block.status)}).toLowerCase();
            const preset = presets[key] || { label: ${JSON.stringify(block.status)}, tone: 'neutral' };
            const badge = await slice.build('Badge', {
               label: preset.label,
               tone: preset.tone,
               variant: 'soft',
               size: 'sm',
               shape: 'rounded'
            });
            if (badge) container.appendChild(badge);
         }
      }`;
      }
      if (block.type === 'compare') {
        return `      {
         const container = this.querySelector('[data-block-id="${block.id}"]');
         if (container) {
            const grid = await slice.build('Grid', { columns: 2, rows: 1, gap: '14px' });
            const buildSide = async (side) => {
               const body = document.createElement('div');
               body.className = 'doc-callout-body';
               body.innerHTML = side.html;
               const callout = await slice.build('Callout', {
                  tone: side.tone,
                  title: side.title,
                  content: Array.from(body.childNodes)
               });
               return callout || body;
            };
            const left = await buildSide(${JSON.stringify(block.left)});
            const right = await buildSide(${JSON.stringify(block.right)});
            if (grid) {
               await grid.setItem(left);
               await grid.setItem(right);
               container.appendChild(grid);
            } else {
               container.appendChild(left);
               container.appendChild(right);
            }
         }
      }`;
      }
      if (block.type === 'related') {
        return `      {
         const container = this.querySelector('[data-block-id="${block.id}"]');
         if (container) {
            const items = ${JSON.stringify(block.items)};
            const grid = await slice.build('Grid', {
               columns: items.length === 4 ? 2 : Math.min(3, Math.max(1, items.length)),
               rows: 1,
               gap: '14px'
            });
            for (const item of items) {
               const card = await slice.build('Card', {
                  title: item.title,
                  text: item.text || '',
                  // The small mark beside the title, not the banner: a page
                  // of four related links should not be four big arrows.
                  headerIcon: 'arrow-right',
                  interactive: true,
                  onClick: () => {
                     if (/^https?:/i.test(item.path)) {
                        window.open(item.path, '_blank', 'noopener,noreferrer');
                     } else {
                        slice.router.navigate(item.path);
                     }
                  }
               });
               if (card && grid) await grid.setItem(card);
            }
            if (grid) container.appendChild(grid);
         }
      }`;
      }
      if (block.type === 'callout') {
        return `      {
         const container = this.querySelector('[data-block-id="${block.id}"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = ${JSON.stringify(block.html)};
            const callout = await slice.build('Callout', {
               tone: "${block.tone}",
               variant: "${block.variant}",
               title: ${JSON.stringify(block.title)},
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
         }
      }`;
      }
      if (block.type === 'details') {
        return `      {
         const container = this.querySelector('[data-block-id="${block.id}"]');
         if (container) {
            const details = await slice.build('Details', { title: ${JSON.stringify(block.title)} });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = ${JSON.stringify(block.html)};
            if (details) {
               details.addDetail(body);
               container.appendChild(details);
            } else {
               container.appendChild(body);
            }
         }
      }`;
      }
      if (block.type === 'component') {
        return `      {
         const container = this.querySelector('[data-block-id="${block.id}"]');
         if (container) {
            let props = {};
            if (${JSON.stringify(block.props)}) {
               try {
                  props = JSON.parse(${JSON.stringify(block.props)});
               } catch (error) {
                  console.warn('Invalid component props JSON:', error);
               }
            }
            const component = await slice.build('${block.component}', props);
            if (component) {
               container.appendChild(component);
            }
         }
      }`;
      }
      if (block.type === 'table') {
        return `      {
         const container = this.querySelector('[data-block-id="${block.id}"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ${JSON.stringify(block.headers)},
               rows: ${JSON.stringify(block.rows)}
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }`;
      }
      if (block.type === 'script') {
        return `      {
         try {
            const fn = new Function('component', 'slice', 'document', ${JSON.stringify(block.content)});
            await fn(this, slice, document);
         } catch (error) {
            console.warn('Inline script failed:', error);
         }
      }`;
      }
      return '';
    })
    .filter(Boolean)
    .join('\n');

  return `export default class ${componentClass} extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = ${enableCopy ? JSON.stringify(markdownPath) : "''"};
    this.markdownContent = ${enableCopy ? JSON.stringify(markdownContent) : "''"};
    this.setupRouterLinks();
    if (${enableCopy ? 'true' : 'false'}) {
      await this.setupCopyButton();
    }
${buildBlocks || '    // No dynamic blocks'}
  }

  async update() {
    // Refresh dynamic content here if needed
  }

  beforeDestroy() {
    if (this._contentClick) {
      this.removeEventListener('click', this._contentClick);
      this._contentClick = null;
    }
  }

  // Internal markdown links are plain anchors with data-route. One delegated
  // handler keeps them inside the SPA, including "/page#section" links, without
  // building a component for every link on the page.
  setupRouterLinks() {
    this._contentClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest?.('a[data-route]');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('#')) {
        event.preventDefault();
        this.scrollToHash(href.slice(1));
        return;
      }
      if (!href.startsWith('/') || href.startsWith('//')) return;

      event.preventDefault();
      const hashIndex = href.indexOf('#');
      const path = hashIndex === -1 ? href : href.slice(0, hashIndex);
      const hash = hashIndex === -1 ? '' : href.slice(hashIndex + 1);
      Promise.resolve(slice.router.navigate(path)).then(() => {
        if (hash) requestAnimationFrame(() => this.scrollToHash(hash));
      });
    };
    this.addEventListener('click', this._contentClick);
  }

  scrollToHash(hash) {
    let id = hash;
    try {
      id = decodeURIComponent(hash);
    } catch {
      id = hash;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

customElements.define('${tagName}', ${componentClass});
`;
};

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const writeComponentFiles = ({ frontMatter, html, jsBlocks }, outputDir, markdownPath = '') => {
  const componentClass = safeComponentName(frontMatter);
  const folderName = componentClass;
  const folderPath = path.join(outputDir, folderName);
  const tagName = `slice-${componentClass.toLowerCase()}`;

  ensureDir(folderPath);

  const htmlContent = generateHtml(componentClass, html);
  const generateFlag = frontMatter?.generate;
  const enableCopy = !(generateFlag === false || String(generateFlag).toLowerCase() === 'false');
  const markdownContent = enableCopy ? (frontMatter?.markdownSource || '') : '';
  const jsContent = generateJs(componentClass, jsBlocks, tagName, markdownPath, markdownContent, enableCopy);
  const cssContent = defaultCss(tagName);

  fs.writeFileSync(path.join(folderPath, `${componentClass}.html`), htmlContent, 'utf8');
  fs.writeFileSync(path.join(folderPath, `${componentClass}.js`), jsContent, 'utf8');

  const cssPath = path.join(folderPath, `${componentClass}.css`);
  if (!fs.existsSync(cssPath)) {
    fs.writeFileSync(cssPath, cssContent, 'utf8');
  }

  return { componentClass, tagName, folderPath };
};

export { writeComponentFiles, safeComponentName };
