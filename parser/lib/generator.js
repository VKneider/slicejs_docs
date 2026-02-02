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
/* Keep shared styles in src/Styles/DocumentationBase.css */
`;
};

const generateHtml = (componentClass, html) => {
  return `<div class="documentation-content ${componentClass.toLowerCase()}">
${html}
</div>
`;
};

const generateJs = (componentClass, jsBlocks, tagName, markdownPath = '') => {
  const buildCodeBlocks = jsBlocks
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
      if (block.type === 'details') {
        return `      {
         const container = this.querySelector('[data-block-id="${block.id}"]');
         if (container) {
            const details = await slice.build('Details', { title: ${JSON.stringify(block.title)}, text: ${JSON.stringify(block.content)} });
            container.appendChild(details);
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
            container.appendChild(component);
         }
      }`;
      }
      if (block.type === 'table') {
        return `      {
         const container = this.querySelector('[data-block-id="${block.id}"]');
         if (container) {
            const lines = ${JSON.stringify(block.rows)};
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
  }

  async init() {
    this.markdownPath = ${JSON.stringify(markdownPath)};
    this.setupCopyButton();
${buildCodeBlocks || '    // No dynamic blocks'}
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
  const jsContent = generateJs(componentClass, jsBlocks, tagName, markdownPath);
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
