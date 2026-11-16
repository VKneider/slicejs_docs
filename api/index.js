// api/index.js — server entrypoint.
//
// The framework owns the mechanics (security, static files, bundles, SPA
// fallback, per-route SEO head, real 404). This app only provides the generated
// artifacts: `seo.json` and the sitemap the parser writes from markdown.
//
// Everything this app adds goes between createSliceServer() and start().

import fs from 'node:fs';
import path from 'node:path';

import { createSliceServer } from 'slicejs-web-framework/api/framework/server.js';

const production =
  process.env.NODE_ENV === 'production' || process.argv.includes('--production');
const mode = production ? 'production' : 'development';

const { app, start } = createSliceServer({
  mode,
  seo: {
    // Relative paths resolve inside the deployed public/ folder, so the same
    // config works for src/ in development and dist/ in production.
    manifest: 'seo.json',
    images: 'og/manifest.json'
  }
});

// The client router matches paths case-insensitively; the SEO manifest is
// exact-match. Send a wrong-case URL to its canonical path instead of a 404.
const manifestPath = path.join(
  process.cwd(),
  production ? 'dist' : 'src',
  'public',
  'seo.json'
);
let canonicalByLower = new Map();
try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  canonicalByLower = new Map(
    Object.keys(manifest.routes || {}).map((route) => [route.toLowerCase(), route])
  );
} catch {
  // The manifest is generated; a missing one is already reported by the server.
}

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const target = canonicalByLower.get(req.path.toLowerCase());
  if (!target || target === req.path) return next();
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  return res.redirect(301, `${target}${query}`);
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    mode,
    framework: 'Slice.js',
    timestamp: new Date().toISOString()
  });
});

await start();

export default app;
