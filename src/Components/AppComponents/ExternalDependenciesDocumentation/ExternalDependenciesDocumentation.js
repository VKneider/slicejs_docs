export default class ExternalDependenciesDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "external-dependencies.md";
    this.markdownContent = "---\ntitle: External Dependencies\nroute: /Documentation/External-Dependencies\nnavLabel: External Dependencies\nsection: Getting Started\ngroup: Tooling\norder: 25\ndescription: Use npm packages in Slice.js — bare imports resolved from node_modules, or files served from src/public/.\ncomponent: ExternalDependenciesDocumentation\ntags: [dependencies, external, public, bundling, node_modules]\n---\n\n# External Dependencies\n\n## Overview\nSlice.js supports two ways to use third-party code, so you can pick the one that fits the library you have.\n\n| Situation | Reach for |\n|-----------|-----------|\n| An npm package installed in `node_modules` (`dayjs`, `gsap`, `date-fns`, …) | **Bare imports** |\n| A vendored script/file you drop into your project | **The `public/` folder** |\n\nBare imports resolve packages from `node_modules` — the same mental model as a React or Vite project. The `public/` folder serves a file you place under `src/public/`, with no resolution step. Both are covered below.\n\n## Bare Imports from `node_modules`\nInstall a package and import it by name — no configuration required:\n\n```bash title=\"Install\"\npnpm add gsap\n```\n\n```javascript title=\"HeroBanner.js\"\nimport gsap from 'gsap';\n\nexport default class HeroBanner extends HTMLElement {\n  init() {\n    gsap.from(this.querySelector('.title'), { y: 24, opacity: 0, duration: 0.4 });\n  }\n}\n```\n\nSlice resolves the package with esbuild — the same resolver in development and in production — so CommonJS and ESM packages behave identically across `slice dev`, `slice build`, and `slice start`.\n\n### How it works\n- **`slice dev`**: no app bundling. Bare specifiers in your served modules are rewritten to a virtual `/@slice-modules/<package>` URL, and each package is pre-bundled on demand and cached (on disk under `node_modules/.slice-deps`, keyed by version). Your components still load as native ES modules.\n- **`slice build` / `slice start`**: each package is bundled once and registered in the production bundle. A package used by two or more route bundles is extracted into a single shared `slice-bundle.vendor-shared.js` (no duplication).\n\n:::tip\nBecause dev and build share the same esbuild resolver, a package that works in `slice dev` works the same way after `slice build`. There is no separate dev-only shim to keep in sync.\n:::\n\n### Module formats and assets\nResolution and interop are handled by esbuild, so the following all work:\n\n- **CommonJS, ESM and UMD** packages, including modern `exports` maps (with `browser`/`import` conditions), the legacy `browser` field, scoped packages (`@scope/pkg`) and subpath specifiers (`pkg/feature`).\n- **Transitive dependencies** — a package's own dependencies are bundled in automatically.\n- **Static and dynamic imports** — both `import gsap from 'gsap'` and `const g = await import('gsap')` resolve to the same bundled package.\n- **Re-exports** — a package (or a relative helper of yours) can `export * from '…'` / `export { x } from '…'`; the bundler wires them.\n- **Assets a package imports**: CSS is bundled and injected as a `<style>` at runtime (once per stylesheet); WASM, images and fonts are inlined as data URLs; text assets (`.glsl/.vert/.frag/.txt`) are inlined as strings. Everything stays self-contained — no sidecar files.\n- **Browser globals**: static `process.env.NODE_ENV` and `global` are substituted at build time, and a small runtime shim provides `process`/`global` for dynamic references — so packages that touch them work without a polyfill. This is **not** a full Node polyfill (see Gotchas).\n\n### Strict builds (CI)\nBy default an unresolved package warns, and the component that imported it fails at runtime. In CI, prefer a hard failure so a missing install never ships:\n\n```bash title=\"Fail the build on any unresolved dependency\"\nslice build --strict-external\n```\n\n`slice doctor` also lists bare imports that are missing from `node_modules`, so you can catch a forgotten install before building.\n\n## The `public/` folder\nUse this for files you vendor directly into your project (a pre-built UMD/ESM script, a polyfill, an image, a font — anything you don't install via npm).\n\nEverything under **`src/public/`** is served at the **root URL** and copied verbatim into the build — no configuration required. So `src/public/libs/my-widget.min.js` is available at `/libs/my-widget.min.js`:\n\n```text\nsrc/\n  public/\n    libs/\n      my-widget.min.js\n    images/\n      logo.png\n```\n\n```javascript title=\"Component usage\"\nimport '/libs/my-widget.min.js';\n```\n\nYour `Themes`, `Styles` and `images` folders live under `public/` too (`src/public/Themes`, …); their URLs (`/Themes`, `/Styles`, `/images`) are unchanged.\n\n- `slice dev`: `src/public/` is served at `/`.\n- `slice build`: `src/public/` is copied into `dist/` and served at `/`.\n- Absolute imports (`/libs/…`) are preserved when the file exists under `public/`; otherwise the CLI warns and strips them.\n\n## Relative Imports\nRelative imports (`./`, `../`) for your own modules always work and need no configuration:\n\n```javascript title=\"UserCard.js\"\nimport { formatName } from './helpers.js';\n```\n\nA relative helper can itself import and **re-export** (`export * from './x.js'`, `export { y } from './x.js'`) — the bundler inlines the whole helper graph.\n\n**JSON** imports work too: the default import is the whole document and named imports map to top-level keys.\n\n```javascript title=\"Importing JSON\"\nimport config from './config.json';        // whole document\nimport { version } from './package-info.json'; // a top-level key\n```\n\n## Gotchas\n\n:::warning\nPackages must be **browser-compatible**. A package that imports Node built-ins (`fs`, `os`, `util`, real `stream`, or needs `Buffer`, …) cannot run in the browser, so the build reports a clear resolution error instead of shipping a broken bundle. Slice provides only a minimal `process`/`global` shim — **not** a full Node polyfill layer. Use a browser build of the library, or drop a vendored file into `src/public/`.\n:::\n\n:::warning\nIf a bare import isn't resolved, Slice CLI warns and strips it. Check that the package is installed in `node_modules` (run your package manager's install). Use `slice doctor` to list bare imports that are missing.\n:::\n\n:::warning\n`public/` imports must start with `/` (absolute path) and the file must exist under `src/public/...` before building.\n:::\n\n## From a vendored file to an npm package\nIf you vendored a library only because bare imports weren't available, install it from npm and switch the import:\n\n```javascript title=\"Before — vendored file\"\nimport '/libs/dayjs/dayjs.min.js';\n```\n\n```javascript title=\"After — npm package\"\nimport dayjs from 'dayjs';\n```\n\nThen remove the vendored copy from `src/public/`.\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const lines = ["| Situation | Reach for |","|-----------|-----------|","| An npm package installed in `node_modules` (`dayjs`, `gsap`, `date-fns`, …) | **Bare imports** |","| A vendored script/file you drop into your project | **The `public/` folder** |"];
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
         const container = this.querySelector('[data-block-id="doc-block-3"]');
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
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
         const container = this.querySelector('[data-block-id="doc-block-5"]');
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
         const container = this.querySelector('[data-block-id="doc-block-6"]');
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
         const container = this.querySelector('[data-block-id="doc-block-7"]');
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
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
         const container = this.querySelector('[data-block-id="doc-block-9"]');
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
         const container = this.querySelector('[data-block-id="doc-block-10"]');
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

customElements.define('slice-externaldependenciesdocumentation', ExternalDependenciesDocumentation);
