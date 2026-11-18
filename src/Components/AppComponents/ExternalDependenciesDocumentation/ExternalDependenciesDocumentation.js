export default class ExternalDependenciesDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "external-dependencies.md";
    this.markdownContent = "---\ntitle: External Dependencies\nroute: /Documentation/External-Dependencies\nnavLabel: External Dependencies\nsection: Configuration\ngroup: ''\norder: 50\ndescription: Use npm packages in Slice.js — bare imports resolved from node_modules, or files served from src/public/.\ncomponent: ExternalDependenciesDocumentation\ntags: [dependencies, external, public, bundling, node_modules]\n---\n\n# External Dependencies\n\n## Overview\nSlice.js supports two ways to use third-party code, so you can pick the one that fits the library you have.\n\n| Situation | Reach for |\n|-----------|-----------|\n| An npm package installed in `node_modules` (`dayjs`, `gsap`, `date-fns`, …) | **Bare imports** |\n| A vendored script/file you drop into your project | **The `public/` folder** |\n\nBare imports resolve packages from `node_modules` — the same mental model as a React or Vite project. The `public/` folder serves a file you place under `src/public/`, with no resolution step. Both are covered below.\n\n## Bare Imports from `node_modules`\nInstall a package and import it by name — no configuration required:\n\n```bash title=\"Install\"\npnpm add gsap\n```\n\n```javascript title=\"HeroBanner.js\"\nimport gsap from 'gsap';\n\nexport default class HeroBanner extends HTMLElement {\n  init() {\n    gsap.from(this.querySelector('.title'), { y: 24, opacity: 0, duration: 0.4 });\n  }\n}\n```\n\nSlice resolves the package with esbuild — the same resolver in development and in production — so CommonJS and ESM packages behave identically across `slice dev`, `slice build`, and `slice start`.\n\n### How it works\n- **`slice dev`**: no app bundling. Bare specifiers in your served modules are rewritten to a virtual `/@slice-modules/<package>` URL, and each package is pre-bundled on demand and cached (on disk under `node_modules/.slice-deps`, keyed by version). Your components still load as native ES modules.\n- **`slice build` / `slice start`**: each package is bundled once and registered in the production bundle. A package used by two or more route bundles is extracted into a single shared `slice-bundle.vendor-shared.js` (no duplication).\n\n:::tip\nBecause dev and build share the same esbuild resolver, a package that works in `slice dev` works the same way after `slice build`. There is no separate dev-only shim to keep in sync.\n:::\n\n### Module formats and assets\nResolution and interop are handled by esbuild, so the following all work:\n\n- **CommonJS, ESM and UMD** packages, including modern `exports` maps (with `browser`/`import` conditions), the legacy `browser` field, scoped packages (`@scope/pkg`) and subpath specifiers (`pkg/feature`).\n- **Transitive dependencies** — a package's own dependencies are bundled in automatically.\n- **Static and dynamic imports** — both `import gsap from 'gsap'` and `const g = await import('gsap')` resolve to the same bundled package.\n- **Re-exports** — a package (or a relative helper of yours) can `export * from '…'` / `export { x } from '…'`; the bundler wires them.\n- **Assets a package imports**: CSS is bundled and injected as a `<style>` at runtime (once per stylesheet); WASM, images and fonts are inlined as data URLs; text assets (`.glsl/.vert/.frag/.txt`) are inlined as strings. Everything stays self-contained — no sidecar files.\n- **Browser globals**: static `process.env.NODE_ENV` and `global` are substituted at build time, and a small runtime shim provides `process`/`global` for dynamic references — so packages that touch them work without a polyfill. This is **not** a full Node polyfill (see Gotchas).\n\n### Strict builds (CI)\nBy default an unresolved package warns, and the component that imported it fails at runtime. In CI, prefer a hard failure so a missing install never ships:\n\n```bash title=\"Fail the build on any unresolved dependency\"\nslice build --strict-external\n```\n\n`slice doctor` also lists bare imports that are missing from `node_modules`, so you can catch a forgotten install before building.\n\n## The `public/` folder\nUse this for files you vendor directly into your project (a pre-built UMD/ESM script, a polyfill, an image, a font — anything you don't install via npm).\n\nEverything under **`src/public/`** is served at the **root URL** and copied verbatim into the build — no configuration required. So `src/public/libs/my-widget.min.js` is available at `/libs/my-widget.min.js`:\n\n```text\nsrc/\n  public/\n    libs/\n      my-widget.min.js\n    images/\n      logo.png\n```\n\n```javascript title=\"Component usage\"\nimport '/libs/my-widget.min.js';\n```\n\nYour `Themes`, `Styles` and `images` folders live under `public/` too (`src/public/Themes`, …); their URLs (`/Themes`, `/Styles`, `/images`) are unchanged.\n\n- `slice dev`: `src/public/` is served at `/`.\n- `slice build`: `src/public/` is copied into `dist/` and served at `/`.\n- Absolute imports (`/libs/…`) are preserved when the file exists under `public/`; otherwise the CLI warns and strips them.\n\n## Relative Imports\nRelative imports (`./`, `../`) for your own modules always work and need no configuration:\n\n```javascript title=\"UserCard.js\"\nimport { formatName } from './helpers.js';\n```\n\nA relative helper can itself import and **re-export** (`export * from './x.js'`, `export { y } from './x.js'`) — the bundler inlines the whole helper graph.\n\n**JSON** imports work too: the default import is the whole document and named imports map to top-level keys.\n\n```javascript title=\"Importing JSON\"\nimport config from './config.json';        // whole document\nimport { version } from './package-info.json'; // a top-level key\n```\n\n## Gotchas\n\n:::warning\nPackages must be **browser-compatible**. A package that imports Node built-ins (`fs`, `os`, `util`, real `stream`, or needs `Buffer`, …) cannot run in the browser, so the build reports a clear resolution error instead of shipping a broken bundle. Slice provides only a minimal `process`/`global` shim — **not** a full Node polyfill layer. Use a browser build of the library, or drop a vendored file into `src/public/`.\n:::\n\n:::warning\nIf a bare import isn't resolved, Slice CLI warns and strips it. Check that the package is installed in `node_modules` (run your package manager's install). Use `slice doctor` to list bare imports that are missing.\n:::\n\n:::warning\n`public/` imports must start with `/` (absolute path) and the file must exist under `src/public/...` before building.\n:::\n\n## From a vendored file to an npm package\nIf you vendored a library only because bare imports weren't available, install it from npm and switch the import:\n\n```javascript title=\"Before — vendored file\"\nimport '/libs/dayjs/dayjs.min.js';\n```\n\n```javascript title=\"After — npm package\"\nimport dayjs from 'dayjs';\n```\n\nThen remove the vendored copy from `src/public/`.\n";
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
            const table = await slice.build('Table', {
               headers: ["Situation","Reach for"],
               rows: [[{"html":"An npm package installed in <code>node_modules</code> (<code>dayjs</code>, <code>gsap</code>, <code>date-fns</code>, …)"},{"html":"<strong>Bare imports</strong>"}],[{"html":"A vendored script/file you drop into your project"},{"html":"<strong>The <code>public/</code> folder</strong>"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "pnpm add gsap",
               language: "bash"
            });
            if ("Install") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Install";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import gsap from 'gsap';\n\nexport default class HeroBanner extends HTMLElement {\n  init() {\n    gsap.from(this.querySelector('.title'), { y: 24, opacity: 0, duration: 0.4 });\n  }\n}",
               language: "javascript"
            });
            if ("HeroBanner.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "HeroBanner.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>Because dev and build share the same esbuild resolver, a package that works in <code>slice dev</code> works the same way after <code>slice build</code>. There is no separate dev-only shim to keep in sync.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice build --strict-external",
               language: "bash"
            });
            if ("Fail the build on any unresolved dependency") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Fail the build on any unresolved dependency";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "src/\n  public/\n    libs/\n      my-widget.min.js\n    images/\n      logo.png",
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
            const code = await slice.build('CodeVisualizer', {
               value: "import '/libs/my-widget.min.js';",
               language: "javascript"
            });
            if ("Component usage") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Component usage";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import { formatName } from './helpers.js';",
               language: "javascript"
            });
            if ("UserCard.js") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "UserCard.js";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import config from './config.json';        // whole document\nimport { version } from './package-info.json'; // a top-level key",
               language: "javascript"
            });
            if ("Importing JSON") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Importing JSON";
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
            body.innerHTML = "<p>Packages must be <strong>browser-compatible</strong>. A package that imports Node built-ins (<code>fs</code>, <code>os</code>, <code>util</code>, real <code>stream</code>, or needs <code>Buffer</code>, …) cannot run in the browser, so the build reports a clear resolution error instead of shipping a broken bundle. Slice provides only a minimal <code>process</code>/<code>global</code> shim — <strong>not</strong> a full Node polyfill layer. Use a browser build of the library, or drop a vendored file into <code>src/public/</code>.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-12"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>If a bare import isn't resolved, Slice CLI warns and strips it. Check that the package is installed in <code>node_modules</code> (run your package manager's install). Use <code>slice doctor</code> to list bare imports that are missing.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p><code>public/</code> imports must start with <code>/</code> (absolute path) and the file must exist under <code>src/public/...</code> before building.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-14"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import '/libs/dayjs/dayjs.min.js';",
               language: "javascript"
            });
            if ("Before — vendored file") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Before — vendored file";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-15"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "import dayjs from 'dayjs';",
               language: "javascript"
            });
            if ("After — npm package") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "After — npm package";
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

customElements.define('slice-externaldependenciesdocumentation', ExternalDependenciesDocumentation);
