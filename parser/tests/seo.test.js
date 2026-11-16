import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildSitemap } from '../lib/seo.js';

const ROOT = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const MANIFEST_PATH = path.join(ROOT, 'src', 'public', 'seo.json');
const SITEMAP_PATH = path.join(ROOT, 'src', 'public', 'sitemap.xml');
const OG_DIR = path.join(ROOT, 'src', 'public', 'og');
const OG_MANIFEST_PATH = path.join(OG_DIR, 'manifest.json');
const OG_BUDGET_BYTES = 120 * 1024;

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

test('sitemap.xml is in sync with seo.json', () => {
  assert.equal(sitemap.trim(), buildSitemap(manifest).trim());
});

test('every sitemap URL has a manifest entry and is indexable', () => {
  for (const loc of locs) {
    const route = loc.slice(manifest.origin.length) || '/';
    const meta = manifest.routes[route];
    assert.ok(meta, `sitemap URL without manifest entry: ${route}`);
    assert.notEqual(meta.robots, false, `${route} is noindex but appears in the sitemap`);
  }
});

test('every indexable manifest route appears in the sitemap', () => {
  for (const [route, meta] of Object.entries(manifest.routes)) {
    if (meta.robots === false || meta.robots?.index === false) continue;
    assert.ok(
      locs.includes(`${manifest.origin}${route}`),
      `indexable route missing from sitemap: ${route}`
    );
  }
});

test('hidden routes never leak into the sitemap', () => {
  assert.ok(!locs.includes(`${manifest.origin}/404`));
});

test('titles and descriptions are present on indexable routes', () => {
  for (const [route, meta] of Object.entries(manifest.routes)) {
    assert.ok(meta.title?.trim(), `missing title: ${route}`);
    if (meta.robots === false || meta.robots?.index === false) continue;
    assert.ok(meta.description?.trim(), `missing description: ${route}`);
  }
});

test('the documentation entries added for Deployment, SEO and Server Entrypoint are indexable', () => {
  for (const route of [
    '/Documentation/Deployment',
    '/Documentation/Architecture/SEO',
    '/Documentation/Architecture/Server-Entrypoint'
  ]) {
    assert.ok(manifest.routes[route], `missing route: ${route}`);
    assert.ok(locs.includes(`${manifest.origin}${route}`), `missing sitemap URL: ${route}`);
  }
});

test('every indexable route has an OG card and no image is orphaned', () => {
  assert.ok(fs.existsSync(OG_MANIFEST_PATH), 'src/public/og/manifest.json is missing');
  const og = JSON.parse(fs.readFileSync(OG_MANIFEST_PATH, 'utf8'));

  assert.equal(og.origin, manifest.origin);
  assert.equal(og.card?.width, 1200);
  assert.equal(og.card?.height, 630);

  for (const [route, meta] of Object.entries(manifest.routes)) {
    if (meta.robots === false || meta.robots?.index === false) continue;
    const entry = og.images?.[route];
    assert.ok(entry, `missing OG card: ${route}`);

    const file = path.join(ROOT, 'src', 'public', entry.path.replace(/^\//, ''));
    assert.ok(fs.existsSync(file), `missing OG file: ${entry.path}`);
    assert.equal(entry.width, 1200, `${route}: wrong manifest width`);
    assert.equal(entry.height, 630, `${route}: wrong manifest height`);

    const bytes = fs.statSync(file).size;
    assert.equal(entry.bytes, bytes, `${route}: manifest bytes disagree with the file`);
    assert.ok(bytes <= OG_BUDGET_BYTES, `${route}: ${bytes} bytes over budget`);
  }

  const referenced = new Set(Object.values(og.images || {}).map((entry) => path.basename(entry.path)));
  const files = fs.readdirSync(OG_DIR).filter((name) => name.endsWith('.png') || name.endsWith('.jpg'));
  for (const name of files) {
    assert.ok(referenced.has(name), `orphan OG file: ${name}`);
  }
});
