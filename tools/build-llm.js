import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'slicejs_docs');
const MARKDOWN_DIR = path.join(ROOT, 'markdown');
const OUTPUT_PATH = path.join(ROOT, 'llm.txt');

const shouldSkip = (filePath) => {
  const base = path.basename(filePath).toLowerCase();
  return base === 'markdown_spec.md' || base === 'index.md' || base === 'markdown-guide.md';
};

const stripFrontMatter = (content) => {
  if (!content.startsWith('---')) return content;
  const end = content.indexOf('\n---');
  if (end === -1) return content;
  return content.slice(end + 4).replace(/^\n+/, '');
};

const readMarkdownFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...readMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
};

const build = () => {
  if (!fs.existsSync(MARKDOWN_DIR)) {
    throw new Error(`Markdown directory not found: ${MARKDOWN_DIR}`);
  }

  const files = readMarkdownFiles(MARKDOWN_DIR)
    .filter((file) => !shouldSkip(file))
    .sort();

  const chunks = [];
  for (const filePath of files) {
    const relative = path.relative(ROOT, filePath).replace(/\\/g, '/');
    const raw = fs.readFileSync(filePath, 'utf8');
    const content = stripFrontMatter(raw).trim();
    if (!content) continue;
    chunks.push(`=== ${relative} ===\n${content}`);
  }

  const output = chunks.join('\n\n');
  fs.writeFileSync(OUTPUT_PATH, output, 'utf8');
  console.log(`Wrote ${OUTPUT_PATH} (${files.length} files)`);
};

try {
  build();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
