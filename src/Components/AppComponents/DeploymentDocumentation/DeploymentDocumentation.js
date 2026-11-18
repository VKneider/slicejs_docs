export default class DeploymentDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/deployment.md";
    this.markdownContent = "---\ntitle: Deployment\nroute: /Documentation/Deployment\nnavLabel: Deployment\nsection: Getting Started\ngroup: ''\norder: 70\ndescription: Host a Slice app with Express (slice start) or as a static site (slice export), including GitHub Pages, Vercel, nginx and S3.\ncomponent: DeploymentDocumentation\ntags: [deployment, hosting, static, express, github-pages]\n---\n\n# Deployment\n\n## Overview\n\nA Slice app can be served in two ways:\n\n| Mode | Command | Runtime | Output |\n|---|---|---|---|\n| Express | `slice start` | Node + Express | `dist/` |\n| Static | `slice export` | Any static file host | `dist-static/` |\n\nBoth start from the same production build. `slice build` compiles the app into\n`dist/`; `slice export` reads that build and writes a flattened, host-ready copy\nto `dist-static/`.\n\nUse **Express** when you need server middleware, `/api/*` routes, server-side\nheaders, or a long-running Node process. Use **static** when the app is entirely\nclient-side and you want Cloudflare Pages, Netlify, Vercel, nginx, GitHub Pages\nor S3 + CloudFront.\n\n:::tip\nThe export is **root-only**. Serve it at the root of a domain\n(`https://example.com/`) or a subdomain (`https://app.example.com/`). Subpath\nhosting (`https://user.github.io/repo/`) is not supported.\n:::\n\n## Build once, deploy twice\n\n```bash\nslice build\n```\n\n`dist/` is the Express/serverless layout:\n\n```text\ndist/\n  App/                 # shell: index.html, index.js, style.css\n  bundles/             # runtime bundles + bundle.config.json\n  Slice/Slice.js       # self-contained runtime\n  public/              # Themes, Styles, images, PWA, SEO\n  locales/             # translator dictionaries (when enabled)\n  routes.js\n  sliceConfig.json\n  slice-env.json\n  slice-env.generated.js\n```\n\n`slice export` flattens `dist/public/*` to the root, creates `index.html` and\n`404.html`, prerenders routes when SEO is configured, copies the env pair, and\nwrites host rules. `dist-static/` is the folder you upload.\n\nWhy not a single `dist`? `dist/` must keep the shape Express serves\n(`App/` at `/App`, `public/` at `/`, explicit root files). A static host needs a\ndifferent shape (`public/*` at `/`, root `index.html`, `404.html`). Keeping the\nartifacts separate makes the upload boundary explicit and avoids breaking\n`slice start`. See [Static export](#static-export) below.\n\nNew projects get `dist-static/` in `.gitignore`. If your project predates the\nexport command, add it yourself.\n\n## Express hosting\n\n```bash\nslice build\nslice start\n```\n\n`slice start`:\n\n- requires `src/` and `api/` (the server entrypoint lives in `api/index.js`),\n- serves `dist/` in production,\n- runs `slice build` automatically if `dist/` or\n  `dist/bundles/bundle.config.json` is missing,\n- resolves the port as `--port` → `sliceConfig.server.port` → `3000`; if that\n  port is busy it tries `port + 1`,\n- keeps `slice dev` for development (`src/`, HMR).\n\nProduction exposes only:\n\n- `dist/public/*` at `/` (Themes, Styles, images, PWA),\n- `/App/*`,\n- `/routes.js` and `/sliceConfig.json`,\n- `/bundles/*` and the legacy `/dist/bundles/*` mirror,\n- `/Slice/Slice.js`,\n- `/slice-env.json` and `/slice-env.generated.js`,\n- `/service-worker.js` and `/manifest.json`,\n- translator dictionaries under their configured folder.\n\nIt does **not** expose `/Components`, the rest of the `/dist` tree, `.map`,\n`.d.ts`, `.env`, `package.json` or `node_modules`. A real `404` requires SEO; see\n[SEO and Share Cards](/Documentation/Architecture/SEO). Without SEO the fallback\nreturns the shell with `200` (a soft 404).\n\n:::note\nThe framework persists `server.port` and `server.host` in `sliceConfig.json`.\nThey are configuration, not secrets. Do not put tokens, passwords or private\nkeys in `sliceConfig.json`, `routes.js`, `bundle.config.json` or\n`slice-env.json`: every one of them is public in both hosting modes.\n:::\n\n## Static export\n\n:::warning\n`slice export` is **experimental**. The output layout, flags and host presets\nmay change between releases; `slice start` remains the stable Express path.\n:::\n\n```bash\nslice build\nslice export --from-dist --host cloudflare\n```\n\nOr let the exporter build first:\n\n```bash\nslice export --host cloudflare\n```\n\n`--from-dist` is useful in CI when the build already ran and was cached.\n\n### Output\n\n```text\ndist-static/\n  index.html                 # shell, or the prerendered \"/\" page\n  App/\n  bundles/\n  Slice/Slice.js\n  images/ Styles/ Themes/ ...  # flattened from dist/public\n  locales/\n  routes.js\n  sliceConfig.json\n  sitemap.xml robots.txt manifest.json service-worker.js\n  slice-env.json\n  slice-env.generated.js\n  <route>/index.html         # prerendered literal routes\n  404.html\n  _redirects | vercel.json | nginx.conf | .nojekyll\n```\n\n`Components/` is pruned by default: every component used at runtime is in a\nbundle, and Express production also 404s `/Components`. `--keep-components` is a\ndebugging escape and the CLI warns that component source becomes fetchable.\n\nThe export is an allowlist. It never publishes `utils/`, `AppConfig.js`,\ngenerated `.d.ts`, `.map`, `.map.br`, `.map.gz`, `.env*`, `package.json`,\nlockfiles, `node_modules` or `.git`. If a file is not in the allowlist, it is not\nuploaded.\n\n`slice-events.generated.js` is the exception: the event debugger dynamically\nimports it, so it is published only when `events.ui.enabled` is true. With the\ndebugger UI off, neither `slice export` nor `slice start` serves it.\n\nIf `translator.path` is not `/locales` (for example `/i18n`), the export copies\nthat folder at the configured path. If `src/public` contains a host rule file\nthe selected preset writes (`_headers`, `_redirects`, `vercel.json` or\n`nginx.conf`), the export stops instead of silently replacing your CSP or\nredirects; merge those rules into the generated file or move them out of\n`public/`.\n\n### Options\n\n| Flag | Default | Notes |\n|---|---|---|\n| `-o, --out <dir>` | `dist-static` | Validated before writing. `src`, `dist`, `api`, `.`, ancestors, paths outside the project and existing folders that are not a previous export are rejected. |\n| `--from-dist` | off | Reuse `dist/` instead of running `slice build`. |\n| `--host <name>` | `cloudflare` | `cloudflare`, `netlify`, `vercel`, `nginx`, `github`, `s3`, `none`. |\n| `--seo <file>` | auto | `seo.json` / `public/seo.json`. |\n| `--origin <url>` | manifest | Canonical/OG origin override. |\n| `--images <file>` | auto | Social card manifest (`public/og/manifest.json`). |\n| `--no-prerender` | off | Shell + SPA fallback only. |\n| `--spa` | off | Unknown routes go to `index.html` (soft 404). |\n| `--keep-components` | off | Ship `Components/` (debug; source is fetchable). |\n| `--check` | off | Validate an existing export; write nothing. |\n| `--dry-run` | off | Report what would be written. |\n| `--sourcemap` | off | Delegated to build; maps are filtered from the export. |\n| `--hash-filenames` | off | Delegated to build. |\n| `--compress` | off | Delegated to build. `.br`/`.gz` siblings are copied; the host must be configured to serve them (`brotli_static`/`gzip_static`, etc.). |\n| `--no-minify` | off | Debug only; readable bundles are still source. |\n| `--no-obfuscate` | off | Delegated to build. |\n\n### 404 and redirects\n\nWith SEO:\n\n- every literal route is prerendered to `<route>/index.html`,\n- `404.html` is a real not-found page with `noindex`,\n- there is no catch-all, so unknown routes get a real 404,\n- locale redirects are written as host rules (`_redirects`, `vercel.json`,\n  nginx `location`) or as portable HTML `meta refresh` pages for hosts without\n  server rules (GitHub Pages, S3, `--host none`).\n\n`--spa` restores the client-router fallback, but the mechanics depend on the host:\n\n| Host | `--spa` behavior |\n|---|---|\n| Cloudflare Pages | Omits `404.html`; Pages auto-SPA serves the root with `200`. Never write a `_redirects` catch-all. |\n| Netlify | Adds `/*  /index.html  200`; existing files still win. |\n| Vercel | Adds a `/(.*)` rewrite; the filesystem wins first. |\n| nginx | `try_files $uri $uri/ /index.html;`. |\n| GitHub Pages | Writes the shell as `404.html`; unknown routes render the app with status `404`. |\n| S3 / CloudFront | Writes the shell as `404.html`; use a CloudFront function for a true `200`. |\n| `none` | Writes the shell as `404.html`; your server decides the status. |\n\nUse `--spa` only when the router must handle deep links that were not prerendered.\n\nWithout SEO the shell is the only page and the SPA fallback is on by default.\n\n### Dynamic routes\n\n`${param}` routes cannot be enumerated. Two options:\n\n1. List concrete values in `seo.json`:\n\n   ```json\n   {\n     \"routes\": {\n       \"/projects/${slug}\": {\n         \"sitemap\": { \"paths\": [\"alpha\", \"beta\"] }\n       }\n     }\n   }\n   ```\n\n2. Pass `--spa` and let the client router resolve the route.\n\n## Backend routes (`/api`)\n\nA static export is just files: **there is no Express and no `/api/*`**. Do not\npoint `/api` at the SPA fallback; it returns HTML, not JSON.\n\nIf the app needs backend routes, use the Express server that ships with Slice:\n\n```bash\nslice build\nslice start\n```\n\nAdd your routes in `api/index.js`, before `start()` mounts the terminal fallback:\n\n```js title=\"api/index.js\"\nimport { createSliceServer } from 'slicejs-web-framework/api/framework/server.js';\n\nconst { app, start } = createSliceServer();\n\napp.get('/api/health', (req, res) => {\n  res.json({ ok: true });\n});\n\nawait start();\n```\n\nDeploy it on a Node host (Render, Fly, Railway, a VPS, Docker, or a serverless\nadapter). A serverless adapter that imports the app instead of running it should\nmount `sliceFallback()` and `sliceErrorHandler()` by hand, as Conclave does.\n\nThe static and Express modes are not mutually exclusive: you can keep the\nfrontend static and call a separate API origin with `SLICE_PUBLIC_API_URL`.\n\n## Service worker\n\n`service-worker.js` is app-owned: Slice serves it and copies it into the build,\nbut it does not generate the caching policy. For a static export:\n\n- every `PRECACHE` path must exist in `dist-static/`;\n- do not precache `/Components/...` (the exporter prunes it by default);\n- bump the cache name on every deploy, or use `--hash-filenames`;\n- if you want a new worker to take over immediately, call `skipWaiting()` in\n  `install` and `clients.claim()` in `activate` (the PWA guide shows the\n  pattern);\n- do not cache `/api/*` responses in a static export, because there is no API.\n\nSee [Make Your App a PWA](/Documentation/Configuration/PWA) for the full worker\nexample.\n\n## Preview locally\n\n```bash\nnpx serve dist-static\n```\n\nThis respects `404.html` and the prerendered route files. Do **not** use\n`npx serve -s` to validate the 404: the `-s` flag forces an SPA fallback and\nhides the real `404.html`. Use `npx serve -s` only when you intentionally want\nto test `--spa` behavior.\n\n`slice start` serves `dist/`, not `dist-static/`; there is no built-in static\npreview command.\n\n## Host matrix\n\n### Cloudflare Pages / Netlify\n\n```bash\nslice export --host cloudflare   # or --host netlify\n```\n\nUpload `dist-static/`. The exporter writes `_redirects` and `_headers`:\n\n- locale redirects,\n- security headers,\n- `Cache-Control: no-store` for `/bundles/*` and the env pair.\n\nCloudflare Pages has no SPA catch-all in `_redirects`: it rejects\n`/* /index.html 200` as an infinite loop, and `/* / 200` intercepts assets.\n`--spa` therefore **omits `404.html`**, which enables Cloudflare's automatic\nSPA mode. If you need a real 404, do not use `--spa`.\n\nNetlify uses the same files plus `/*  /index.html  200` when `--spa` is used.\n\n### Vercel\n\n```bash\nslice export --host vercel\n```\n\nUpload `dist-static/` and let Vercel read `vercel.json` (redirects, optional\nrewrite, cache headers). Set the project output directory to `dist-static` if\nyou deploy from a Git repository.\n\nLocale redirects use `statusCode: 301|302`; Vercel's `permanent` boolean maps to\n**308/307**, not 301/302. The `/(.*)` rewrite only applies when there is no file\nat the requested path, so bundles and assets are served normally.\n\n`vercel.json` also carries the three security headers (`X-Content-Type-Options`,\n`X-Frame-Options`, `Referrer-Policy`) and `Cache-Control: no-store` for bundles\nand the env pair.\n\n### nginx\n\n```bash\nslice export --host nginx\n```\n\nCopy `dist-static/` to the server and include `nginx.conf` (or merge it into\nyour site config). It maps `404` to `/404.html`, sets `no-store` on bundles and\nenv files, and adds the three security headers with `always` (so 404 responses\nkeep them).\n\n### GitHub Pages\n\nRoot-only. Two supported shapes:\n\n| Shape | URL | Works |\n|---|---|---|\n| User site | `https://user.github.io/` | Yes |\n| Project site + custom domain | `https://example.com/` | Yes |\n| Project site by default | `https://user.github.io/repo/` | No (needs a base path) |\n\n```bash\nslice export --host github\n```\n\nPublish `dist-static/` to the `gh-pages` branch (or `/docs`) and configure the\ncustom domain in **Settings → Pages**. `.nojekyll` is written automatically.\n\nGitHub Pages has no server redirects and no custom headers. Locale redirects\nbecome HTML `meta refresh` pages; there is no CSP/HSTS control. If the app\ndepends on `/api/*`, GitHub Pages is not enough: use a separate backend or a\nhost with functions.\n\n`--spa` on GitHub writes the shell as `404.html`, so unknown routes render the\napp but GitHub still returns `404`. A `200` fallback is not possible on Pages.\n\n### S3 + CloudFront\n\n```bash\nslice export --host s3\n```\n\nUpload `dist-static/` with `index.html` as the default root document and\n`404.html` as the error document. Locale redirects become HTML redirect pages.\n`--spa` writes the shell as `404.html` (soft 404, status 404). For a true `200`\nfallback, use a CloudFront function to rewrite navigation requests to\n`/index.html`; `CustomErrorResponses` alone keeps the 404 status.\n\n### `--host none`\n\nNo host rules. The folder is portable: `index.html`, prerendered routes,\n`404.html`, env files and client redirect pages. Use it for a custom server or a\nhost the exporter does not model.\n\n## Validate before upload\n\n```bash\nslice export --from-dist --host cloudflare --check\n```\n\n`--check` writes nothing and fails when:\n\n- a required runtime file is missing (`index.html`, `404.html`, `routes.js`,\n  `sliceConfig.json`, the env pair, `bundles/bundle.config.json`,\n  `Slice/Slice.js`),\n- `Components/` is present without `--keep-components`,\n- `public/` was not flattened,\n- `utils/`, `src/`, `api/`, `node_modules/`, `.git/`, `AppConfig.js` or a\n  generated `.d.ts` is present,\n- any `.map`, `.map.br`, `.map.gz`, `.d.ts`, `.env*`, `package.json`, lockfile,\n  `node_modules` or `.git` is present,\n- an exported `.js` contains `sourceMappingURL=`,\n- host rules are incoherent (`_redirects` without `_headers`, invalid\n  `vercel.json`, nginx without `error_page 404 /404.html`, explicit GitHub host\n  without `.nojekyll`),\n- a literal route has no prerendered page and the export has no SPA fallback.\n\n`--check` does **not** enumerate `${param}` routes or verify every referenced\nasset. It warns when a bundle calls `fetch(\"/api/...\")`, because a static host\ncannot serve Express routes.\n\nRun it in CI before uploading:\n\n```yaml title=\"GitHub Actions (excerpt)\"\n- run: npm ci\n- run: npx slice build\n- run: npx slice export --from-dist --host github\n- run: npx slice export --from-dist --host github --check\n- uses: actions/upload-pages-artifact@v3\n  with:\n    path: dist-static\n```\n\n## Environment variables\n\n`slice build` writes `dist/slice-env.json` and `dist/slice-env.generated.js`.\nThe runtime imports the shim, so there is no production env endpoint. Values are\nfrozen at build time: rebuild after changing `.env` or `SLICE_PUBLIC_*`.\n\nOnly `SLICE_PUBLIC_*` keys reach the browser. See\n[Environment Variables](/Documentation/Configuration/environment-variables).\n\n## What is public\n\nThese files are served by design and must not contain secrets:\n\n| File | Contents |\n|---|---|\n| `sliceConfig.json` | Framework configuration, including `server.port`/`host`. |\n| `routes.js` | Route table. |\n| `bundle.config.json` | Bundle manifest. |\n| `slice-env.json` / `.generated.js` | `SLICE_PUBLIC_*` values only. |\n| `manifest.json` | PWA manifest. |\n| `seo.json`, `sitemap.xml`, `robots.txt` | Public SEO data. |\n| `service-worker.js` | Public worker. |\n\nEverything else is either in a bundle or pruned.\n\n## Troubleshooting\n\n| Symptom | Check |\n|---|---|\n| `/Themes`, `/images` 404 | `dist/public` was not flattened; rerun `slice export` and `--check`. |\n| Unknown route returns the shell with 200 | SEO was not configured, or `--spa` is on. Add `seo.json` or remove `--spa`. |\n| Unknown route returns 404 but the client route exists | The route is dynamic (`${param}`). Add `sitemap.paths` or use `--spa`. |\n| Styles or bundles load from the wrong URL | The export must be served at the domain root, not a subpath. |\n| `--check` reports `Components/` | Rerun without `--keep-components`. |\n| Env values are stale | Rebuild; production env is frozen at build time. |\n| GitHub Pages serves the README | Publish `dist-static/` itself as the Pages artifact, not the repository root. |\n\n## Related docs\n\n- [CLI Commands](/Documentation/CLI) — `build`, `start`, `export`.\n- [Environment Variables](/Documentation/Configuration/environment-variables).\n- [Project Anatomy](/Documentation/Project-Anatomy).\n- [Server Entrypoint](/Documentation/Architecture/Server-Entrypoint).\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"Getting Started"}]
            });
            if (breadcrumbs) {
               container.appendChild(breadcrumbs);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Mode","Command","Runtime","Output"],
               rows: [[{"html":"Express"},{"html":"<code>slice start</code>"},{"html":"Node + Express"},{"html":"<code>dist/</code>"}],[{"html":"Static"},{"html":"<code>slice export</code>"},{"html":"Any static file host"},{"html":"<code>dist-static/</code>"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>The export is <strong>root-only</strong>. Serve it at the root of a domain (<code>https://example.com/</code>) or a subdomain (<code>https://app.example.com/</code>). Subpath hosting (<code>https://user.github.io/repo/</code>) is not supported.</p>";
            const callout = await slice.build('Callout', {
               tone: "success",
               variant: "soft",
               title: "Tip",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice build",
               language: "bash"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "dist/\n  App/                 # shell: index.html, index.js, style.css\n  bundles/             # runtime bundles + bundle.config.json\n  Slice/Slice.js       # self-contained runtime\n  public/              # Themes, Styles, images, PWA, SEO\n  locales/             # translator dictionaries (when enabled)\n  routes.js\n  sliceConfig.json\n  slice-env.json\n  slice-env.generated.js",
               language: "text"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice build\nslice start",
               language: "bash"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>The framework persists <code>server.port</code> and <code>server.host</code> in <code>sliceConfig.json</code>. They are configuration, not secrets. Do not put tokens, passwords or private keys in <code>sliceConfig.json</code>, <code>routes.js</code>, <code>bundle.config.json</code> or <code>slice-env.json</code>: every one of them is public in both hosting modes.</p>";
            const callout = await slice.build('Callout', {
               tone: "neutral",
               variant: "ghost",
               title: "Note",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p><code>slice export</code> is <strong>experimental</strong>. The output layout, flags and host presets may change between releases; <code>slice start</code> remains the stable Express path.</p>";
            const callout = await slice.build('Callout', {
               tone: "warning",
               variant: "soft",
               title: "Warning",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice build\nslice export --from-dist --host cloudflare",
               language: "bash"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice export --host cloudflare",
               language: "bash"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "dist-static/\n  index.html                 # shell, or the prerendered \"/\" page\n  App/\n  bundles/\n  Slice/Slice.js\n  images/ Styles/ Themes/ ...  # flattened from dist/public\n  locales/\n  routes.js\n  sliceConfig.json\n  sitemap.xml robots.txt manifest.json service-worker.js\n  slice-env.json\n  slice-env.generated.js\n  <route>/index.html         # prerendered literal routes\n  404.html\n  _redirects | vercel.json | nginx.conf | .nojekyll",
               language: "text"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Flag","Default","Notes"],
               rows: [[{"html":"<code>-o, --out &lt;dir&gt;</code>"},{"html":"<code>dist-static</code>"},{"html":"Validated before writing. <code>src</code>, <code>dist</code>, <code>api</code>, <code>.</code>, ancestors, paths outside the project and existing folders that are not a previous export are rejected."}],[{"html":"<code>--from-dist</code>"},{"html":"off"},{"html":"Reuse <code>dist/</code> instead of running <code>slice build</code>."}],[{"html":"<code>--host &lt;name&gt;</code>"},{"html":"<code>cloudflare</code>"},{"html":"<code>cloudflare</code>, <code>netlify</code>, <code>vercel</code>, <code>nginx</code>, <code>github</code>, <code>s3</code>, <code>none</code>."}],[{"html":"<code>--seo &lt;file&gt;</code>"},{"html":"auto"},{"html":"<code>seo.json</code> / <code>public/seo.json</code>."}],[{"html":"<code>--origin &lt;url&gt;</code>"},{"html":"manifest"},{"html":"Canonical/OG origin override."}],[{"html":"<code>--images &lt;file&gt;</code>"},{"html":"auto"},{"html":"Social card manifest (<code>public/og/manifest.json</code>)."}],[{"html":"<code>--no-prerender</code>"},{"html":"off"},{"html":"Shell + SPA fallback only."}],[{"html":"<code>--spa</code>"},{"html":"off"},{"html":"Unknown routes go to <code>index.html</code> (soft 404)."}],[{"html":"<code>--keep-components</code>"},{"html":"off"},{"html":"Ship <code>Components/</code> (debug; source is fetchable)."}],[{"html":"<code>--check</code>"},{"html":"off"},{"html":"Validate an existing export; write nothing."}],[{"html":"<code>--dry-run</code>"},{"html":"off"},{"html":"Report what would be written."}],[{"html":"<code>--sourcemap</code>"},{"html":"off"},{"html":"Delegated to build; maps are filtered from the export."}],[{"html":"<code>--hash-filenames</code>"},{"html":"off"},{"html":"Delegated to build."}],[{"html":"<code>--compress</code>"},{"html":"off"},{"html":"Delegated to build. <code>.br</code>/<code>.gz</code> siblings are copied; the host must be configured to serve them (<code>brotli_static</code>/<code>gzip_static</code>, etc.)."}],[{"html":"<code>--no-minify</code>"},{"html":"off"},{"html":"Debug only; readable bundles are still source."}],[{"html":"<code>--no-obfuscate</code>"},{"html":"off"},{"html":"Delegated to build."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Host","--spa behavior"],
               rows: [[{"html":"Cloudflare Pages"},{"html":"Omits <code>404.html</code>; Pages auto-SPA serves the root with <code>200</code>. Never write a <code>_redirects</code> catch-all."}],[{"html":"Netlify"},{"html":"Adds <code>/*  /index.html  200</code>; existing files still win."}],[{"html":"Vercel"},{"html":"Adds a <code>/(.*)</code> rewrite; the filesystem wins first."}],[{"html":"nginx"},{"html":"<code>try_files $uri $uri/ /index.html;</code>."}],[{"html":"GitHub Pages"},{"html":"Writes the shell as <code>404.html</code>; unknown routes render the app with status <code>404</code>."}],[{"html":"S3 / CloudFront"},{"html":"Writes the shell as <code>404.html</code>; use a CloudFront function for a true <code>200</code>."}],[{"html":"<code>none</code>"},{"html":"Writes the shell as <code>404.html</code>; your server decides the status."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-14"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice build\nslice start",
               language: "bash"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-15"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import { createSliceServer } from 'slicejs-web-framework/api/framework/server.js';\n\nconst { app, start } = createSliceServer();\n\napp.get('/api/health', (req, res) => {\n  res.json({ ok: true });\n});\n\nawait start();",
               language: "js"
            });
            if ("api/index.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "api/index.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-16"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "npx serve dist-static",
               language: "bash"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-17"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice export --host cloudflare   # or --host netlify",
               language: "bash"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-18"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice export --host vercel",
               language: "bash"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-19"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice export --host nginx",
               language: "bash"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-20"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Shape","URL","Works"],
               rows: [[{"html":"User site"},{"html":"<code>https://user.github.io/</code>"},{"html":"Yes"}],[{"html":"Project site + custom domain"},{"html":"<code>https://example.com/</code>"},{"html":"Yes"}],[{"html":"Project site by default"},{"html":"<code>https://user.github.io/repo/</code>"},{"html":"No (needs a base path)"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-21"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice export --host github",
               language: "bash"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-22"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice export --host s3",
               language: "bash"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-23"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice export --from-dist --host cloudflare --check",
               language: "bash"
            });
            if (null) {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = null;
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-24"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "- run: npm ci\n- run: npx slice build\n- run: npx slice export --from-dist --host github\n- run: npx slice export --from-dist --host github --check\n- uses: actions/upload-pages-artifact@v3\n  with:\n    path: dist-static",
               language: "yaml"
            });
            if ("GitHub Actions (excerpt)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "GitHub Actions (excerpt)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-25"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["File","Contents"],
               rows: [[{"html":"<code>sliceConfig.json</code>"},{"html":"Framework configuration, including <code>server.port</code>/<code>host</code>."}],[{"html":"<code>routes.js</code>"},{"html":"Route table."}],[{"html":"<code>bundle.config.json</code>"},{"html":"Bundle manifest."}],[{"html":"<code>slice-env.json</code> / <code>.generated.js</code>"},{"html":"<code>SLICE_PUBLIC_*</code> values only."}],[{"html":"<code>manifest.json</code>"},{"html":"PWA manifest."}],[{"html":"<code>seo.json</code>, <code>sitemap.xml</code>, <code>robots.txt</code>"},{"html":"Public SEO data."}],[{"html":"<code>service-worker.js</code>"},{"html":"Public worker."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-26"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Symptom","Check"],
               rows: [[{"html":"<code>/Themes</code>, <code>/images</code> 404"},{"html":"<code>dist/public</code> was not flattened; rerun <code>slice export</code> and <code>--check</code>."}],[{"html":"Unknown route returns the shell with 200"},{"html":"SEO was not configured, or <code>--spa</code> is on. Add <code>seo.json</code> or remove <code>--spa</code>."}],[{"html":"Unknown route returns 404 but the client route exists"},{"html":"The route is dynamic (<code>${param}</code>). Add <code>sitemap.paths</code> or use <code>--spa</code>."}],[{"html":"Styles or bundles load from the wrong URL"},{"html":"The export must be served at the domain root, not a subpath."}],[{"html":"<code>--check</code> reports <code>Components/</code>"},{"html":"Rerun without <code>--keep-components</code>."}],[{"html":"Env values are stale"},{"html":"Rebuild; production env is frozen at build time."}],[{"html":"GitHub Pages serves the README"},{"html":"Publish <code>dist-static/</code> itself as the Pages artifact, not the repository root."}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
  }

  async update() {
    // Refresh dynamic content here if needed
  }

  beforeDestroy() {
    if (this._contentClick) {
      this.removeEventListener('click', this._contentClick);
      this._contentClick = null;
    }
  }

  // Internal markdown links are plain anchors with data-route. One delegated
  // handler keeps them inside the SPA, including "/page#section" links, without
  // building a component for every link on the page.
  setupRouterLinks() {
    this._contentClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest?.('a[data-route]');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('#')) {
        event.preventDefault();
        this.scrollToHash(href.slice(1));
        return;
      }
      if (!href.startsWith('/') || href.startsWith('//')) return;

      event.preventDefault();
      const hashIndex = href.indexOf('#');
      const path = hashIndex === -1 ? href : href.slice(0, hashIndex);
      const hash = hashIndex === -1 ? '' : href.slice(hashIndex + 1);
      Promise.resolve(slice.router.navigate(path)).then(() => {
        if (hash) requestAnimationFrame(() => this.scrollToHash(hash));
      });
    };
    this.addEventListener('click', this._contentClick);
  }

  scrollToHash(hash) {
    let id = hash;
    try {
      id = decodeURIComponent(hash);
    } catch {
      id = hash;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async setupCopyButton() {
    const container = this.querySelector('[data-copy-md]');
    if (!container) return;

    const copyMenu = await slice.build('CopyMarkdownMenu', {
      markdownPath: this.markdownPath,
      markdownContent: this.markdownContent,
      label: '❐'
    });

    container.appendChild(copyMenu);
  }

  async copyMarkdown() {}
}

customElements.define('slice-deploymentdocumentation', DeploymentDocumentation);
