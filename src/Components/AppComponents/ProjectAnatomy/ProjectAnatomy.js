export default class ProjectAnatomy extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    this.markdownPath = "getting-started/project-anatomy.md";
    this.markdownContent = "---\ntitle: Project Anatomy\nroute: /Documentation/Project-Anatomy\nnavLabel: Project Anatomy\nsection: Getting Started\ngroup: First Steps\norder: 11\ndescription: What slice init creates and which files you actually edit.\ncomponent: ProjectAnatomy\ntags: [getting-started, project, structure]\n---\n\n# Project Anatomy\n\n## Overview\nAfter `slice init` you get a working **App Shell + MultiRoute** starter: a persistent navbar\nwrapping a content area that swaps sections by URL. This page explains every file the starter\ncreates, which ones you edit first, and which ones to leave alone.\n\nIf you have not initialized a project yet, see Installation, then come back here.\n\n## The generated tree\n```text title=\"Fresh project after slice init\"\nmy-app/\n├── api/                         # Express dev/prod server + security middleware (don't edit)\n├── src/\n│   ├── App/\n│   │   ├── index.html           # SPA entry: the #app mount + loads /App/index.js\n│   │   ├── index.js             # Boots Slice; optional router guards live here\n│   │   └── style.css            # App-level base styles\n│   ├── Components/\n│   │   ├── AppComponents/       # YOUR app-specific components\n│   │   │   ├── AppShell/        #   persistent shell: navbar + MultiRoute content area\n│   │   │   ├── HomeSection/     #   the \"/\" section\n│   │   │   └── AboutSection/    #   the \"/about\" section\n│   │   ├── Visual/              # Registry UI components installed for the starter\n│   │   ├── Service/             # Built-in services (FetchManager, storage helpers)\n│   │   └── components.js        # Registry of local components (auto-generated)\n│   ├── Themes/                  # Slice.css, Light.css, Dark.css (CSS variables)\n│   ├── Styles/                  # Shared stylesheets\n│   ├── routes.js                # Route table (path -> component)\n│   └── sliceConfig.json         # Framework configuration\n└── package.json                 # Scripts: dev, start, get, browse, component:create...\n```\n\n:::tip\nThe starter installs only the Visual components it uses. Add more on demand with\n`slice get <Name>` (run `slice browse` to see the catalog).\n:::\n\n## File-by-file\n| File | What it is | Do you edit it? |\n| --- | --- | --- |\n| `src/routes.js` | Maps each URL path to a component name. Start here. | Yes — first |\n| `src/Components/AppComponents/AppShell/` | The shell: builds the navbar and the `MultiRoute` content area in `init()`. | Yes |\n| `src/Components/AppComponents/HomeSection/` | The `/` page. Edit this to change the landing content. | Yes |\n| `src/Components/AppComponents/AboutSection/` | The `/about` page. | Yes |\n| `src/App/index.js` | Boots Slice. Add router guards here, then start the router. | Sometimes |\n| `src/App/index.html` | SPA shell: the `#app` mount and the module script tag. | Rarely |\n| `src/sliceConfig.json` | Managers (events, context, theme, logger, debugger), paths, server port. | Yes |\n| `src/Components/components.js` | Name → category map used to load components. | No — auto-generated |\n| `src/Components/Visual/*` | Installed registry components. | No — managed by `slice get` / `slice sync` |\n| `src/Components/Service/*` | Built-in services you can use or extend. | Optional |\n| `src/Themes/*` | Theme files defining CSS variables. | Optional |\n| `api/` | The server. Zero-config; serves `/src` in dev and `/dist` in production. | No |\n\n## How a page reaches the screen\n1. `index.html` loads `/App/index.js`, which imports Slice and exposes the global `slice`.\n2. The router reads `src/routes.js` and matches the current URL.\n3. For `/` and `/about` the match is `AppShell`. The shell builds a persistent `Navbar` and a\n   `MultiRoute` whose own routes pick `HomeSection` or `AboutSection` for the content area.\n4. Navigating between `/` and `/about` keeps the shell mounted and only swaps the section.\n\n## What is safe to delete\n- `HomeSection` and `AboutSection` are examples — rename or replace them with your own sections.\n- Keep `AppShell`, `routes.js`, `sliceConfig.json`, `components.js`, and `api/`.\n\n## Next\nContinue with **Your First Page** to add and edit a section, then **The Development Loop**.\n";
    if (true) {
      this.setupCopyButton();
    }
      {
         const container = this.querySelector('[data-block-id="doc-block-1"]');
         if (container) {
            const code = await slice.build('CodeVisualizer', {
               value: "my-app/\n├── api/                         # Express dev/prod server + security middleware (don't edit)\n├── src/\n│   ├── App/\n│   │   ├── index.html           # SPA entry: the #app mount + loads /App/index.js\n│   │   ├── index.js             # Boots Slice; optional router guards live here\n│   │   └── style.css            # App-level base styles\n│   ├── Components/\n│   │   ├── AppComponents/       # YOUR app-specific components\n│   │   │   ├── AppShell/        #   persistent shell: navbar + MultiRoute content area\n│   │   │   ├── HomeSection/     #   the \"/\" section\n│   │   │   └── AboutSection/    #   the \"/about\" section\n│   │   ├── Visual/              # Registry UI components installed for the starter\n│   │   ├── Service/             # Built-in services (FetchManager, storage helpers)\n│   │   └── components.js        # Registry of local components (auto-generated)\n│   ├── Themes/                  # Slice.css, Light.css, Dark.css (CSS variables)\n│   ├── Styles/                  # Shared stylesheets\n│   ├── routes.js                # Route table (path -> component)\n│   └── sliceConfig.json         # Framework configuration\n└── package.json                 # Scripts: dev, start, get, browse, component:create...",
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
         const container = this.querySelector('[data-block-id="doc-block-2"]');
         if (container) {
            const lines = ["| File | What it is | Do you edit it? |","| --- | --- | --- |","| `src/routes.js` | Maps each URL path to a component name. Start here. | Yes — first |","| `src/Components/AppComponents/AppShell/` | The shell: builds the navbar and the `MultiRoute` content area in `init()`. | Yes |","| `src/Components/AppComponents/HomeSection/` | The `/` page. Edit this to change the landing content. | Yes |","| `src/Components/AppComponents/AboutSection/` | The `/about` page. | Yes |","| `src/App/index.js` | Boots Slice. Add router guards here, then start the router. | Sometimes |","| `src/App/index.html` | SPA shell: the `#app` mount and the module script tag. | Rarely |","| `src/sliceConfig.json` | Managers (events, context, theme, logger, debugger), paths, server port. | Yes |","| `src/Components/components.js` | Name → category map used to load components. | No — auto-generated |","| `src/Components/Visual/*` | Installed registry components. | No — managed by `slice get` / `slice sync` |","| `src/Components/Service/*` | Built-in services you can use or extend. | Optional |","| `src/Themes/*` | Theme files defining CSS variables. | Optional |","| `api/` | The server. Zero-config; serves `/src` in dev and `/dist` in production. | No |"];
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

customElements.define('slice-projectanatomy', ProjectAnatomy);
