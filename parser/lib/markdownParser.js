import fs from 'fs';

const FRONT_MATTER_REGEX = /^---\n([\s\S]*?)\n---\n/;

const parseFrontMatter = (content) => {
  const match = content.match(FRONT_MATTER_REGEX);
  if (!match) {
    return { data: null, body: content };
  }

  const raw = match[1];
  const body = content.slice(match[0].length);
  const lines = raw.split('\n');
  const data = {};

  for (const line of lines) {
    if (!line.trim()) continue;
    const [key, ...rest] = line.split(':');
    if (!key || rest.length === 0) continue;
    const value = rest.join(':').trim();

    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1).trim();
      data[key.trim()] = inner
        ? inner.split(',').map((v) => v.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, ''))
        : [];
      continue;
    }

    data[key.trim()] = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
  }

  return { data, body };
};

const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const escapeHtml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

const inlineMarkdown = (text) => {
  let output = escapeHtml(text);
  output = output.replace(/`([^`]+)`/g, '<code>$1</code>');
  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return output;
};

const parseAttributes = (raw) => {
  const attrs = {};
  const regex = /(\w+)="([^"]*)"/g;
  let match;
  while ((match = regex.exec(raw))) {
    attrs[match[1]] = match[2];
  }
  return attrs;
};

const parseBlocks = (body) => {
  const lines = body.split('\n');
  const blocks = [];
  let i = 0;

  const pushParagraph = (paragraphLines) => {
    if (paragraphLines.length === 0) return;
    const text = paragraphLines.join(' ').trim();
    if (!text) return;
    blocks.push({ type: 'paragraph', text });
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const info = line.slice(3).trim();
      const [language, ...attrParts] = info.split(' ');
      const attrs = parseAttributes(attrParts.join(' '));
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: 'code',
        language: language || 'text',
        value: codeLines.join('\n'),
        title: attrs.title || null,
        highlight: attrs.highlight || null
      });
      i++;
      continue;
    }

    if (line.startsWith(':::')) {
      const directive = line.slice(3).trim();
      const [name, ...rest] = directive.split(' ');
      const attrs = parseAttributes(rest.join(' '));
      const contentLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith(':::')) {
        contentLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: 'directive',
        name,
        attrs,
        content: contentLines.join('\n').trim()
      });
      i++;
      continue;
    }

    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?\s*-/.test(lines[i + 1])) {
      const tableLines = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'table', rows: tableLines });
      continue;
    }

    if (line.startsWith('#')) {
      const level = line.match(/^#+/)[0].length;
      const text = line.slice(level).trim();
      blocks.push({ type: 'heading', level, text });
      i++;
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2).trim());
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, '').trim());
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    const paragraphLines = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith(':::') &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('- ') &&
      !lines[i].startsWith('* ') &&
      !/^\d+\.\s/.test(lines[i])
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }
    pushParagraph(paragraphLines);
  }

  return blocks;
};

const renderBlocks = (blocks) => {
  const htmlParts = [];
  const jsBlocks = [];
  let blockId = 0;
  const usedIds = new Set();
  let hasTitle = false;

  const nextId = () => `doc-block-${++blockId}`;

  for (const block of blocks) {
    if (block.type === 'heading') {
      let slug = slugify(block.text);
      if (!slug) slug = `section-${blockId + 1}`;
      let unique = slug;
      let count = 1;
      while (usedIds.has(unique)) {
        count += 1;
        unique = `${slug}-${count}`;
      }
      usedIds.add(unique);
      if (!hasTitle && block.level === 1) {
        htmlParts.push(`
<div class="doc-title-bar">
  <h1 id="${unique}">
    <span class="doc-title-text">${inlineMarkdown(block.text)}</span>
    <span class="copy-md-slot" data-copy-md></span>
  </h1>
</div>`);
        hasTitle = true;
      } else {
        htmlParts.push(`<h${block.level} id="${unique}">${inlineMarkdown(block.text)}</h${block.level}>`);
      }
      continue;
    }

    if (block.type === 'paragraph') {
      htmlParts.push(`<p>${inlineMarkdown(block.text)}</p>`);
      continue;
    }

    if (block.type === 'ul') {
      const items = block.items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('');
      htmlParts.push(`<ul>${items}</ul>`);
      continue;
    }

    if (block.type === 'ol') {
      const items = block.items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('');
      htmlParts.push(`<ol>${items}</ol>`);
      continue;
    }

    if (block.type === 'code') {
      const id = nextId();
      htmlParts.push(`<div class="code-block" data-block-id="${id}"></div>`);
      jsBlocks.push({ type: 'code', id, ...block });
      continue;
    }

    if (block.type === 'table') {
      const id = nextId();
      htmlParts.push(`<div class="table-block" data-block-id="${id}"></div>`);
      jsBlocks.push({ type: 'table', id, rows: block.rows });
      continue;
    }

    if (block.type === 'directive') {
      const name = block.name.toLowerCase();

      if (name === 'details') {
        const id = nextId();
        htmlParts.push(`<div class="details-block" data-block-id="${id}"></div>`);
        jsBlocks.push({ type: 'details', id, title: block.attrs.title || '', content: block.content });
        continue;
      }

      if (name === 'tip' || name === 'warning') {
        htmlParts.push(`<div class="callout callout-${name}">${inlineMarkdown(block.content)}</div>`);
        continue;
      }

      if (name === 'steps') {
        const items = block.content
          .split('\n')
          .map((line) => line.replace(/^\d+\.\s/, '').trim())
          .filter(Boolean);
        const list = items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('');
        htmlParts.push(`<ol class="steps">${list}</ol>`);
        continue;
      }

      if (name === 'component') {
        const id = nextId();
        htmlParts.push(`<div class="component-block" data-block-id="${id}"></div>`);
        jsBlocks.push({
          type: 'component',
          id,
          component: block.attrs.name || '',
          props: block.content
        });
        continue;
      }

      if (name === 'script') {
        jsBlocks.push({
          type: 'script',
          content: block.content
        });
        continue;
      }

      if (name === 'html') {
        htmlParts.push(block.content);
        continue;
      }
    }
  }

  return { html: htmlParts.join('\n'), jsBlocks };
};

const parseMarkdownFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, body } = parseFrontMatter(content);
  const blocks = parseBlocks(body);
  const { html, jsBlocks } = renderBlocks(blocks);
  if (data) {
    data.markdownSource = content;
  }
  return { frontMatter: data, html, jsBlocks };
};

export { parseMarkdownFile };
