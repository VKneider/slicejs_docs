import fs from 'fs';
import path from 'path';

const escapeValue = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
};

const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    const raw = tags.trim();
    if (raw.startsWith('[') && raw.endsWith(']')) {
      const inner = raw.slice(1, -1).trim();
      if (!inner) return [];
      return inner
        .split(',')
        .map((item) => item.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, ''))
        .filter(Boolean);
    }
    return [raw];
  }
  return [];
};

const normalizeFrontMatter = (frontMatter) => {
  const tags = parseTags(frontMatter.tags);
  return {
    title: frontMatter.title || '',
    route: frontMatter.route || '',
    description: frontMatter.description || '',
    section: frontMatter.section || '',
    group: frontMatter.group || '',
    order: Number(frontMatter.order) || 0,
    navLabel: frontMatter.navLabel || '',
    tags
  };
};

const buildDocsIndex = (entries) => {
  const index = entries
    .map(normalizeFrontMatter)
    .filter((entry) => entry.title && entry.route)
    .sort((a, b) => {
      if (a.section !== b.section) return a.section.localeCompare(b.section);
      if (a.group !== b.group) return a.group.localeCompare(b.group);
      return a.order - b.order;
    });

  const lines = [];
  lines.push('const docsIndex = [');
  for (const entry of index) {
    const tagsValue = entry.tags.map((tag) => `\'${escapeValue(tag)}\'`).join(', ');
    lines.push('  {');
    lines.push(`    title: '${escapeValue(entry.title)}',`);
    lines.push(`    route: '${escapeValue(entry.route)}',`);
    lines.push(`    description: '${escapeValue(entry.description)}',`);
    lines.push(`    section: '${escapeValue(entry.section)}',`);
    lines.push(`    group: '${escapeValue(entry.group)}',`);
    lines.push(`    order: ${entry.order},`);
    lines.push(`    navLabel: '${escapeValue(entry.navLabel)}',`);
    lines.push(`    tags: [${tagsValue}]`);
    lines.push('  },');
  }
  lines.push('];');
  lines.push('');
  lines.push('export default docsIndex;');
  lines.push('');

  return lines.join('\n');
};

const writeDocsIndex = (entries, outputPath) => {
  const content = buildDocsIndex(entries);
  fs.writeFileSync(outputPath, content, 'utf8');
};

export { writeDocsIndex };
