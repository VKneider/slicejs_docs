import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { parseMarkdownFile } from '../lib/markdownParser.js';

test('parseMarkdownFile reads front matter with CRLF line endings', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'slice-docs-parser-'));
  const filePath = path.join(tmpDir, 'sample.md');
  const markdown = [
    '---',
    'title: Sample',
    'route: /Documentation/Sample',
    'component: SampleDocumentation',
    '---',
    '',
    '# Sample',
    '',
    'Body'
  ].join('\r\n');

  fs.writeFileSync(filePath, markdown, 'utf8');
  const parsed = parseMarkdownFile(filePath);

  assert.equal(parsed.frontMatter?.title, 'Sample');
  assert.equal(parsed.frontMatter?.route, '/Documentation/Sample');
  assert.equal(parsed.frontMatter?.component, 'SampleDocumentation');
});
