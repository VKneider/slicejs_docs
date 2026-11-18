import fs from 'fs';

import { buildStaticPropsSectionForFrontMatter } from './staticPropsDocs.js';

const FRONT_MATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;

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

const escapeHtmlAttribute = (text) => {
  return escapeHtml(text)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// The standard contract is deliberately conservative for hrefs. A docs page
// may link to an app route (/Documentation/...), an anchor (#section), an
// external site, or an email/phone. Anything else stays as plain text instead
// of becoming a clickable dead end.
const isSafeMarkdownHref = (href) => /^(?:https?:\/\/|\/\/|\/|#|mailto:|tel:)/i.test(href);
const isSafeImageSrc = (src) => /^(?:https?:\/\/|\/)/i.test(src);
const isInternalMarkdownHref = (href) => href.startsWith('/') && !href.startsWith('//');

const CODE_TOKEN_PREFIX = '\u0000SLICE_CODE_';
const CODE_TOKEN_SUFFIX = '_TOKEN\u0000';

// Inline formatting for the standard contract:
//   **bold**  *italic*  `code`  [label](/path)  [label](https://...)  ![alt](/img)
//
// Code spans are tokenized first so a `[not a link](x)` inside inline code is
// never turned into an anchor. Internal links carry `data-route`, which the
// generated page turns into SPA navigation; external links open in a new tab.
const inlineMarkdown = (text) => {
  const codeSpans = [];

  let output = escapeHtml(text).replace(/`([^`]+)`/g, (_, code) => {
    const token = `${CODE_TOKEN_PREFIX}${codeSpans.length}${CODE_TOKEN_SUFFIX}`;
    codeSpans.push(`<code>${code}</code>`);
    return token;
  });

  output = output.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  output = output.replace(/(^|[^\w*])\*([^*\n]+)\*(?![\w*])/g, '$1<em>$2</em>');

  output = output.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (match, alt, src) => {
    if (!isSafeImageSrc(src)) return alt;
    return `<img src="${escapeHtmlAttribute(src)}" alt="${escapeHtmlAttribute(alt)}" loading="lazy" decoding="async">`;
  });

  output = output.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, href) => {
    if (!isSafeMarkdownHref(href)) return label;
    const external = /^(?:https?:\/\/|\/\/)/i.test(href);
    const attrs = isInternalMarkdownHref(href)
      ? ' data-route'
      : external
        ? ' target="_blank" rel="noopener noreferrer"'
        : '';
    return `<a href="${escapeHtmlAttribute(href)}"${attrs}>${label}</a>`;
  });

  output = output.replace(
    new RegExp(`${CODE_TOKEN_PREFIX.replace(/\u0000/g, '\\u0000')}(\\d+)${CODE_TOKEN_SUFFIX.replace(/\u0000/g, '\\u0000')}`, 'g'),
    (_, index) => codeSpans[Number(index)]
  );

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

const PARAGRAPH_BREAK = /^\s*$/;
const HORIZONTAL_RULE = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/;
const BLOCKQUOTE = /^\s*>\s?/;

// Renders the body of a directive (callout, details) as rich HTML: paragraphs,
// unordered lists and ordered lists. The blocks are intentionally smaller than
// the page parser - a directive holds prose, not a whole document.
const renderRich = (text) => {
  const lines = text.split('\n');
  const parts = [];
  let paragraph = [];
  let list = null;
  let listTag = '';

  const flushParagraph = () => {
    if (!paragraph.length) return;
    parts.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    parts.push(`<${listTag}>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('')}</${listTag}>`);
    list = null;
    listTag = '';
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.*)$/);
    if (unordered) {
      flushParagraph();
      if (listTag !== 'ul') {
        flushList();
        listTag = 'ul';
        list = [];
      }
      list.push(unordered[1]);
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.*)$/);
    if (ordered) {
      flushParagraph();
      if (listTag !== 'ol') {
        flushList();
        listTag = 'ol';
        list = [];
      }
      list.push(ordered[1]);
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return parts.join('');
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

   // A table row must START with "|". Matching includes("|") instead turned
    // any list item containing a union into a table, because the NEXT list
    // item starts with "-" and so matched the delimiter-row test. An API
    // list like
    //
    //     - `variant` (`neutral` | `accent` | `success`, default `neutral`)
    //     - `label` (string) -- the text
    //
    // became a one-row table, and every item after it vanished behind a
    // "No data". Every real table row in src/markdown starts with "|"
    // (173 of 173), so requiring it costs nothing and fixes all four of the
    // affected pages at once.
    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*-/.test(lines[i + 1])) {
      const tableLines = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
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

    if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) {
      const { block, next } = parseList(lines, i);
      blocks.push(block);
      i = next;
      continue;
    }

    if (BLOCKQUOTE.test(line)) {
      const paragraphs = [];
      let current = [];
      while (i < lines.length && BLOCKQUOTE.test(lines[i])) {
        const quoted = lines[i].replace(BLOCKQUOTE, '');
        if (PARAGRAPH_BREAK.test(quoted)) {
          if (current.length) paragraphs.push(current.join(' ').trim());
          current = [];
        } else {
          current.push(quoted.trim());
        }
        i++;
      }
      if (current.length) paragraphs.push(current.join(' ').trim());
      const clean = paragraphs.filter(Boolean);
      if (clean.length) blocks.push({ type: 'blockquote', paragraphs: clean });
      continue;
    }

    if (HORIZONTAL_RULE.test(line)) {
      blocks.push({ type: 'hr' });
      i++;
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
      !/^\d+\.\s/.test(lines[i]) &&
      !BLOCKQUOTE.test(lines[i]) &&
      !HORIZONTAL_RULE.test(lines[i]) &&
      !/^\s*\|/.test(lines[i])
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }
    pushParagraph(paragraphLines);
  }

  return blocks;
};

// A list, with nested lists by indentation:
//
//     - `variant`:
//       - `'filled'` (default)
//       - `'surface'`
//     - `size`
//
// Each item is { text, children }, where children are the nested lists under
// it. A deeper-indented line opens a list under the item above it; a
// shallower one closes it. Bullets and numbers can nest in each other. Without
// this, an indented "  - " line ended the list and printed as a paragraph of
// dashes.
const LIST_ITEM = /^(\s*)([-*]|\d+\.)\s+(.*)$/;

const parseList = (lines, start) => {
  const first = lines[start].match(LIST_ITEM);
  const indent = first[1].length;
  const ordered = /\d/.test(first[2]);
  const items = [];
  let i = start;
  while (i < lines.length) {
    const match = lines[i].match(LIST_ITEM);
    if (!match) {
      const line = lines[i];
      const trimmed = line.trim();

      // A wrapped list item (the next line is prose, not a new item) belongs to
      // the item above it. Without this, a two-line instruction became an <ol>
      // with one item plus a paragraph, then another <ol> for the next item.
      if (!trimmed) break;
      if (/^\s*(?:#|```|:::|>|\|)/.test(line) || HORIZONTAL_RULE.test(line)) break;
      if (!items.length) break;

      items[items.length - 1].text = `${items[items.length - 1].text} ${trimmed}`.trim();
      i++;
      continue;
    }

    const depth = match[1].length;
    if (depth < indent) break;
    if (depth > indent) {
      const { block, next } = parseList(lines, i);
      if (!items.length) items.push({ text: '', children: [] });
      items[items.length - 1].children.push(block);
      i = next;
      continue;
    }
    if (/\d/.test(match[2]) !== ordered) break;
    items.push({ text: match[3].trim(), children: [] });
    i++;
  }
  return { block: { type: ordered ? 'ol' : 'ul', items }, next: i };
};

const renderList = (block) => {
  const tag = block.type === 'ol' ? 'ol' : 'ul';
  const items = block.items.map((item) => {
    // Older callers may still hand in plain strings.
    if (typeof item === 'string') return `<li>${inlineMarkdown(item)}</li>`;
    const nested = (item.children || []).map(renderList).join('');
    return `<li>${inlineMarkdown(item.text)}${nested}</li>`;
  }).join('');
  return `<${tag}>${items}</${tag}>`;
};

// An escaped pipe (\|) is a character inside a cell - a union type, a value in
// prose - not a column break. Split on the escape first, then restore it.
const splitTableRow = (line) => {
  let value = line.trim();
  if (value.startsWith('|')) value = value.slice(1);
  if (value.endsWith('|')) value = value.slice(0, -1);
  const mark = '\u0001';
  const escapedPipe = '\\|';
  return value
    .split(escapedPipe)
    .join(mark)
    .split('|')
    .map((cell) => cell.split(mark).join('|').trim());
};

const plainInline = (text) => {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
};

const CALLOUTS = {
  tip: { tone: 'success', title: 'Tip', variant: 'soft' },
  warning: { tone: 'warning', title: 'Warning', variant: 'soft' },
  note: { tone: 'neutral', title: 'Note', variant: 'ghost' },
  info: { tone: 'info', title: 'Note', variant: 'soft' },
  success: { tone: 'success', title: 'Success', variant: 'soft' },
  danger: { tone: 'danger', title: 'Warning', variant: 'soft' }
};

const buildBreadcrumbItems = (frontMatter) => {
  if (!frontMatter) return [];
  const items = [{ text: 'Docs', path: '/Documentation' }];
  if (frontMatter.section) items.push({ text: frontMatter.section });
  if (frontMatter.group && frontMatter.group !== frontMatter.section) {
    items.push({ text: frontMatter.group });
  }
  if (items.length === 1) {
    items.push({ text: frontMatter.navLabel || frontMatter.title || 'Documentation' });
  }
  return items;
};

const readingTime = (body) => {
  const plain = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/[#>*_|[\]-]/g, ' ');
  const words = plain.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
};

const renderBlocks = (blocks, options = {}) => {
  const frontMatter = options.frontMatter;
  const body = options.body || '';
  const status = Array.isArray(frontMatter?.status) ? frontMatter.status[0] : frontMatter?.status;
  const htmlParts = [];
  const jsBlocks = [];
  let blockId = 0;
  const usedIds = new Set();
  let hasTitle = false;

  const nextId = () => `doc-block-${++blockId}`;

  if (frontMatter) {
    const id = nextId();
    htmlParts.push(`
<div class="doc-page-meta">
  <div class="doc-breadcrumb" data-block-id="${id}"></div>
  <span class="doc-reading-time">${readingTime(body)} min read</span>
</div>`);
    jsBlocks.push({ type: 'breadcrumb', id, items: buildBreadcrumbItems(frontMatter) });
  }

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
        const statusId = status ? nextId() : '';
        htmlParts.push(`
<div class="doc-title-bar">
  <h1 id="${unique}">
    <span class="doc-title-text">${inlineMarkdown(block.text)}</span>${status ? `\n    <span class="doc-status" data-block-id="${statusId}"></span>` : ''}
    <span class="copy-md-slot" data-copy-md></span>
  </h1>
</div>`);
        if (status) {
          jsBlocks.push({ type: 'status', id: statusId, status: String(status) });
        }
        if (frontMatter?.description) {
          htmlParts.push(`<p class="doc-lede">${inlineMarkdown(frontMatter.description)}</p>`);
        }
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

    if (block.type === 'ul' || block.type === 'ol') {
      htmlParts.push(renderList(block));
      continue;
    }

    if (block.type === 'blockquote') {
      const paragraphs = block.paragraphs.map((text) => `<p>${inlineMarkdown(text)}</p>`).join('');
      htmlParts.push(`<blockquote>${paragraphs}</blockquote>`);
      continue;
    }

    if (block.type === 'hr') {
      htmlParts.push('<hr>');
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
      const cells = block.rows.map(splitTableRow);
      const headers = (cells[0] || []).map(plainInline);
      const rows = cells.slice(2).map((row) => row.map((cell) => ({ html: inlineMarkdown(cell) })));
      jsBlocks.push({ type: 'table', id, headers, rows });
      continue;
    }

    if (block.type === 'directive') {
      const name = block.name.toLowerCase();

      if (name === 'details') {
        const id = nextId();
        htmlParts.push(`<div class="details-block" data-block-id="${id}"></div>`);
        jsBlocks.push({
          type: 'details',
          id,
          title: block.attrs.title || '',
          html: renderRich(block.content)
        });
        continue;
      }

      const preset = CALLOUTS[name];
      if (preset || name === 'callout') {
        const id = nextId();
        htmlParts.push(`<div class="callout-block" data-block-id="${id}"></div>`);
        jsBlocks.push({
          type: 'callout',
          id,
          tone: block.attrs.tone || preset?.tone || 'info',
          variant: block.attrs.variant || preset?.variant || 'soft',
          title: block.attrs.title || preset?.title || 'Note',
          html: renderRich(block.content)
        });
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

      if (name === 'compare') {
        const id = nextId();
        const parts = block.content.split(/\n\s*---\s*\n/);
        htmlParts.push(`<div class="compare-block" data-block-id="${id}"></div>`);
        jsBlocks.push({
          type: 'compare',
          id,
          left: {
            title: block.attrs.left || block.attrs.do || 'Do',
            tone: block.attrs.leftTone || 'success',
            html: renderRich(parts[0] || '')
          },
          right: {
            title: block.attrs.right || block.attrs.dont || "Don't",
            tone: block.attrs.rightTone || 'danger',
            html: renderRich(parts[1] || '')
          }
        });
        continue;
      }

      if (name === 'related') {
        const items = block.content
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.startsWith('- '))
          .map((line) => {
            const raw = line.slice(2).trim();
            const linked = raw.match(/^\[([^\]]+)\]\(([^)\s]+)\)\s*(?:[-—–]\s*(.*))?$/);
            if (linked) {
              return {
                title: plainInline(linked[1]),
                path: linked[2],
                text: plainInline(linked[3] || '')
              };
            }
            const parts = raw.split('|').map((part) => part.trim());
            if (parts.length < 2) return null;
            return {
              title: plainInline(parts[0]),
              path: parts[1],
              text: plainInline(parts[2] || '')
            };
          })
          .filter(Boolean);

        if (!items.length) {
          htmlParts.push(`<div class="doc-directive doc-directive-related">${renderRich(block.content)}</div>`);
          continue;
        }

        const id = nextId();
        htmlParts.push(`<div class="related-block" data-block-id="${id}"></div>`);
        jsBlocks.push({ type: 'related', id, items });
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
        const id = nextId();
        htmlParts.push(`<div class="script-block" data-block-id="${id}"></div>`);
        jsBlocks.push({
          type: 'script',
          id,
          attrs: block.attrs,
          content: block.content
        });
        continue;
      }

      if (name === 'html') {
        htmlParts.push(block.content);
        continue;
      }

      // Unknown directive: render its body instead of silently dropping it.
      // That is how three `:::note` blocks used to disappear from the docs.
      htmlParts.push(`<div class="doc-directive doc-directive-${name}">${renderRich(block.content)}</div>`);
    }
  }

  return { html: htmlParts.join('\n'), jsBlocks };
};

const parseMarkdownFile = (filePath, options = {}) => {
  const projectRoot = options.projectRoot;
  // Strip a UTF-8 BOM: Windows editors can save one, and it sits before the
  // opening `---`, so the front matter would not be found at all. Normalize
  // CRLF/lone CR to LF as well: the block parser treats `\r` as a line
  // terminator, which made list items at the end of CRLF files fail to match.
  const content = fs
    .readFileSync(filePath, 'utf8')
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n');
  const { data, body } = parseFrontMatter(content);

  let enrichedBody = body;
  if (data && projectRoot) {
    const staticPropsSection = buildStaticPropsSectionForFrontMatter({
      projectRoot,
      frontMatter: data
    });
    if (staticPropsSection) {
      enrichedBody = `${body.trimEnd()}\n\n${staticPropsSection}\n`;
    }
  }

  const blocks = parseBlocks(enrichedBody);
  const { html, jsBlocks } = renderBlocks(blocks, { frontMatter: data, body });
  if (data) {
    data.markdownSource = content;
  }
  return { frontMatter: data, html, jsBlocks };
};

export { parseMarkdownFile };
