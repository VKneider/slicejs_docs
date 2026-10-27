export default class ServerEntrypointDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/server-entrypoint.md";
    this.markdownContent = "---\ntitle: Server Entrypoint\nroute: /Documentation/Architecture/Server-Entrypoint\nnavLabel: Server Entrypoint\nsection: Project Architecture\ngroup: Runtime and Deployment\norder: 1\ndescription: What api/index.js is, why the framework returns the app instead of listening, where your middleware goes, and the one rule that decides whether it runs at all.\ncomponent: ServerEntrypointDocumentation\ntags: [server, api, middleware, express, deployment, fallback]\n---\n\n# Server Entrypoint\n\n`api/index.js` is your server. It is a normal ES module that the CLI runs for both `slice dev` and\n`slice start`:\n\n```js\nimport { createSliceServer } from 'slicejs-web-framework/api/framework/server.js';\n\nconst { app, start } = createSliceServer();\n\nawait start();\n\nexport default app;\n```\n\n`createSliceServer()` builds an Express app with everything the framework needs — security,\ncompression, the environment endpoint, static assets, bundles, the PWA endpoints — and hands it back\n**without listening and without a catch-all**. Nothing is final until you call `start()`.\n\n## Adding your own middleware\n\nAnything you add between the factory and `start()` runs **before** the SPA fallback, which is the\nonly thing that must be last:\n\n```js\nimport { createSliceServer } from 'slicejs-web-framework/api/framework/server.js';\n\nconst { app, start } = createSliceServer();\n\napp.get('/health', (req, res) => res.json({ ok: true }));\napp.use('/api/hooks', hooks);\napp.use(sessionMiddleware);\napp.use((req, res, next) => {\n  res.setHeader('X-App', 'acme');\n  next();\n});\n\nawait start();\n\nexport default app;\n```\n\n:::warning\nMiddleware added **after** `start()` never runs. `start()` mounts the terminal fallback and then\nlistens, so anything registered later is past the piece that answers every page request. Keep\n`await start()` as the last line.\n:::\n\n## `start()` and the terminal fallback\n\n`start({ port, host, signals })`:\n\n- resolves the port as `options.port` → `PORT` → `sliceConfig.server.port` → `3001`,\n- mounts `sliceFallback()` (and the error handler) unless you already mounted one,\n- installs `SIGINT`/`SIGTERM` once and closes the server gracefully (`signals: false` opts out),\n- throws if called twice,\n- returns the `http.Server` (it is async because the SEO context is prepared before listening).\n\nThe fallback is where \"nobody answered\" is decided:\n\n| Request | What it answers |\n|---|---|\n| a known page | the prerendered HTML for that route (or the plain shell without SEO) |\n| a path that is not a page | the same shell with a real `404` |\n| an unknown `/api/*` path | `404` JSON, never the shell |\n| a non-`GET` request | falls through, so Express answers it |\n| a component file in development (`.html`, `.css`) | the shell, or an empty stylesheet for JS-only components |\n\n## Running without `start()`\n\nFor a serverless adapter or a test harness, close the chain by hand:\n\n```js\nimport express from 'express';\nimport {\n  sliceFallback,\n  sliceErrorHandler\n} from 'slicejs-web-framework/api/framework/server.js';\n\nconst app = express();\napp.get('/health', (req, res) => res.json({ ok: true }));\napp.use(sliceFallback({ projectRoot: process.cwd() }));\napp.use(sliceErrorHandler({ projectRoot: process.cwd() }));\n\nexport default app;\n```\n\nBoth take the same options as the factory (`projectRoot`, `mode`, `seo`). The error handler has to be\nmounted after the fallback because Express only routes an error to middleware registered later in\nthe stack.\n\n## SEO is an option, not a second server\n\nPer-route `<title>`, canonical, Open Graph and real 404s are wired by passing `seo` to the factory:\n\n```js\nconst { app, start } = createSliceServer({\n  seo: { manifest: './seo.json' }\n});\n```\n\nThe manifest, the origin rules and the sitemap command live in\n[SEO and Share Cards](/Documentation/Architecture/SEO). Without that option the fallback keeps the\nbehaviour of a plain SPA: every path answers the shell with `200`.\n\n## Where the pieces live\n\n```\napi/index.js                 your server (this page)\napi/seo.js                   only if you generate the manifest yourself\nnode_modules/slicejs-web-framework/api/framework/server.js   the factory + fallback\nnode_modules/slicejs-web-framework/api/framework/seo.js      the SEO mechanics\n```\n\nDo not copy the framework server into your project: the factory already exposes every seam you\nneed, and a copy stops receiving fixes.\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import { createSliceServer } from 'slicejs-web-framework/api/framework/server.js';\n\nconst { app, start } = createSliceServer();\n\nawait start();\n\nexport default app;",
               language: "js"
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
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import { createSliceServer } from 'slicejs-web-framework/api/framework/server.js';\n\nconst { app, start } = createSliceServer();\n\napp.get('/health', (req, res) => res.json({ ok: true }));\napp.use('/api/hooks', hooks);\napp.use(sessionMiddleware);\napp.use((req, res, next) => {\n  res.setHeader('X-App', 'acme');\n  next();\n});\n\nawait start();\n\nexport default app;",
               language: "js"
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
            const lines = ["| Request | What it answers |","|---|---|","| a known page | the prerendered HTML for that route (or the plain shell without SEO) |","| a path that is not a page | the same shell with a real `404` |","| an unknown `/api/*` path | `404` JSON, never the shell |","| a non-`GET` request | falls through, so Express answers it |","| a component file in development (`.html`, `.css`) | the shell, or an empty stylesheet for JS-only components |"];
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import express from 'express';\nimport {\n  sliceFallback,\n  sliceErrorHandler\n} from 'slicejs-web-framework/api/framework/server.js';\n\nconst app = express();\napp.get('/health', (req, res) => res.json({ ok: true }));\napp.use(sliceFallback({ projectRoot: process.cwd() }));\napp.use(sliceErrorHandler({ projectRoot: process.cwd() }));\n\nexport default app;",
               language: "js"
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
               value: "const { app, start } = createSliceServer({\n  seo: { manifest: './seo.json' }\n});",
               language: "js"
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
               value: "api/index.js                 your server (this page)\napi/seo.js                   only if you generate the manifest yourself\nnode_modules/slicejs-web-framework/api/framework/server.js   the factory + fallback\nnode_modules/slicejs-web-framework/api/framework/seo.js      the SEO mechanics",
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

customElements.define('slice-serverentrypointdocumentation', ServerEntrypointDocumentation);
