export default class PwaDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "pwa.md";
    this.markdownContent = "---\ntitle: Make Your App a PWA\nroute: /Documentation/Configuration/PWA\nnavLabel: PWA\nsection: Getting Started\ngroup: Configuration\norder: 22\ndescription: Manually turn a Slice app into an installable PWA with a manifest and a service worker.\ncomponent: PwaDocumentation\ntags: [pwa, manifest, service-worker, offline, configuration]\n---\n\n# Make Your App a PWA\n\n## Overview\nA Progressive Web App is **installable** (add to home screen) and can work\n**offline**. A Slice app becomes one by adding three things — a web app manifest,\nsome icons, and a service worker — and registering the worker from your page.\n\nYou don't need any extra server setup: the Slice dev/prod server already serves\n`/manifest.json` and `/service-worker.js` with the correct MIME types (and the\nservice worker with `Cache-Control: no-cache` and `Service-Worker-Allowed: /` so\nits scope is the whole app). Drop the files in `src/` and they're served at the\nsite root; `slice build` copies them into `dist/` for production.\n\n## Steps\n:::steps\n1. Add `src/manifest.json`.\n2. Add icons and expose their folder in `sliceConfig.json`.\n3. Add `src/service-worker.js`.\n4. Link the manifest and theme color in `App/index.html`.\n5. Register the service worker — in production only.\n:::\n\n## 1. The manifest\nCreate `src/manifest.json` (served at `/manifest.json`):\n\n```json title=\"src/manifest.json\"\n{\n  \"name\": \"Orders Dashboard\",\n  \"short_name\": \"Orders\",\n  \"start_url\": \"/\",\n  \"scope\": \"/\",\n  \"display\": \"standalone\",\n  \"theme_color\": \"#11131c\",\n  \"background_color\": \"#11131c\",\n  \"icons\": [\n    { \"src\": \"/images/icon-192.png\", \"sizes\": \"192x192\", \"type\": \"image/png\" },\n    { \"src\": \"/images/icon-512.png\", \"sizes\": \"512x512\", \"type\": \"image/png\" },\n    { \"src\": \"/images/icon-512-maskable.png\", \"sizes\": \"512x512\", \"type\": \"image/png\", \"purpose\": \"maskable\" }\n  ]\n}\n```\n\n## 2. Icons\nPut your icons in a folder that is in `publicFolders` so they are served and\ncopied to `dist/`. The starter already exposes `images/`, so `src/images/icon-192.png`\nis served at `/images/icon-192.png`. Provide at least 192×192 and 512×512, plus a\n512×512 `maskable` for Android.\n\n```json title=\"sliceConfig.json — already includes images by default\"\n{ \"publicFolders\": [\"/Themes\", \"/Styles\", \"/assets\", \"/images\"] }\n```\n\n## 3. The service worker\nCreate `src/service-worker.js` (served at `/service-worker.js`). A minimal\napp-shell worker: precache a few core assets, serve navigations network-first with\nan offline fallback, and serve other GETs cache-first.\n\n```javascript title=\"src/service-worker.js\"\nconst CACHE = 'app-v1'; // bump this string when you ship new assets\nconst PRECACHE = ['/', '/manifest.json', '/images/icon-192.png'];\n\nself.addEventListener('install', (event) => {\n  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));\n});\n\nself.addEventListener('activate', (event) => {\n  event.waitUntil(\n    caches.keys()\n      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))\n      .then(() => self.clients.claim())\n  );\n});\n\nself.addEventListener('fetch', (event) => {\n  const { request } = event;\n  if (request.method !== 'GET') return;\n  if (request.mode === 'navigate') {\n    event.respondWith(fetch(request).catch(() => caches.match('/')));\n    return;\n  }\n  event.respondWith(caches.match(request).then((hit) => hit || fetch(request)));\n});\n```\n\nList in `PRECACHE` the assets you want available offline. In production your code\nships as hashed bundles under `/bundles/`, so add the ones your first screen needs\nand bump `CACHE` whenever you deploy new assets.\n\n## 4. Link it in the page\nAdd the manifest and theme color to `App/index.html`:\n\n```html title=\"App/index.html (inside <head>)\"\n<link rel=\"manifest\" href=\"/manifest.json\" />\n<meta name=\"theme-color\" content=\"#11131c\" />\n<link rel=\"apple-touch-icon\" href=\"/images/icon-192.png\" />\n```\n\n## 5. Register the worker — production only\nA caching service worker would serve stale files during development and break the\nlive-edit loop. Register it **only in production**, and unregister any leftover\nworker in development. Add this once, e.g. at the end of `App/index.html`:\n\n```html title=\"App/index.html (before </body>)\"\n<script type=\"module\">\n  if ('serviceWorker' in navigator) {\n    const isProduction = await fetch('/slice-env.json', { cache: 'no-store' })\n      .then((r) => (r.ok ? r.json() : null))\n      .then((env) => env?.mode === 'production')\n      .catch(() => true);\n\n    if (isProduction) {\n      navigator.serviceWorker.register('/service-worker.js', { scope: '/' });\n    } else {\n      const registrations = await navigator.serviceWorker.getRegistrations();\n      registrations.forEach((registration) => registration.unregister());\n    }\n  }\n</script>\n```\n\n## Best Practices\n:::tip\nBump the `CACHE` string on every deploy. The `activate` handler deletes old caches,\nso users get the new assets instead of a stale shell.\n:::\n\n:::tip\nKeep `PRECACHE` small — just the shell and what the first screen needs. Everything\nelse is cached on demand by the cache-first `fetch` handler.\n:::\n\n## Gotchas\n:::warning\nNever register a caching service worker in development. It serves old assets and\nhides your edits. The snippet above registers only when `slice-env.json` reports\n`production` and unregisters otherwise.\n:::\n\n:::warning\nKeep `service-worker.js` at the site root (`/service-worker.js`) so its scope is the\nwhole app. A worker served from a subfolder only controls that subfolder.\n:::\n\n## FAQ\n:::details title=\"Do I need to configure the server to serve these files?\"\nNo. The Slice server already serves `/manifest.json` and `/service-worker.js` (with\nthe right MIME types and no-cache headers for the worker). Just place the files in\n`src/` — they are served in dev and copied to `dist/` by `slice build`.\n:::\n\n:::details title=\"Why isn't my app updating after I deploy?\"\nA service worker keeps serving its cached assets until a new worker activates. Bump\nthe `CACHE` string so `activate` clears the old cache, and reload twice (once to\ninstall the new worker, once for it to take control).\n:::\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
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
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{ \"publicFolders\": [\"/Themes\", \"/Styles\", \"/assets\", \"/images\"] }",
               language: "json"
            });
            if ("sliceConfig.json — already includes images by default") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "sliceConfig.json — already includes images by default";
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
            const details = await slice.build('Details', { title: "Do I need to configure the server to serve these files?", text: "No. The Slice server already serves `/manifest.json` and `/service-worker.js` (with\nthe right MIME types and no-cache headers for the worker). Just place the files in\n`src/` — they are served in dev and copied to `dist/` by `slice build`." });
            container.appendChild(details);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const details = await slice.build('Details', { title: "Why isn't my app updating after I deploy?", text: "A service worker keeps serving its cached assets until a new worker activates. Bump\nthe `CACHE` string so `activate` clears the old cache, and reload twice (once to\ninstall the new worker, once for it to take control)." });
            container.appendChild(details);
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

customElements.define('slice-pwadocumentation', PwaDocumentation);
