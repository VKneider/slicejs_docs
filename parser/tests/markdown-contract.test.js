import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { parseMarkdownFile } from '../lib/markdownParser.js';
import { lintCalloutBudget } from '../index.js';

const fixture = `---
title: Contract Fixture
route: /Documentation/Contract-Fixture
navLabel: Contract Fixture
section: Components
group: Component Model
order: 99
description: A fixture for the shared markdown contract.
component: ContractFixture
status: new
tags: [test]
---

# Contract Fixture

A paragraph with [Services](/Documentation/Service) and an [external link](https://example.com).

> A quoted aside with \`code\`.

1. First step wraps
   onto another line.
2. Second step.

- Parent item
  - Nested item

| Name | Notes |
| --- | --- |
| \`slice.build\` | See [Docs](/Documentation/Service). |

:::note
A quiet note.
:::

:::compare left="Do" right="Don't"
Update the prop.
---
Destroy and rebuild.
:::

:::related
- [Component Anatomy](/Documentation/Component-Anatomy) - How files fit together.
- [Static Props](/Documentation/Static-Props) - Typed props.
:::
`;

const parseFixture = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slice-docs-contract-'));
  const file = path.join(dir, 'contract.md');
  fs.writeFileSync(file, fixture, 'utf8');
  try {
    return parseMarkdownFile(file);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

test('internal and external links are rendered, never left as literal markdown', () => {
  const { html } = parseFixture();

  assert.match(html, /<a href="\/Documentation\/Service" data-route>Services<\/a>/);
  assert.match(html, /<a href="https:\/\/example.com" target="_blank" rel="noopener noreferrer">external link<\/a>/);
  assert.doesNotMatch(html, /\[Services\]\(/);
});

test('blockquotes render as blockquote paragraphs', () => {
  const { html } = parseFixture();
  assert.match(html, /<blockquote><p>A quoted aside with <code>code<\/code>\.<\/p><\/blockquote>/);
});

test('wrapped list items stay in one list and nested lists stay nested', () => {
  const { html } = parseFixture();
  assert.match(
    html,
    /<ol><li>First step wraps onto another line\.<\/li><li>Second step\.<\/li><\/ol>/
  );
  assert.match(
    html,
    /<ul><li>Parent item<ul><li>Nested item<\/li><\/ul><\/li><\/ul>/
  );
});

test('table cells keep inline links and code', () => {
  const { jsBlocks } = parseFixture();
  const table = jsBlocks.find((block) => block.type === 'table');
  assert.ok(table);
  assert.deepEqual(table.headers, ['Name', 'Notes']);
  assert.match(table.rows[0][0].html, /<code>slice\.build<\/code>/);
  assert.match(table.rows[0][1].html, /<a href="\/Documentation\/Service" data-route>Docs<\/a>/);
});

test('note renders as a quiet Callout and compare renders two sides', () => {
  const { jsBlocks } = parseFixture();
  const note = jsBlocks.find((block) => block.type === 'callout');
  const compare = jsBlocks.find((block) => block.type === 'compare');

  assert.ok(note);
  assert.equal(note.tone, 'neutral');
  assert.equal(note.variant, 'ghost');

  assert.ok(compare);
  assert.equal(compare.left.title, 'Do');
  assert.equal(compare.right.title, "Don't");
  assert.match(compare.left.html, /Update the prop/);
  assert.match(compare.right.html, /Destroy and rebuild/);
});

test('related links and the status badge become blocks', () => {
  const { jsBlocks } = parseFixture();
  const related = jsBlocks.find((block) => block.type === 'related');
  const status = jsBlocks.find((block) => block.type === 'status');

  assert.ok(related);
  assert.equal(related.items.length, 2);
  assert.equal(related.items[0].path, '/Documentation/Component-Anatomy');
  assert.match(related.items[0].text, /How files fit together/);

  assert.ok(status);
  assert.equal(status.status, 'new');
});

test('breadcrumb and lede come from front matter', () => {
  const { html, jsBlocks } = parseFixture();
  const breadcrumb = jsBlocks.find((block) => block.type === 'breadcrumb');

  assert.ok(breadcrumb);
  assert.deepEqual(breadcrumb.items, [
    { text: 'Docs', path: '/Documentation' },
    { text: 'Components' },
    { text: 'Component Model' }
  ]);
  assert.match(html, /<p class="doc-lede">A fixture for the shared markdown contract\.<\/p>/);
});

test('the callout budget allows three callouts and rejects a fourth', () => {
  const page = (count) => `# Page\n\n${':::tip\nAdvice.\n:::\n\n'.repeat(count)}`;

  assert.deepEqual(lintCalloutBudget(page(3), 'markdown/page.md'), []);

  const errors = lintCalloutBudget(page(4), 'markdown/page.md');

  assert.equal(errors.length, 1);
  assert.match(errors[0], /markdown\/page\.md/);
  assert.match(errors[0], /4 callouts/);
  assert.match(errors[0], /:::compare/);
});

test('the callout budget does not count compare, details, steps or related', () => {
  const markdown = [
    ':::tip', 'One.', ':::',
    ':::compare left="A" right="B"', 'Left.', '---', 'Right.', ':::',
    ':::details title="More"', 'Body.', ':::',
    ':::steps', '1. First.', ':::',
    ':::related', '- [Button](/Documentation/Button) - The button.', ':::',
    ':::warning', 'Two.', ':::',
    ':::note', 'Three.', ':::'
  ].join('\n');

  assert.deepEqual(lintCalloutBudget(markdown, 'markdown/page.md'), []);
});

test('the callout budget ignores ::: inside a code fence', () => {
  const markdown = ['```md', ':::tip', 'A.', ':::', ':::warning', 'B.', ':::', ':::note', 'C.', ':::', ':::callout', 'D.', ':::', '```'].join('\n');

  assert.deepEqual(lintCalloutBudget(markdown, 'markdown/page.md'), []);
});
