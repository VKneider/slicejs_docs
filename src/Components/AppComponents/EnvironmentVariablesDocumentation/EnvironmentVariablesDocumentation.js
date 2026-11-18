export default class EnvironmentVariablesDocumentation extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/environment-variables.md";
    this.markdownContent = "---\ntitle: Environment Variables\nroute: /Documentation/Configuration/environment-variables\nnavLabel: Environment Variables\nsection: Configuration\ngroup: ''\norder: 20\ndescription: Expose browser-safe env values with SLICE_PUBLIC_ and runtime helpers.\ncomponent: EnvironmentVariablesDocumentation\ntags: [config, env, security]\n---\n\n# Environment Variables\n\n## Overview\nSlice.js exposes browser-safe environment variables through:\n\n- `GET /slice-env.json`\n- `slice.getEnv(key, fallback)`\n- `slice.getPublicEnv()`\n\nThis is intended for public runtime configuration (for example API base URLs or feature flags).\n\n## Public vs Private Variables\nOnly variables prefixed with `SLICE_PUBLIC_` are exposed to the browser.\n\n| Variable | Exposed to browser | Example |\n| --- | --- | --- |\n| `SLICE_PUBLIC_*` | yes | `SLICE_PUBLIC_API_URL=https://api.example.com` |\n| Any other key | no | `DB_PASSWORD=...` |\n\n:::warning\nEverything sent to the browser is public. Never put secrets, private tokens, or credentials in `SLICE_PUBLIC_*` variables.\n:::\n\n## Define Variables\nCreate or update your `.env` file:\n\n```bash title=\".env\"\nSLICE_PUBLIC_API_URL=https://api.example.com\nSLICE_PUBLIC_ENABLE_CHAT=true\nDB_PASSWORD=server-only\n```\n\n## Build-time Artifact\n`slice build` writes two files into `dist/`:\n\n- `slice-env.json` — the shared payload (`{ mode, env }`).\n- `slice-env.generated.js` — a tiny ESM shim that exports the same object.\n\nThe runtime **imports** `/slice-env.generated.js` at boot. There is no env endpoint in production.\n`slice dev` keeps `/slice-env.json` live so `.env` edits do not require a build.\n\n```json title=\"dist/slice-env.json\"\n{\n  \"mode\": \"production\",\n  \"env\": {\n    \"SLICE_PUBLIC_API_URL\": \"https://api.example.com\",\n    \"SLICE_PUBLIC_ENABLE_CHAT\": \"true\"\n  }\n}\n```\n\n### Resolution Rules\n- `process.env` has priority over `.env` when both define the same key.\n- In development, values are resolved per request.\n- In production, values are frozen at build time. Rebuild after changing `.env` or `SLICE_PUBLIC_*`.\n- `slice export` copies both files to the static output; `slice start` serves them as static assets.\n\n### Deployment Modes\n| Mode | Command | Env delivery |\n| --- | --- | --- |\n| Express | `slice build` + `slice start` | `dist/slice-env.generated.js` served as a static asset |\n| Static | `slice build` + `slice export` | `slice-env.generated.js` at the static root |\n\n## Runtime Access in Components\n\n```javascript title=\"Read public env from Slice runtime\"\nexport default class HomePage extends HTMLElement {\n  async init() {\n    const apiUrl = slice.getEnv('SLICE_PUBLIC_API_URL', 'http://localhost:3000');\n    const env = slice.getPublicEnv();\n\n    console.log('API URL:', apiUrl);\n    console.log('All public env:', env);\n  }\n}\n```\n\n## Typed Accessors (`slice.env`)\n`slice.getEnv` always returns a string (env values are strings). `slice.env.*` parses common shapes for you, so you stop re-writing `String(...).split(',')` and boolean checks across the app.\n\n| Accessor | Returns | Example |\n| --- | --- | --- |\n| `slice.env.get(key, fallback?)` | `string` | `slice.env.get('SLICE_PUBLIC_API_URL', '')` |\n| `slice.env.bool(key, fallback?)` | `boolean` | `'1' \\| 'true' \\| 'yes' \\| 'on'` → `true` |\n| `slice.env.int(key, fallback?)` | `number` | `slice.env.int('SLICE_PUBLIC_TIMEOUT', 5000)` |\n| `slice.env.list(key, fallback?)` | `string[]` | `'a, b'` → `['a','b']` (trims, drops empties) |\n| `slice.env.has(key)` | `boolean` | key present in the public env |\n| `slice.env.all()` | `object` | snapshot of all `SLICE_PUBLIC_*` keys |\n\n```javascript title=\"Typed reads\"\nconst auth   = slice.env.bool('SLICE_PUBLIC_AUTH_ENABLED');        // false if missing\nconst models = slice.env.list('SLICE_PUBLIC_MODELS', ['default']); // ['a','b',...]\nconst apiUrl = slice.env.get('SLICE_PUBLIC_API_URL', '');\n```\n\nMissing or empty values fall back: `bool`/`int`/`list` return the provided fallback (or `false` / `0` / `[]`).\n\n## Recommended Workflow\n:::steps\n1. Define browser-safe keys using `SLICE_PUBLIC_`.\n2. Keep secrets in non-public env keys.\n3. Run `slice build` (or `slice export`) after changing public env values.\n4. Read values with `slice.env.*` (or `slice.getEnv`) in runtime code.\n:::\n\n## Troubleshooting\n:::tip\nIf a key is missing in browser runtime, verify the key starts with `SLICE_PUBLIC_`.\n:::\n\n:::tip\nIf production values do not update, restart the server process to refresh cached env payload.\n:::\n\n## Related Docs\n- `sliceConfig.json`: `/Documentation/Configuration/sliceConfig`\n";
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
               headers: ["Variable","Exposed to browser","Example"],
               rows: [[{"html":"<code>SLICE_PUBLIC_*</code>"},{"html":"yes"},{"html":"<code>SLICE_PUBLIC_API_URL=https://api.example.com</code>"}],[{"html":"Any other key"},{"html":"no"},{"html":"<code>DB_PASSWORD=...</code>"}]]
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
            body.innerHTML = "<p>Everything sent to the browser is public. Never put secrets, private tokens, or credentials in <code>SLICE_PUBLIC_*</code> variables.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "SLICE_PUBLIC_API_URL=https://api.example.com\nSLICE_PUBLIC_ENABLE_CHAT=true\nDB_PASSWORD=server-only",
               language: "bash"
            });
            if (".env") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = ".env";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-5"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "{\n  \"mode\": \"production\",\n  \"env\": {\n    \"SLICE_PUBLIC_API_URL\": \"https://api.example.com\",\n    \"SLICE_PUBLIC_ENABLE_CHAT\": \"true\"\n  }\n}",
               language: "json"
            });
            if ("dist/slice-env.json") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "dist/slice-env.json";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-6"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Mode","Command","Env delivery"],
               rows: [[{"html":"Express"},{"html":"<code>slice build</code> + <code>slice start</code>"},{"html":"<code>dist/slice-env.generated.js</code> served as a static asset"}],[{"html":"Static"},{"html":"<code>slice build</code> + <code>slice export</code>"},{"html":"<code>slice-env.generated.js</code> at the static root"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-7"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "export default class HomePage extends HTMLElement {\n  async init() {\n    const apiUrl = slice.getEnv('SLICE_PUBLIC_API_URL', 'http://localhost:3000');\n    const env = slice.getPublicEnv();\n\n    console.log('API URL:', apiUrl);\n    console.log('All public env:', env);\n  }\n}",
               language: "javascript"
            });
            if ("Read public env from Slice runtime") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Read public env from Slice runtime";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["Accessor","Returns","Example"],
               rows: [[{"html":"<code>slice.env.get(key, fallback?)</code>"},{"html":"<code>string</code>"},{"html":"<code>slice.env.get('SLICE_PUBLIC_API_URL', '')</code>"}],[{"html":"<code>slice.env.bool(key, fallback?)</code>"},{"html":"<code>boolean</code>"},{"html":"<code>'1' | 'true' | 'yes' | 'on'</code> → <code>true</code>"}],[{"html":"<code>slice.env.int(key, fallback?)</code>"},{"html":"<code>number</code>"},{"html":"<code>slice.env.int('SLICE_PUBLIC_TIMEOUT', 5000)</code>"}],[{"html":"<code>slice.env.list(key, fallback?)</code>"},{"html":"<code>string[]</code>"},{"html":"<code>'a, b'</code> → <code>['a','b']</code> (trims, drops empties)"}],[{"html":"<code>slice.env.has(key)</code>"},{"html":"<code>boolean</code>"},{"html":"key present in the public env"}],[{"html":"<code>slice.env.all()</code>"},{"html":"<code>object</code>"},{"html":"snapshot of all <code>SLICE_PUBLIC_*</code> keys"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-9"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "const auth   = slice.env.bool('SLICE_PUBLIC_AUTH_ENABLED');        // false if missing\nconst models = slice.env.list('SLICE_PUBLIC_MODELS', ['default']); // ['a','b',...]\nconst apiUrl = slice.env.get('SLICE_PUBLIC_API_URL', '');",
               language: "javascript"
            });
            if ("Typed reads") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Typed reads";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>If a key is missing in browser runtime, verify the key starts with <code>SLICE_PUBLIC_</code>.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-11"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>If production values do not update, restart the server process to refresh cached env payload.</p>";
            const callout = await slice.build('Callout', {
               tone: "success",
               variant: "soft",
               title: "Tip",
               content: Array.from(body.childNodes)
            });
            container.appendChild(callout || body);
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

customElements.define('slice-environmentvariablesdocumentation', EnvironmentVariablesDocumentation);
