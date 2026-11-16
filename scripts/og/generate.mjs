#!/usr/bin/env node
// Generate one 1200×630 social card per indexable documentation route.
//
//   pnpm run og:generate                 # every indexable route
//   pnpm run og:generate -- --only=/Documentation/Deployment
//   pnpm run og:generate -- --base-url=http://localhost:3001
//   pnpm run og:check                    # validate the committed manifest only
//   pnpm run og:generate -- --prune      # remove retired routes/cards, no browser
//
// The capture uses the Playwright already installed by `slicejs-components`
// (the sibling repo), so docs does not need its own Playwright dependency.
// Override it with SLICE_PLAYWRIGHT=/path/to/@playwright/test/index.mjs.
//
// Each card is generated from the real page: the route is opened against a
// real server, the top 1200×630 of the page is captured, and the title/section
// card is composed in Chromium. The content hash in the filename makes every
// new image a new URL, because social platforms cache previews per URL.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { CARD, CARD_VERSION, buildCardHtml, displayTitle, routeSlug } from './card.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const PUBLIC = path.join(ROOT, 'src', 'public');
const SEO_MANIFEST = path.join(PUBLIC, 'seo.json');
const MARKDOWN_DIR = path.join(ROOT, 'markdown');
const OG_DIR = path.join(PUBLIC, 'og');
const OG_MANIFEST = path.join(OG_DIR, 'manifest.json');
const BUDGET_BYTES = 120 * 1024;
const DEVICE_SCALE = 1;

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name) => {
  const hit = args.find((arg) => arg.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : null;
};

const CHECK = flag('check');
const ONLY = value('only');
const PRUNE = flag('prune');
const BASE_URL = value('base-url');
const CONCURRENCY = Number(value('concurrency')) || 4;

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const log = (...parts) => console.log(...parts);
const isImageFile = (name) => name.endsWith('.png') || name.endsWith('.jpg');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

const writeIfChanged = (file, content) => {
  const next = `${JSON.stringify(content, null, 2)}\n`;
  const prev = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (prev === next) return false;
  fs.writeFileSync(file, next);
  return true;
};

/** Pixel size straight out of the file header — PNG IHDR or JPEG SOF. */
const imageSize = (buffer) => {
  if (buffer.readUInt32BE(0) === 0x89504e47) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  let offset = 2;
  while (offset < buffer.length - 9) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    const isSof = marker >= 0xc0 && marker <= 0xcf
      && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + buffer.readUInt16BE(offset + 2);
  }
  throw new Error('could not read the image size');
};

/** Section/group live only in the markdown front matter, not in seo.json. */
const readDocsMeta = () => {
  const meta = new Map();
  if (!fs.existsSync(MARKDOWN_DIR)) return meta;

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith('.md')) continue;
      const source = fs.readFileSync(full, 'utf8');
      const frontMatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
      if (!frontMatter) continue;
      const field = (key) => {
        const match = new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(frontMatter[1]);
        return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : undefined;
      };
      const route = field('route');
      if (route) meta.set(route, { section: field('section'), group: field('group') });
    }
  };

  walk(MARKDOWN_DIR);
  return meta;
};

const isIndexable = (meta) => Boolean(meta)
  && meta.robots !== false
  && meta.robots?.index !== false;

const indexableRoutes = (seo) => {
  const docsMeta = readDocsMeta();
  return Object.entries(seo.routes || {})
    .filter(([, meta]) => isIndexable(meta))
    .map(([route, meta]) => ({ route, meta: { ...meta, ...(docsMeta.get(route) || {}) } }))
    .sort((a, b) => a.route.localeCompare(b.route));
};

// ── --check: no browser, no server ─────────────────────────────────────────

const runCheck = () => {
  if (!fs.existsSync(SEO_MANIFEST)) {
    console.error('src/public/seo.json is missing. Run: pnpm run docs:generate');
    process.exit(1);
  }
  if (!fs.existsSync(OG_MANIFEST)) {
    console.error('src/public/og/manifest.json is missing. Run: pnpm run og:generate');
    process.exit(1);
  }

  const seo = readJson(SEO_MANIFEST);
  const routes = indexableRoutes(seo);
  const manifest = readJson(OG_MANIFEST);
  const images = manifest.images || {};
  const origin = seo.origin || manifest.origin;
  const problems = [];

  if (manifest.origin !== origin) {
    problems.push(`manifest origin "${manifest.origin}" != seo origin "${origin}"`);
  }
  if (manifest.card?.width !== CARD.width || manifest.card?.height !== CARD.height) {
    problems.push('manifest card size disagrees with the template');
  }

  for (const { route } of routes) {
    const entry = images[route];
    if (!entry) {
      problems.push(`${route}: no OG image`);
      continue;
    }
    const file = path.join(PUBLIC, entry.path.replace(/^\//, ''));
    if (!fs.existsSync(file)) {
      problems.push(`${route}: missing file ${entry.path}`);
      continue;
    }
    const buffer = fs.readFileSync(file);
    const size = imageSize(buffer);
    if (size.width !== CARD.width || size.height !== CARD.height) {
      problems.push(`${route}: ${size.width}×${size.height}, expected ${CARD.width}×${CARD.height}`);
    }
    if (buffer.length > BUDGET_BYTES) {
      problems.push(`${route}: ${kb(buffer.length)} over the ${kb(BUDGET_BYTES)} budget`);
    }
    if (entry.width !== size.width || entry.height !== size.height) {
      problems.push(`${route}: manifest size disagrees with the file`);
    }
  }

  for (const route of Object.keys(images)) {
    if (!routes.some((item) => item.route === route)) {
      problems.push(`${route}: stale manifest entry (route is gone or noindex)`);
    }
  }

  const referenced = new Set(Object.values(images).map((entry) => path.basename(entry.path)));
  const files = fs.existsSync(OG_DIR) ? fs.readdirSync(OG_DIR).filter(isImageFile) : [];
  const total = files.reduce((sum, name) => sum + fs.statSync(path.join(OG_DIR, name)).size, 0);
  for (const name of files) {
    if (!referenced.has(name)) problems.push(`og/${name}: orphan file`);
  }

  if (problems.length) {
    console.error(`OG images: ${problems.length} problem(s)\n${problems.map((p) => `  - ${p}`).join('\n')}`);
    process.exit(1);
  }
  log(`OG images OK: ${routes.length} routes, ${files.length} files, ${kb(total)} total.`);
};

const pruneRetiredCards = () => {
  const seo = readJson(SEO_MANIFEST);
  const manifest = readJson(OG_MANIFEST);
  const routes = new Set(indexableRoutes(seo).map((item) => item.route));
  const previous = manifest.images || {};
  manifest.images = Object.fromEntries(
    Object.entries(previous).filter(([route]) => routes.has(route))
  );
  writeIfChanged(OG_MANIFEST, manifest);

  const referenced = new Set(Object.values(manifest.images).map((entry) => path.basename(entry.path)));
  let removed = 0;
  for (const name of fs.readdirSync(OG_DIR).filter(isImageFile)) {
    if (referenced.has(name)) continue;
    fs.unlinkSync(path.join(OG_DIR, name));
    removed += 1;
  }
  log(`OG: pruned ${Object.keys(previous).length - Object.keys(manifest.images).length} route(s), ${removed} orphan image(s).`);
};

// ── server ─────────────────────────────────────────────────────────────────

const getFreePort = () => new Promise((resolve, reject) => {
  const server = createServer();
  server.unref();
  server.on('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    server.close(() => resolve(port));
  });
});

const waitForServer = async (baseUrl, timeoutMs = 30_000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${baseUrl}/api/status`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`server did not answer at ${baseUrl} within ${timeoutMs} ms`);
};

const startServer = async () => {
  const port = await getFreePort();
  const child = spawn(process.execPath, ['api/index.js'], {
    cwd: ROOT,
    // Capture the source app, not a possibly stale dist/ build.
    env: { ...process.env, PORT: String(port), NODE_ENV: 'development' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (chunk) => { output += chunk; });
  child.stderr.on('data', (chunk) => { output += chunk; });
  const baseUrl = `http://127.0.0.1:${port}`;
  try {
    await waitForServer(baseUrl);
  } catch (error) {
    child.kill();
    throw new Error(`${error.message}\n--- server output ---\n${output}`, { cause: error });
  }
  return { baseUrl, stop: () => child.kill() };
};

// ── Playwright from the sibling components repo ────────────────────────────

const loadPlaywright = async () => {
  const candidates = [
    process.env.SLICE_PLAYWRIGHT,
    path.resolve(ROOT, '..', 'slicejs-components', 'node_modules', '@playwright', 'test', 'index.mjs'),
    path.resolve(ROOT, 'node_modules', '@playwright', 'test', 'index.mjs')
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return import(pathToFileURL(candidate).href);
  }
  try {
    return await import('@playwright/test');
  } catch {
    throw new Error(
      'Playwright was not found. Run this from the slice-workspace (the sibling ' +
      'slicejs-components repo is reused), install @playwright/test, or set ' +
      'SLICE_PLAYWRIGHT=/path/to/@playwright/test/index.mjs'
    );
  }
};

// ── capture + card ─────────────────────────────────────────────────────────

const waitForStableDom = async (page, { quietMs = 350, timeoutMs = 8_000 } = {}) => {
  const deadline = Date.now() + timeoutMs;
  let last = -1;
  let stableSince = 0;
  while (Date.now() < deadline) {
    const size = await page.evaluate(() => document.body.innerHTML.length);
    if (size === last) {
      if (!stableSince) stableSince = Date.now();
      if (Date.now() - stableSince >= quietMs) return;
    } else {
      last = size;
      stableSince = 0;
    }
    await page.waitForTimeout(100);
  }
};

const captureRoute = async (page, baseUrl, route) => {
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForSelector('#app > *', { timeout: 30_000 }).catch(() => {});
  if (route.startsWith('/Documentation')) {
    // The inner MultiRoute is the content area. A blank route leaves it empty
    // (or on slice-loading), which is exactly the failure we must not turn
    // into a valid-looking OG image.
    const mounted = await page.waitForFunction(() => {
      const content = document.querySelector('slice-multi-route');
      return Boolean(content && content.querySelector(':scope > *:not(slice-loading)'));
    }, null, { timeout: 30_000 }).then(() => true).catch(() => false);
    if (!mounted) throw new Error('documentation content did not mount');
  }
  await page.evaluate(() => document.fonts.ready.then(() => true));
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'LIGHT');
    document.documentElement.setAttribute('data-slice-theme', 'LIGHT');
    document.documentElement.style.colorScheme = 'light';
  });
  await waitForStableDom(page);
  await page.waitForTimeout(150);

  return page.screenshot({
    type: 'png',
    animations: 'disabled',
    clip: { x: 0, y: 0, width: CARD.width, height: CARD.height }
  });
};

const renderCard = async (cardPage, { route, meta, shot, host }) => {
  const html = buildCardHtml({
    route,
    title: meta.title,
    section: meta.section,
    group: meta.group,
    description: meta.description,
    host,
    kind: 'page',
    imageData: `data:image/png;base64,${shot.toString('base64')}`
  });

  await cardPage.setContent(html, { waitUntil: 'load' });
  await cardPage.evaluate(() => document.fonts.ready.then(() => true));
  return cardPage.screenshot({
    type: 'jpeg',
    quality: 86,
    animations: 'disabled',
    clip: { x: 0, y: 0, width: CARD.width, height: CARD.height }
  });
};

const runPool = async (items, limit, worker) => {
  let next = 0;
  const lanes = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      await worker(items[index], index);
    }
  });
  await Promise.all(lanes);
};

const generate = async () => {
  if (!fs.existsSync(SEO_MANIFEST)) {
    throw new Error('src/public/seo.json is missing. Run: pnpm run docs:generate');
  }

  const seo = readJson(SEO_MANIFEST);
  const origin = seo.origin || 'https://slicejs.com';
  const host = origin.replace(/^https?:\/\//, '');
  let routes = indexableRoutes(seo).map(({ route, meta }) => ({
    route,
    meta: { ...meta, title: displayTitle(meta.title) }
  }));

  if (ONLY) {
    const wanted = new Set(ONLY.split(',').map((item) => item.trim()).filter(Boolean));
    routes = routes.filter((item) => wanted.has(item.route));
    if (!routes.length) {
      console.error(`--only=${ONLY} matches no indexable route.`);
      process.exit(1);
    }
  }

  fs.mkdirSync(OG_DIR, { recursive: true });
  const previous = fs.existsSync(OG_MANIFEST) ? readJson(OG_MANIFEST) : { images: {} };
  const images = {};

  // `--only` regenerates one card; keep every other committed card and its
  // manifest entry instead of pruning them as if they were retired.
  if (ONLY) {
    const allRoutes = new Set(indexableRoutes(seo).map((item) => item.route));
    const regenerated = new Set(routes.map((item) => item.route));
    for (const [route, entry] of Object.entries(previous.images || {})) {
      if (allRoutes.has(route) && !regenerated.has(route)) images[route] = entry;
    }
  }

  const server = BASE_URL ? null : await startServer();
  const baseUrl = BASE_URL || server.baseUrl;
  log(`OG: ${routes.length} route(s) against ${baseUrl}`);

  const pending = new Map();
  let failed = 0;

  try {
    const { chromium } = await loadPlaywright();
    const browser = await chromium.launch();
    try {
      const captureContext = await browser.newContext({
        viewport: { width: 1440, height: 960 },
        deviceScaleFactor: DEVICE_SCALE,
        colorScheme: 'light',
        reducedMotion: 'reduce',
        locale: 'en-US',
        timezoneId: 'UTC'
      });
      const cardContext = await browser.newContext({
        viewport: CARD,
        deviceScaleFactor: 1,
        colorScheme: 'light',
        reducedMotion: 'reduce',
        locale: 'en-US'
      });

      await runPool(routes, CONCURRENCY, async ({ route, meta }) => {
        const page = await captureContext.newPage();
        const cardPage = await cardContext.newPage();
        try {
          const shot = await captureRoute(page, baseUrl, route);
          const buffer = await renderCard(cardPage, { route, meta, shot, host });
          const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 10);
          const name = `${routeSlug(route)}-${hash}.jpg`;
          pending.set(route, { buffer, name });
          log(`  ✓ ${route} (${kb(buffer.length)})`);
        } catch (error) {
          failed += 1;
          console.warn(`  ! ${route}: ${error.message}`);
        } finally {
          await page.close();
          await cardPage.close();
        }
      });
    } finally {
      await browser.close();
    }
  } finally {
    server?.stop();
  }

  // Never publish a partial manifest or delete old cards when one route failed:
  // the previous manifest stays valid and `og:check` reports the gap.
  if (failed) {
    log(`OG: ${failed} route(s) failed; keeping the previous manifest.`);
    process.exitCode = 1;
    return;
  }

  for (const [route, { buffer, name }] of pending) {
    fs.writeFileSync(path.join(OG_DIR, name), buffer);
    images[route] = {
      path: `/og/${name}`,
      width: CARD.width,
      height: CARD.height,
      type: 'image/jpeg',
      bytes: buffer.length,
      kind: 'page'
    };
  }

  const sortedImages = {};
  for (const route of Object.keys(images).sort()) sortedImages[route] = images[route];
  const manifest = {
    version: 1,
    generator: CARD_VERSION,
    origin,
    card: { width: CARD.width, height: CARD.height },
    images: sortedImages
  };
  writeIfChanged(OG_MANIFEST, manifest);

  // Drop any image no longer referenced (renamed route, new hash).
  const referenced = new Set(Object.values(sortedImages).map((entry) => path.basename(entry.path)));
  for (const name of fs.readdirSync(OG_DIR).filter(isImageFile)) {
    if (!referenced.has(name)) fs.unlinkSync(path.join(OG_DIR, name));
  }

  const total = Object.values(sortedImages).reduce((sum, entry) => sum + entry.bytes, 0);
  log(`OG: ${Object.keys(sortedImages).length} card(s), ${kb(total)} total.`);
};

if (CHECK) {
  runCheck();
} else if (PRUNE) {
  if (!fs.existsSync(OG_MANIFEST)) {
    console.error('src/public/og/manifest.json is missing. Run: pnpm run og:generate');
    process.exit(1);
  }
  pruneRetiredCards();
} else {
  await generate();
}
