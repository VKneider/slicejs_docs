export default class DeploymentDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/deployment.md";
    this.markdownContent = "---\ntitle: Deployment\nroute: /Documentation/Deployment\nnavLabel: Deployment\nsection: Getting Started\ngroup: Deployment\norder: 12\ndescription: Host a Slice app with Express (slice start) or as a static site (slice export), including GitHub Pages, Vercel, nginx and S3.\ncomponent: DeploymentDocumentation\ntags: [deployment, hosting, static, express, github-pages]\n---\n\n# Deployment\n\n## Overview\n\nA Slice app can be served in two ways:\n\n| Mode | Command | Runtime | Output |\n|---|---|---|---|\n| Express | `slice start` | Node + Express | `dist/` |\n| Static | `slice export` | Any static file host | `dist-static/` |\n\nBoth start from the same production build. `slice build` compiles the app into\n`dist/`; `slice export` reads that build and writes a flattened, host-ready copy\nto `dist-static/`.\n\nUse **Express** when you need server middleware, `/api/*` routes, server-side\nheaders, or a long-running Node process. Use **static** when the app is entirely\nclient-side and you want Cloudflare Pages, Netlify, Vercel, nginx, GitHub Pages\nor S3 + CloudFront.\n\n:::tip\nThe export is **root-only**. Serve it at the root of a domain\n(`https://example.com/`) or a subdomain (`https://app.example.com/`). Subpath\nhosting (`https://user.github.io/repo/`) is not supported.\n:::\n\n## Build once, deploy twice\n\n```bash\nslice build\n```\n\n`dist/` is the Express/serverless layout:\n\n```text\ndist/\n  App/                 # shell: index.html, index.js, style.css\n  bundles/             # runtime bundles + bundle.config.json\n  Slice/Slice.js       # self-contained runtime\n  public/              # Themes, Styles, images, PWA, SEO\n  locales/             # translator dictionaries (when enabled)\n  routes.js\n  sliceConfig.json\n  slice-env.json\n  slice-env.generated.js\n```\n\n`slice export` flattens `dist/public/*` to the root, creates `index.html` and\n`404.html`, prerenders routes when SEO is configured, copies the env pair, and\nwrites host rules. `dist-static/` is the folder you upload.\n\nWhy not a single `dist`? `dist/` must keep the shape Express serves\n(`App/` at `/App`, `public/` at `/`, explicit root files). A static host needs a\ndifferent shape (`public/*` at `/`, root `index.html`, `404.html`). Keeping the\nartifacts separate makes the upload boundary explicit and avoids breaking\n`slice start`. See [Static export](#static-export) below.\n\nNew projects get `dist-static/` in `.gitignore`. If your project predates the\nexport command, add it yourself.\n\n## Express hosting\n\n```bash\nslice build\nslice start\n```\n\n`slice start`:\n\n- requires `src/` and `api/` (the server entrypoint lives in `api/index.js`),\n- serves `dist/` in production,\n- runs `slice build` automatically if `dist/` or\n  `dist/bundles/bundle.config.json` is missing,\n- resolves the port as `--port` → `sliceConfig.server.port` → `3000`; if that\n  port is busy it tries `port + 1`,\n- keeps `slice dev` for development (`src/`, HMR).\n\nProduction exposes only:\n\n- `dist/public/*` at `/` (Themes, Styles, images, PWA),\n- `/App/*`,\n- `/routes.js` and `/sliceConfig.json`,\n- `/bundles/*` and the legacy `/dist/bundles/*` mirror,\n- `/Slice/Slice.js`,\n- `/slice-env.json` and `/slice-env.generated.js`,\n- `/service-worker.js` and `/manifest.json`,\n- translator dictionaries under their configured folder.\n\nIt does **not** expose `/Components`, the rest of the `/dist` tree, `.map`,\n`.d.ts`, `.env`, `package.json` or `node_modules`. A real `404` requires SEO; see\n[SEO and Share Cards](/Documentation/Architecture/SEO). Without SEO the fallback\nreturns the shell with `200` (a soft 404).\n\n:::note\nThe framework persists `server.port` and `server.host` in `sliceConfig.json`.\nThey are configuration, not secrets. Do not put tokens, passwords or private\nkeys in `sliceConfig.json`, `routes.js`, `bundle.config.json` or\n`slice-env.json`: every one of them is public in both hosting modes.\n:::\n\n## Static export\n\n```bash\nslice build\nslice export --from-dist --host cloudflare\n```\n\nOr let the exporter build first:\n\n```bash\nslice export --host cloudflare\n```\n\n`--from-dist` is useful in CI when the build already ran and was cached.\n\n### Output\n\n```text\ndist-static/\n  index.html                 # shell, or the prerendered \"/\" page\n  App/\n  bundles/\n  Slice/Slice.js\n  images/ Styles/ Themes/ ...  # flattened from dist/public\n  locales/\n  routes.js\n  sliceConfig.json\n  sitemap.xml robots.txt manifest.json service-worker.js\n  slice-env.json\n  slice-env.generated.js\n  <route>/index.html         # prerendered literal routes\n  404.html\n  _redirects | vercel.json | nginx.conf | .nojekyll\n```\n\n`Components/` is pruned by default: every component used at runtime is in a\nbundle, and Express production also 404s `/Components`. `--keep-components` is a\ndebugging escape and the CLI warns that component source becomes fetchable.\n\nThe export is an allowlist. It never publishes `utils/`, `AppConfig.js`,\n`slice-events.generated.js`, generated `.d.ts`, `.map`, `.map.br`, `.map.gz`,\n`.env*`, `package.json`, lockfiles, `node_modules` or `.git`. If a file is not in\nthe allowlist, it is not uploaded.\n\n### Options\n\n| Flag | Default | Notes |\n|---|---|---|\n| `-o, --out <dir>` | `dist-static` | Validated before writing. `src`, `dist`, `api`, `.`, ancestors, paths outside the project and existing folders that are not a previous export are rejected. |\n| `--from-dist` | off | Reuse `dist/` instead of running `slice build`. |\n| `--host <name>` | `cloudflare` | `cloudflare`, `netlify`, `vercel`, `nginx`, `github`, `s3`, `none`. |\n| `--seo <file>` | auto | `seo.json` / `public/seo.json`. |\n| `--origin <url>` | manifest | Canonical/OG origin override. |\n| `--images <file>` | auto | Social card manifest (`public/og/manifest.json`). |\n| `--no-prerender` | off | Shell + SPA fallback only. |\n| `--spa` | off | Unknown routes go to `index.html` (soft 404). |\n| `--keep-components` | off | Ship `Components/` (debug; source is fetchable). |\n| `--check` | off | Validate an existing export; write nothing. |\n| `--dry-run` | off | Report what would be written. |\n| `--sourcemap` | off | Delegated to build; maps are filtered from the export. |\n| `--hash-filenames` | off | Delegated to build. |\n| `--compress` | off | Delegated to build. `.br`/`.gz` siblings are copied; the host must be configured to serve them (`brotli_static`/`gzip_static`, etc.). |\n| `--no-minify` | off | Debug only; readable bundles are still source. |\n| `--no-obfuscate` | off | Delegated to build. |\n\n### 404 and redirects\n\nWith SEO:\n\n- every literal route is prerendered to `<route>/index.html`,\n- `404.html` is a real not-found page with `noindex`,\n- there is no catch-all, so unknown routes get a real 404,\n- locale redirects are written as host rules (`_redirects`, `vercel.json`,\n  nginx `location`) or as portable HTML `meta refresh` pages for hosts without\n  server rules (GitHub Pages, S3, `--host none`).\n\n`--spa` restores the client-router fallback: unknown routes serve\n`index.html` with `200`. Use it only when the router must handle deep links that\nwere not prerendered.\n\nWithout SEO the shell is the only page and the SPA fallback is on by default.\n\n### Dynamic routes\n\n`${param}` routes cannot be enumerated. Two options:\n\n1. List concrete values in `seo.json`:\n\n   ```json\n   {\n     \"routes\": {\n       \"/projects/${slug}\": {\n         \"sitemap\": { \"paths\": [\"alpha\", \"beta\"] }\n       }\n     }\n   }\n   ```\n\n2. Pass `--spa` and let the client router resolve the route.\n\n## Preview locally\n\n```bash\nnpx serve dist-static\n```\n\nThis respects `404.html` and the prerendered route files. Do **not** use\n`npx serve -s` to validate the 404: the `-s` flag forces an SPA fallback and\nhides the real `404.html`. Use `npx serve -s` only when you intentionally want\nto test `--spa` behavior.\n\n`slice start` serves `dist/`, not `dist-static/`; there is no built-in static\npreview command.\n\n## Host matrix\n\n### Cloudflare Pages / Netlify\n\n```bash\nslice export --host cloudflare   # or --host netlify\n```\n\nUpload `dist-static/`. The exporter writes `_redirects` and `_headers`:\n\n- locale redirects,\n- optional `/*  /index.html  200` when `--spa` is used,\n- security headers,\n- `Cache-Control: no-store` for `/bundles/*` and the env pair.\n\n### Vercel\n\n```bash\nslice export --host vercel\n```\n\nUpload `dist-static/` and let Vercel read `vercel.json` (redirects, optional\nrewrite, cache headers). Set the project output directory to `dist-static` if\nyou deploy from a Git repository.\n\n### nginx\n\n```bash\nslice export --host nginx\n```\n\nCopy `dist-static/` to the server and include `nginx.conf` (or merge it into\nyour site config). It maps `404` to `/404.html` and sets `no-store` on bundles\nand env files.\n\n### GitHub Pages\n\nRoot-only. Two supported shapes:\n\n| Shape | URL | Works |\n|---|---|---|\n| User site | `https://user.github.io/` | Yes |\n| Project site + custom domain | `https://example.com/` | Yes |\n| Project site by default | `https://user.github.io/repo/` | No (needs a base path) |\n\n```bash\nslice export --host github\n```\n\nPublish `dist-static/` to the `gh-pages` branch (or `/docs`) and configure the\ncustom domain in **Settings → Pages**. `.nojekyll` is written automatically.\n\nGitHub Pages has no server redirects and no custom headers. Locale redirects\nbecome HTML `meta refresh` pages; there is no CSP/HSTS control. If the app\ndepends on `/api/*`, GitHub Pages is not enough: use a separate backend or a\nhost with functions.\n\n### S3 + CloudFront\n\n```bash\nslice export --host s3\n```\n\nUpload `dist-static/` with `index.html` as the default root document and\n`404.html` as the error document. Locale redirects become HTML redirect pages.\nFor an SPA fallback, use a CloudFront function or `CustomErrorResponses` to\n`/index.html` (soft 404).\n\n### `--host none`\n\nNo host rules. The folder is portable: `index.html`, prerendered routes,\n`404.html`, env files and client redirect pages. Use it for a custom server or a\nhost the exporter does not model.\n\n## Validate before upload\n\n```bash\nslice export --from-dist --host cloudflare --check\n```\n\n`--check` writes nothing and fails when:\n\n- a required runtime file is missing (`index.html`, `404.html`, `routes.js`,\n  `sliceConfig.json`, the env pair, `bundles/bundle.config.json`,\n  `Slice/Slice.js`),\n- `Components/` is present without `--keep-components`,\n- `public/` was not flattened,\n- `utils/`, `src/`, `api/`, `node_modules/`, `.git/`, `AppConfig.js`,\n  `slice-events.generated.js` or a generated `.d.ts` is present,\n- any `.map`, `.map.br`, `.map.gz`, `.d.ts`, `.env*`, `package.json`, lockfile,\n  `node_modules` or `.git` is present,\n- an exported `.js` contains `sourceMappingURL=`,\n- host rules are incoherent (`_redirects` without `_headers`, invalid\n  `vercel.json`, nginx without `error_page 404 /404.html`, explicit GitHub host\n  without `.nojekyll`),\n- a literal route has no prerendered page and the export has no SPA fallback.\n\n`--check` does **not** enumerate `${param}` routes, verify every referenced\nasset, or scan application config for secrets.\n\nRun it in CI before uploading:\n\n```yaml title=\"GitHub Actions (excerpt)\"\n- run: npm ci\n- run: npx slice build\n- run: npx slice export --from-dist --host github\n- run: npx slice export --from-dist --host github --check\n- uses: actions/upload-pages-artifact@v3\n  with:\n    path: dist-static\n```\n\n## Environment variables\n\n`slice build` writes `dist/slice-env.json` and `dist/slice-env.generated.js`.\nThe runtime imports the shim, so there is no production env endpoint. Values are\nfrozen at build time: rebuild after changing `.env` or `SLICE_PUBLIC_*`.\n\nOnly `SLICE_PUBLIC_*` keys reach the browser. See\n[Environment Variables](/Documentation/Configuration/environment-variables).\n\n## What is public\n\nThese files are served by design and must not contain secrets:\n\n| File | Contents |\n|---|---|\n| `sliceConfig.json` | Framework configuration, including `server.port`/`host`. |\n| `routes.js` | Route table. |\n| `bundle.config.json` | Bundle manifest. |\n| `slice-env.json` / `.generated.js` | `SLICE_PUBLIC_*` values only. |\n| `manifest.json` | PWA manifest. |\n| `seo.json`, `sitemap.xml`, `robots.txt` | Public SEO data. |\n| `service-worker.js` | Public worker. |\n\nEverything else is either in a bundle or pruned.\n\n## Troubleshooting\n\n| Symptom | Check |\n|---|---|\n| `/Themes`, `/images` 404 | `dist/public` was not flattened; rerun `slice export` and `--check`. |\n| Unknown route returns the shell with 200 | SEO was not configured, or `--spa` is on. Add `seo.json` or remove `--spa`. |\n| Unknown route returns 404 but the client route exists | The route is dynamic (`${param}`). Add `sitemap.paths` or use `--spa`. |\n| Styles or bundles load from the wrong URL | The export must be served at the domain root, not a subpath. |\n| `--check` reports `Components/` | Rerun without `--keep-components`. |\n| Env values are stale | Rebuild; production env is frozen at build time. |\n| GitHub Pages serves the README | Publish `dist-static/` itself as the Pages artifact, not the repository root. |\n\n## Related docs\n\n- [CLI Commands](/Documentation/CLI) — `build`, `start`, `export`.\n- [Environment Variables](/Documentation/Configuration/environment-variables).\n- [Project Anatomy](/Documentation/Project-Anatomy).\n- [Server Entrypoint](/Documentation/Architecture/Server-Entrypoint).\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Mode | Command | Runtime | Output |","|---|---|---|---|","| Express | `slice start` | Node + Express | `dist/` |","| Static | `slice export` | Any static file host | `dist-static/` |"];
            const clean = (line) => {
               let value = line.trim();
               if (value.startsWith('|')) {
                  value = value.slice(1);
               }
               if (value.endsWith('|')) {
                  value = value.slice(0, -1);
               }
               return value.split('|').map((cell) => cell.trim());
            };

            const formatCell = (text) => {
               let output = text
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');

               const applyBold = (input) => {
                  let result = '';
                  let index = 0;
                  while (index < input.length) {
                     const start = input.indexOf('**', index);
                     if (start === -1) {
                        result += input.slice(index);
                        break;
                     }
                     const end = input.indexOf('**', start + 2);
                     if (end === -1) {
                        result += input.slice(index);
                        break;
                     }
                     result += input.slice(index, start) + '<strong>' + input.slice(start + 2, end) + '</strong>';
                     index = end + 2;
                  }
                  return result;
               };

               const applyInlineCode = (input) => {
                  const parts = input.split(String.fromCharCode(96));
                  if (parts.length === 1) return input;
                  return parts
                     .map((part, idx) => (idx % 2 === 1 ? '<code>' + part + '</code>' : part))
                     .join('');
               };

               output = applyBold(output);
               output = applyInlineCode(output);
               return output;
            };

            const headers = lines.length > 0 ? clean(lines[0]) : [];
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
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
         const container = this.querySelector('[data-block-id="doc-block-5"]');
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const lines = ["| Flag | Default | Notes |","|---|---|---|","| `-o, --out <dir>` | `dist-static` | Validated before writing. `src`, `dist`, `api`, `.`, ancestors, paths outside the project and existing folders that are not a previous export are rejected. |","| `--from-dist` | off | Reuse `dist/` instead of running `slice build`. |","| `--host <name>` | `cloudflare` | `cloudflare`, `netlify`, `vercel`, `nginx`, `github`, `s3`, `none`. |","| `--seo <file>` | auto | `seo.json` / `public/seo.json`. |","| `--origin <url>` | manifest | Canonical/OG origin override. |","| `--images <file>` | auto | Social card manifest (`public/og/manifest.json`). |","| `--no-prerender` | off | Shell + SPA fallback only. |","| `--spa` | off | Unknown routes go to `index.html` (soft 404). |","| `--keep-components` | off | Ship `Components/` (debug; source is fetchable). |","| `--check` | off | Validate an existing export; write nothing. |","| `--dry-run` | off | Report what would be written. |","| `--sourcemap` | off | Delegated to build; maps are filtered from the export. |","| `--hash-filenames` | off | Delegated to build. |","| `--compress` | off | Delegated to build. `.br`/`.gz` siblings are copied; the host must be configured to serve them (`brotli_static`/`gzip_static`, etc.). |","| `--no-minify` | off | Debug only; readable bundles are still source. |","| `--no-obfuscate` | off | Delegated to build. |"];
            const clean = (line) => {
               let value = line.trim();
               if (value.startsWith('|')) {
                  value = value.slice(1);
               }
               if (value.endsWith('|')) {
                  value = value.slice(0, -1);
               }
               return value.split('|').map((cell) => cell.trim());
            };

            const formatCell = (text) => {
               let output = text
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');

               const applyBold = (input) => {
                  let result = '';
                  let index = 0;
                  while (index < input.length) {
                     const start = input.indexOf('**', index);
                     if (start === -1) {
                        result += input.slice(index);
                        break;
                     }
                     const end = input.indexOf('**', start + 2);
                     if (end === -1) {
                        result += input.slice(index);
                        break;
                     }
                     result += input.slice(index, start) + '<strong>' + input.slice(start + 2, end) + '</strong>';
                     index = end + 2;
                  }
                  return result;
               };

               const applyInlineCode = (input) => {
                  const parts = input.split(String.fromCharCode(96));
                  if (parts.length === 1) return input;
                  return parts
                     .map((part, idx) => (idx % 2 === 1 ? '<code>' + part + '</code>' : part))
                     .join('');
               };

               output = applyBold(output);
               output = applyInlineCode(output);
               return output;
            };

            const headers = lines.length > 0 ? clean(lines[0]) : [];
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
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
         const container = this.querySelector('[data-block-id="doc-block-10"]');
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
         const container = this.querySelector('[data-block-id="doc-block-11"]');
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
         const container = this.querySelector('[data-block-id="doc-block-12"]');
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
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const lines = ["| Shape | URL | Works |","|---|---|---|","| User site | `https://user.github.io/` | Yes |","| Project site + custom domain | `https://example.com/` | Yes |","| Project site by default | `https://user.github.io/repo/` | No (needs a base path) |"];
            const clean = (line) => {
               let value = line.trim();
               if (value.startsWith('|')) {
                  value = value.slice(1);
               }
               if (value.endsWith('|')) {
                  value = value.slice(0, -1);
               }
               return value.split('|').map((cell) => cell.trim());
            };

            const formatCell = (text) => {
               let output = text
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');

               const applyBold = (input) => {
                  let result = '';
                  let index = 0;
                  while (index < input.length) {
                     const start = input.indexOf('**', index);
                     if (start === -1) {
                        result += input.slice(index);
                        break;
                     }
                     const end = input.indexOf('**', start + 2);
                     if (end === -1) {
                        result += input.slice(index);
                        break;
                     }
                     result += input.slice(index, start) + '<strong>' + input.slice(start + 2, end) + '</strong>';
                     index = end + 2;
                  }
                  return result;
               };

               const applyInlineCode = (input) => {
                  const parts = input.split(String.fromCharCode(96));
                  if (parts.length === 1) return input;
                  return parts
                     .map((part, idx) => (idx % 2 === 1 ? '<code>' + part + '</code>' : part))
                     .join('');
               };

               output = applyBold(output);
               output = applyInlineCode(output);
               return output;
            };

            const headers = lines.length > 0 ? clean(lines[0]) : [];
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-14"]');
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
         const container = this.querySelector('[data-block-id="doc-block-15"]');
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
         const container = this.querySelector('[data-block-id="doc-block-16"]');
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
         const container = this.querySelector('[data-block-id="doc-block-17"]');
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
         const container = this.querySelector('[data-block-id="doc-block-18"]');
         if (container) {
            const lines = ["| File | Contents |","|---|---|","| `sliceConfig.json` | Framework configuration, including `server.port`/`host`. |","| `routes.js` | Route table. |","| `bundle.config.json` | Bundle manifest. |","| `slice-env.json` / `.generated.js` | `SLICE_PUBLIC_*` values only. |","| `manifest.json` | PWA manifest. |","| `seo.json`, `sitemap.xml`, `robots.txt` | Public SEO data. |","| `service-worker.js` | Public worker. |"];
            const clean = (line) => {
               let value = line.trim();
               if (value.startsWith('|')) {
                  value = value.slice(1);
               }
               if (value.endsWith('|')) {
                  value = value.slice(0, -1);
               }
               return value.split('|').map((cell) => cell.trim());
            };

            const formatCell = (text) => {
               let output = text
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');

               const applyBold = (input) => {
                  let result = '';
                  let index = 0;
                  while (index < input.length) {
                     const start = input.indexOf('**', index);
                     if (start === -1) {
                        result += input.slice(index);
                        break;
                     }
                     const end = input.indexOf('**', start + 2);
                     if (end === -1) {
                        result += input.slice(index);
                        break;
                     }
                     result += input.slice(index, start) + '<strong>' + input.slice(start + 2, end) + '</strong>';
                     index = end + 2;
                  }
                  return result;
               };

               const applyInlineCode = (input) => {
                  const parts = input.split(String.fromCharCode(96));
                  if (parts.length === 1) return input;
                  return parts
                     .map((part, idx) => (idx % 2 === 1 ? '<code>' + part + '</code>' : part))
                     .join('');
               };

               output = applyBold(output);
               output = applyInlineCode(output);
               return output;
            };

            const headers = lines.length > 0 ? clean(lines[0]) : [];
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-19"]');
         if (container) {
            const lines = ["| Symptom | Check |","|---|---|","| `/Themes`, `/images` 404 | `dist/public` was not flattened; rerun `slice export` and `--check`. |","| Unknown route returns the shell with 200 | SEO was not configured, or `--spa` is on. Add `seo.json` or remove `--spa`. |","| Unknown route returns 404 but the client route exists | The route is dynamic (`${param}`). Add `sitemap.paths` or use `--spa`. |","| Styles or bundles load from the wrong URL | The export must be served at the domain root, not a subpath. |","| `--check` reports `Components/` | Rerun without `--keep-components`. |","| Env values are stale | Rebuild; production env is frozen at build time. |","| GitHub Pages serves the README | Publish `dist-static/` itself as the Pages artifact, not the repository root. |"];
            const clean = (line) => {
               let value = line.trim();
               if (value.startsWith('|')) {
                  value = value.slice(1);
               }
               if (value.endsWith('|')) {
                  value = value.slice(0, -1);
               }
               return value.split('|').map((cell) => cell.trim());
            };

            const formatCell = (text) => {
               let output = text
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');

               const applyBold = (input) => {
                  let result = '';
                  let index = 0;
                  while (index < input.length) {
                     const start = input.indexOf('**', index);
                     if (start === -1) {
                        result += input.slice(index);
                        break;
                     }
                     const end = input.indexOf('**', start + 2);
                     if (end === -1) {
                        result += input.slice(index);
                        break;
                     }
                     result += input.slice(index, start) + '<strong>' + input.slice(start + 2, end) + '</strong>';
                     index = end + 2;
                  }
                  return result;
               };

               const applyInlineCode = (input) => {
                  const parts = input.split(String.fromCharCode(96));
                  if (parts.length === 1) return input;
                  return parts
                     .map((part, idx) => (idx % 2 === 1 ? '<code>' + part + '</code>' : part))
                     .join('');
               };

               output = applyBold(output);
               output = applyInlineCode(output);
               return output;
            };

            const headers = lines.length > 0 ? clean(lines[0]) : [];
            // Cells carry trusted inline markup (code/bold) from the parser, so
            // they use Table's explicit { html } opt-in (Table escapes plain strings).
            const rows = lines.slice(2).map((line) => clean(line).map((cell) => ({ html: formatCell(cell) })));
            const table = await slice.build('Table', { headers, rows });
            container.appendChild(table);
         }
      }
  }

  async update() {
    // Refresh dynamic content here if needed
  }

  beforeDestroy() {
    // Cleanup timers, listeners, or pending work here
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
