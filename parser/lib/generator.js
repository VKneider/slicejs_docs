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

${tagName} {
  color: var(--font-primary-color);
  display: block;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
}

${tagName} h1,
${tagName} h2,
${tagName} h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

${tagName} h1 {
  text-align: center;
  border-bottom: 3px solid var(--primary-color);
  padding-bottom: 12px;
}

${tagName} h2 {
  border-bottom: 1px solid var(--primary-color-shade);
  padding-bottom: 8px;
}

${tagName} code {
  font-family: monospace;
  background-color: var(--secondary-background-color);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

${tagName} .code-block,
${tagName} .details-block,
${tagName} .component-block {
  margin: 1.5em 0;
}

${tagName} .callout {
  border-left: 4px solid var(--primary-color);
  padding: 12px 16px;
  background: var(--secondary-background-color);
  margin: 1em 0;
}

${tagName} .callout-warning {
  border-left-color: var(--danger-color);
}

${tagName} .steps {
  padding-left: 1.5em;
}

@media (max-width: 768px) {
  ${tagName} {
    padding: 15px;
  }
}
`;
};

const generateHtml = (componentClass, html) => {
  return `<div class="${componentClass.toLowerCase()}">
${html}
</div>
`;
};

const generateJs = (componentClass, jsBlocks, tagName) => {
  const buildCodeBlocks = jsBlocks
    .map((block) => {
      if (block.type === 'code') {
        return `      await this.appendCodeBlock("${block.id}", ${JSON.stringify(block.value)}, "${block.language}", ${JSON.stringify(block.title)});`;
      }
      if (block.type === 'details') {
        return `      await this.appendDetailsBlock("${block.id}", ${JSON.stringify(block.title)}, ${JSON.stringify(block.content)});`;
      }
      if (block.type === 'component') {
        return `      await this.appendComponentBlock("${block.id}", "${block.component}", ${JSON.stringify(block.props)});`;
      }
      if (block.type === 'script') {
        return `      await this.runInlineScript(${JSON.stringify(block.content)});`;
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
${buildCodeBlocks || '    // No dynamic blocks'}
  }

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

customElements.define('${tagName}', ${componentClass});
`;
};

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const writeComponentFiles = ({ frontMatter, html, jsBlocks }, outputDir) => {
  const componentClass = safeComponentName(frontMatter);
  const folderName = componentClass;
  const folderPath = path.join(outputDir, folderName);
  const tagName = `slice-${componentClass.toLowerCase()}`;

  ensureDir(folderPath);

  const htmlContent = generateHtml(componentClass, html);
  const jsContent = generateJs(componentClass, jsBlocks, tagName);
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
