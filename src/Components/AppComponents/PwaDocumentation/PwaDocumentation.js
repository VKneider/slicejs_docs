export default class PwaDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "pwa.md";
    this.markdownContent = "---\ntitle: Make Your App a PWA\nroute: /Documentation/Configuration/PWA\nnavLabel: PWA\nsection: Configuration\ngroup: ''\norder: 60\ndescription: Manually turn a Slice app into an installable PWA with a manifest and a service worker.\ncomponent: PwaDocumentation\ntags: [pwa, manifest, service-worker, offline, configuration]\n---\n\n# Make Your App a PWA\n\n## Overview\nA Progressive Web App is **installable** (add to home screen) and can work\n**offline**. A Slice app becomes one by adding three things — a web app manifest,\nsome icons, and a service worker — and registering the worker from your page.\n\nYou don't need any extra server setup: the Slice dev/prod server already serves\n`/manifest.json` and `/service-worker.js` with the correct MIME types (and the\nservice worker with `Cache-Control: no-cache` and `Service-Worker-Allowed: /` so\nits scope is the whole app). Drop the files in `src/` and they're served at the\nsite root; `slice build` copies them into `dist/` for production.\n\nThey can also live in `src/public/`; Express prefers the `public/` copy for\nthese two files, and `slice export` preserves that precedence.\n\n## Steps\n:::steps\n1. Add `src/manifest.json`.\n2. Add icons under `src/public/`.\n3. Add `src/service-worker.js`.\n4. Link the manifest and theme color in `App/index.html`.\n5. Register the service worker — in production only.\n:::\n\n## 1. The manifest\nCreate `src/manifest.json` (served at `/manifest.json`):\n\n```json title=\"src/manifest.json\"\n{\n  \"name\": \"Orders Dashboard\",\n  \"short_name\": \"Orders\",\n  \"start_url\": \"/\",\n  \"scope\": \"/\",\n  \"display\": \"standalone\",\n  \"theme_color\": \"#11131c\",\n  \"background_color\": \"#11131c\",\n  \"icons\": [\n    { \"src\": \"/images/icon-192.png\", \"sizes\": \"192x192\", \"type\": \"image/png\" },\n    { \"src\": \"/images/icon-512.png\", \"sizes\": \"512x512\", \"type\": \"image/png\" },\n    { \"src\": \"/images/icon-512-maskable.png\", \"sizes\": \"512x512\", \"type\": \"image/png\", \"purpose\": \"maskable\" }\n  ]\n}\n```\n\n## 2. Icons\nPut your icons under `src/public/` so they are served at the root URL and copied\nto `dist/`. The starter already includes `src/public/images/`, so\n`src/public/images/icon-192.png` is served at `/images/icon-192.png`. Provide at\nleast 192×192 and 512×512, plus a 512×512 `maskable` for Android.\n\n`src/public/` is the **only** public asset entry point: everything under it is\nserved at `/` and copied into the build. That is also why `Themes/`, `Styles/`\nand `images/` live there — `paths.themes` and `paths.styles` point at the URLs\nthose folders expose (`/Themes`, `/Styles`). You do not need to expose them in\n`sliceConfig.json`.\n\n## 3. The service worker\nCreate `src/service-worker.js` (served at `/service-worker.js`). A minimal\napp-shell worker: precache a few core assets, serve navigations network-first with\nan offline fallback, and serve other GETs cache-first.\n\n```javascript title=\"src/service-worker.js\"\nconst CACHE = 'app-v1'; // bump this string when you ship new assets\nconst PRECACHE = ['/', '/manifest.json', '/images/icon-192.png'];\n\nself.addEventListener('install', (event) => {\n  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));\n});\n\nself.addEventListener('activate', (event) => {\n  event.waitUntil(\n    caches.keys()\n      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))\n      .then(() => self.clients.claim())\n  );\n});\n\nself.addEventListener('fetch', (event) => {\n  const { request } = event;\n  if (request.method !== 'GET') return;\n  if (request.mode === 'navigate') {\n    event.respondWith(fetch(request).catch(() => caches.match('/')));\n    return;\n  }\n  event.respondWith(caches.match(request).then((hit) => hit || fetch(request)));\n});\n```\n\nList in `PRECACHE` the assets you want available offline. In production your code\nships as bundles under `/bundles/` (hashed only when you build with\n`--hash-filenames`), so add the ones your first screen needs and bump `CACHE`\nwhenever you deploy new assets.\n\nThe `fetch` handler in the example is cache-first for everything except\nnavigations. If you keep stable bundle filenames, that means an open tab can keep\nserving the old bundle until the worker updates. Either bump `CACHE` on every\ndeploy (as above), or use `--hash-filenames` so a new build produces new URLs.\n\n## 4. Link it in the page\nAdd the manifest and theme color to `App/index.html`:\n\n```html title=\"App/index.html (inside <head>)\"\n<link rel=\"manifest\" href=\"/manifest.json\" />\n<meta name=\"theme-color\" content=\"#11131c\" />\n<link rel=\"apple-touch-icon\" href=\"/images/icon-192.png\" />\n```\n\n## 5. Register the worker — production only\nA caching service worker would serve stale files during development and break the\nlive-edit loop. Register it **only in production**, and unregister any leftover\nworker in development. Add this once, e.g. at the end of `App/index.html`:\n\n```html title=\"App/index.html (before </body>)\"\n<script type=\"module\">\n  if ('serviceWorker' in navigator) {\n    const isProduction = await fetch('/slice-env.json', { cache: 'no-store' })\n      .then((r) => (r.ok ? r.json() : null))\n      .then((env) => env?.mode === 'production')\n      .catch(() => true);\n\n    if (isProduction) {\n      navigator.serviceWorker.register('/service-worker.js', { scope: '/' });\n    } else {\n      const registrations = await navigator.serviceWorker.getRegistrations();\n      registrations.forEach((registration) => registration.unregister());\n    }\n  }\n</script>\n```\n\n## Best Practices\n:::tip\nBump the `CACHE` string on every deploy. The `activate` handler deletes old caches,\nso users get the new assets instead of a stale shell.\n:::\n\n:::tip\nKeep `PRECACHE` small — just the shell and what the first screen needs. Everything\nelse is cached on demand by the cache-first `fetch` handler.\n:::\n\n## Static export\n`service-worker.js` is published at the export root, so the same worker works on\na static host. Two export-specific rules:\n\n- Every path in `PRECACHE` must exist in `dist-static/`. The shell in this\n  example is `/` and `/manifest.json`; if you precache `/App/index.html`, that\n  file is present too.\n- Do **not** precache `/Components/...` in a static export: the exporter prunes\n  `Components/` by default. Use bundle URLs or public assets instead.\n\nIf you use `--spa`, navigations fall back to `/index.html` (or the configured\ncatch-all); without `--spa`, unknown routes get the real `404.html`.\n\n## Backend routes\nA service worker cannot add a backend. If your PWA calls `/api/*`, deploy the app\nwith `slice start` (Express) instead of `slice export`, or keep the static\nfrontend and point it at a separate API origin through `SLICE_PUBLIC_API_URL`.\n\n## Gotchas\n:::warning\nNever register a caching service worker in development. It serves old assets and\nhides your edits. The snippet above registers only when `slice-env.json` reports\n`production` and unregisters otherwise.\n:::\n\n:::warning\nKeep `service-worker.js` at the site root (`/service-worker.js`) so its scope is the\nwhole app. A worker served from a subfolder only controls that subfolder.\n:::\n\n## FAQ\n:::details title=\"Do I need to configure the server to serve these files?\"\nNo. The Slice server already serves `/manifest.json` and `/service-worker.js` (with\nthe right MIME types and no-cache headers for the worker). Just place the files in\n`src/` — they are served in dev and copied to `dist/` by `slice build`.\n:::\n\n:::details title=\"Why isn't my app updating after I deploy?\"\nA service worker keeps serving its cached assets until a new worker activates. Bump\nthe `CACHE` string so `activate` clears the old cache, and reload twice (once to\ninstall the new worker, once for it to take control).\n:::\n";
    this.setupRouterLinks();
    if (true) {
      await this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const breadcrumbs = await slice.build('Breadcrumbs', {
               items: [{"text":"Docs","path":"/Documentation"},{"text":"Configuration"}]
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
               value: "{\n  \"name\": \"Orders Dashboard\",\n  \"short_name\": \"Orders\",\n  \"start_url\": \"/\",\n  \"scope\": \"/\",\n  \"display\": \"standalone\",\n  \"theme_color\": \"#11131c\",\n  \"background_color\": \"#11131c\",\n  \"icons\": [\n    { \"src\": \"/images/icon-192.png\", \"sizes\": \"192x192\", \"type\": \"image/png\" },\n    { \"src\": \"/images/icon-512.png\", \"sizes\": \"512x512\", \"type\": \"image/png\" },\n    { \"src\": \"/images/icon-512-maskable.png\", \"sizes\": \"512x512\", \"type\": \"image/png\", \"purpose\": \"maskable\" }\n  ]\n}",
               language: "json"
            });
            if ("src/manifest.json") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "src/manifest.json";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const CACHE = 'app-v1'; // bump this string when you ship new assets\nconst PRECACHE = ['/', '/manifest.json', '/images/icon-192.png'];\n\nself.addEventListener('install', (event) => {\n  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));\n});\n\nself.addEventListener('activate', (event) => {\n  event.waitUntil(\n    caches.keys()\n      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))\n      .then(() => self.clients.claim())\n  );\n});\n\nself.addEventListener('fetch', (event) => {\n  const { request } = event;\n  if (request.method !== 'GET') return;\n  if (request.mode === 'navigate') {\n    event.respondWith(fetch(request).catch(() => caches.match('/')));\n    return;\n  }\n  event.respondWith(caches.match(request).then((hit) => hit || fetch(request)));\n});",
               language: "javascript"
            });
            if ("src/service-worker.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "src/service-worker.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "<link rel=\"manifest\" href=\"/manifest.json\" />\n<meta name=\"theme-color\" content=\"#11131c\" />\n<link rel=\"apple-touch-icon\" href=\"/images/icon-192.png\" />",
               language: "html"
            });
            if ("App/index.html (inside <head>)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "App/index.html (inside <head>)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "<script type=\"module\">\n  if ('serviceWorker' in navigator) {\n    const isProduction = await fetch('/slice-env.json', { cache: 'no-store' })\n      .then((r) => (r.ok ? r.json() : null))\n      .then((env) => env?.mode === 'production')\n      .catch(() => true);\n\n    if (isProduction) {\n      navigator.serviceWorker.register('/service-worker.js', { scope: '/' });\n    } else {\n      const registrations = await navigator.serviceWorker.getRegistrations();\n      registrations.forEach((registration) => registration.unregister());\n    }\n  }\n</script>",
               language: "html"
            });
            if ("App/index.html (before </body>)") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "App/index.html (before </body>)";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Bump the <code>CACHE</code> string on every deploy. The <code>activate</code> handler deletes old caches, so users get the new assets instead of a stale shell.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Keep <code>PRECACHE</code> small — just the shell and what the first screen needs. Everything else is cached on demand by the cache-first <code>fetch</code> handler.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Never register a caching service worker in development. It serves old assets and hides your edits. The snippet above registers only when <code>slice-env.json</code> reports <code>production</code> and unregisters otherwise.</p>";
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
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Keep <code>service-worker.js</code> at the site root (<code>/service-worker.js</code>) so its scope is the whole app. A worker served from a subfolder only controls that subfolder.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const details = await slice.build('Details', { title: "Do I need to configure the server to serve these files?" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<p>No. The Slice server already serves <code>/manifest.json</code> and <code>/service-worker.js</code> (with the right MIME types and no-cache headers for the worker). Just place the files in <code>src/</code> — they are served in dev and copied to <code>dist/</code> by <code>slice build</code>.</p>";
            if (details) {
               details.addDetail(body);
               container.appendChild(details);
            } else {
               container.appendChild(body);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const details = await slice.build('Details', { title: "Why isn't my app updating after I deploy?" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<p>A service worker keeps serving its cached assets until a new worker activates. Bump the <code>CACHE</code> string so <code>activate</code> clears the old cache, and reload twice (once to install the new worker, once for it to take control).</p>";
            if (details) {
               details.addDetail(body);
               container.appendChild(details);
            } else {
               container.appendChild(body);
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

customElements.define('slice-pwadocumentation', PwaDocumentation);
