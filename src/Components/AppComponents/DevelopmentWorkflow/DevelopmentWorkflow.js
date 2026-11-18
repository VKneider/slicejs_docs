export default class DevelopmentWorkflow extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
    this._contentClick = null;
  }

  async init() {
    this.markdownPath = "getting-started/development-workflow.md";
    this.markdownContent = "---\ntitle: The Development Loop\nroute: /Documentation/Development-Workflow\nnavLabel: The Development Loop\nsection: Getting Started\ngroup: ''\norder: 60\ndescription: The day-to-day loop: start the dev server, edit, create components, run the fast checks, document, build and serve.\ncomponent: DevelopmentWorkflow\ntags: [getting-started, cli, workflow, dev, build, doctor]\n---\n\n# The Development Loop\n\nDay-to-day Slice work is a short loop: start the dev server, change a component, see it reload, and\nrun the fast checks before you build. The same loop applies to a new project and to one that has\nbeen running for months.\n\n## The loop at a glance\n\n| Step | Command | What happens |\n| --- | --- | --- |\n| Start the loop | `slice dev` | Serves `/src` with HMR and regenerates project docs before watching. |\n| Create or edit | `slice component create <Name> --category <Category>` | Writes `.js` / `.html` / `.css` and updates `components.js`. |\n| Reuse a component | `slice get <Name>` | Installs a registry component into the project. |\n| Check | `slice doctor && slice lint && slice typecheck` | Fast gates before a build. |\n| Document | `slice docs generate` / `slice docs check` | AGENTS inventory, declarations and the event catalog. |\n| Ship | `slice build` then `slice start` | Bundles `/dist`; `start` serves it. |\n\n:::steps\n1. Start the dev server with `slice dev`.\n2. Create or edit the component and let the dev server reload it.\n3. Assign a prop, call a method, or use `update()` — do not rebuild for a prop change.\n4. Run `slice doctor`, `slice lint` and `slice typecheck`.\n5. Run `slice build`, then `slice start` to verify the production output.\n:::\n\n## 1. Start: `slice dev`\n\n```bash\nslice dev\n```\n\n`slice dev` serves the app from `src/` with hot reload. Changes to `.js`, `.html` and `.css` reload\nthe page; changes to `sliceConfig.json` may need a restart. Before watching, it regenerates the\nproject documentation (AGENTS inventory, declarations and `docs/events/`).\n\n- **Port:** `server.port` in `sliceConfig.json`, or `slice dev -p 4000`. The default is `3000`;\n  if it is taken, the CLI falls back to the next free port.\n- **Debug panels:** `alt+shift+e` (events) and `alt+shift+c` (context) when\n  `events.ui.enabled` / `context.ui.enabled` are on.\n- **Inspect props:** right-click a component when `debugger.enabled` is on.\n\nIf you use `package.json` scripts, `pnpm run dev` / `npm run dev` are the same command pinned to the\nproject's local CLI.\n\n## 2. Create or reuse a component\n\n```bash\n# Non-interactive: writes the three files and registers the component\nslice component create UserCard --category AppComponents\n\n# Interactive: prompts for whatever you omit\nslice component create\n```\n\nComponents must be listed in `src/Components/components.js` to be loadable. `component create` and\n`component list` update it for you:\n\n```bash\nslice component list        # resync components.js with the folders on disk\n```\n\nTo reuse something from the official registry:\n\n```bash\nslice browse                         # list official components\nslice get Card Input Select          # Visual components\nslice get FetchManager --service     # a Service\n```\n\n:::warning\nA component that is on disk but missing from `components.js` makes `slice.build()` return `null`.\nRun `slice component list` (or `slice doctor`) before debugging the component itself.\n:::\n\nThe full flag list is in [CLI Commands](/Documentation/CLI).\n\n## 3. Check before you build\n\n```bash\nslice doctor && slice lint && slice typecheck\n```\n\n- **`slice doctor`** is the fast static check: config, component files, routes, prop definitions,\n  imports, SEO and common lifecycle mistakes. It exits 0 with warnings and 1 on failures.\n- **`slice lint`** runs ESLint with the shared Slice config.\n- **`slice typecheck`** runs the project's own TypeScript against the generated declarations.\n\nDoctor does not compile or bundle. It can prove the project is structurally sound; it cannot prove\nthat esbuild resolves the whole graph. That is what `slice build` is for.\n\n:::details title=\"Typecheck needs TypeScript in the project\"\n`slice typecheck` uses the TypeScript installed by the project. If it is missing, add the optional\ntooling once with `slice setup lint --with-types`.\n:::\n\n## 4. Documentation is part of the loop\n\n```bash\nslice docs generate          # AGENTS inventory + declarations + docs/events/\nslice docs generate types    # declarations + src/slice-events.generated.js\nslice docs generate events   # docs/events/* (Markdown, Mermaid, HTML)\nslice docs check             # CI drift gate\n```\n\n`slice dev` regenerates before it starts watching, and `slice build` runs the drift check for a\nscaffolded project. Update the Markdown and the component `README.md` when behavior changes; see\n[Documentation & AGENTS.md](/Documentation/Documentation-System).\n\n## 5. Build and serve\n\n```bash\nslice build     # bundles + dist/\nslice start     # serves dist/\n```\n\n`slice build` analyzes what the routes use, bundles and minifies into `dist/`, copies `src/public/`\nto `dist/public/`, checks the generated docs, and never writes into `src/`. `slice start` serves\n`dist/`; if the build is missing, it runs `slice build` first.\n\n:::compare left=\"Dev server\" right=\"Production build\"\nServes `src/`, hot-reloads edits, keeps debug panels and dev-only runtime features.\n---\nWrites and serves `dist/`, bundles and minifies, runs the docs check, and turns off dev-only panels.\n:::\n\nFor a static host, `slice export` packages the build for `dist-static/` (experimental); see\n[CLI Commands](/Documentation/CLI).\n\n## Where your code lives\n\n| You want to… | Put it in |\n| --- | --- |\n| Add an app screen or section | `src/Components/AppComponents/<Name>/` |\n| Reuse a UI element across screens | a Visual component (`slice get <Name>` or create one) |\n| Hold logic/data with no UI (API client, storage) | `src/Components/Service/<Name>/` |\n| Change navigation | `src/routes.js` (and the shell's `MultiRoute`) |\n| Toggle managers, theme, port | `src/sliceConfig.json` |\n\n## Next steps\n\n:::related\n- [CLI Commands](/Documentation/CLI) - Every command, flag and exit code.\n- [Project Anatomy](/Documentation/Project-Anatomy) - What `slice init` creates.\n- [Your First Page](/Documentation/First-Page) - The first route and component.\n- [Documentation & AGENTS.md](/Documentation/Documentation-System) - What `docs generate` writes.\n:::\n";
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
            const table = await slice.build('Table', {
               headers: ["Step","Command","What happens"],
               rows: [[{"html":"Start the loop"},{"html":"<code>slice dev</code>"},{"html":"Serves <code>/src</code> with HMR and regenerates project docs before watching."}],[{"html":"Create or edit"},{"html":"<code>slice component create &lt;Name&gt; --category &lt;Category&gt;</code>"},{"html":"Writes <code>.js</code> / <code>.html</code> / <code>.css</code> and updates <code>components.js</code>."}],[{"html":"Reuse a component"},{"html":"<code>slice get &lt;Name&gt;</code>"},{"html":"Installs a registry component into the project."}],[{"html":"Check"},{"html":"<code>slice doctor &amp;&amp; slice lint &amp;&amp; slice typecheck</code>"},{"html":"Fast gates before a build."}],[{"html":"Document"},{"html":"<code>slice docs generate</code> / <code>slice docs check</code>"},{"html":"AGENTS inventory, declarations and the event catalog."}],[{"html":"Ship"},{"html":"<code>slice build</code> then <code>slice start</code>"},{"html":"Bundles <code>/dist</code>; <code>start</code> serves it."}]]
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
               value: "slice dev",
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
         const container = this.querySelector('[data-block-id="doc-block-4"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "# Non-interactive: writes the three files and registers the component\nslice component create UserCard --category AppComponents\n\n# Interactive: prompts for whatever you omit\nslice component create",
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
               value: "slice component list        # resync components.js with the folders on disk",
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
               value: "slice browse                         # list official components\nslice get Card Input Select          # Visual components\nslice get FetchManager --service     # a Service",
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
            const body = document.createElement('div');
            body.className = 'doc-callout-body';
            body.innerHTML = "<p>A component that is on disk but missing from <code>components.js</code> makes <code>slice.build()</code> return <code>null</code>. Run <code>slice component list</code> (or <code>slice doctor</code>) before debugging the component itself.</p>";
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
         const container = this.querySelector('[data-block-id="doc-block-8"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice doctor && slice lint && slice typecheck",
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
            const details = await slice.build('Details', { title: "Typecheck needs TypeScript in the project" });
            const body = document.createElement('div');
            body.className = 'doc-details-body';
            body.innerHTML = "<p><code>slice typecheck</code> uses the TypeScript installed by the project. If it is missing, add the optional tooling once with <code>slice setup lint --with-types</code>.</p>";
            if (details) {
               details.addDetail(body);
               container.appendChild(details);
            } else {
               container.appendChild(body);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-10"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "slice docs generate          # AGENTS inventory + declarations + docs/events/\nslice docs generate types    # declarations + src/slice-events.generated.js\nslice docs generate events   # docs/events/* (Markdown, Mermaid, HTML)\nslice docs check             # CI drift gate",
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
               value: "slice build     # bundles + dist/\nslice start     # serves dist/",
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
            const grid = await slice.build('Grid', { columns: 2, rows: 1, gap: '14px' });
            const buildSide = async (side) => {
               const body = document.createElement('div');
               body.className = 'doc-callout-body';
               body.innerHTML = side.html;
               const callout = await slice.build('Callout', {
                  tone: side.tone,
                  title: side.title,
                  content: Array.from(body.childNodes)
               });
               return callout || body;
            };
            const left = await buildSide({"title":"Dev server","tone":"success","html":"<p>Serves <code>src/</code>, hot-reloads edits, keeps debug panels and dev-only runtime features.</p>"});
            const right = await buildSide({"title":"Production build","tone":"danger","html":"<p>Writes and serves <code>dist/</code>, bundles and minifies, runs the docs check, and turns off dev-only panels.</p>"});
            if (grid) {
               await grid.setItem(left);
               await grid.setItem(right);
               container.appendChild(grid);
            } else {
               container.appendChild(left);
               container.appendChild(right);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-13"]');
         if (container) {
            const table = await slice.build('Table', {
               headers: ["You want to…","Put it in"],
               rows: [[{"html":"Add an app screen or section"},{"html":"<code>src/Components/AppComponents/&lt;Name&gt;/</code>"}],[{"html":"Reuse a UI element across screens"},{"html":"a Visual component (<code>slice get &lt;Name&gt;</code> or create one)"}],[{"html":"Hold logic/data with no UI (API client, storage)"},{"html":"<code>src/Components/Service/&lt;Name&gt;/</code>"}],[{"html":"Change navigation"},{"html":"<code>src/routes.js</code> (and the shell's <code>MultiRoute</code>)"}],[{"html":"Toggle managers, theme, port"},{"html":"<code>src/sliceConfig.json</code>"}]]
            });
            if (table) {
               container.appendChild(table);
            }
         }
      }
      {
         const container = this.querySelector('[data-block-id="doc-block-14"]');
         if (container) {
            const items = [{"title":"CLI Commands","path":"/Documentation/CLI","text":"Every command, flag and exit code."},{"title":"Project Anatomy","path":"/Documentation/Project-Anatomy","text":"What slice init creates."},{"title":"Your First Page","path":"/Documentation/First-Page","text":"The first route and component."},{"title":"Documentation & AGENTS.md","path":"/Documentation/Documentation-System","text":"What docs generate writes."}];
            const grid = await slice.build('Grid', {
               columns: items.length === 4 ? 2 : Math.min(3, Math.max(1, items.length)),
               rows: 1,
               gap: '14px'
            });
            for (const item of items) {
               const card = await slice.build('Card', {
                  title: item.title,
                  text: item.text || '',
                  // The small mark beside the title, not the banner: a page
                  // of four related links should not be four big arrows.
                  headerIcon: 'arrow-right',
                  interactive: true,
                  onClick: () => {
                     if (/^https?:/i.test(item.path)) {
                        window.open(item.path, '_blank', 'noopener,noreferrer');
                     } else {
                        slice.router.navigate(item.path);
                     }
                  }
               });
               if (card && grid) await grid.setItem(card);
            }
            if (grid) container.appendChild(grid);
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

customElements.define('slice-developmentworkflow', DevelopmentWorkflow);
