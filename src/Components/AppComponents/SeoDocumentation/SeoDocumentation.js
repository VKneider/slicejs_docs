export default class SeoDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "project-architecture/seo.md";
    this.markdownContent = "---\ntitle: SEO and Share Cards\nroute: /Documentation/Architecture/SEO\nnavLabel: SEO and Share Cards\nsection: Guides\ngroup: ''\norder: 80\ndescription: Per-route title, description, canonical, Open Graph and JSON-LD, real 404s, a committed sitemap, and titles that survive client-side navigation.\ncomponent: SeoDocumentation\ntags: [seo, meta, canonical, open-graph, sitemap, 404, router]\n---\n\n# SEO and Share Cards\n\nA Slice app is a SPA: the browser gets one `App/index.html` and the router swaps the view. Left alone\nthat means one `<title>` for every route, no canonical, a `200` for URLs that do not exist, and a link\npreview that looks the same everywhere. The framework fixes the mechanics; you provide the content.\n\n## The manifest: `seo.json`\n\nOne file, with one entry per page. It can live at the project root (hand-written) or inside\n`public/` — `src/public/seo.json`, which is what a generated pipeline writes. The server and the\n`slice seo` commands check the root first, then `public/`:\n\n```json\n{\n  \"version\": 1,\n  \"origin\": \"https://acme.dev\",\n  \"defaults\": {\n    \"titleSuffix\": \" | Acme\",\n    \"description\": \"Acme helps teams ship.\",\n    \"siteName\": \"Acme\",\n    \"locale\": \"en_US\",\n    \"image\": \"/images/banner.png\"\n  },\n  \"routes\": {\n    \"/\": { \"title\": \"Home\", \"titleSuffix\": false },\n    \"/pricing\": {\n      \"title\": \"Pricing\",\n      \"description\": \"Plans and limits.\",\n      \"image\": \"/og/pricing.png\",\n      \"robots\": true\n    },\n    \"/private\": { \"title\": \"Private\", \"robots\": false }\n  },\n  \"sitemap\": true\n}\n```\n\n`defaults` are inherited by every route, so a title suffix or a site-wide card is written once.\n\n| Field | What it does |\n|---|---|\n| `origin` | absolute URL used for canonical, `og:url`, `og:image` and the sitemap. Required in production |\n| `title` / `titlePrefix` / `titleSuffix` | `<title>`, `og:title`, `twitter:title`. The affixes add text around the title (the separator is part of the string); `false` disables one for a route |\n| `description` | the meta description plus both social descriptions |\n| `canonical` | defaults to `origin + path` |\n| `image` / `imageAlt` | the social card; `og:image:width/height/type` are derived when the file is local |\n| `robots` | `false` for `noindex, nofollow`, or `{ index, follow, noarchive, nosnippet }` |\n| `sitemap` | `false` keeps an indexable page out of `sitemap.xml`; otherwise `{ lastmod, priority, changefreq }` |\n| `jsonLd` | one object or an array; `@context` is added if you omit it |\n| `openGraph` / `twitter` | the full objects, if you need more than the short fields |\n\n### Routes with parameters\n\nUse the router's syntax. A pattern provides the metadata for every instance, and the canonical is\nalways the real path:\n\n```json\n{\n  \"routes\": {\n    \"/producto/${id}\": { \"title\": \"Producto\", \"image\": \"/og/producto.png\" }\n  }\n}\n```\n\n`/producto/42` gets that title and `origin + /producto/42` as its canonical. A pattern cannot be\nenumerated, so it never enters the sitemap by itself. A title built from the parameter needs the\nroute's own metadata in `routes.js` and is not part of this version.\n\n### Patterns in the sitemap\n\nA pattern can opt into the sitemap by declaring the values the app actually publishes. Each value is\na string for a single parameter or an object when the pattern has several:\n\n```json\n{\n  \"routes\": {\n    \"/producto/${id}\": {\n      \"title\": \"Producto\",\n      \"sitemap\": { \"paths\": [\"42\", { \"id\": \"7\" }], \"priority\": 0.6 }\n    }\n  }\n}\n```\n\n`slice seo sitemap` expands every value into its own `<url>` (one per locale, with the same\n`hreflang` alternates), and `slice seo check` fails when a value is missing one of the pattern's\nparameters. Values are URL-encoded; the route itself still renders dynamically per request.\n\n## Enabling it\n\n```js\nconst { app, start } = createSliceServer({\n  seo: { manifest: './seo.json' }\n});\n\nawait start();\n```\n\nAt startup the server reads the manifest, imports `routes.js` to know which paths are pages, renders\neach one once (head injected into the shell, gzip + brotli + ETag precomputed) and keeps them in\nmemory. A request is a lookup and a write.\n\n| Request | Answer |\n|---|---|\n| a known route | `200`, its own head, self canonical |\n| a path that is not a route | **`404`** with the shell (the client router paints its own NotFound) and `noindex` |\n| `robots: false` | `200` + `noindex, nofollow`, no canonical change |\n| a `${param}` route | `200`, rendered once per path and cached |\n\n### The origin, and why it is not read from the request\n\nThe head is prerendered once, so the origin has to be known at startup. It is resolved in this order:\n\n1. `SLICE_ORIGIN` (environment),\n2. `createSliceServer({ seo: { origin } })`,\n3. `origin` in `seo.json`,\n4. in development only: `http://localhost:<port>`,\n5. otherwise the server **fails at startup**.\n\nReading it from `req.headers.host` would produce one cached page per host and the wrong scheme behind\na TLS proxy. In development the `localhost` fallback keeps the metadata inspectable; set\n`SLICE_ORIGIN` on a preview deploy so its canonical and its card point at the preview.\n\n## The sitemap is a committed file\n\n```bash\nslice seo sitemap            # writes public/sitemap.xml from seo.json\nslice seo sitemap --dry-run  # reports, writes nothing\nslice seo check              # CI: validates the manifest and the committed sitemap\n```\n\n`slice seo sitemap` writes `src/public/sitemap.xml` (and `robots.txt` only when the manifest has a\n`robotsTxt` block), from the indexable routes only. It never overwrites silently: an existing file\nthat would change asks first, `--yes` skips the question, and a non-interactive run fails instead of\nwaiting for input. An unchanged file is not rewritten.\n\nCommit the result. `slice seo check` compares the committed file against the manifest and exits\nnon-zero when they drifted, so the sitemap cannot rot between deploys.\n\n## Titles survive client-side navigation\n\nRoute entries accept `metadata`, and the router applies it on every navigation — including the first\none — so the tab title does not stay on the landing page:\n\n```js\n// src/routes.js\n{ path: '/pricing', component: 'Pricing', metadata: { title: 'Pricing', description: 'Plans.' } }\n```\n\n```json\n// src/sliceConfig.json — only to opt out\n{ \"router\": { \"updateTitles\": false } }\n```\n\nWhat it does and does not do:\n\n- only the fields the route declares; a route without `metadata.title` keeps the server's title,\n- `canonical` and `robots` are **never** written from the client: crawlers do not run your JavaScript,\n  so changing them there would only desync the SPA from the HTML that was served,\n- a `router:change` listener still wins, because the metadata is applied before the event fires,\n- `slice doctor` and `slice seo check` warn when `routes.js` and `seo.json` disagree on a title for the\n  same path — that disagreement is what would make the tab title change after hydration.\n\n:::tip\nPut the canonical title in one place. If a route declares `metadata.title`, keep it identical to the\nmanifest's (including the `| Acme` suffix), or let the manifest own the title and leave\n`metadata.title` out.\n:::\n\n## What this does not solve\n\n- **The page body is still rendered in the browser.** A crawler that does not execute JavaScript sees\n  the correct head and an empty `#app`. Pre-rendering the article content is a separate problem.\n- **Generating the social image** is not part of the runtime. The manifest accepts `image`, and\n  `slice seo images` produces the files from the real pages (it writes `public/og/manifest.json`,\n  which you pass as `seo.images`). See [CLI commands](/Documentation/CLI#seo-images).\n\n## Several languages\n\nWith `slice.translator` configured, the same manifest drives **one page per route and locale**. The\ntext fields accept `{ \"t\": \"key\", \"params\": { … } }`, and the server resolves them with the app's\ndictionaries:\n\n```json title=\"seo.json\"\n{\n  \"defaults\": { \"titleSuffix\": { \"t\": \"seo.titleSuffix\" } },\n  \"routes\": {\n    \"/pricing\": { \"title\": { \"t\": \"pricing.title\" }, \"description\": { \"t\": \"pricing.description\" } }\n  },\n  \"locales\": { \"en\": { \"ogLocale\": \"en_US\" } }\n}\n```\n\n- Every literal route is prerendered once per locale (`/pricing`, `/en/pricing`), each with its own\n  `<html lang>`, canonical, translated `<head>` and `og:locale`.\n- Each page carries `<link rel=\"alternate\" hreflang=\"…\">` for its locales plus `x-default`.\n- Under `\"prefix\"`, `/` answers `302` to the default locale; under `\"except-default\"`, a\n  default-locale prefix (`/es/pricing`) answers `301` to `/pricing`.\n- A prefix that is not a configured locale is not a locale: it falls through to a real `404`.\n- `slice seo sitemap` writes one `<url>` per route and locale with the same alternates; a `{ t }` key\n  missing in one locale fails `slice seo check`, because that page would advertise the key as title.\n- `${param}` routes are rendered per request, per locale.\n\nSee [Translating an app](/Documentation/Translator) for the client half.\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"Guides"}]
            });
            if (breadcrumbs) {
               container.appendChild(breadcrumbs);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"version\": 1,\n  \"origin\": \"https://acme.dev\",\n  \"defaults\": {\n    \"titleSuffix\": \" | Acme\",\n    \"description\": \"Acme helps teams ship.\",\n    \"siteName\": \"Acme\",\n    \"locale\": \"en_US\",\n    \"image\": \"/images/banner.png\"\n  },\n  \"routes\": {\n    \"/\": { \"title\": \"Home\", \"titleSuffix\": false },\n    \"/pricing\": {\n      \"title\": \"Pricing\",\n      \"description\": \"Plans and limits.\",\n      \"image\": \"/og/pricing.png\",\n      \"robots\": true\n    },\n    \"/private\": { \"title\": \"Private\", \"robots\": false }\n  },\n  \"sitemap\": true\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Field","What it does"],
               rows: [[{"html":"<code>origin</code>"},{"html":"absolute URL used for canonical, <code>og:url</code>, <code>og:image</code> and the sitemap. Required in production"}],[{"html":"<code>title</code> / <code>titlePrefix</code> / <code>titleSuffix</code>"},{"html":"<code>&lt;title&gt;</code>, <code>og:title</code>, <code>twitter:title</code>. The affixes add text around the title (the separator is part of the string); <code>false</code> disables one for a route"}],[{"html":"<code>description</code>"},{"html":"the meta description plus both social descriptions"}],[{"html":"<code>canonical</code>"},{"html":"defaults to <code>origin + path</code>"}],[{"html":"<code>image</code> / <code>imageAlt</code>"},{"html":"the social card; <code>og:image:width/height/type</code> are derived when the file is local"}],[{"html":"<code>robots</code>"},{"html":"<code>false</code> for <code>noindex, nofollow</code>, or <code>{ index, follow, noarchive, nosnippet }</code>"}],[{"html":"<code>sitemap</code>"},{"html":"<code>false</code> keeps an indexable page out of <code>sitemap.xml</code>; otherwise <code>{ lastmod, priority, changefreq }</code>"}],[{"html":"<code>jsonLd</code>"},{"html":"one object or an array; <code>@context</code> is added if you omit it"}],[{"html":"<code>openGraph</code> / <code>twitter</code>"},{"html":"the full objects, if you need more than the short fields"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
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
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"routes\": {\n    \"/producto/${id}\": {\n      \"title\": \"Producto\",\n      \"sitemap\": { \"paths\": [\"42\", { \"id\": \"7\" }], \"priority\": 0.6 }\n    }\n  }\n}",
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Request","Answer"],
               rows: [[{"html":"a known route"},{"html":"<code>200</code>, its own head, self canonical"}],[{"html":"a path that is not a route"},{"html":"<strong><code>404</code></strong> with the shell (the client router paints its own NotFound) and <code>noindex</code>"}],[{"html":"<code>robots: false</code>"},{"html":"<code>200</code> + <code>noindex, nofollow</code>, no canonical change"}],[{"html":"a <code>${param}</code> route"},{"html":"<code>200</code>, rendered once per path and cached"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
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
         const container = this.querySelector('[data-block-id="doc-block-9"]');
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
         const container = this.querySelector('[data-block-id="doc-block-10"]');
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
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Put the canonical title in one place. If a route declares <code>metadata.title</code>, keep it identical to the manifest's (including the <code>| Acme</code> suffix), or let the manifest own the title and leave <code>metadata.title</code> out.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"defaults\": { \"titleSuffix\": { \"t\": \"seo.titleSuffix\" } },\n  \"routes\": {\n    \"/pricing\": { \"title\": { \"t\": \"pricing.title\" }, \"description\": { \"t\": \"pricing.description\" } }\n  },\n  \"locales\": { \"en\": { \"ogLocale\": \"en_US\" } }\n}",
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

customElements.define('slice-seodocumentation', SeoDocumentation);
