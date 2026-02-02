// Slice.js markdown parser
// Converts markdown docs into component files and route entries.

import fs from 'fs';
import path from 'path';
import { parseMarkdownFile } from './lib/markdownParser.js';
import { writeComponentFiles } from './lib/generator.js';
import { collectDocCandidates } from './lib/report.js';

const ROOT = path.resolve(process.cwd(), 'slicejs_docs');
const MARKDOWN_DIR = path.join(ROOT, 'markdown');
const OUTPUT_DIR = path.join(ROOT, 'src', 'Components', 'AppComponents');

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

const readAllAppComponents = (dir) => {
  if (!fs.existsSync(dir)) return [];
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

const run = () => {
  const markdownFiles = readAllMarkdownFiles(MARKDOWN_DIR);
  console.log(`Found ${markdownFiles.length} markdown files`);

  const generated = [];

  for (const filePath of markdownFiles) {
    try {
      const parsed = parseMarkdownFile(filePath);
      if (!parsed.frontMatter) {
        console.log(`Skipped ${path.relative(ROOT, filePath)} (no front matter)`);
        continue;
      }
      const markdownPath = path.relative(MARKDOWN_DIR, filePath).replace(/\\/g, '/');
      const result = writeComponentFiles(parsed, OUTPUT_DIR, markdownPath);
      generated.push({ filePath, component: result.componentClass });
      console.log(`Generated ${result.componentClass} from ${path.relative(ROOT, filePath)}`);
    } catch (error) {
      console.warn(`Failed to parse ${filePath}:`, error.message);
    }
  }

  const appComponents = readAllAppComponents(OUTPUT_DIR);
  const report = collectDocCandidates(appComponents);

  const reportPath = path.join(ROOT, 'parser', 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ generated, ...report }, null, 2), 'utf8');

  console.log('Report written to parser/report.json');
};

run();
