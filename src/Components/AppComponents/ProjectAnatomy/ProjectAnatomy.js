export default class ProjectAnatomy extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/project-anatomy.md";
    this.markdownContent = "---\ntitle: Project Anatomy\nroute: /Documentation/Project-Anatomy\nnavLabel: Project Anatomy\nsection: Getting Started\ngroup: ''\norder: 40\ndescription: What slice init creates and which files you actually edit.\ncomponent: ProjectAnatomy\ntags: [getting-started, project, structure]\n---\n\n# Project Anatomy\n\n## Overview\nAfter `slice init` you get a working **App Shell + MultiRoute** starter: a persistent navbar\nwrapping a content area that swaps sections by URL. This page explains every file the starter\ncreates, which ones you edit first, and which ones to leave alone.\n\nIf you have not initialized a project yet, see Installation, then come back here.\n\n## The generated tree\n```text title=\"Fresh project after slice init\"\nmy-app/\n├── AGENTS.md                    # Agent guide: read order, commands, category table\n├── CLAUDE.md                    # One line: @AGENTS.md (Claude compatibility)\n├── api/                         # Express dev/prod server + security middleware (don't edit)\n├── src/\n│   ├── App/\n│   │   ├── index.html           # SPA entry: the #app mount + loads /App/index.js\n│   │   ├── index.js             # Boots Slice; optional router guards live here\n│   │   └── style.css            # App-level base styles\n│   ├── Components/\n│   │   ├── AppComponents/       # YOUR app-specific components\n│   │   │   ├── AGENTS.md        #   category guide + generated inventory\n│   │   │   ├── AppShell/        #   persistent shell: navbar + MultiRoute content area\n│   │   │   ├── HomeSection/     #   the \"/\" section\n│   │   │   └── AboutSection/    #   the \"/about\" section\n│   │   ├── Visual/              # Registry UI components installed for the starter\n│   │   │   └── AGENTS.md        #   registry rules + generated inventory\n│   │   ├── Service/             # Built-in services (FetchManager, storage helpers)\n│   │   │   └── AGENTS.md\n│   │   └── components.js        # Registry of local components (auto-generated)\n│   ├── public/                  # Served from the site root, copied to dist/ as-is\n│   │   ├── Themes/              #   Slice.css, Light.css, Dark.css (CSS variables)\n│   │   ├── Styles/              #   Shared stylesheets\n│   │   ├── images/              #   favicon and other static images\n│   │   ├── manifest.json        #   PWA manifest\n│   │   ├── robots.txt           #   Crawler rules\n│   │   └── sitemap.xml          #   Sitemap\n│   ├── routes.js                # Route table (path -> component)\n│   └── sliceConfig.json         # Framework configuration\n├── docs/\n│   └── events/                  # Generated event catalog, Mermaid + standalone HTML\n│       ├── index.md\n│       ├── <namespace>.md\n│       ├── diagram.mmd\n│       └── diagram.html\n├── node_modules/                # Dependencies (framework + local CLI) — inside the project\n├── .gitignore                   # Ignores node_modules/, dist/, dist-static/ and local .env files\n├── package.json                 # Scripts, packageManager field, dependencies\n└── pnpm-lock.yaml               # Lockfile of your package manager (or package-lock.json)\n```\n\n`AGENTS.md` and the category guides are part of the scaffold, not optional generated noise. They\ntell agents which category a component belongs to and where its docs live. `CLAUDE.md` only imports\n`AGENTS.md`. `src/markdown/` is not created in an app: that folder belongs to the Slice.js Components\nand Slice.js Docs sites.\n\n`slice init` creates the `my-app/` folder itself — you don't `mkdir` or `npm init`\nbeforehand. The `package.json` pins your package manager in the `packageManager`\nfield, lists `slicejs-web-framework` as a dependency and `slicejs-cli` as a\ndevDependency, and ships the scripts (`dev`, `start`, `get`, `browse`,\n`component:create`...).\n\n:::tip\nThe starter installs only the Visual components it uses. Add more on demand with\n`npm run get -- <Name>` (run `npm run browse` to see the catalog).\n:::\n\n## File-by-file\n| File | What it is | Do you edit it? |\n| --- | --- | --- |\n| `src/routes.js` | Maps each URL path to a component name. Start here. | Yes — first |\n| `src/Components/AppComponents/AppShell/` | The shell: builds the navbar and the `MultiRoute` content area in `init()`. | Yes |\n| `src/Components/AppComponents/HomeSection/` | The `/` page. Edit this to change the landing content. | Yes |\n| `src/Components/AppComponents/AboutSection/` | The `/about` page. | Yes |\n| `src/App/index.js` | Boots Slice. Add router guards here, then start the router. | Sometimes |\n| `src/App/index.html` | SPA shell: the `#app` mount and the module script tag. | Rarely |\n| `src/sliceConfig.json` | Managers (events, context, theme, logger, debugger), paths, server port. | Yes |\n| `src/Components/components.js` | Name → category map used to load components. | No — auto-generated |\n| `src/Components/Visual/*` | Installed registry components. | No — managed by `npm run get -- <Name>` / `npm run sync` |\n| `src/Components/Service/*` | Built-in services you can use or extend. | Optional |\n| `src/public/*` | Public files served from the site root (`/Themes/...`, `/images/...`) and copied to `dist/` by the build. | Yes |\n| `src/public/Themes/*` | Theme files defining CSS variables. | Optional |\n| `.gitignore` | Keeps `node_modules/`, the `dist/` build output, the `dist-static/` export and local `.env` files out of git. | Rarely |\n| `api/` | The server. Zero-config; serves `/src` in dev and the built files under `/dist` in production (`public/` at the root, `/App`, bundles and the runtime). | No |\n\n## How a page reaches the screen\n1. `index.html` loads `/App/index.js`, which imports Slice and exposes the global `slice`.\n2. The router reads `src/routes.js` and matches the current URL.\n3. For `/` and `/about` the match is `AppShell`. The shell builds a persistent `Navbar` and a\n   `MultiRoute` whose own routes pick `HomeSection` or `AboutSection` for the content area.\n4. Navigating between `/` and `/about` keeps the shell mounted and only swaps the section.\n\n## What is safe to delete\n- `HomeSection` and `AboutSection` are examples — rename or replace them with your own sections.\n- Keep `AppShell`, `routes.js`, `sliceConfig.json`, `components.js`, and `api/`.\n\n## Next\nContinue with **Your First Page** to add and edit a section, then **The Development Loop**.\n";
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
            const code = await slice.build('CodeVisualizer', {
               value: "my-app/\n├── AGENTS.md                    # Agent guide: read order, commands, category table\n├── CLAUDE.md                    # One line: @AGENTS.md (Claude compatibility)\n├── api/                         # Express dev/prod server + security middleware (don't edit)\n├── src/\n│   ├── App/\n│   │   ├── index.html           # SPA entry: the #app mount + loads /App/index.js\n│   │   ├── index.js             # Boots Slice; optional router guards live here\n│   │   └── style.css            # App-level base styles\n│   ├── Components/\n│   │   ├── AppComponents/       # YOUR app-specific components\n│   │   │   ├── AGENTS.md        #   category guide + generated inventory\n│   │   │   ├── AppShell/        #   persistent shell: navbar + MultiRoute content area\n│   │   │   ├── HomeSection/     #   the \"/\" section\n│   │   │   └── AboutSection/    #   the \"/about\" section\n│   │   ├── Visual/              # Registry UI components installed for the starter\n│   │   │   └── AGENTS.md        #   registry rules + generated inventory\n│   │   ├── Service/             # Built-in services (FetchManager, storage helpers)\n│   │   │   └── AGENTS.md\n│   │   └── components.js        # Registry of local components (auto-generated)\n│   ├── public/                  # Served from the site root, copied to dist/ as-is\n│   │   ├── Themes/              #   Slice.css, Light.css, Dark.css (CSS variables)\n│   │   ├── Styles/              #   Shared stylesheets\n│   │   ├── images/              #   favicon and other static images\n│   │   ├── manifest.json        #   PWA manifest\n│   │   ├── robots.txt           #   Crawler rules\n│   │   └── sitemap.xml          #   Sitemap\n│   ├── routes.js                # Route table (path -> component)\n│   └── sliceConfig.json         # Framework configuration\n├── docs/\n│   └── events/                  # Generated event catalog, Mermaid + standalone HTML\n│       ├── index.md\n│       ├── <namespace>.md\n│       ├── diagram.mmd\n│       └── diagram.html\n├── node_modules/                # Dependencies (framework + local CLI) — inside the project\n├── .gitignore                   # Ignores node_modules/, dist/, dist-static/ and local .env files\n├── package.json                 # Scripts, packageManager field, dependencies\n└── pnpm-lock.yaml               # Lockfile of your package manager (or package-lock.json)",
               language: "text"
            });
            if ("Fresh project after slice init") {
               const label = document.createElement('div');
               label.classList.add('code-block-title');
               label.textContent = "Fresh project after slice init";
               container.appendChild(label);
            }
            container.appendChild(code);
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-3"]');
         if (container) {
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>The starter installs only the Visual components it uses. Add more on demand with <code>npm run get -- &lt;Name&gt;</code> (run <code>npm run browse</code> to see the catalog).</p>";
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
            const table = await slice.build('Table', {
               headers: ["File","What it is","Do you edit it?"],
               rows: [[{"html":"<code>src/routes.js</code>"},{"html":"Maps each URL path to a component name. Start here."},{"html":"Yes — first"}],[{"html":"<code>src/Components/AppComponents/AppShell/</code>"},{"html":"The shell: builds the navbar and the <code>MultiRoute</code> content area in <code>init()</code>."},{"html":"Yes"}],[{"html":"<code>src/Components/AppComponents/HomeSection/</code>"},{"html":"The <code>/</code> page. Edit this to change the landing content."},{"html":"Yes"}],[{"html":"<code>src/Components/AppComponents/AboutSection/</code>"},{"html":"The <code>/about</code> page."},{"html":"Yes"}],[{"html":"<code>src/App/index.js</code>"},{"html":"Boots Slice. Add router guards here, then start the router."},{"html":"Sometimes"}],[{"html":"<code>src/App/index.html</code>"},{"html":"SPA shell: the <code>#app</code> mount and the module script tag."},{"html":"Rarely"}],[{"html":"<code>src/sliceConfig.json</code>"},{"html":"Managers (events, context, theme, logger, debugger), paths, server port."},{"html":"Yes"}],[{"html":"<code>src/Components/components.js</code>"},{"html":"Name → category map used to load components."},{"html":"No — auto-generated"}],[{"html":"<code>src/Components/Visual/*</code>"},{"html":"Installed registry components."},{"html":"No — managed by <code>npm run get -- &lt;Name&gt;</code> / <code>npm run sync</code>"}],[{"html":"<code>src/Components/Service/*</code>"},{"html":"Built-in services you can use or extend."},{"html":"Optional"}],[{"html":"<code>src/public/*</code>"},{"html":"Public files served from the site root (<code>/Themes/...</code>, <code>/images/...</code>) and copied to <code>dist/</code> by the build."},{"html":"Yes"}],[{"html":"<code>src/public/Themes/*</code>"},{"html":"Theme files defining CSS variables."},{"html":"Optional"}],[{"html":"<code>.gitignore</code>"},{"html":"Keeps <code>node_modules/</code>, the <code>dist/</code> build output, the <code>dist-static/</code> export and local <code>.env</code> files out of git."},{"html":"Rarely"}],[{"html":"<code>api/</code>"},{"html":"The server. Zero-config; serves <code>/src</code> in dev and the built files under <code>/dist</code> in production (<code>public/</code> at the root, <code>/App</code>, bundles and the runtime)."},{"html":"No"}]]
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

customElements.define('slice-projectanatomy', ProjectAnatomy);
