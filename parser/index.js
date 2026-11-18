// Slice.js markdown parser
// Converts markdown docs into component files and route entries.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseMarkdownFile } from './lib/markdownParser.js';
import { writeComponentFiles } from './lib/generator.js';
import { collectDocCandidates } from './lib/report.js';
import { writeDocsIndex } from './lib/docsIndex.js';
import { writeDocumentationRoutes } from './lib/tree.js';
import { writeSeoArtifacts } from './lib/seo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const MARKDOWN_DIR = path.join(ROOT, 'markdown');
const OUTPUT_DIR = path.join(ROOT, 'src', 'Components', 'AppComponents');
const PUBLIC_DIR = path.join(ROOT, 'src', 'public');
const STYLE_TEMPLATE = path.join(__dirname, 'templates', 'DocumentationBase.css');
const STYLE_TARGET = path.join(PUBLIC_DIR, 'Styles', 'DocumentationBase.css');

// The base documentation stylesheet is part of the shared markdown contract.
// Keep the editable copy in parser/templates/ and let docs:generate publish it,
// exactly like the component-docs parser does.
const syncDocumentationBase = () => {
  if (!fs.existsSync(STYLE_TEMPLATE)) return false;
  const next = fs.readFileSync(STYLE_TEMPLATE, 'utf8');
  const previous = fs.existsSync(STYLE_TARGET) ? fs.readFileSync(STYLE_TARGET, 'utf8') : '';
  if (previous === next) return false;
  fs.mkdirSync(path.dirname(STYLE_TARGET), { recursive: true });
  fs.writeFileSync(STYLE_TARGET, next, 'utf8');
  return true;
};

const readAllMarkdownFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...readAllMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
};

const readAllAppComponents = (dir) => {  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...readAllAppComponents(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push({ filePath: fullPath, content: fs.readFileSync(fullPath, 'utf8') });
    }
  }

  return files;
};

// The shared contract keeps a page to at most three callouts: a fourth tip in
// a row is usually a table, a Details block, a compare or plain prose. Both
// docs sites follow the same budget, so a page cannot drift from the contract.
const CALLOUT_BUDGET = 3;
const CALLOUT_DIRECTIVES = new Set(['tip', 'warning', 'note', 'info', 'success', 'danger', 'callout']);

const lintCalloutBudget = (markdownSource, filePath) => {
  if (!markdownSource || typeof markdownSource !== 'string') {
    return [];
  }

  const lines = markdownSource.split(/\r?\n/);
  const found = [];
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const name = line.match(/^:::([a-zA-Z-]+)/)?.[1]?.toLowerCase();
    if (name && CALLOUT_DIRECTIVES.has(name)) {
      found.push(i + 1);
    }
  }

  if (found.length <= CALLOUT_BUDGET) {
    return [];
  }

  return [
    `[${filePath}] ${found.length} callouts (lines ${found.join(', ')}); the contract allows ${CALLOUT_BUDGET}. ` +
      'Turn the rest into prose, :::compare, :::details or :::related.'
  ];
};

const lintMarkdown = () => {
  const errors = [];
  for (const filePath of readAllMarkdownFiles(MARKDOWN_DIR)) {
    const parsed = parseMarkdownFile(filePath);
    if (!parsed.frontMatter) continue;
    const relative = path.relative(ROOT, filePath).replace(/\\/g, '/');
    errors.push(...lintCalloutBudget(parsed.frontMatter.markdownSource || '', relative));
  }
  return errors;
};

const run = () => {
  const lintOnly = process.argv.includes('--lint-only');
  const lintErrors = lintMarkdown();
  if (lintErrors.length > 0) {
    console.error('Markdown lint failed:');
    for (const error of lintErrors) console.error(`- ${error}`);
    process.exit(1);
  }
  if (lintOnly) {
    console.log('Markdown lint completed successfully.');
    return;
  }

  const markdownFiles = readAllMarkdownFiles(MARKDOWN_DIR);
  console.log(`Found ${markdownFiles.length} markdown files`);

  const generated = [];
  const indexEntries = [];
  const seoEntries = [];
  const parseErrors = [];

  for (const filePath of markdownFiles) {
    try {
      const parsed = parseMarkdownFile(filePath);
      if (!parsed.frontMatter) {
        console.log(`Skipped ${path.relative(ROOT, filePath)} (no front matter)`);
        continue;
      }
      const generateFlag = parsed.frontMatter.generate;
      const isGenerateFalse = generateFlag === false || String(generateFlag).toLowerCase() === 'false';
      const isMarkdownGuide = path.basename(filePath).toLowerCase() === 'markdown-guide.md';
      if (!isMarkdownGuide) {
        indexEntries.push(parsed.frontMatter);
        seoEntries.push({
          route: parsed.frontMatter.route,
          title: parsed.frontMatter.title,
          description: parsed.frontMatter.description,
          section: parsed.frontMatter.section,
          group: parsed.frontMatter.group,
          markdownFile: path.relative(ROOT, filePath).replace(/\\/g, '/')
        });
      }
      if (isGenerateFalse || isMarkdownGuide) {
        console.log(`Skipped ${path.relative(ROOT, filePath)} (generate: false)`);
        continue;
      }
      const markdownPath = path.relative(MARKDOWN_DIR, filePath).replace(/\\/g, '/');
      const result = writeComponentFiles(parsed, OUTPUT_DIR, markdownPath);
      generated.push({ filePath, component: result.componentClass });
      console.log(`Generated ${result.componentClass} from ${path.relative(ROOT, filePath)}`);
    } catch (error) {
      parseErrors.push(`[${path.relative(ROOT, filePath)}] ${error.message}`);
    }
  }

  if (parseErrors.length > 0) {
    console.error('Markdown parsing failed:');
    for (const error of parseErrors) console.error(`- ${error}`);
    process.exit(1);
  }

  const appComponents = readAllAppComponents(OUTPUT_DIR);
  const report = collectDocCandidates(appComponents);

  const docsIndexPath = path.join(ROOT, 'src', 'Components', 'AppComponents', 'DocumentationPage', 'docsIndex.js');
  writeDocsIndex(indexEntries, docsIndexPath);

  const treePath = path.join(ROOT, 'src', 'Components', 'AppComponents', 'DocumentationPage', 'documentationRoutes.js');
  writeDocumentationRoutes(indexEntries, treePath);

  const seo = writeSeoArtifacts({ root: ROOT, publicDir: PUBLIC_DIR, entries: seoEntries });
  if (seo.changed.length > 0) {
    console.log(`SEO artifacts updated: ${seo.changed.join(', ')}`);
  }

  if (syncDocumentationBase()) {
    console.log('DocumentationBase.css synced from parser/templates');
  }

  const reportPath = path.join(ROOT, 'parser', 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ generated, ...report }, null, 2), 'utf8');

  console.log('Report written to parser/report.json');
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isMain) {
  run();
}

export { lintCalloutBudget };
