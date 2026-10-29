export default class SeoDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "project-architecture/seo.md";
    this.markdownContent = "---\ntitle: SEO and Share Cards\nroute: /Documentation/Architecture/SEO\nnavLabel: SEO and Share Cards\nsection: Project Architecture\ngroup: Runtime and Deployment\norder: 2\ndescription: Per-route title, description, canonical, Open Graph and JSON-LD, real 404s, a committed sitemap, and titles that survive client-side navigation.\ncomponent: SeoDocumentation\ntags: [seo, meta, canonical, open-graph, sitemap, 404, router]\n---\n\n# SEO and Share Cards\n\nA Slice app is a SPA: the browser gets one `App/index.html` and the router swaps the view. Left alone\nthat means one `<title>` for every route, no canonical, a `200` for URLs that do not exist, and a link\npreview that looks the same everywhere. The framework fixes the mechanics; you provide the content.\n\n## The manifest: `seo.json`\n\nOne file, with one entry per page. It can live at the project root (hand-written) or inside\n`public/` — `src/public/seo.json`, which is what a generated pipeline writes. The server and the\n`slice seo` commands check the root first, then `public/`:\n\n```json\n{\n  \"version\": 1,\n  \"origin\": \"https://acme.dev\",\n  \"defaults\": {\n    \"titleTemplate\": \"%s | Acme\",\n    \"description\": \"Acme helps teams ship.\",\n    \"siteName\": \"Acme\",\n    \"locale\": \"en_US\",\n    \"image\": \"/images/banner.png\"\n  },\n  \"routes\": {\n    \"/\": { \"title\": \"Home\", \"titleTemplate\": \"%s\" },\n    \"/pricing\": {\n      \"title\": \"Pricing\",\n      \"description\": \"Plans and limits.\",\n      \"image\": \"/og/pricing.png\",\n      \"robots\": true\n    },\n    \"/private\": { \"title\": \"Private\", \"robots\": false }\n  },\n  \"sitemap\": true\n}\n```\n\n`defaults` are inherited by every route, so a title suffix or a site-wide card is written once.\n\n| Field | What it does |\n|---|---|\n| `origin` | absolute URL used for canonical, `og:url`, `og:image` and the sitemap. Required in production |\n| `title` / `titleTemplate` | `<title>`, `og:title`, `twitter:title`. `%s` is the title; a template of `\"%s\"` opts a route out |\n| `description` | the meta description plus both social descriptions |\n| `canonical` | defaults to `origin + path` |\n| `image` / `imageAlt` | the social card; `og:image:width/height/type` are derived when the file is local |\n| `robots` | `false` for `noindex, nofollow`, or `{ index, follow, noarchive, nosnippet }` |\n| `sitemap` | `false` keeps an indexable page out of `sitemap.xml`; otherwise `{ lastmod, priority, changefreq }` |\n| `jsonLd` | one object or an array; `@context` is added if you omit it |\n| `openGraph` / `twitter` | the full objects, if you need more than the short fields |\n\n### Routes with parameters\n\nUse the router's syntax. A pattern provides the metadata for every instance, and the canonical is\nalways the real path:\n\n```json\n{\n  \"routes\": {\n    \"/producto/${id}\": { \"title\": \"Producto\", \"image\": \"/og/producto.png\" }\n  }\n}\n```\n\n`/producto/42` gets that title and `origin + /producto/42` as its canonical. A pattern cannot be\nenumerated, so it never enters the sitemap. A title built from the parameter needs the route's own\nmetadata in `routes.js` and is not part of this version.\n\n## Enabling it\n\n```js\nconst { app, start } = createSliceServer({\n  seo: { manifest: './seo.json' }\n});\n\nawait start();\n```\n\nAt startup the server reads the manifest, imports `routes.js` to know which paths are pages, renders\neach one once (head injected into the shell, gzip + brotli + ETag precomputed) and keeps them in\nmemory. A request is a lookup and a write.\n\n| Request | Answer |\n|---|---|\n| a known route | `200`, its own head, self canonical |\n| a path that is not a route | **`404`** with the shell (the client router paints its own NotFound) and `noindex` |\n| `robots: false` | `200` + `noindex, nofollow`, no canonical change |\n| a `${param}` route | `200`, rendered once per path and cached |\n\n### The origin, and why it is not read from the request\n\nThe head is prerendered once, so the origin has to be known at startup. It is resolved in this order:\n\n1. `SLICE_ORIGIN` (environment),\n2. `createSliceServer({ seo: { origin } })`,\n3. `origin` in `seo.json`,\n4. in development only: `http://localhost:<port>`,\n5. otherwise the server **fails at startup**.\n\nReading it from `req.headers.host` would produce one cached page per host and the wrong scheme behind\na TLS proxy. In development the `localhost` fallback keeps the metadata inspectable; set\n`SLICE_ORIGIN` on a preview deploy so its canonical and its card point at the preview.\n\n## The sitemap is a committed file\n\n```bash\nslice seo sitemap            # writes public/sitemap.xml from seo.json\nslice seo sitemap --dry-run  # reports, writes nothing\nslice seo check              # CI: validates the manifest and the committed sitemap\n```\n\n`slice seo sitemap` writes `src/public/sitemap.xml` (and `robots.txt` only when the manifest has a\n`robotsTxt` block), from the indexable routes only. It never overwrites silently: an existing file\nthat would change asks first, `--yes` skips the question, and a non-interactive run fails instead of\nwaiting for input. An unchanged file is not rewritten.\n\nCommit the result. `slice seo check` compares the committed file against the manifest and exits\nnon-zero when they drifted, so the sitemap cannot rot between deploys.\n\n## Titles survive client-side navigation\n\nRoute entries accept `metadata`, and the router applies it on every navigation — including the first\none — so the tab title does not stay on the landing page:\n\n```js\n// src/routes.js\n{ path: '/pricing', component: 'Pricing', metadata: { title: 'Pricing', description: 'Plans.' } }\n```\n\n```json\n// src/sliceConfig.json — only to opt out\n{ \"router\": { \"updateTitles\": false } }\n```\n\nWhat it does and does not do:\n\n- only the fields the route declares; a route without `metadata.title` keeps the server's title,\n- `canonical` and `robots` are **never** written from the client: crawlers do not run your JavaScript,\n  so changing them there would only desync the SPA from the HTML that was served,\n- a `router:change` listener still wins, because the metadata is applied before the event fires,\n- `slice doctor` and `slice seo check` warn when `routes.js` and `seo.json` disagree on a title for the\n  same path — that disagreement is what would make the tab title change after hydration.\n\n:::tip\nPut the canonical title in one place. If a route declares `metadata.title`, keep it identical to the\nmanifest's (including the `| Acme` suffix), or let the manifest own the title and leave\n`metadata.title` out.\n:::\n\n## What this does not solve\n\n- **The page body is still rendered in the browser.** A crawler that does not execute JavaScript sees\n  the correct head and an empty `#app`. Pre-rendering the article content is a separate problem.\n- **Generating the social image** is not part of the runtime. The manifest accepts `image`, and\n  `slice seo images` produces the files from the real pages (it writes `public/og/manifest.json`,\n  which you pass as `seo.images`). See [CLI commands](/Documentation/CLI#seo-images).\n\n## Several languages\n\nWith `slice.translator` configured, the same manifest drives **one page per route and locale**. The\ntext fields accept `{ \"t\": \"key\", \"params\": { … } }`, and the server resolves them with the app's\ndictionaries:\n\n```json title=\"seo.json\"\n{\n  \"defaults\": { \"titleTemplate\": { \"t\": \"seo.titleTemplate\" } },\n  \"routes\": {\n    \"/pricing\": { \"title\": { \"t\": \"pricing.title\" }, \"description\": { \"t\": \"pricing.description\" } }\n  },\n  \"locales\": { \"en\": { \"ogLocale\": \"en_US\" } }\n}\n```\n\n- Every literal route is prerendered once per locale (`/pricing`, `/en/pricing`), each with its own\n  `<html lang>`, canonical, translated `<head>` and `og:locale`.\n- Each page carries `<link rel=\"alternate\" hreflang=\"…\">` for its locales plus `x-default`.\n- Under `\"prefix\"`, `/` answers `302` to the default locale; under `\"prefix-except-default\"`, a\n  default-locale prefix (`/es/pricing`) answers `301` to `/pricing`.\n- A prefix that is not a configured locale is not a locale: it falls through to a real `404`.\n- `slice seo sitemap` writes one `<url>` per route and locale with the same alternates; a `{ t }` key\n  missing in one locale fails `slice seo check`, because that page would advertise the key as title.\n- `${param}` routes are rendered per request, per locale.\n\nSee [Translating an app](/Documentation/Translator) for the client half.\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"version\": 1,\n  \"origin\": \"https://acme.dev\",\n  \"defaults\": {\n    \"titleTemplate\": \"%s | Acme\",\n    \"description\": \"Acme helps teams ship.\",\n    \"siteName\": \"Acme\",\n    \"locale\": \"en_US\",\n    \"image\": \"/images/banner.png\"\n  },\n  \"routes\": {\n    \"/\": { \"title\": \"Home\", \"titleTemplate\": \"%s\" },\n    \"/pricing\": {\n      \"title\": \"Pricing\",\n      \"description\": \"Plans and limits.\",\n      \"image\": \"/og/pricing.png\",\n      \"robots\": true\n    },\n    \"/private\": { \"title\": \"Private\", \"robots\": false }\n  },\n  \"sitemap\": true\n}",
               language: "json"
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
            const lines = ["| Field | What it does |","|---|---|","| `origin` | absolute URL used for canonical, `og:url`, `og:image` and the sitemap. Required in production |","| `title` / `titleTemplate` | `<title>`, `og:title`, `twitter:title`. `%s` is the title; a template of `\"%s\"` opts a route out |","| `description` | the meta description plus both social descriptions |","| `canonical` | defaults to `origin + path` |","| `image` / `imageAlt` | the social card; `og:image:width/height/type` are derived when the file is local |","| `robots` | `false` for `noindex, nofollow`, or `{ index, follow, noarchive, nosnippet }` |","| `sitemap` | `false` keeps an indexable page out of `sitemap.xml`; otherwise `{ lastmod, priority, changefreq }` |","| `jsonLd` | one object or an array; `@context` is added if you omit it |","| `openGraph` / `twitter` | the full objects, if you need more than the short fields |"];
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"routes\": {\n    \"/producto/${id}\": { \"title\": \"Producto\", \"image\": \"/og/producto.png\" }\n  }\n}",
               language: "json"
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
               value: "const { app, start } = createSliceServer({\n  seo: { manifest: './seo.json' }\n});\n\nawait start();",
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
            const lines = ["| Request | Answer |","|---|---|","| a known route | `200`, its own head, self canonical |","| a path that is not a route | **`404`** with the shell (the client router paints its own NotFound) and `noindex` |","| `robots: false` | `200` + `noindex, nofollow`, no canonical change |","| a `${param}` route | `200`, rendered once per path and cached |"];
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice seo sitemap            # writes public/sitemap.xml from seo.json\nslice seo sitemap --dry-run  # reports, writes nothing\nslice seo check              # CI: validates the manifest and the committed sitemap",
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
               value: "// src/routes.js\n{ path: '/pricing', component: 'Pricing', metadata: { title: 'Pricing', description: 'Plans.' } }",
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "// src/sliceConfig.json — only to opt out\n{ \"router\": { \"updateTitles\": false } }",
               language: "json"
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
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"defaults\": { \"titleTemplate\": { \"t\": \"seo.titleTemplate\" } },\n  \"routes\": {\n    \"/pricing\": { \"title\": { \"t\": \"pricing.title\" }, \"description\": { \"t\": \"pricing.description\" } }\n  },\n  \"locales\": { \"en\": { \"ogLocale\": \"en_US\" } }\n}",
               language: "json"
            });
            if ("seo.json") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "seo.json";
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

customElements.define('slice-seodocumentation', SeoDocumentation);
